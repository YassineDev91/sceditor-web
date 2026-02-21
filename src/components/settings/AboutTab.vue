<template>
    <div class="space-y-4 text-sm dark:text-gray-200">
        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">About SCEditor-web</h4>

        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
            <div class="flex items-center space-x-3">
                <div class="flex-1">
                    <h5 class="font-medium text-gray-900 dark:text-white">SCEditor-web</h5>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                        A Graphical Modeling Tool for Smart Contract Design
                    </p>
                </div>
                <span class="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-200">
                    v0.3-alpha
                </span>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-2">
                <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Version:</span>
                    <span class="ml-2 text-gray-600 dark:text-gray-400">0.3-alpha</span>
                </div>
                <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                    <span class="ml-2 text-gray-600 dark:text-gray-400">Academic prototype (research only)</span>
                </div>
                <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Last updated:</span>
                    <span class="ml-2 text-gray-600 dark:text-gray-400">September 2025</span>
                </div>
            </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
            <h5 class="font-medium text-gray-900 dark:text-white">Research Context</h5>
            <p class="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                SCEditor-web is an experimental, browser-based graphical editor for modeling smart contracts.
                Developed under Model-Driven Engineering (MDE) principles, it enables users to visually construct
                contract components, export platform-agnostic JSON models, and generate executable code using Large
                Language Models (LLMs).
            </p>

            <div class="pt-2">
                <h6 class="font-medium text-gray-700 dark:text-gray-300 text-xs mb-2">Published Paper:</h6>
                <p class="text-gray-600 dark:text-gray-400 text-xs italic">
                    "SCEditor-Web: Bridging Model-Driven Engineering and Generative AI for Smart Contract Development"
                </p>
                <p class="text-gray-600 dark:text-gray-400 text-xs mt-1">
                    Information, Vol. 16, No. 10, 2025
                </p>
            </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
            <h5 class="font-medium text-gray-900 dark:text-white">Features</h5>
            <ul class="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <li class="flex items-start">
                    <span class="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>Structural + Behavioral modeling in a layered visual interface</span>
                </li>
                <li class="flex items-start">
                    <span class="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>JSON export respecting a blockchain-agnostic metamodel</span>
                </li>
                <li class="flex items-start">
                    <span class="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>Integration with LLMs for Solidity, Vyper, Rust, and ink! code generation</span>
                </li>
                <li class="flex items-start">
                    <span class="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>Component-level drilldown via function layers</span>
                </li>
                <li class="flex items-start">
                    <span class="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>Modular Vue 3 + Konva.js + Pinia architecture</span>
                </li>
            </ul>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
            <h5 class="font-medium text-gray-900 dark:text-white">Links</h5>
            <div class="space-y-2">
                <a href="https://github.com/YassineDev91/sceditor-web" target="_blank"
                    class="block text-blue-600 dark:text-blue-400 hover:underline text-xs">
                    GitHub Repository →
                </a>
                <a href="https://www.mdpi.com/2078-2489/16/10/870" target="_blank"
                    class="block text-blue-600 dark:text-blue-400 hover:underline text-xs">
                    Published Paper →
                </a>
                <a href="https://github.com/YassineDev91/smart-contract-eval" target="_blank"
                    class="block text-blue-600 dark:text-blue-400 hover:underline text-xs">
                    Evaluation Repository →
                </a>
            </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
            <h5 class="font-medium text-gray-900 dark:text-white">License</h5>
            <p class="text-xs text-gray-600 dark:text-gray-400">
                MIT License — For academic and research use only.
            </p>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
            <h5 class="font-medium text-gray-900 dark:text-white">Contact</h5>
            <p class="text-xs text-gray-600 dark:text-gray-400">
                📧 yassine.aithsain@uit.ac.ma
            </p>
        </div>
    </div>
</template>

<script setup>
// No state needed for About tab
</script>
