// ExpressionRenderer.vue
<template>
  <div>
    <span v-if="expression.type === 'Identifier'">{{ expression.value }}</span>
    <span v-else-if="expression.type === 'BinaryOperation'">
      (
      <ExpressionRenderer :expression="expression.left" />
      {{ expression.operator }}
      <ExpressionRenderer :expression="expression.right" />)
    </span>
    <span v-else-if="expression.type === 'IndexAccess'">
      <ExpressionRenderer :expression="expression.object" />[
      <ExpressionRenderer :expression="expression.index" />]
    </span>
    <span v-else-if="expression.type === 'CallExpression'">
      {{ expression.callee }}(<span v-for="(arg, i) in expression.args" :key="i">
        <ExpressionRenderer :expression="arg" />
        <span v-if="i < expression.args.length - 1">, </span>
      </span>)
    </span>
    <span v-else>[Unknown Expression]</span>
  </div>
</template>

<script setup>
const props = defineProps({
  expression: Object
});
</script>