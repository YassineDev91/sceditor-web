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
        <div class="bg-slate-800 border-solid border-white outline-1 w-full h-full rounded-md flex flex-col">
            <div v-if="verified !== null" class="px-3 pt-3">
                <span v-if="verified" class="inline-flex items-center gap-1 text-green-400 text-xs font-medium">
                    ✓ Verified — compiles successfully
                </span>
                <span v-else class="inline-flex items-center gap-1 text-red-400 text-xs font-medium">
                    ✗ Not verified — compilation failed after {{ attempts.length }} attempt(s)
                </span>
            </div>
            <div v-if="attempts.length > 1" class="px-3 pt-2 text-xs text-gray-400 space-y-1">
                <div v-for="a in attempts" :key="a.attempt">
                    Attempt {{ a.attempt }}: {{ a.success ? '✓ compiled' : '✗ failed' }}
                    <span v-if="!a.success" class="text-gray-500">— {{ a.errors?.slice(0, 120) }}</span>
                </div>
            </div>
            <div class="text-white text-sm p-3 overflow-auto flex-1">
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
import { runVerificationLoop } from '@/codegen/verificationLoop'

const generatedCode = ref("empty");
const attempts = ref([]);
const verified = ref(null);
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

// Proxy API call handler
async function callProxy(provider, model, prompt) {
    const { url, secret } = settingsStore.llm.proxy;
    const response = await fetch(`${url}/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Proxy-Secret': secret,
        },
        body: JSON.stringify({ provider, model, prompt }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || `Proxy request failed: ${response.status} ${response.statusText}`);
    }

    return data.code;
}

// Verify service API call handler
async function verifyCode(language, code) {
    const { url, secret } = settingsStore.llm.verify;
    const response = await fetch(`${url}/api/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Verify-Secret': secret,
        },
        body: JSON.stringify({ language, code }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || `Verification request failed: ${response.status} ${response.statusText}`);
    }

    return data;
}

function buildFixPrompt(previousCode, errors) {
    return `The following ${sc_language.value} smart contract failed to compile.

<CODE>
${previousCode}
</CODE>

<COMPILER_ERRORS>
${errors}
</COMPILER_ERRORS>

Fix the code so it compiles successfully, while still implementing the same contract specification as before. Output only the corrected ${sc_language.value} smart contract code. Do not include explanations.`;
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
    attempts.value = [];
    verified.value = null;

    console.log(`Generating code using ${selectedProvider.value} (${selectedModel.value})`);

    const result = await runVerificationLoop({
        language: sc_language.value,
        buildPrompt: () => prompt.value,
        buildFixPrompt,
        generate: (p) => callProxy(selectedProvider.value, selectedModel.value, p).then(extractCode),
        verify: verifyCode,
    });

    attempts.value = result.attempts;
    verified.value = result.success;

    if (result.success) {
        generatedCode.value = result.code;
        console.log("✅ Code generated and verified successfully");
    } else if (result.code) {
        generatedCode.value = result.code;
        console.warn("⚠️ Code generated but did not pass verification after all attempts:", result.finalError);
    } else {
        generatedCode.value = `Error generating code: ${result.finalError}\n\nPlease check:\n- Your provider/model configuration in Settings\n- The proxy server and verify server are both running and reachable\n- The Proxy/Verify URLs and Shared Secrets in Settings are correct\n- Ollama is running locally (if the proxy is configured to reach it)`;
        console.error("❌ Error generating code:", result.finalError);
    }
}

const highlightedCode = computed(() => {
    let highlighted = hljs.highlightAuto(generatedCode.value).value;

    return highlighted
});
// Function to extract Solidity or Rust code from response
function extractCode(response) {
    // Try to extract code from markdown code blocks
    const match = response.match(/```(?:solidity|rust|sol|rs)?\n?([\s\S]+?)\n?```/);
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