<template>
  <component :is="getComponentType(statement.type)" :statement="statement" :x="statement.x" :y="statement.y"
    @dragmove="$emit('dragmove', $event)" @click="$emit('click', $event)" />
</template>

<script setup>
import EmbededConditionalStatement from './EmbededConditionalStatement.vue';
import EmbededAssignmentStatement from './EmbededAssignmentStatement.vue';

const emit = defineEmits(['dragmove']);
const props = defineProps({ statement: Object });

const getComponentType = (type) => {
  switch (type) {
    case 'AssignmentStatement': return EmbededAssignmentStatement;
    case 'ConditionStatement': return EmbededConditionalStatement;
  }
};
</script>