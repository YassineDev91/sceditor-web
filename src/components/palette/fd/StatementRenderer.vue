<script setup>
import { defineProps, defineEmits } from 'vue'

import AssignmentStatement from './AssignmentStatement.vue'
import ReturnStatement from './ReturnStatement.vue'
import EmitStatement from './EmitStatement.vue'
import CallStatement from './CallStatement.vue'
import IfStatement from './IfStatement.vue'
import ForStatement from './ForStatement.vue'

const props = defineProps({
  statement: Object,
  x: Number,
  y: Number
})

const emit = defineEmits(['dragmove', 'select'])

const componentMap = {
  AssignmentStatement,
  ReturnStatement,
  EmitStatement,
  CallStatement,
  IfStatement,
  ForStatement
}

const Component = componentMap[props.statement.cmp_type]
</script>
<template>
  <component
    :is="Component"
    :statement="props.statement"
    :x="props.x"
    :y="props.y"
    @dragmove="(e) => emit('dragmove', e)"
    @select="(stmt) => emit('select', stmt)"
  />
</template>