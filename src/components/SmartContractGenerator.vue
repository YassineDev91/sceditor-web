<template>
    <div class="flex flex-col text-sm space-y-2 ">
        <h1 class="mb-2">
            Code generation
        </h1>

        <!-- Current Provider/Model Display -->
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-md">
            <div class="flex items-center justify-between">
                <span>Provider:</span>
                <span class="font-medium">{{ getProviderLabel(settingsStore.llm.provider) }}</span>
            </div>
            <div class="flex items-center justify-between mt-1">
                <span>Model:</span>
                <span class="font-medium">{{ getModelLabel(settingsStore.llm.provider) }}</span>
            </div>
        </div>

        <!-- Smart Contract Language Selection -->
        <select name="sc_language" id="sc_language" v-model="sc_language"
            class="hover:bg-slate-700 bg-slate-700 outline-none w-full shadow-sm px-2 py-1 rounded-md">
            <option value="">Choose SC language</option>
            <option value="ink">ink! for Polkadot</option>
            <option value="solana">Rust for Solana</option>
            <option value="solidity">Solidity for Ethereum</option>
            <option value="vyper">Vyper for Ethereum</option>
        </select>

        <div class="flex flex-row space-x-2">
            <button @click="generate"
                class="hover:bg-slate-700 w-full text-sm shadow-sm px-2 py-1 border border-slate-700 bg-slate-800/45 rounded-md">
                Generate Code
            </button>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
            Configure LLM in Settings ⚙️
        </p>
    </div>
    <Drawer v-model:open="showDrawer">
        <div class=" bg-slate-800 border-solid border-white outline-1 w-full h-full rounded-md ">
            <div class="text-white text-sm p-3">
                <code v-html="highlightedCode"></code>
            </div>
        </div>
    </Drawer>
</template>

<script setup>
import { useContractStorage } from "@/stores/contract";
import { useSettingsStore } from "@/stores/settings";
import { InboxIcon } from "@heroicons/vue/24/outline";
import { computed, ref, watch } from "vue";
import Drawer from "./Drawer.vue";
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark-dimmed.css';

const generatedCode = ref("empty");
var showDrawer = ref(false)
const fileStore = useContractStorage()
const settingsStore = useSettingsStore()
const sc_language = ref("");

// Provider and model selection from settings store
const selectedProvider = computed(() => settingsStore.llm.provider);
const selectedModel = computed(() => {
    const provider = settingsStore.llm.provider;
    return settingsStore.llm[provider]?.model || "";
});

// Helper functions to display provider and model labels
const getProviderLabel = (provider) => {
    const labels = {
        'ollama': 'Ollama (Local)',
        'gemini': 'Google Gemini',
        'openai': 'OpenAI',
        'anthropic': 'Anthropic Claude'
    };
    return labels[provider] || 'Not configured';
};

const getModelLabel = (provider) => {
    const model = settingsStore.llm[provider]?.model;
    if (!model) return 'Not configured';

    // Return model name in a user-friendly format
    const modelLabels = {
        'llama3': 'Llama 3',
        'codellama': 'CodeLlama',
        'mistral': 'Mistral',
        'deepseek-coder': 'DeepSeek Coder',
        'qwen2.5-coder': 'Qwen 2.5 Coder',
        'gemini-pro': 'Gemini Pro',
        'gemini-1.5-pro': 'Gemini 1.5 Pro',
        'gemini-1.5-flash': 'Gemini 1.5 Flash',
        'gpt-4': 'GPT-4',
        'gpt-4-turbo': 'GPT-4 Turbo',
        'gpt-3.5-turbo': 'GPT-3.5 Turbo',
        'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet',
        'claude-3-opus-20240229': 'Claude 3 Opus',
        'claude-3-sonnet-20240229': 'Claude 3 Sonnet'
    };

    return modelLabels[model] || model;
};


const prompt = computed(() => {
    return `You are a professional smart contract developer. Based on the JSON specification below, generate a complete ${sc_language.value} smart contract.

The JSON contains:
- Structural definitions (contract, variables, structs, functions, etc.).
- Optional natural language descriptions that clarify developer intentions or behavior.

Please follow these guidelines:
- Implement all logic explicitly defined in the JSON structure.
- Use the description field (when present) to enrich the contract, infer purpose, and write readable, semantically appropriate code.
- Prioritize the description to resolve ambiguities.
- Write clean, commented, deployable code.

Here is the smart contract definition:
<JSON>
${JSON.stringify(fileStore.contract, null, 2)}
</JSON>

Now generate the ${sc_language.value} code. Output only the smart contract code. Do not include explanations.`
});

// Provider-specific API call handlers
async function callOllama(prompt) {
    const ollamaUrl = settingsStore.llm.ollama.url;
    const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: selectedModel.value,
            prompt: prompt,
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
}

async function callGemini(prompt) {
    const apiKey = settingsStore.llm.gemini.apiKey;
    if (!apiKey) {
        throw new Error("Gemini API key not configured. Please configure it in Settings.");
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel.value}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );

    if (!response.ok) {
        throw new Error(`Gemini request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts?.[0]?.text;
}

async function callOpenAI(prompt) {
    const apiKey = settingsStore.llm.openai.apiKey;
    if (!apiKey) {
        throw new Error("OpenAI API key not configured. Please configure it in Settings.");
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: selectedModel.value,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content;
}

async function callAnthropic(prompt) {
    const apiKey = settingsStore.llm.anthropic.apiKey;
    if (!apiKey) {
        throw new Error("Anthropic API key not configured. Please configure it in Settings.");
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: selectedModel.value,
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    if (!response.ok) {
        throw new Error(`Anthropic request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0]?.text;
}

async function generate() {
    if (!selectedProvider.value) {
        alert("Please configure an LLM provider in Settings.");
        return;
    }

    if (!selectedModel.value) {
        alert("Please configure a model in Settings.");
        return;
    }

    if (sc_language.value === "") {
        alert("Please select a smart contract language.");
        return;
    }

    showDrawer.value = true;
    generatedCode.value = "Generating code... Please wait.";

    console.log(`Generating code using ${selectedProvider.value} (${selectedModel.value})`);

    try {
        let rawCode = "";

        // Call the appropriate provider API
        switch (selectedProvider.value) {
            case "ollama":
                rawCode = await callOllama(prompt.value);
                break;
            case "gemini":
                rawCode = await callGemini(prompt.value);
                break;
            case "openai":
                rawCode = await callOpenAI(prompt.value);
                break;
            case "anthropic":
                rawCode = await callAnthropic(prompt.value);
                break;
            default:
                throw new Error(`Unknown provider: ${selectedProvider.value}`);
        }

        // Extract code from markdown blocks if present
        generatedCode.value = extractCode(rawCode);
        console.log("✅ Code generated successfully");

    } catch (error) {
        console.error("❌ Error generating code:", error);
        generatedCode.value = `Error generating code: ${error.message}\n\nPlease check:\n- Your provider configuration in Settings\n- Your API key is valid (for cloud providers)\n- Ollama is running (for local provider)\n- The API endpoint is accessible`;
    }
}

const highlightedCode = computed(() => {
    let highlighted = hljs.highlightAuto(generatedCode.value).value;

    return highlighted
});
// Function to extract Solidity, Rust, or Vyper code from response
function extractCode(response) {
    // Try to extract code from markdown code blocks
    const match = response.match(/```(?:solidity|rust|vyper|sol|rs)?\n?([\s\S]+?)\n?```/);
    if (match) {
        return match[1].trim();
    }

    // If no markdown blocks found, return the raw response (it might already be clean code)
    return response.trim();
}
</script>

<style>
pre {
    overflow-x: auto;
    /* Allow horizontal scrolling for <pre> itself */
}
</style>