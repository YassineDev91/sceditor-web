<template>
    <v-group :config="groupConfig">
        <v-rect :config="rectConfig"></v-rect>
        <v-text :config="textConfig" />

        <StatementRenderer :statement="statement" />
        <v-text :config="contentConfig" v-for="expression in props.expressions" :text="expression.params.type" />

    </v-group>
</template>
<script setup>
import { onMounted, ref } from "vue";

onMounted(() => {
    console.log();

})

const props = defineProps({
    x: Number,
    y: Number,
    type: String,
    expressions: Object
});
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: 200,
    height: 100,
    stroke: 'black',
    strokeWidth: 1,
})
const textConfig = ref({
    x: rectConfig.value.x + 5,
    y: rectConfig.value.y + 3,
    text: props.type,
    fontSize: 12,
})

const contentConfig = ref({
    x: rectConfig.value.x + 3,
    y: rectConfig.value.y + 10,
    fontSize: 12,
})

const groupConfig = ref({
    x: props.x,
    y: props.y,
    draggable: true,
})

</script>

<style></style>