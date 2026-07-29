<!-- RevertStatement.vue -->
<template>

    <v-group ref="groupRef" :config="groupConfig" @dragmove="(e) => emit('dragmove', e)" @mousedown="handleSelect">
        <v-rect ref="rectRef" :config="rectConfig"></v-rect>
        <v-text :config="textConfig"></v-text>
        <v-image :config="iconConfig"></v-image>
        <ContentRectangle :config="contentRect"></ContentRectangle>
    </v-group>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useImage } from 'vue-konva';
import { useContractStorage } from '@/stores/contract';
import ContentRectangle from './ContentRectangle.vue';
const emit = defineEmits(['dragmove']);

const fileStore = useContractStorage();

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
    fill: "#FDECEA",
    stroke: "#E57373",
    strokeWidth: 1,

})

const textConfig = ref({
    x: rectConfig.value.x + 45,
    y: rectConfig.value.y + 17,

    fontSize: 13,
    text: props.statement.cmp_type || 'RevertStatement',
})

const errorName = computed(() =>
  fileStore.contract.errorDeclarations.find(e => e.id === props.statement.errorRef)?.name || 'no error selected'
);

const contentRect = computed(() => ({
    x: props.x + 10,
    y: props.y + 30,
    content: errorName.value,
    height: 30,
    width: 180,
    fillColor: "#FEFDF8",
    borderColor: "#E57373",
    fontSize: 13,
    strokeWidth: 1,
}))
const groupConfig = ref({
    x: props.x,
    y: props.y,
    draggable: true,
})
const [image] = useImage("src/assets/icons/error.png")
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
    groupRef.value.getNode().width(rectRef.value.getNode().width())
    groupRef.value.getNode().height(rectRef.value.getNode().height())
})
</script>
