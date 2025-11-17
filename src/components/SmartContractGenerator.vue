<template>
    <div class="flex flex-col text-sm space-y-2 ">
        <h1 class="mb-2">
            Code generation
        </h1>
        <select name="sc_language" id="sc_language" v-model="sc_language"
            class="hover:bg-slate-700 bg-slate-700 outline-none w-full shadow-sm px-2 py-1 rounded-md">

            >
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
            <!-- <button @click="exportContract" :disabled="(prompt == '' | sc_language == '')"
                class="disabled:hover:bg-transparent text-sm disabled:text-slate-500 disabled:border-slate-500 hover:bg-slate-700 w-full shadow-sm px-2 py-1 border border-slate-200 rounded-md">
                Export {{ sc_language }}
            </button> -->

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
import { computed, ref } from "vue";
import Drawer from "./Drawer.vue";
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark-dimmed.css';   // Import the theme (optional)



const generatedCode = ref("empty");
var showDrawer = ref(false)

const fileStore = useContractStorage()

const sc_language = ref(""); // Default to Solidity

const API_KEY = import.meta.env.VITE_AI_API_KEY;
const API_URL = import.meta.env.VITE_AI_API_URL;


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



async function generate() {
    if (sc_language.value === "") {
        alert("Please select a smart contract language.");
        return;
    }
    showDrawer.value = true

    generatedCode.value = "Generating code... Please wait.";

    console.log("Generating code for:", prompt.value);


    try {

        if (!API_URL) {
            console.warn("⚠️ AI API URL is missing! Check your .env file.");
            generatedCode.value = "Error: API URL not configured. Please add VITE_AI_API_URL to your .env file.";
            return
        }

        const response = await fetch(
            `${API_URL}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt.value }] }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("📦 API Response:", data);

        // Parse Gemini API response structure
        let rawCode = "";
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            rawCode = data.candidates[0].content.parts[0].text;
        } else if (data.output) {
            // Fallback for other API structures
            rawCode = data.output;
        } else {
            throw new Error("Unexpected API response structure");
        }

        // Extract code from markdown blocks if present
        generatedCode.value = extractCode(rawCode);
        console.log("✅ Code generated successfully");


    } catch (error) {
        console.error("❌ Error generating code:", error);
        generatedCode.value = `Error generating code: ${error.message}\n\nPlease check:\n- Your API URL is correct\n- Your API key is valid\n- The API endpoint is accessible`;
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