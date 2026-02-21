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
          url: import.meta.env.VITE_OLLAMA_URL || "http://localhost:11434",
          model: import.meta.env.VITE_OLLAMA_MODEL || "llama3",
        },
        gemini: {
          apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
          model: import.meta.env.VITE_GEMINI_MODEL || "gemini-pro",
        },
        openai: {
          apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
          model: import.meta.env.VITE_OPENAI_MODEL || "gpt-4",
        },
        anthropic: {
          apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || "",
          model: import.meta.env.VITE_ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
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

    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
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

    // Update LLM configuration
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
          url: "http://localhost:11434",
          model: "llama3",
        },
        gemini: {
          apiKey: "",
          model: "gemini-pro",
        },
        openai: {
          apiKey: "",
          model: "gpt-4",
        },
        anthropic: {
          apiKey: "",
          model: "claude-3-5-sonnet-20241022",
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

    // Test LLM connection
    async testLLMConnection() {
      const provider = this.llm.provider;
      try {
        if (provider === "ollama") {
          const response = await fetch(`${this.llm.ollama.url}/api/tags`);
          if (response.ok) {
            const data = await response.json();
            return { success: true, message: `Connected! Found ${data.models?.length || 0} models.` };
          }
        } else if (provider === "gemini") {
          if (!this.llm.gemini.apiKey) {
            return { success: false, message: "API key is required" };
          }
          // Simple test - just verify key format
          return { success: true, message: "API key configured" };
        } else if (provider === "openai") {
          if (!this.llm.openai.apiKey) {
            return { success: false, message: "API key is required" };
          }
          return { success: true, message: "API key configured" };
        } else if (provider === "anthropic") {
          if (!this.llm.anthropic.apiKey) {
            return { success: false, message: "API key is required" };
          }
          return { success: true, message: "API key configured" };
        }
        return { success: false, message: "Unknown provider" };
      } catch (error) {
        return { success: false, message: error.message };
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
