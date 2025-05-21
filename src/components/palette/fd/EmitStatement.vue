<!-- EmitStatement.vue -->
<template>

    <v-group ref="groupRef" :config="groupConfig" @dragmove="e => emit('dragmove', e)">
        <v-rect ref="rectRef" :config="rectConfig"></v-rect>
        <v-text :config="textConfig"></v-text>
        <v-image :config="iconConfig"></v-image>
        <!-- <AddStatement ref="addStatementCmp" :coordinates="{ x: props.x + 30, y: props.y + 60 }"></AddStatement> -->

    </v-group>
</template>

<script setup>
import { onMounted, ref } from 'vue';
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
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: 200,
    height: 100,
    cornerRadius: 5,
    fill: "#FFDBD4",
    stroke: "#FA9580",
    

})

const textConfig = ref({
    x: rectConfig.value.x + 45,
    y: rectConfig.value.y + 17,
    fontSize: 15,
    text: props.statement.type

})
const groupConfig = ref({
    x: props.x,
    y: props.y,
    draggable: true,
})
const [image] = useImage("src/assets/icons/emit_icon.png")
const iconConfig = ref({
    x: rectConfig.value.x + 10,
    y: rectConfig.value.y + 10,
    width: 30,
    height: 30,
    image: image
})
onMounted(() => {
    console.log("emit rect x,y", rectConfig.value.x, rectConfig.value.y)
    console.log("emit props x,y", props.x, props.y)

    groupRef.value.getNode().width(rectRef.value.getNode().width())
    groupRef.value.getNode().height(rectRef.value.getNode().height())
})
</script>