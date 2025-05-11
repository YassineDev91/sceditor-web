<!-- CallStatement.vue -->
<template>
    <div class="statement">
      {{ statement.object }}.{{ statement.method }}(
      <span v-for="(param, i) in statement.params" :key="i">
        <ExpressionRenderer :expression="{ type: 'Identifier', value: param.value || param }" />
        <span v-if="i < statement.params.length - 1">, </span>
      </span>
      );
    </div>
  </template>
  
  <script setup>
  import ExpressionRenderer from './ExpressionRenderer.vue';
  const props = defineProps({ statement: Object });
  </script>