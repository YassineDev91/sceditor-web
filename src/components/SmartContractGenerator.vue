<template>
    <div class="flex flex-col text-sm space-y-2 ">
        <h1 class="mb-2">
            Code generation
        </h1>

        <!-- LLM Provider Selection -->
        <select name="ai_provider" id="ai_provider" v-model="selectedProvider"
            class="hover:bg-slate-700 bg-slate-700 outline-none w-full shadow-sm px-2 py-1 rounded-md">
            <option value="">Choose LLM Provider</option>
            <option value="ollama">Ollama (Local)</option>
            <option value="gemini">Google Gemini</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic Claude</option>
        </select>

        <!-- Model Selection (dynamic based on provider) -->
        <select v-if="selectedProvider" name="ai_model" id="ai_model" v-model="selectedModel"
            class="hover:bg-slate-700 bg-slate-700 outline-none w-full shadow-sm px-2 py-1 rounded-md">
            <option value="">Choose Model</option>
            <option v-for="model in availableModels" :key="model.value" :value="model.value">
                {{ model.label }}
            </option>
        </select>

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
import { InboxIcon } from "@heroicons/vue/24/outline";
import { computed, ref, watch } from "vue";
import Drawer from "./Drawer.vue";
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark-dimmed.css';

const generatedCode = ref("empty");
var showDrawer = ref(false)
const fileStore = useContractStorage()
const sc_language = ref("");

// Provider and model selection
const selectedProvider = ref(import.meta.env.VITE_AI_PROVIDER || "");
const selectedModel = ref("");

// Model configurations for each provider
const providerModels = {
    ollama: [
        { label: "Llama 3", value: "llama3" },
        { label: "CodeLlama", value: "codellama" },
        { label: "Mistral", value: "mistral" },
        { label: "DeepSeek Coder", value: "deepseek-coder" },
        { label: "Qwen 2.5 Coder", value: "qwen2.5-coder" },
        { label: "Custom Model", value: "custom" }
    ],
    gemini: [
        { label: "Gemini Pro", value: "gemini-pro" },
        { label: "Gemini 1.5 Pro", value: "gemini-1.5-pro" },
        { label: "Gemini 1.5 Flash", value: "gemini-1.5-flash" }
    ],
    openai: [
        { label: "GPT-4", value: "gpt-4" },
        { label: "GPT-4 Turbo", value: "gpt-4-turbo" },
        { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" }
    ],
    anthropic: [
        { label: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20241022" },
        { label: "Claude 3 Opus", value: "claude-3-opus-20240229" },
        { label: "Claude 3 Sonnet", value: "claude-3-sonnet-20240229" }
    ]
};

// Compute available models based on selected provider
const availableModels = computed(() => {
    return providerModels[selectedProvider.value] || [];
});

// Auto-select model from env when provider changes
watch(selectedProvider, (newProvider) => {
    if (newProvider === "ollama") {
        selectedModel.value = import.meta.env.VITE_OLLAMA_MODEL || "llama3";
    } else if (newProvider === "gemini") {
        selectedModel.value = import.meta.env.VITE_GEMINI_MODEL || "gemini-pro";
    } else if (newProvider === "openai") {
        selectedModel.value = import.meta.env.VITE_OPENAI_MODEL || "gpt-4";
    } else if (newProvider === "anthropic") {
        selectedModel.value = import.meta.env.VITE_ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";
    }
});


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
    const ollamaUrl = import.meta.env.VITE_OLLAMA_URL || "http://localhost:11434";
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
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
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
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.");
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
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error("Anthropic API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file.");
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
        alert("Please select an LLM provider.");
        return;
    }

    if (!selectedModel.value) {
        alert("Please select a model.");
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
        generatedCode.value = `Error generating code: ${error.message}\n\nPlease check:\n- Your provider configuration in .env\n- Your API key is valid (for cloud providers)\n- Ollama is running (for local provider)\n- The API endpoint is accessible`;
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