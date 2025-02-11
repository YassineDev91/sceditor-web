<template>
    <v-group>
        <v-image :config="iconConfig"></v-image>
        <v-text :config="leftConfig"></v-text>
        <v-text :config="equalSignConfig"></v-text>
        <v-text :config="rightConfig"></v-text>
    </v-group>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    x: Number,
    y: Number,
    expressions: Object
})


const iconConfig = ref({
    x: props.x,
    y: props.y,
    src: '@/assets/icons/equal.png',
    width:12,
    height:12
})

const leftConfig = ref({
    x: iconConfig.value.x + 10,
    y: iconConfig.value.y,
    text: props.expressions.left,
    fontSize: 12,
})

const equalSignConfig = ref({
    x: leftConfig.value.x + leftConfig.value.text.length * 5.6,
    y: leftConfig.value.y,
    text: "=",
    fontSize: 12,
})

const rightConfig = ref({
    x: equalSignConfig.value.x + 10,
    y: equalSignConfig.value.y,
    text: props.expressions.right,
    fontSize: 12,
})
</script>

<style></style>