<template>
    <v-group :config="{ draggable: true }">
        <v-text :config="textConfig" />
        <v-line :config="lineConfig" />
        <v-rect :config="rectConfig">
        </v-rect>
        <Literal v-for="(literal, index) in props.literals" :key="literal.id" :visibility="literal.visibility"
            :name="literal.name" :type="literal.type" :x="rectConfig.x + 10" :y="rectConfig.y + (index * 15) + 20">
        </Literal>
    </v-group>
</template>
<script setup>
import { ref } from "vue";
import Literal from './Literal.vue'

const props = defineProps({
    x: Number,
    y: Number,
    name: String,
    literals: Array
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
    x: rectConfig.value.x + 3,
    y: rectConfig.value.y + 3,
    text: props.name,
    fontSize: 12,
})
const lineConfig = ref({
    points: [rectConfig.value.x, rectConfig.value.y + textConfig.value.fontSize + 5, rectConfig.value.x + rectConfig.value.width, rectConfig.value.y + textConfig.value.fontSize + 5],
    stroke: 'black',
    strokeWidth: 1,
}
)
</script>

<style></style>