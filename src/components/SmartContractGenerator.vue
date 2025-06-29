<template>
    <div class="flex flex-col text-sm space-y-2 ">
        <h1 class="mb-2">
            Code generation
        </h1>
        <select name="sc_language" id="sc_language" v-model="sc_language"
            class="hover:bg-slate-700 bg-slate-700 outline-none w-full shadow-sm px-2 py-1 rounded-md">

            >
            <option value="">Choose SC language</option>
            <option value="solidity">Solidity</option>
            <option value="solana">Rust</option>
            <option value="vyper">Vyper</option>
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

        if (!API_KEY) {
            console.warn("⚠️ AI API key is missing! Check your .env file.");

            return
        }
        const response = await fetch(
            `...?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt.value }] }]
                })
            }
        );

        const data = await response.json();
        generatedCode.value = data.output;


    } catch (error) {
        console.error("Error generating code:", error);
        generatedCode.value = "Error generating code. Please check the console for details.";
    }

}

const highlightedCode = computed(() => {
    let highlighted = hljs.highlightAuto(generatedCode.value).value;

    return highlighted
});
// Function to extract Solidity, Rust, or Vyper code from response
function extractCode(response) {
    const match = response.match(/```(solidity|rust|vyper)?\n([\s\S]+?)\n```/);
    return match ? match[2] : "No valid code found.";
}
</script>

<style>
pre {
    overflow-x: auto;
    /* Allow horizontal scrolling for <pre> itself */
}
</style>