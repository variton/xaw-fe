<script lang="ts">
  import { login } from "$lib/api/auth";

  let username = $state("");
  let password = $state("");
  let isConnecting = $state(false);
  let connectionMessage = $state("");

  async function connect(event: SubmitEvent) {
    event.preventDefault();
    if (isConnecting) return;

    isConnecting = true;
    connectionMessage = "";
    try {
      console.log("simple test");
      await login(username, password);
      password = "";
      connectionMessage = "Connected successfully.";
    } catch (error) {
      connectionMessage =
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.";
    } finally {
      isConnecting = false;
    }
  }
</script>

<svelte:head>
  <title>Welcome to Artifact watcher</title>
  <meta
    name="description"
    content="Welcome to Artifact watcher. Enter your login and password to get started."
  />
</svelte:head>

<main>
  <div class="digital-rain" aria-hidden="true">
    {#each Array.from({ length: 28 }, (_, i) => i) as column}
      <span
        style={`--column: ${column}; --duration: ${14 + (column % 9)}s; --delay: ${-column * 2.7}s;`}
      >
        {column % 2 === 0
          ? "0101アイウエオ1010カキクケコ0110サシスセソ"
          : "1100タチツテト0011ナニヌネノ1010ハヒフヘホ"}
      </span>
    {/each}
  </div>
  <a class="brand" href="/" aria-label="Artifact watcher home"
    >Artifact watcher<span>.</span></a
  >

  <section class="login-card" aria-labelledby="welcome-heading">
    <div class="mark" aria-hidden="true">AW</div>
    <p class="eyebrow">ENTER THE MATRIX</p>
    <h1 id="welcome-heading">Wake up.</h1>
    <p class="intro">Enter your login and password to get started.</p>

    <form class="fields" method="POST" onsubmit={connect}>
      <div class="field">
        <label for="login">Login</label>
        <input
          id="login"
          name="login"
          bind:value={username}
          disabled={isConnecting}
          type="text"
          autocomplete="username"
          placeholder="Enter your login"
          required
        />
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          name="password"
          bind:value={password}
          disabled={isConnecting}
          type="password"
          autocomplete="current-password"
          placeholder="Enter your password"
          required
        />
      </div>
      <button type="submit" disabled={isConnecting} aria-busy={isConnecting}>
        {isConnecting ? "Connecting…" : "Connect"}
        <span aria-hidden="true">→</span>
      </button>
      <p class="connection-message" role="status">{connectionMessage}</p>
    </form>
  </section>

  <footer>Follow the white rabbit.</footer>
</main>

<style>
  @import "./landing.css";
</style>
