type Metric = { label: string; value: string };

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
