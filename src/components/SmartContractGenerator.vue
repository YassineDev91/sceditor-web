<template>
    <div class="flex flex-col">
        <textarea v-model="prompt" class="border mt-5" placeholder="Enter JSON or description"></textarea>
        <button @click="generate" class="m-2 hover:bg-slate-100 shadow-sm px-2 py-1 border border-slate-200 rounded-md">Generate Code</button>
        <pre v-if="generatedCode">{{ generatedCode }}</pre>
    </div>
</template>

<script setup>
import { ref } from "vue";

const prompt = ref("");
const generatedCode = ref("");

async function generate() {
    const response = await fetch("http://localhost:3000/generate", {  // Change to localhost:11434 if no backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.value })
    });

    const data = await response.json();
    generatedCode.value = extractCode(data.response);  // Extract Solidity, Rust, or Vyper code
}

// Function to extract Solidity, Rust, or Vyper code from response
function extractCode(response) {
    const match = response.match(/```(solidity|rust|vyper)?\n([\s\S]+?)\n```/);
    return match ? match[2] : "No valid code found.";
}
</script>