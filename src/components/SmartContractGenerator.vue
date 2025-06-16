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
        <!-- <textarea v-model="prompt"
            class="border bg-slate-800 p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
            placeholder="">
        </textarea> -->
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
                <pre><code v-html="highlightedCode"></code></pre>
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


const prompt = ref("");
const sc_language = ref("");
const generatedCode = ref("empty");
var showDrawer = ref(false)

const fileStore = useContractStorage()
async function generate() {
    showDrawer.value = true


    const response = await fetch("http://localhost:3000/api/v1/generate", {  // Change to localhost:11434 if no backend
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.value })
    });

    const data = await response.json();
    // generatedCode.value = extractCode(data.response);  // Extract Solidity, Rust, or Vyper code
    generatedCode.value = data.output;
}

function exportContract() {
    alert("exporting...")
}
const highlightedCode = computed(() => {
    let highlighted = hljs.highlightAuto(generatedCode.value).value;
    console.log(highlighted);
    
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
  overflow-x: auto; /* Allow horizontal scrolling for <pre> itself */
}</style>