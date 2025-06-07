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

    <template v-if="element.method">
      <label>Method:</label>
      <input v-model="element.method" class="bg-slate-700 input" />
    </template>

    <template v-if="element.condition">
      <label>Condition:</label>
      <input v-model="element.condition" class="bg-slate-700 input" />
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