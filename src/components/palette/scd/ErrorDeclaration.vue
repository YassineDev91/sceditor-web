<template>
  <v-group :config="groupConfig" @mousedown="handleClick">
    <v-rect :config="rectConfig" />
    <v-text :config="textConfig" />
    <v-image :config="iconConfig" />
</v-group>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useContractStorage } from '@/stores/contract'
import { useImage } from 'vue-konva'

const fileStore = useContractStorage()
const props = defineProps({
  name: String,
  x: Number,
  y: Number,
  data: Object,
})

const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  name: props.name,
  type: 'ErrorDeclaration',
  draggable: true,
}))

const rectConfig = ref({
  x: 0,
  y: 0,
  width: 140,
  height: 40,
  fill: '#FDECEA',
  stroke: '#E57373',
  cornerRadius: 5,
  strokeWidth: 1,
})

const textConfig = ref({
  x: 35,
  y: 15,
  text: `error ${props.name}();`,
  fontSize: 12,
  fill: '#000',
})


const [image] = useImage("src/assets/icons/error.png")
const iconConfig = ref({
    x:  5,
    y:  5,
    image: image,
    width: 30,
    height: 30
})

function handleClick() {
  fileStore.showProperties(props.data)
}
</script>
