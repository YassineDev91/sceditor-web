<template>
    <v-group :draggable="true">
        <v-rect :config="rectConfig"></v-rect>
        <v-rect :config="paramsConfig"></v-rect>
        <v-rect :config="returnConfig"></v-rect>
        <v-text :config="nameConfig"></v-text>
        <v-line :config="nameUnderLineConfig"></v-line>
        <!-- Parameters -->
        <Parameter v-for="param in params" :key="param.id" :name="param.name" :x="props.x" :y="props.y - 20" />

        <Statement v-for="(stmt, index) in statements?.filter(elm => elm.type == 'AssignmentStatement')" :key="stmt.id" :expressions="stmt.expressions" :x="rectConfig.x"
            :y="rectConfig.y + (index * 15) + 30" />

        <Return v-if="_return" :name="_return.name" :x="props.x + rectConfig.width - 100"
            :y="props.y + rectConfig.height" />
    </v-group>
</template>

<script setup>
import { ref } from "vue"
import Parameter from "./Parameter.vue"
import Return from './Return.vue'
import Statement from '@/components/palette/scd/Statement.vue'

const props = defineProps({
    x: Number,
    y: Number,
    name: String,
    params: Array,
    statements: Array,
    _return: { name: String, type: String }
})
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: 200,
    height: 100,
    stroke: 'black',
    strokeWidth: 1,
    dash: [3, 2],
})
const nameConfig = ref({
    x: props.x + 10,
    y: props.y + 5,
    fontSize: 12,
    text: props.name
})
const nameUnderLineConfig = ref({
    points: [rectConfig.value.x, rectConfig.value.y + nameConfig.value.fontSize + 10, rectConfig.value.x + rectConfig.value.width, rectConfig.value.y + nameConfig.value.fontSize + 10],
    stroke: 'black',
    strokeWidth: 1,
    lineJoin: 'round',
    dash: [3, 2],
})
const returnConfig = ref({
    x: props.x,
    y: props.y + rectConfig.value.height
})
const paramsConfig = ref({
    x: props.x,
    y: props.y,

})
</script>

<style></style>