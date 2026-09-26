type Metric = { label: string; value: string };

export function benchmarkingSamples(html: string) {
  return Array.from(
    html.matchAll(
      /<tr>\s*<td>(\d+)<\/td>\s*<td>([\d.]+)<\/td>\s*<td>([\d.]+)<\/td>/g,
    ),
    (match) => ({ sample: Number(match[1]), milliseconds: Number(match[2]) }),
  ).filter((row) => Number.isFinite(row.milliseconds));
}

export function benchmarkingMetrics(html: string): Metric[] {
  const cards = new Map(
    Array.from(
      html.matchAll(
        /<article class="card">\s*<span>([^<]+)<\/span>\s*<strong>([\s\S]*?)<\/strong>/g,
      ),
      (match) => [
        match[1].trim(),
        match[2]
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim(),
      ],
    ),
  );
  const metrics: Metric[] = [];
  for (const [key, label] of [
    ["SAMPLES", "Samples"],
    ["MEAN", "Mean execution time"],
    ["P50", "Median (P50)"],
    ["P95", "P95 execution time"],
    ["MIN / MAX", "Min / max"],
  ]) {
    const value = cards.get(key);
    if (value)
      metrics.push({
        label,
        value: key === "MIN / MAX" ? `${value} ms` : value,
      });
  }
  const similarity = html.match(/Image similarity<\/h2>\s*<p>([\d.]+) mean/);
  if (similarity) metrics.push({ label: "Mean SSIM", value: similarity[1] });
  return metrics;
}

// Read the summary cards before the individual results in the supplied exports.
export function cardMetrics(html: string): Metric[] {
  return Array.from(
    html.matchAll(
      /<div class="(?:metric-label|card-title)">([^<]+)<\/div>\s*<div class="(?:metric-value|card-value)[^"]*">([^<]+)<\/div>/g,
    ),
    (match) => ({ label: match[1].trim(), value: match[2].trim() }),
  ).slice(0, 4);
}

export function coverageMetrics(html: string): Metric[] {
  return Array.from(
    html.matchAll(
      /<td class="headerItem">(Lines|Functions):<\/td>\s*<td class="headerCovTableEntry\w*">([^<]+)<\/td>\s*<td class="headerCovTableEntry">(\d+)<\/td>\s*<td class="headerCovTableEntry">(\d+)<\/td>/g,
    ),
    (match) => ({
      label: match[1],
      value: `${match[2].replace(/&nbsp;/g, " ").trim()} (${match[4]}/${match[3]})`,
    }),
  );
}
