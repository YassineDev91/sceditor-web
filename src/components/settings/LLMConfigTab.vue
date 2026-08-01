<template>
    <div class="space-y-4 text-sm dark:text-gray-200">
        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">LLM Provider Configuration</h4>

        <!-- Provider Selection -->
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Provider
            </label>
            <select v-model="settingsStore.llm.provider" @change="onProviderChange"
                class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
                <option value="ollama">Ollama (Local)</option>
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic Claude</option>
            </select>
        </div>

        <!-- Ollama Configuration -->
        <div v-if="settingsStore.llm.provider === 'ollama'" class="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h5 class="font-medium text-gray-900 dark:text-white">Ollama Settings</h5>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ollama URL
                </label>
                <input type="text" v-model="settingsStore.llm.ollama.url" @blur="saveSettings"
                    placeholder="http://localhost:11434"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model
                </label>
                <select v-model="settingsStore.llm.ollama.model" @change="saveSettings"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
                    <option value="llama3">Llama 3</option>
                    <option value="codellama">CodeLlama</option>
                    <option value="mistral">Mistral</option>
                    <option value="deepseek-coder">DeepSeek Coder</option>
                    <option value="qwen2.5-coder">Qwen 2.5 Coder</option>
                </select>
            </div>
        </div>

        <!-- Gemini Configuration -->
        <div v-if="settingsStore.llm.provider === 'gemini'" class="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h5 class="font-medium text-gray-900 dark:text-white">Google Gemini Settings</h5>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API Key
                </label>
                <input type="password" v-model="settingsStore.llm.gemini.apiKey" @blur="saveSettings"
                    placeholder="Enter your Gemini API key"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank"
                        class="text-blue-600 dark:text-blue-400 hover:underline">Google AI Studio</a>
                </p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model
                </label>
                <select v-model="settingsStore.llm.gemini.model" @change="saveSettings"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
                    <option value="gemini-pro">Gemini Pro</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                </select>
            </div>
        </div>

        <!-- OpenAI Configuration -->
        <div v-if="settingsStore.llm.provider === 'openai'" class="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h5 class="font-medium text-gray-900 dark:text-white">OpenAI Settings</h5>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API Key
                </label>
                <input type="password" v-model="settingsStore.llm.openai.apiKey" @blur="saveSettings"
                    placeholder="Enter your OpenAI API key"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank"
                        class="text-blue-600 dark:text-blue-400 hover:underline">OpenAI Platform</a>
                </p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model
                </label>
                <select v-model="settingsStore.llm.openai.model" @change="saveSettings"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
            </div>
        </div>

        <!-- Anthropic Configuration -->
        <div v-if="settingsStore.llm.provider === 'anthropic'" class="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h5 class="font-medium text-gray-900 dark:text-white">Anthropic Claude Settings</h5>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API Key
                </label>
                <input type="password" v-model="settingsStore.llm.anthropic.apiKey" @blur="saveSettings"
                    placeholder="Enter your Anthropic API key"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Get your API key from <a href="https://console.anthropic.com/settings/keys" target="_blank"
                        class="text-blue-600 dark:text-blue-400 hover:underline">Anthropic Console</a>
                </p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model
                </label>
                <select v-model="settingsStore.llm.anthropic.model" @change="saveSettings"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
                    <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                    <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                    <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                </select>
            </div>
        </div>

        <!-- Test Connection Button -->
        <div class="pt-3">
            <button @click="testConnection" :disabled="testingConnection"
                class="w-full inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="!testingConnection">Test Connection</span>
                <span v-else>Testing...</span>
            </button>
            <p v-if="connectionStatus" :class="[
                'mt-2 text-sm text-center',
                connectionStatus.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            ]">
                {{ connectionStatus.message }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const testingConnection = ref(false)
const connectionStatus = ref(null)

const saveSettings = () => {
    settingsStore.saveSettings()
}

const onProviderChange = () => {
    connectionStatus.value = null
    saveSettings()
}

const testConnection = async () => {
    testingConnection.value = true
    connectionStatus.value = null

    try {
        const result = await settingsStore.testLLMConnection()
        connectionStatus.value = result
    } catch (error) {
        connectionStatus.value = { success: false, message: error.message }
    } finally {
        testingConnection.value = false
    }
}
</script>
