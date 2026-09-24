<script lang="ts">
  export type DailyMetrics = {
    date: string;
    memoryErrors: number | null;
    unitPassRate: number | null;
    lineCoverage: number | null;
    functionCoverage: number | null;
  };

  let {
    dates,
    history = [],
    demo = false,
  }: {
    dates: string[];
    history?: DailyMetrics[];
    demo?: boolean;
  } = $props();

  const days = $derived([...dates].reverse());
  const sample = [
    [6, 89, 92.1, 94],
    [4, 92, 93.8, 96],
    [5, 94, 95.2, 96],
    [2, 95, 96.4, 98],
    [1, 97, 97.1, 98],
    [1, 98, 98.5, 100],
    [0, 100, 99.2, 100],
  ];
  const values = $derived(
    days.map((date, i) =>
      demo
        ? {
            date,
            memoryErrors: sample[i][0],
            unitPassRate: sample[i][1],
            lineCoverage: sample[i][2],
            functionCoverage: sample[i][3],
          }
        : history.find((row) => row.date === date),
    ),
  );
  const charts = [
    {
      title: "Memory leak",
      description: "Memory errors · lower is better",
      percent: false,
      series: [
        { key: "memoryErrors", label: "Errors", color: "var(--theme-accent)" },
      ],
    },
    {
      title: "Unit tests",
      description: "Tests passed · higher is better",
      percent: true,
      series: [
        {
          key: "unitPassRate",
          label: "Pass rate",
          color: "var(--theme-accent)",
        },
      ],
    },
    {
      title: "Coverage tests",
      description: "Code covered · higher is better",
      percent: true,
      series: [
        { key: "lineCoverage", label: "Lines", color: "var(--theme-accent)" },
        {
          key: "functionCoverage",
          label: "Functions",
          color: "var(--theme-secondary)",
        },
      ],
    },
  ] as const;
  type MetricKey = Exclude<keyof DailyMetrics, "date">;
  const x = (i: number) => 40 + i * 45;
  const y = (value: number, max: number) => 154 - (value / max) * 120;
  function maximum(key: MetricKey) {
    return Math.max(1, ...values.map((row) => row?.[key] ?? 0));
  }
  function path(key: MetricKey, max: number) {
    let connected = false;
    return values
      .map((row, i) => {
        const value = row?.[key];
        if (value == null) {
          connected = false;
          return "";
        }
        const command = connected ? "L" : "M";
        connected = true;
        return `${command}${x(i)},${y(value, max)}`;
      })
      .join(" ");
  }
</script>

<div class="trends">
  <div class="trends-heading">
    <h2>Seven-day trends</h2>
    <span>{demo ? "DEMO · SAMPLE DATA" : "Last six days + today"}</span>
  </div>
  {#if demo}
    <p class="notice">Illustrative sample data, not repository results.</p>
  {:else if !history.length}
    <p class="notice">
      Historical results are not available yet. Missing days are left blank.
    </p>
  {/if}
  <div class="charts">
    {#each charts as chart}
      {@const max = chart.percent ? 100 : maximum("memoryErrors")}
      <article>
        <h3>{chart.title}</h3>
        <p>{chart.description}</p>
        <svg
          viewBox="0 0 340 195"
          role="img"
          aria-label={`${chart.title}: seven-day trend${demo ? " using sample data" : ""}`}
        >
          {#each [0, 0.5, 1] as tick}
            <line
              x1="40"
              x2="310"
              y1={y(tick * max, max)}
              y2={y(tick * max, max)}
              class="grid-line"
            />
            <text x="33" y={y(tick * max, max) + 4} text-anchor="end"
              >{tick * max}{chart.percent ? "%" : ""}</text
            >
          {/each}
          {#each days as date, i}
            <text x={x(i)} y="177" text-anchor="middle">{date.slice(5)}</text>
          {/each}
          {#each chart.series as series, seriesIndex}
            <path
              d={path(series.key, max)}
              fill="none"
              stroke={series.color}
              stroke-width="2.5"
              stroke-dasharray={seriesIndex ? "5 4" : undefined}
            />
            {#each values as row, i}
              {@const value = row?.[series.key]}
              {#if value != null}
                <circle
                  cx={x(i)}
                  cy={y(value, max)}
                  r="3.5"
                  fill={series.color}
                >
                  <title
                    >{days[i]} · {series.label}: {value}{chart.percent
                      ? "%"
                      : ""}</title
                  >
                </circle>
              {/if}
            {/each}
          {/each}
        </svg>
        <div class="legend">
          {#each chart.series as series}
            <span style:color={series.color}>● {series.label}</span>
          {/each}
        </div>
        <details>
          <summary>View daily values</summary>
          <table>
            <thead
              ><tr
                ><th>Date</th>{#each chart.series as series}<th
                    >{series.label}</th
                  >{/each}</tr
              ></thead
            >
            <tbody
              >{#each days as date, i}<tr
                  ><td>{date}</td>{#each chart.series as series}<td
                      >{values[i]?.[series.key] ?? "—"}{values[i]?.[
                        series.key
                      ] != null && chart.percent
                        ? "%"
                        : ""}</td
                    >{/each}</tr
                >{/each}</tbody
            >
          </table>
        </details>
      </article>
    {/each}
  </div>
</div>

<style>
  .trends {
    padding: 24px;
  }
  .trends-heading {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  h2 {
    margin: 0;
    color: var(--theme-heading);
    font-size: 20px;
  }
  .trends-heading span,
  .notice {
    color: var(--theme-muted);
    font-size: 12px;
  }
  .notice {
    line-height: 1.6;
  }
  .charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
    gap: 16px;
    margin-top: 20px;
  }
  article {
    min-width: 0;
    padding: 16px;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background:
      repeating-linear-gradient(
        0deg,
        transparent 0 3px,
        color-mix(in srgb, var(--theme-accent) 1.57%, transparent) 3px 4px
      ),
      linear-gradient(var(--theme-panel-2), var(--theme-panel));
  }
  h3 {
    color: var(--theme-accent);
    margin: 0 0 8px;
    font-size: 16px;
  }
  article p {
    color: var(--theme-muted);
    margin: 0;
    font-size: 12px;
  }
  svg {
    display: block;
    width: 100%;
    margin-top: 12px;
    overflow: visible;
  }
  text {
    fill: var(--theme-muted);
    font:
      10px "Courier New",
      monospace;
  }
  .grid-line {
    stroke: var(--theme-border);
    stroke-dasharray: 2 4;
  }
  .legend {
    display: flex;
    gap: 16px;
    font-size: 12px;
  }
  details {
    margin-top: 16px;
    font-size: 12px;
    color: var(--theme-text);
  }
  summary {
    cursor: pointer;
  }
  summary:focus-visible {
    outline: 2px solid var(--theme-accent);
    outline-offset: 4px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;
  }
  th,
  td {
    padding: 6px 3px;
    text-align: left;
    border-bottom: 1px solid var(--theme-border);
  }
</style>
