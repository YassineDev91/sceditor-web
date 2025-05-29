<template>
  <div
    class="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center px-6 overflow-x-hidden mt-20">
    <header class="text-center mb-16 animate-fade-in-up">
      <h1 class="text-5xl font-bold mb-4 tracking-tight">SCEditor web</h1>
      <p class="text-sm text-black bg-yellow-400 px-2 py-1 rounded uppercase inline-block mt-2">v0.3-alpha</p>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto mt-4">
        A browser-based graphical editor for designing platform-agnostic smart contracts with AI-powered code
        generation.
      </p>
      <a href="https://github.com/YassineDev91/sceditor-web" target="_blank"
        class="inline-flex items-center mt-6 text-blue-600 hover:underline text-sm font-medium">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.4.7-4.1-1.6-4.1-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7.4.7.4.6.2.9.7 1.1 1.1.4.8 1.6.6 2.1.5.1-.4.4-.7.7-.9-2.8-.3-5.8-1.4-5.8-6.1 0-1.4.5-2.6 1.3-3.6-.1-.3-.6-1.7.1-3.5 0 0 1-.3 3.4 1.3a11.7 11.7 0 016.2 0c2.4-1.6 3.4-1.3 3.4-1.3.7 1.8.2 3.2.1 3.5.8 1 1.3 2.2 1.3 3.6 0 4.8-3 5.8-5.8 6.1.4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0012 .5z" />
        </svg>
        View on GitHub
      </a>
    </header>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-20 animate-fade-in-up">
      <div class="p-6  border border-gray-200 rounded-lg shadow transition hover:shadow-lg">
        <h3 class="text-xl font-semibold mb-2">Visual Modeling</h3>
        <p class="text-gray-600">Drag-and-drop interface to define contract structure and logic in layered
          views.</p>
      </div>
      <div class="p-6  border border-gray-200 rounded-lg shadow transition hover:shadow-lg">
        <h3 class="text-xl font-semibold mb-2">AI Code Generation</h3>
        <p class="text-gray-600">Generate Solidity code from structured models using LLMs like GPT-4o or Gemini.
        </p>
      </div>
      <div class="p-6  border border-gray-200 rounded-lg shadow transition hover:shadow-lg">
        <h3 class="text-xl font-semibold mb-2">JSON Export</h3>
        <p class="text-gray-600">Export models in a platform-agnostic JSON format aligned with your metamodel.
        </p>
      </div>
    </section>

    <div class="flex flex-col md:flex-row gap-4 mb-20 animate-fade-in-up">
      <RouterLink to="/editor"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center shadow">
        Start Modeling
      </RouterLink>
      <RouterLink to="/docs"
        class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg text-center shadow">
        How It Works
      </RouterLink>
    </div>

    <section class="w-full  px-4 animate-fade-in-up">
      <h2 class="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div class="w-full px-4 pt-5">
        <div class="mx-auto w-full rounded-2xl bg-white p-2">
          <Disclosure v-slot="{ open }">
            <DisclosureButton
              class="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-xl font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/75">
              <span>Is the editor open-source?</span>
              <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-blue-500" />
            </DisclosureButton>
            <DisclosurePanel class="px-4 pb-2 pt-4 text-xl text-gray-500">
              Yes, the current version is available on GitHub for academic and community use.
            </DisclosurePanel>
          </Disclosure>
          <Disclosure as="div" class="mt-2" v-slot="{ open }">
            <DisclosureButton
              class="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-xl font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/75">
              <span>Does the editor support all blockchain platforms?</span>
              <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-blue-500" />
            </DisclosureButton>
            <DisclosurePanel class="px-4 pb-2 pt-4 text-xl text-gray-500">
              The metamodel is designed to be platform-agnostic. Actual support for specific blockchain platforms (e.g.,
              Solidity, Vyper, Rust) depends on the capabilities of the integrated LLM used for code generation.
            </DisclosurePanel>
          </Disclosure>
          <Disclosure as="div" class="mt-2" v-slot="{ open }">
            <DisclosureButton
              class="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-xl font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/75">
              <span>Can I use my own language model?</span>
              <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-blue-500" />
            </DisclosureButton>
            <DisclosurePanel class="px-4 pb-2 pt-4 text-xl text-gray-500">
              Yes, the prompt strategy is adaptable. You can integrate local LLMs or cloud-based APIs.
            </DisclosurePanel>
          </Disclosure>
        </div>
      </div>
    </section>



    <footer class="mt-16 mb-8 text-center text-sm text-gray-500 animate-fade-in-up">
      <p>SCEditor web v0.3-alpha — This editor is under active development. Some features may be experimental or
        incomplete.</p>
      <p>
        Found an issue or have feedback? <a href="https://github.com/YassineDev91/sceditor-web/issues"
          class="text-blue-600 hover:underline">Submit feedback</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronUpIcon } from '@heroicons/vue/20/solid'
</script>

<style scoped>
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}
</style>