<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import SettingsPage from "./SettingsPage.svelte";
  import { themeStyle, type Theme } from "$lib/themes";
  import ReportTrends from "./ReportTrends.svelte";
  import BenchmarkChart from "./BenchmarkChart.svelte";
  import memoryLeakReport from "../../../reports/valgrind-report.html?raw";
  import unitTestsReport from "../../../reports/doctest-report.html?raw";
  import coverageReport from "../../../reports/index.html?raw";
  import benchmarkingReport from "../../../reports/customs/benchmarking.html?raw";
  import stressTestingReport from "../../../reports/customs/stress-testing.html?raw";
  import reportThemeCss from "../../css/report-theme.css?raw";
  import {
    cardMetrics,
    coverageMetrics,
    benchmarkingMetrics,
    benchmarkingSamples,
  } from "$lib/report-summary";

  const benchmarkMetrics = benchmarkingMetrics(benchmarkingReport);
  const benchmarkSamples = benchmarkingSamples(benchmarkingReport);
  const qualitySummaries = [
    {
      title: "Benchmarking",
      slug: "benchmarking",
      metrics: benchmarkMetrics,
      demo: false,
    },
    {
      title: "Stress testing",
      slug: "stress-testing",
      metrics: cardMetrics(stressTestingReport),
      demo: true,
    },
  ];

  const summaries = [
    {
      title: "Memory leak",
      slug: "memory-leak",
      metrics: cardMetrics(memoryLeakReport),
    },
    {
      title: "Unit tests",
      slug: "unit-tests",
      metrics: cardMetrics(unitTestsReport),
    },
    {
      title: "Coverage tests",
      slug: "coverage-tests",
      metrics: coverageMetrics(coverageReport),
    },
  ];

  const reportDocuments: Record<string, { title: string; html: string }> = {
    "memory-leak": {
      title: "Valgrind memory leak report",
      html: memoryLeakReport,
    },
    "unit-tests": { title: "Doctest unit tests report", html: unitTestsReport },
    "coverage-tests": { title: "LCOV coverage report", html: coverageReport },
  };
  const isSettings = $derived(page.url.searchParams.get("view") === "settings");
  const isQualityReports = $derived(
    page.url.searchParams.get("view") === "quality-reports",
  );
  const reportDocument = $derived(
    reportDocuments[page.url.searchParams.get("report") ?? ""],
  );

  const mainReportNames: Record<string, string> = {
    "memory-leak": "Memory leak",
    "unit-tests": "Unit tests",
    "coverage-tests": "Coverage tests",
  };
  const qualityReportNames: Record<string, string> = {
    benchmarking: "Benchmarking",
    "stress-testing": "Stress testing",
  };
  const reportNames = $derived(
    isQualityReports ? qualityReportNames : mainReportNames,
  );
  const reportOrder = $derived(Object.keys(reportNames));
  const reportIndex = $derived(
    reportOrder.indexOf(page.url.searchParams.get("report") ?? ""),
  );
  const previousReport = $derived(
    reportOrder[
      (Math.max(reportIndex, 0) - 1 + reportOrder.length) % reportOrder.length
    ],
  );
  const nextReport = $derived(
    reportOrder[(reportIndex + 1) % reportOrder.length],
  );
  const report = $derived(
    reportNames[page.url.searchParams.get("report") ?? ""],
  );
  function reportHref(slug: string) {
    const params = new URLSearchParams(page.url.searchParams);
    if (!isQualityReports) params.delete("view");
    params.set("report", slug);
    return `?${params}`;
  }
  type Repository = { id: string; name: string };

  let availableDates = $state<string[]>([]);
  let repositoryDate = $state("");
  onMount(() => {
    const today = new Date();
    availableDates = Array.from({ length: 7 }, (_, daysAgo) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - daysAgo,
      );
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    });
  });

  let {
    interfaceTheme,
    reportTheme,
    saveMessage,
    onchange,
    username = "",
    onlogout,
    repositories = [
      { id: "xcicd", name: "xcicd" },
      { id: "tcxx", name: "tcxx" },
      { id: "tcxx-23", name: "tcxx-23" },
    ],
  }: {
    interfaceTheme: Theme;
    reportTheme: Theme;
    saveMessage: string;
    onchange: (target: "interface" | "report", theme: Theme) => void;
    repositories?: Repository[];
    username?: string;
    onlogout: () => void;
  } = $props();
  const themedStressTest = $derived(
    stressTestingReport.replace(
      "</head>",
      `<style>${reportThemeCss} :root { ${themeStyle(reportTheme)} }</style></head>`,
    ),
  );
  const themedBenchmark = $derived(
    benchmarkingReport.replace(
      "</head>",
      `<style>${reportThemeCss} :root { ${themeStyle(reportTheme)} }</style></head>`,
    ),
  );
  const themedReport = $derived(
    reportDocument?.html.replace(
      "</head>",
      `<style>${reportThemeCss} :root { ${themeStyle(reportTheme)} }</style></head>`,
    ),
  );
  let selectedRepo = $state("");
  const repository = $derived(
    repositories.find((repo) => repo.id === selectedRepo),
  );
  const canShowReports = $derived(
    Boolean(repository) && availableDates.includes(repositoryDate),
  );
</script>

<div class="workspace">
  <header>
    <a class="brand" href="/" aria-label="Artifact watcher home"
      >Artifact watcher<span>.</span></a
    >
    <div class="repository-filters">
      <div class="repo-field">
        <label for="repo">Repo</label>
        <select id="repo" name="repo" bind:value={selectedRepo}>
          <option value="" disabled>
            {repositories.length
              ? "Select a repository"
              : "No repositories available"}
          </option>
          {#each repositories as repo (repo.id)}
            <option value={repo.id}>{repo.name}</option>
          {/each}
        </select>
      </div>
      <div class="date-field">
        <label for="report-date">Date</label>
        <select id="report-date" name="report-date" bind:value={repositoryDate}>
          <option value="" disabled>Select a date</option>
          {#each availableDates as date}
            <option value={date}>{date}</option>
          {/each}
        </select>
      </div>
    </div>
    <span class="status"><span aria-hidden="true">●</span> Connected</span>
    <button class="logout-button" type="button" onclick={onlogout}
      >Log out</button
    >
  </header>

  <section aria-labelledby="workspace-heading">
    <p class="eyebrow">
      {isSettings
        ? "PERSONALIZE YOUR WORKSPACE"
        : isQualityReports
          ? "REPOSITORY QUALITY"
          : report
            ? "REPOSITORY REPORT"
            : "CONNECTION ESTABLISHED"}
    </p>
    <div class="welcome-heading">
      <h1 id="workspace-heading">
        {isSettings
          ? "Settings"
          : isQualityReports
            ? "Quality reports"
            : (report ??
              (username.trim() ? `Welcome, ${username.trim()}.` : "Welcome."))}
      </h1>
      {#if !isSettings}
        <div class="workspace-actions">
          <a
            class="settings-button"
            href="?view=settings"
            aria-label="Settings"
            title="Settings"
          >
            <span aria-hidden="true">⚙</span>
          </a>
          <a
            class="next-button"
            href={isQualityReports ? "?" : "?view=quality-reports"}
            aria-label={isQualityReports
              ? "Back to repositories"
              : "Quality reports"}
            title={isQualityReports
              ? "Back to repositories"
              : "Quality reports"}
          >
            <span aria-hidden="true">»</span>
          </a>
        </div>
      {/if}
    </div>
    {#if isQualityReports && report}
      <p class="intro">
        <a class="back-link" href="?view=quality-reports"
          >← Back to quality reports</a
        >
      </p>
    {:else if !isQualityReports}
      <p class="intro">
        {#if report || isSettings}
          <a class="back-link" href="?">← Back to repositories</a>
        {:else}
          Your repositories. Your artifacts. One place to watch.
        {/if}
      </p>
    {/if}

    {#if isSettings}
      <SettingsPage {interfaceTheme} {reportTheme} {onchange} {saveMessage} />
    {:else}
      <div
        class="repository-panel"
        style={themeStyle(reportTheme)}
        style:margin-top={isQualityReports && !report ? "40px" : undefined}
        aria-live="polite"
      >
        <div class="panel-heading">
          <div class="panel-title">
            {#if repository}
              <span class="repository-name">{repository.name}</span>
            {/if}
            {#if repositoryDate}
              <time
                class="repository-date"
                datetime={repositoryDate}
                title="Selected report date">[{repositoryDate}]</time
              >
            {/if}
          </div>
          <div class="panel-controls">
            <span aria-hidden="true">[ AW ]</span>
            {#if isQualityReports || canShowReports}
              <nav
                class="report-navigation"
                aria-label={isQualityReports
                  ? "Cycle quality reports"
                  : "Cycle reports"}
              >
                <a
                  href={reportHref(previousReport)}
                  aria-label={`Previous report: ${reportNames[previousReport]}`}
                  title={`Previous: ${reportNames[previousReport]}`}>{"_<<"}</a
                >
                <a
                  href={reportHref(nextReport)}
                  aria-label={`Next report: ${reportNames[nextReport]}`}
                  title={`Next: ${reportNames[nextReport]}`}>{">>_"}</a
                >
              </nav>
            {/if}
          </div>
        </div>
        {#if !canShowReports}
          <div class="panel-content">
            <div class="terminal-mark" aria-hidden="true">&gt;_</div>
            <h2>Select a repository and date</h2>
            <p>
              {repositories.length
                ? "Choose both a repository and a date above to view report metrics, trends, and results."
                : "No repositories are available yet. Reports will appear after a repository and date are selected."}
            </p>
          </div>
        {:else if isQualityReports}
          {#if !report}
            <div
              class="results-summary"
              role="region"
              aria-label="Quality report results summary"
            >
              {#each qualitySummaries as summary}
                <article class="result-card">
                  <h2>{summary.title}</h2>
                  {#if summary.demo}<p>
                      DEMO · Synthetic data, not repository results.
                    </p>{/if}
                  {#if summary.metrics.length}
                    <dl>
                      {#each summary.metrics as metric}
                        <div>
                          <dt>{metric.label}</dt>
                          <dd>{metric.value}</dd>
                        </div>
                      {/each}
                    </dl>
                  {:else}
                    <p>Summary unavailable.</p>
                  {/if}
                  <div class="repository-actions">
                    <a href={reportHref(summary.slug)}>{summary.title}</a>
                  </div>
                </article>
              {/each}
            </div>
            <BenchmarkChart samples={benchmarkSamples} />
          {/if}
          {#if page.url.searchParams.get("report") === "benchmarking"}
            <iframe
              class="embedded-report"
              title="SSIM benchmarking report"
              srcdoc={themedBenchmark}
              sandbox=""
            ></iframe>
          {:else if page.url.searchParams.get("report") === "stress-testing"}
            <iframe
              class="embedded-report"
              title="Stress testing demo report"
              srcdoc={themedStressTest}
              sandbox=""
            ></iframe>
          {/if}
        {:else}
          {#if !report}
            <div
              class="results-summary"
              role="region"
              aria-label="Report results summary"
            >
              {#each summaries as summary}
                <article class="result-card">
                  <h2>{summary.title}</h2>
                  {#if summary.metrics.length}
                    <dl>
                      {#each summary.metrics as metric}
                        <div>
                          <dt>{metric.label}</dt>
                          <dd>{metric.value}</dd>
                        </div>
                      {/each}
                    </dl>
                  {:else}
                    <p>Summary unavailable.</p>
                  {/if}
                  <div class="repository-actions">
                    <a href={reportHref(summary.slug)}>{summary.title}</a>
                  </div>
                </article>
              {/each}
            </div>
          {/if}
          {#if reportDocument}
            <iframe
              class="embedded-report"
              title={reportDocument.title}
              srcdoc={themedReport}
              sandbox=""
            ></iframe>
          {:else}
            <ReportTrends dates={availableDates} demo />
            <div class="panel-content">
              <div class="terminal-mark" aria-hidden="true">&gt;_</div>
              <h2>{repository ? repository.name : "Awaiting repository"}</h2>
              <p>
                {report
                  ? `${report} results are not available yet.`
                  : repository
                    ? "Repository selected. Artifact data is not available yet."
                    : repositories.length
                      ? "Choose a repository from the Repo dropdown above to get started."
                      : "No repositories are available yet. Your connected repositories will appear in the Repo dropdown."}
              </p>
            </div>
          {/if}
        {/if}
      </div>
    {/if}
  </section>
</div>

<style>
  @import "../../css/connected.css";
</style>
