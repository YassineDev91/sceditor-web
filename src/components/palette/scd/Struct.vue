<template>
    <v-group :config="{ draggable: true }">
        <v-line :config="lineConfig" />
        <v-rect :config="rectConfig">
        </v-rect>
        <v-rect :config="selectionRectConfig" v-if="selected">
        </v-rect>
        <Literal v-for="(literal, index) in props.literals" :key="literal.id" :visibility="literal.visibility"
            :name="literal.name" :type="literal.type" :x="rectConfig.x + 10" :y="rectConfig.y + (index * 15) + 20">
        </Literal>
        <v-text :config="textConfig" />

    </v-group>
</template>
<script setup>
import { ref } from "vue";
import Literal from './Literal.vue'

const props = defineProps({
    x: Number,
    y: Number,
    name: String,
    literals: Array,
    data: Object,
    selected: Boolean
});
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: 200,
    height: 100,
    stroke: 'black',
    strokeWidth: 1,
})
const selectionRectConfig = ref({
    x: props.x,
    y: props.y,
    width: 200,
    height: 101,
    stroke: '#3498db',
    strokeWidth: 2,
})
const textConfig = ref({
    x: rectConfig.value.x + 3,
    y: rectConfig.value.y + 3,
    text: props.data.name,
    fontSize: 12,
    data: props.data
})
const lineConfig = ref({
    points: [rectConfig.value.x, rectConfig.value.y + textConfig.value.fontSize + 5, rectConfig.value.x + rectConfig.value.width, rectConfig.value.y + textConfig.value.fontSize + 5],
    stroke: 'black',
    strokeWidth: 1,
}
)
</script>

<style></style>