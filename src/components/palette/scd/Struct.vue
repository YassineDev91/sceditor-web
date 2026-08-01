<template>
  <v-group :config="groupConfig" @mousedown="handleClick">
    <v-rect :config="rectConfig" />
    <v-rect v-if="selected" :config="selectionRectConfig" />
    <Literal
      v-for="(literal, index) in props.literals"
      :key="literal.id"
      :visibility="literal.visibility"
      :name="literal.name"
      :data="literal"
      :x="10"
      :y="35 + (index * 25)"
    />
    <v-text :config="textConfig" />
    <v-image :config="iconConfig" />
  </v-group>
</template>

<script setup>
import { ref, computed } from 'vue';
import Literal from './Literal.vue';
import { useContractStorage } from '@/stores/contract';
import { useImage } from 'vue-konva';

const fileStore = useContractStorage();

const props = defineProps({
  x: Number,
  y: Number,
  name: String,
  literals: Array,
  data: Object,
  selected: Boolean
});

const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  name: props.name,
  type: 'Struct',
  width: rectConfig.value.width,
  height: rectConfig.value.height,
  draggable: true
}));

const rectConfig = ref({
  x: 0,
  y: 0,
  width: 150,
  height: 140,
  fill: '#E9E5FD',
  cornerRadius: 5,
  stroke: '#9673A6',
  strokeWidth: 1
});

const selectionRectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: rectConfig.value.width,
  height: rectConfig.value.height,
  stroke: '#3498db',
  cornerRadius: 5,
  strokeWidth: 2
}));

const textConfig = ref({
  x: 60,
  y: 10,
  text: props.name,
  fontSize: 12,
  fill: '#000'
});

const [image] = useImage('src/assets/icons/struct_icon.png');
const iconConfig = ref({
  x: 30,
  y: 5,
  width: 20,
  height: 20,
  image: image
});

function handleClick() {
  console.log("✅ Clicked struct with data:", props.data);
  console.log('🧪 props.data.type =', props.data?.type)
  fileStore.showProperties(props.data);
}
</script>