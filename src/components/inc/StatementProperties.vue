<template>
    <div class="p-2">
        <label>Name:</label>
        <input v-model="element.name"
            class="bg-slate-800 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
            placeholder="Name" />

        <template v-if="element.cmp_type == 'Call'">
            <label>Target function:</label>
            <select v-if="(fileStore.contract.functions || []).length > 0" v-model="element.target"
                class="bg-slate-800 input border p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3">
                <option value="" disabled>Select a function</option>
                <option v-for="fn in (fileStore.contract.functions || [])" :key="fn.id" :value="fn.id">{{ fn.name }}</option>
            </select>
            <p v-else class="text-xs text-gray-500 mb-3">No functions declared — add one on the structural layer first.</p>
        </template>

        <template v-if="element.cmp_type == 'Emit'">
            <label>Event:</label>
            <select v-if="(fileStore.contract.events || []).length > 0" v-model="element.eventRef"
                class="bg-slate-800 input border p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3">
                <option value="" disabled>Select an event</option>
                <option v-for="ev in (fileStore.contract.events || [])" :key="ev.id" :value="ev.id">{{ ev.name }}</option>
            </select>
            <p v-else class="text-xs text-gray-500 mb-3">No events declared — add one on the structural layer first.</p>
        </template>

        <template v-if="element.cmp_type == 'Revert'">
            <label>Error:</label>
            <select v-if="(fileStore.contract.errorDeclarations || []).length > 0" v-model="element.errorRef"
                class="bg-slate-800 input border p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3">
                <option value="" disabled>Select an error</option>
                <option v-for="err in (fileStore.contract.errorDeclarations || [])" :key="err.id" :value="err.id">{{ err.name }}</option>
            </select>
            <p v-else class="text-xs text-gray-500 mb-3">No errors declared — add one on the structural layer first.</p>
        </template>

        <p v-if="element.cmp_type == 'Decision'" class="text-xs text-gray-500 mb-3">
            Drag from this step's connector handle to each possible next step to draw its branches.
        </p>
        <p v-if="element.cmp_type == 'Action' || element.cmp_type == 'Return'" class="text-xs text-gray-500 mb-3">
            Use the Description field above to describe what this step does.
        </p>
    </div>
</template>

<script setup>
import { useContractStorage } from '@/stores/contract'
const fileStore = useContractStorage()

const props = defineProps({
  element: Object
})
</script>

<style scoped>
.input {
  @apply w-full border px-1 py-0.5 rounded my-1 text-xs;
}
</style>
