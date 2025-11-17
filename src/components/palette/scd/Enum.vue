<template>
  <v-group :config="groupConfig" @mousedown="handleClick">
    <v-rect :config="rectConfig" />
    <v-text :config="titleConfig" />
    <Value v-for="(value, index) in props.values" :key="index" :x="rectConfig.x" :y="rectConfig.y + (index * 25) + 27"
      :value="value" />
    <v-rect v-if="selected" :config="selectionRectConfig" />
    <v-image :config="iconConfig" />
  </v-group>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useContractStorage } from '@/stores/contract'
import { useImage } from 'vue-konva'
import Value from './Value.vue'

const fileStore = useContractStorage()
const props = defineProps({
  name: String,
  values: Array,
  x: Number,
  y: Number,
  selected: Boolean,
  data: Object,
})

// Calculate consistent height: header (30px) + values (25px each) + padding (5px)
const calculateHeight = computed(() => {
  return props.values && props.values.length > 0
    ? 30 + (props.values.length * 25) + 5
    : 35; // minimum height when no values
});

const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  name: props.name,
  type: 'Enum',
  width: 160,
  height: calculateHeight.value,
  draggable: true,
}))

const rectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: groupConfig.value.width,
  height: calculateHeight.value,
  fill: '#E7F7F0',
  stroke: '#26A69A',
  cornerRadius: 5,
  strokeWidth: 0.5,
}))

const selectionRectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: groupConfig.value.width,
  height: calculateHeight.value,
  stroke: '#3498db',
  strokeWidth: 2,
  cornerRadius: 5,
}))

const titleConfig = ref({
  x: 30,
  y: 10,
  text:  props.name || 'Enum',
  fontSize: 12,
  fill: '#000',
})

const [icon] = useImage('src/assets/icons/enum.png')
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
