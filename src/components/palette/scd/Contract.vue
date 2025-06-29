<template>
    <v-group :config="groupConfig" @transformend="(e) => handleTransformEnd(e, i)">
        <v-text :config="textConfig" />
        <v-rect :config="rectConfig">
        </v-rect>

    </v-group>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";


const props = defineProps({
    x: Number,
    y: Number,
    dimensions: Object,
    name: String,
});

const groupConfig = computed(() => ({
    x: props.x,
    y: props.y,
    draggable: false,
}));
const rectConfig =computed(() => ({
    x: props.x,
    y: props.y,
    width: props.dimensions.width || 800,
    height: props.dimensions.height || 600,
    stroke: 'black',
    strokeWidth: 1.3,
    cornerRadius: 5
}))
const textConfig = computed(() => ({
    x: rectConfig.value.x + 3,
    y: rectConfig.value.y + 3,
    text: props.name,
    fontSize: 20,
}))

onMounted(() => {

})


</script>

<style></style>