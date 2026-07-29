import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem("sceditor-settings");
    const defaults = {
      // LLM Configuration
      llm: {
        provider: import.meta.env.VITE_AI_PROVIDER || "ollama",
        ollama: {
          model: import.meta.env.VITE_OLLAMA_MODEL || "llama3",
        },
        gemini: {
          model: import.meta.env.VITE_GEMINI_MODEL || "gemini-pro",
        },
        openai: {
          model: import.meta.env.VITE_OPENAI_MODEL || "gpt-4",
        },
        anthropic: {
          model: import.meta.env.VITE_ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
        },
        proxy: {
          url: import.meta.env.VITE_PROXY_URL || "http://localhost:4000",
          secret: "",
        },
        verify: {
          url: import.meta.env.VITE_VERIFY_URL || "http://localhost:4100",
          secret: "",
        },
      },
      // Editor Preferences
      editor: {
        autosaveEnabled: true,
        autosaveInterval: 30000, // 30 seconds
        gridEnabled: true,
        snapToGrid: false,
        gridSize: 20,
        theme: "light",
      },
      // General
      general: {
        language: "en",
        showWelcome: true,
      },
    };

    if (!saved) {
      return defaults;
    }

    const parsed = JSON.parse(saved);
    return {
      ...defaults,
      ...parsed,
      llm: {
        provider: parsed.llm?.provider ?? defaults.llm.provider,
        ollama: { model: parsed.llm?.ollama?.model ?? defaults.llm.ollama.model },
        gemini: { model: parsed.llm?.gemini?.model ?? defaults.llm.gemini.model },
        openai: { model: parsed.llm?.openai?.model ?? defaults.llm.openai.model },
        anthropic: { model: parsed.llm?.anthropic?.model ?? defaults.llm.anthropic.model },
        proxy: { ...defaults.llm.proxy, ...parsed.llm?.proxy },
        verify: { ...defaults.llm.verify, ...parsed.llm?.verify },
      },
    };
  },
  actions: {
    // Save settings to localStorage
    saveSettings() {
      localStorage.setItem("sceditor-settings", JSON.stringify(this.$state));
      console.log("✅ Settings saved");
    },

    // Update LLM provider
    setLLMProvider(provider) {
      this.llm.provider = provider;
      this.saveSettings();
    },

    // Update LLM configuration (also used for the shared "proxy" config)
    updateLLMConfig(provider, config) {
      if (this.llm[provider]) {
        this.llm[provider] = { ...this.llm[provider], ...config };
        this.saveSettings();
      }
    },

    // Update editor preferences
    updateEditorPreferences(preferences) {
      this.editor = { ...this.editor, ...preferences };
      this.saveSettings();
    },

    // Reset to defaults
    resetToDefaults() {
      const confirmReset = confirm("Are you sure you want to reset all settings to defaults?");
      if (!confirmReset) return;

      this.llm = {
        provider: "ollama",
        ollama: {
          model: "llama3",
        },
        gemini: {
          model: "gemini-pro",
        },
        openai: {
          model: "gpt-4",
        },
        anthropic: {
          model: "claude-3-5-sonnet-20241022",
        },
        proxy: {
          url: "http://localhost:4000",
          secret: "",
        },
        verify: {
          url: "http://localhost:4100",
          secret: "",
        },
      };

      this.editor = {
        autosaveEnabled: true,
        autosaveInterval: 30000,
        gridEnabled: true,
        snapToGrid: false,
        gridSize: 20,
        theme: "light",
      };

      this.general = {
        language: "en",
        showWelcome: true,
      };

      this.saveSettings();
      console.log("🔄 Settings reset to defaults");
    },

    // Test the proxy connection (and, transitively, whichever provider is selected)
    async testLLMConnection() {
      const provider = this.llm.provider;
      try {
        const response = await fetch(`${this.llm.proxy.url}/api/status`, {
          headers: { "X-Proxy-Secret": this.llm.proxy.secret },
        });

        if (response.status === 401) {
          return { success: false, message: "Proxy authentication failed — check your shared secret in Settings." };
        }
        if (!response.ok) {
          return { success: false, message: `Proxy returned ${response.status}` };
        }

        const status = await response.json();
        const providerStatus = status[provider];
        if (!providerStatus) {
          return { success: false, message: "Unknown provider" };
        }

        if (provider === "ollama") {
          return providerStatus.reachable
            ? { success: true, message: `Connected! Found ${providerStatus.models?.length || 0} models.` }
            : { success: false, message: "Could not reach Ollama from the proxy server." };
        }

        return providerStatus.configured
          ? { success: true, message: "API key configured on the server." }
          : { success: false, message: `${provider} is not configured on the server.` };
      } catch (error) {
        return { success: false, message: "Could not reach the proxy server — is it running, and is the Proxy URL setting correct?" };
      }
    },
  },
  getters: {
    currentLLMConfig(state) {
      const provider = state.llm.provider;
      return state.llm[provider] || {};
    },
    currentProvider(state) {
      return state.llm.provider;
    },
  },
});
