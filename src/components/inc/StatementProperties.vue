<template>
  <div class="p-2">
    <label>Type:</label>
    <input v-model="element.cmp_type" class="bg-slate-800 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3" disabled />

    <template v-if="element.expressions">
      <label>Left Expression:</label>
      <input v-model="element.expressions[0].left.name" class="bg-slate-800 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3" placeholder="Left" />
      <label>Right Expression:</label>
      <input v-model="element.expressions[0].right.value" class="bg-slate-800 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3" placeholder="Right" />
    </template>

    <template v-if="element.cmp_type == 'CallStatement'">
      <label>Object:</label>
      <input v-model="element.object" class="bg-slate-800 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3" />
      <label>Method:</label>
      <input v-model="element.method" class="bg-slate-800 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3" />
    </template>

    <template v-if="element.cmp_type == 'EmitStatement'">
      <label>Event:</label>
      <select v-if="fileStore.contract.events.length > 0" v-model="element.eventRef"
        class="bg-slate-800 input border p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3">
        <option value="" disabled>Select an event</option>
        <option v-for="ev in fileStore.contract.events" :key="ev.id" :value="ev.id">{{ ev.name }}</option>
      </select>
      <p v-else class="text-xs text-gray-500 mb-3">No events declared — add one on the structural layer first.</p>
      <label>Args (comma-separated):</label>
      <input :value="(element.args || []).join(',')"
        @change="e => element.args = e.target.value.split(',').map(s => s.trim()).filter(Boolean)"
        class="bg-slate-800 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3" />
    </template>

    <template v-if="element.cmp_type == 'RevertStatement'">
      <label>Error:</label>
      <select v-if="fileStore.contract.errorDeclarations.length > 0" v-model="element.errorRef"
        class="bg-slate-800 input border p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3">
        <option value="" disabled>Select an error</option>
        <option v-for="err in fileStore.contract.errorDeclarations" :key="err.id" :value="err.id">{{ err.name }}</option>
      </select>
      <p v-else class="text-xs text-gray-500 mb-3">No errors declared — add one on the structural layer first.</p>
      <label>Args (comma-separated):</label>
      <input :value="(element.args || []).join(',')"
        @change="e => element.args = e.target.value.split(',').map(s => s.trim()).filter(Boolean)"
        class="bg-slate-800 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3" />
    </template>

    <template v-if="element.cmp_type == 'ConditionStatement'">
      <h1 class="my-1">Condition</h1>
      <div class="grid grid-cols-3 gap-1">
        <div>
          <label>Left:</label>
          <input v-model="element.condition.left" class="bg-slate-800 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3" placeholder="Left" />
        </div>
        <div>
          <label>Operator:</label>
          <input v-model="element.condition.operator" class="bg-slate-800 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3" placeholder="Operator" />
        </div>
        <div>
          <label>Right:</label>
          <input v-model="element.condition.right" class="bg-slate-800 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3" placeholder="Right" />
        </div>
        


      </div>

    </template>
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