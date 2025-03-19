<template>
    <div class="flex flex-col space-y-2 ">
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
        <textarea v-model="prompt"
            class="border bg-slate-800 p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
            placeholder="">
        </textarea>
        <div class="flex flex-row space-x-2">
            <button @click="generate"
                class="hover:bg-slate-700 w-full shadow-sm px-2 py-1 border border-slate-200 rounded-md">
                Generate Code
            </button>
            <button @click="exportContract" :disabled="(prompt == '' | sc_language == '')"
                class="disabled:hover:bg-transparent disabled:text-slate-500 disabled:border-slate-500 hover:bg-slate-700 w-full shadow-sm px-2 py-1 border border-slate-200 rounded-md">
                Export {{ sc_language }}
            </button>

        </div>
        <pre v-if="generatedCode">{{ generatedCode }}</pre>
    </div>
    <Drawer v-model:open="showDrawer"></Drawer>
</template>

<script setup>
import { useContractStorage } from "@/stores/contract";
import { InboxIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import Drawer from "./Drawer.vue";

const prompt = ref("");
const sc_language = ref("");
const generatedCode = ref("");
var showDrawer = ref(false)

const fileStore = useContractStorage()
async function generate() {
    showDrawer.value = true
    
    const response = await fetch("http://localhost:6000/generate-code", {  // Change to localhost:11434 if no backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.value })
    });

    const data = await response.json();
    generatedCode.value = extractCode(data.response);  // Extract Solidity, Rust, or Vyper code
}

function exportContract() {
    alert("exporting...")
}

// Function to extract Solidity, Rust, or Vyper code from response
function extractCode(response) {
    const match = response.match(/```(solidity|rust|vyper)?\n([\s\S]+?)\n```/);
    return match ? match[2] : "No valid code found.";
}
</script>