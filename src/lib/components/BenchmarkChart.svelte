<script lang="ts">
  let { samples }: { samples: { sample: number; milliseconds: number }[] } =
    $props();
  const maximum = $derived(
    Math.max(1, ...samples.map((row) => row.milliseconds)) * 1.1,
  );
  const x = (i: number) => 52 + (i / Math.max(1, samples.length - 1)) * 660;
  const y = (value: number) => 220 - (value / maximum) * 190;
  const points = $derived(
    samples.map((row, i) => `${x(i)},${y(row.milliseconds)}`).join(" "),
  );
</script>

<div class="benchmark-chart">
  <div class="chart-heading">
    <h2>Benchmarking performance</h2>
    <span>{samples.length} recorded samples</span>
  </div>
  <article>
    <h3>Execution time</h3>
    <p>Reported execution time per sample · milliseconds · lower is better</p>
    {#if samples.length}
      <svg
        viewBox="0 0 740 270"
        role="img"
        aria-label="Benchmark execution time by recorded sample, in milliseconds"
      >
        {#each [0, 0.25, 0.5, 0.75, 1] as tick}
          <line
            x1="52"
            x2="712"
            y1={y(tick * maximum)}
            y2={y(tick * maximum)}
            class="grid-line"
          />
          <text x="44" y={y(tick * maximum) + 4} text-anchor="end"
            >{(tick * maximum).toFixed(0)}</text
          >
        {/each}
        <polyline
          {points}
          fill="none"
          stroke="var(--theme-accent)"
          stroke-width="2.5"
        />
        {#each samples as row, i}
          <circle
            cx={x(i)}
            cy={y(row.milliseconds)}
            r="3.5"
            fill="var(--theme-accent)"
          >
            <title>Sample {row.sample}: {row.milliseconds.toFixed(3)} ms</title>
          </circle>
          {#if i === 0 || i === samples.length - 1 || (i + 1) % 10 === 0}
            <text x={x(i)} y="244" text-anchor="middle">{row.sample}</text>
          {/if}
        {/each}
        <text x="382" y="265" text-anchor="middle">Sample</text>
      </svg>
      <div class="legend">● Execution time (ms)</div>
      <details>
        <summary>View sample values</summary>
        <table>
          <thead
            ><tr
              ><th scope="col">Sample</th><th scope="col"
                >Execution time (ms)</th
              ></tr
            ></thead
          >
          <tbody
            >{#each samples as row}<tr
                ><td>{row.sample}</td><td>{row.milliseconds.toFixed(3)}</td></tr
              >{/each}</tbody
          >
        </table>
      </details>
    {:else}
      <p>No timing samples are available in this report.</p>
    {/if}
  </article>
</div>

<style>
  .benchmark-chart {
    padding: 24px;
  }
  .chart-heading {
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
  .chart-heading span,
  p {
    color: var(--theme-muted);
    font-size: 12px;
  }
  article {
    margin-top: 20px;
    min-width: 0;
    padding: 16px;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background: linear-gradient(var(--theme-panel-2), var(--theme-panel));
  }
  h3 {
    color: var(--theme-accent);
    margin: 0 0 8px;
    font-size: 16px;
  }
  p {
    margin: 0;
    line-height: 1.6;
  }
  svg {
    display: block;
    width: 100%;
    margin-top: 12px;
  }
  text {
    fill: var(--theme-muted);
    font:
      12px "Courier New",
      monospace;
  }
  .grid-line {
    stroke: var(--theme-border);
    stroke-dasharray: 2 4;
  }
  .legend {
    color: var(--theme-accent);
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
