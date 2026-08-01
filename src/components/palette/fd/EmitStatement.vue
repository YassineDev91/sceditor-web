<!-- EmitStatement.vue -->
<template>

    <v-group ref="groupRef" :config="groupConfig" @dragmove="(e) => emit('dragmove', e)" @mousedown="handleSelect">
        <v-rect ref="rectRef" :config="rectConfig"></v-rect>
        <v-text :config="textConfig"></v-text>
        <v-image :config="iconConfig"></v-image>
        <ContentRectangle :config="contentRect"></ContentRectangle>
        <!-- <AddStatement ref="addStatementCmp" :coordinates="{ x: props.x + 30, y: props.y + 60 }"></AddStatement> -->

    </v-group>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useImage } from 'vue-konva';
import ContentRectangle from './ContentRectangle.vue';
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
    height: 80,
    cornerRadius: 5,
    fill: "#FFDBD4",
    stroke: "#FA9580",
    strokeWidth: 1,

})

const textConfig = ref({
    x: rectConfig.value.x + 45,
    y: rectConfig.value.y + 17,

    fontSize: 13,
    text: props.statement.cmp_type || 'EmitStatement',
})

const contentRect = computed(() => ({
    x: props.x + 10,
    y: props.y + 30,
    content: props.statement.event,
    height: 30,
    width: 180,
    fillColor: "#FEFDF8",
    borderColor: "#FA9580",
    fontSize: 13,
    strokeWidth: 1,
}))
const groupConfig = ref({
    x: props.x,
    y: props.y,
    draggable: true,
})
const [image] = useImage("src/assets/icons/emit_icon.png")
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
    console.log("emit rect x,y", rectConfig.value.x, rectConfig.value.y)
    console.log("emit props x,y", props.x, props.y)

    groupRef.value.getNode().width(rectRef.value.getNode().width())
    groupRef.value.getNode().height(rectRef.value.getNode().height())
})
</script>