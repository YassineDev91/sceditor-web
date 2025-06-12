<template>
  <div class="p-2">
    <label>Type:</label>
    <input v-model="element.cmp_type" class="bg-slate-700 input" disabled />

    <template v-if="element.expressions">
      <label>Left Expression:</label>
      <input v-model="element.expressions[0].left.name" class="bg-slate-700 input" placeholder="Left" />
      <label>Right Expression:</label>
      <input v-model="element.expressions[0].right.value" class="bg-slate-700 input" placeholder="Right" />
    </template>

    <template v-if="element.cmp_type == 'CallStatement'">
      <label>Object:</label>
      <input v-model="element.object" class="bg-slate-700 input" />
      <label>Method:</label>
      <input v-model="element.method" class="bg-slate-700 input" />
    </template>

    <template v-if="element.cmp_type == 'EmitStatement'">
      <label>Event:</label>
      <input v-model="element.event" class="bg-slate-700 input" />

    </template>

    <template v-if="element.cmp_type == 'IfStatement'">
      <label>Left:</label>
      <input v-model="element.condition.left" class="bg-slate-700 input" placeholder="Left" />
      <label>Right:</label>
      <input v-model="element.condition.right" class="bg-slate-700 input" placeholder="Right" />
      <label>Operator:</label>
      <input v-model="element.condition.operator" class="bg-slate-700 input" placeholder="Operator" />
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