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
      <input v-model="element.event" class="bg-slate-800 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3" />

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
const props = defineProps({
  element: Object
})
</script>

<style scoped>
.input {
  @apply w-full border px-1 py-0.5 rounded my-1 text-xs;
}
</style>