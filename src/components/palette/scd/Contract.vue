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
    x: 0,  // Relative to group, not absolute
    y: 0,  // Relative to group, not absolute
    width: props.dimensions.width || 800,
    height: props.dimensions.height || 600,
    stroke: 'black',
    strokeWidth: 1.3,
    cornerRadius: 5
}))
const textConfig = computed(() => ({
    x: 3,  // Relative to group
    y: 3,  // Relative to group
    text: props.name,
    fontSize: 20,
}))

onMounted(() => {

})


</script>

<style></style>