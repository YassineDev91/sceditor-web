<!-- StatementRenderer.vue -->
<template>
  <component :is="getComponentType(statement.type)" :statement="statement" :x="statement.x" :y="statement.y"
    @dragmove="$emit('dragmove', $event)" @click="$emit('click', $event)" />
</template>

<script setup>
import ReturnStatement from './ReturnStatement.vue';
import EmitStatement from './EmitStatement.vue';
import CallStatement from './CallStatement.vue';
import IfStatement from './IfStatement.vue';
import AssignmentStatement from './AssignmentStatement.vue';
import ForStatement from './ForStatement.vue';
const emit = defineEmits(['dragmove']);
const props = defineProps({ statement: Object });

const getComponentType = (type) => {
  switch (type) {
    case 'AssignmentStatement': return AssignmentStatement;
    case 'ReturnStatement': return ReturnStatement;
    case 'EmitStatement': return EmitStatement;
    case 'CallStatement': return CallStatement;
    case 'IfStatement': return IfStatement;
    case 'ForStatement': return ForStatement;
  }
};
</script>