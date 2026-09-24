<script lang="ts">
  import { themes, themeStyle, type Theme } from "$lib/themes";
  let {
    interfaceTheme,
    reportTheme,
    onchange,
    saveMessage,
  }: {
    interfaceTheme: Theme;
    reportTheme: Theme;
    onchange: (target: "interface" | "report", theme: Theme) => void;
    saveMessage: string;
  } = $props();
</script>

<div class="settings">
  <p>
    Choose the appearance of your workspace and reports independently. Changes
    apply immediately.
  </p>
  {#each ["interface", "report"] as target}
    <fieldset>
      <legend
        >{target === "interface" ? "Interface theme" : "Report theme"}</legend
      >
      <div class="choices">
        {#each themes as theme}
          <label
            class="choice"
            class:selected={(target === "interface"
              ? interfaceTheme
              : reportTheme) === theme.id}
          >
            <div
              class="preview"
              style={themeStyle(theme.id)}
              aria-hidden="true"
            >
              <span
                >{target === "interface"
                  ? "Artifact watcher"
                  : "Report summary"}</span
              >
              <div class="preview-panel">
                <strong
                  >{target === "interface"
                    ? "Your repositories"
                    : "98.4%"}</strong
                ><span
                  >{target === "interface"
                    ? "Explore your artifacts →"
                    : "Tests passed"}</span
                >
              </div>
            </div>
            <div class="choice-title">
              <input
                type="radio"
                name={`${target}-theme`}
                value={theme.id}
                checked={(target === "interface"
                  ? interfaceTheme
                  : reportTheme) === theme.id}
                onchange={() =>
                  onchange(target as "interface" | "report", theme.id)}
              />{theme.name}
            </div>
            <span class="description">{theme.description}</span>
          </label>
        {/each}
      </div>
    </fieldset>
  {/each}
  <p role="status">{saveMessage}</p>
</div>

<style>
  .settings {
    padding: 24px;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background: var(--theme-panel);
  }
  p,
  .description {
    color: var(--theme-muted);
    line-height: 1.6;
  }
  p:first-child {
    margin-top: 0;
  }
  fieldset {
    border: 0;
    padding: 0;
    margin: 32px 0;
    min-width: 0;
  }
  legend {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
  }
  .choices {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
    gap: 16px;
  }
  .choice {
    padding: 12px;
    border: 2px solid var(--theme-border);
    border-radius: 6px;
    cursor: pointer;
  }
  .choice.selected {
    border-color: var(--theme-accent);
  }
  .choice:focus-within {
    outline: 3px solid var(--theme-accent);
    outline-offset: 3px;
  }
  .preview {
    padding: 16px;
    background: var(--theme-bg);
    color: var(--theme-text);
    border-radius: 4px;
    font-size: 12px;
  }
  .preview-panel {
    display: grid;
    gap: 10px;
    margin-top: 16px;
    padding: 16px;
    background: var(--theme-panel-2);
    border: 1px solid var(--theme-border);
  }
  strong {
    color: var(--theme-accent);
    font-size: 18px;
  }
  .choice-title {
    display: flex;
    gap: 8px;
    align-items: center;
    margin: 16px 0 8px;
    font-weight: bold;
  }
  input {
    accent-color: var(--theme-accent);
  }
  .description {
    font-size: 12px;
  }
</style>
