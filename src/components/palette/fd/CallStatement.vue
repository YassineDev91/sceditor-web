<!-- CallStatement.vue -->
<template>
  <v-group ref="groupRef" :config="groupConfig" @dragmove="(e) => emit('dragmove', e)" @mousedown="handleSelect">
    <v-rect ref="rectRef" :config="rectConfig"></v-rect>
    <v-text :config="textConfig"></v-text>
    <v-image :config="iconConfig" />
    <v-group>
      <v-rect :config="contentRectConfig"></v-rect>
      <v-text :config="contentConfig"></v-text>
    </v-group>
    <!-- <AddStatement ref="addStatementCmp" :coordinates="{ x: props.x+30, y: props.y+60 }"></AddStatement> -->
  </v-group>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useImage } from 'vue-konva';
import AddStatement from './AddStatement.vue';

const emit = defineEmits(['dragmove']);

const props = defineProps({
  x: Number,
  y: Number,
  statement: Object
});
const groupRef = ref({})
const rectRef = ref({})
const addStatementCmp = ref({})
const rectConfig = ref({
  x: props.x,
  y: props.y,
  width: 200,
  height: 90,
  cornerRadius: 5,
  fill: "#E9F9EA",
  stroke: "#7CC9AE",
  strokeWidth: 1,


})

const textConfig = ref({
  x: rectConfig.value.x + 45,
  y: rectConfig.value.y + 17,
  fontSize: 13,
  text: props.statement.cmp_type || 'CallStatement',
})





const contentRectConfig = ref({
  x: rectConfig.value.x + 35,
  y: textConfig.value.y + 30,
  height: 30,
  width: 130,
  stroke: "#7CC9AE",
  strokeWidth: 1,
  fill: "#FEFDF8",
  cornerRadius: 5
})
// textX = rectX + (rectWidth - textWidth) / 2;
// textY = rectY + (rectHeight - textHeight) / 2;
const contentConfig = computed(() => ({
  x: contentRectConfig.value.x + (contentRectConfig.value.width - props.statement.method.length * 7) / 2,
  y: contentRectConfig.value.y + (contentRectConfig.value.height - 15) / 2,
  text: props.statement.object + '.' + props.statement.method,
  fontSize: 15
}))
const groupConfig = ref({
  x: props.x,
  y: props.y,
  draggable: true,
})
const [image] = useImage("src/assets/icons/call_icon.png")
const iconConfig = ref({
  x: rectConfig.value.x + 10,
  y: rectConfig.value.y + 10,
  width: 25,
  height: 25,
  image: image
})

function handleSelect() {
  console.log('✅ Statement clicked:', props.statement)
  emit('select', props.statement)
}

onMounted(() => {
  const rectNode = rectRef.value.getNode()
  addStatementCmp.value.y = rectNode.y() + rectNode.height() + 100
  groupRef.value.getNode().width(rectRef.value.getNode().width())
  groupRef.value.getNode().height(rectRef.value.getNode().height())

})
</script>