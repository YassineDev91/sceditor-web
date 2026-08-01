<template>
  <v-group :config="groupConfig" @mousedown="handleClick">
    <v-rect :config="rectConfig" />
    <v-rect v-if="selected" :config="selectionRectConfig" />
    <v-text :config="titleConfig" />
    <v-image :config="iconConfig" />
    <Parameter v-for="(parameter, index) in props.parameters" :x="groupConfig.x * index" :y="groupConfig.y"
      :name="parameter.name" />
    <Statement v-for="(stmt, index) in props.statements" :key="stmt.id" :statement="stmt" :x="rectConfig.x"
      :y="rectConfig.y + (index * 30) + 30" fill="#FFFFE1" stroke="#FABB81"/>
      <v-image :config="iconConfig" />
  </v-group>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useContractStorage } from '@/stores/contract'
import { useImage } from 'vue-konva'
import Statement from './Statement.vue'
import Parameter from './Parameter.vue'

const fileStore = useContractStorage()
const props = defineProps({
  name: String,
  x: Number,
  y: Number,
  data: Object,
  statements: Array,
  selected: Boolean,
})

const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  name: props.name,
  type: 'Modifier',
  draggable: true,
}))

const dynamicHeight = computed(() => {
  const baseHeight = 35;       // fixed top area
  const statementHeight = 30;  // height per statement
  return baseHeight + (props.statements?.length || 0) * statementHeight;
})

const rectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: 170,
  height: dynamicHeight.value,
  fill: '#FFECD1',
  stroke: '#FABB81',
  cornerRadius: 5,
  strokeWidth: 1,
}))

const selectionRectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: rectConfig.value.width,
  height: dynamicHeight.value,
  stroke: '#3498db',
  strokeWidth: 2,
  cornerRadius: 5,
}))

const titleConfig = ref({
  x: 30,
  y: 10,
  text: props.name || 'modifier',
  fontSize: 12,
  fill: '#000',
})

const [icon] = useImage('src/assets/icons/modifier.png')
const iconConfig = ref({
  x: 5,
  y: 5,
  width: 20,
  height: 20,
  image: icon,
})

function handleClick() {
  fileStore.showProperties(props.data)
}
</script>
