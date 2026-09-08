<script lang="ts">
  type Repository = { id: string; name: string };

  let {
    repositories = [
      { id: "xcicd", name: "xcicd" },
      { id: "tcxx", name: "tcxx" },
      { id: "tcxx-23", name: "tcxx-23" },
    ],
  }: { repositories?: Repository[] } = $props();
  let selectedRepo = $state("");
  const repository = $derived(
    repositories.find((repo) => repo.id === selectedRepo),
  );
</script>

<div class="workspace">
  <header>
    <a class="brand" href="/" aria-label="Artifact watcher home"
      >Artifact watcher<span>.</span></a
    >
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
    <span class="status"><span aria-hidden="true">●</span> Connected</span>
  </header>

  <section aria-labelledby="workspace-heading">
    <p class="eyebrow">CONNECTION ESTABLISHED</p>
    <h1 id="workspace-heading">Welcome to the Matrix.</h1>
    <p class="intro">Your repositories. Your artifacts. One place to watch.</p>

    <div class="repository-panel" aria-live="polite">
      <div class="panel-heading">
        <span>REPOSITORY WATCHER</span><span aria-hidden="true">[ AW ]</span>
      </div>
      <div class="panel-content">
        <div class="terminal-mark" aria-hidden="true">&gt;_</div>
        <h2>{repository ? repository.name : "Awaiting repository"}</h2>
        <p>
          {repository
            ? "Repository selected. Artifact data is not available yet."
            : repositories.length
              ? "Choose a repository from the Repo dropdown above to get started."
              : "No repositories are available yet. Your connected repositories will appear in the Repo dropdown."}
        </p>
      </div>
    </div>
  </section>
</div>

<style>
  @import "../../css/connected.css";
</style>
