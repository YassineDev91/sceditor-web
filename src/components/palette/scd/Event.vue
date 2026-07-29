<template>
  <v-group :config="groupConfig" @click="e => emit('click', e)"
  @dragend="e => emit('dragend', e)">
    <v-rect :config="rectConfig" />
    <v-text :config="textConfig" />
    <v-image :config="iconConfig" />
    <v-rect :config="selectionConfig" v-if="props.data.isSelected" />
  </v-group>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useContractStorage } from '@/stores/contract'
import { useImage } from 'vue-konva'
import { formatTypeNode } from '@/schema/typeFormat'

const emit = defineEmits(['click', 'dragend'])
const fileStore = useContractStorage()
const props = defineProps({
  name: String,
  x: Number,
  y: Number,
  data: Object,
})

const paramTypesText = computed(() =>
  (props.data.parameters || []).map(p => formatTypeNode(p.type)).join(', ')
)

const contentWidth = props.name.length * 9 + 60

const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  name: props.name,
  type: 'Event',
  draggable: true,
}))

const rectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: contentWidth,
  height: 40,
  fill: '#E3F2FD',
  stroke: '#64B5F6',
  cornerRadius: 5,
  strokeWidth: 1,
}))

const textConfig = computed(() => ({
  x: 35,
  y: 15,
  text: `event ${props.name}(${paramTypesText.value});`,
  fontSize: 12,
  fill: '#000',
}))

const selectionConfig = computed(() => ({
  width: rectConfig.value.width,
  height: rectConfig.value.height,
  stroke: '#3498db',
  cornerRadius: 5,
  strokeWidth: 1.5,
}))

const [image] = useImage("src/assets/icons/emit.png")
const iconConfig = ref({
  x: 5,
  y: 5,
  image: image,
  width: 30,
  height: 30
})
</script>
