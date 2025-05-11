<template>
    <v-group :draggable="true">
        <v-rect ref="rectRef" :config="rectConfig"></v-rect>
        <v-rect :config="paramsConfig"></v-rect>
        <v-rect :config="returnConfig"></v-rect>
        <v-line :config="nameUnderLineConfig"></v-line>
        <v-rect :config="selectionConfig" v-if="selected"></v-rect>
        <!-- Parameters -->
        <Parameter v-for="param in params" :key="param.id" :name="param.name" :x="props.x" :y="props.y - 20" />

        <!-- Statements -->
        <Statement v-for="(stmt, index) in statements?.filter(elm => elm.type == 'AssignmentStatement')" :key="stmt.id"
            :expressions="stmt.expressions" :x="rectConfig.x" :y="rectConfig.y + (index * 15) + 30"
            @max-width="updateRectWidth" />

        <!-- Return Statement -->
        <Return v-if="returnParams" :name="returnParams.name" :x="props.x" :y="props.y + rectConfig.height" />
        
        <v-text :config="nameConfig"></v-text>
    </v-group>
</template>

<script setup>
import { ref, watch } from "vue";
import Parameter from "./Parameter.vue";
import Return from './Return.vue';
import Statement from '@/components/palette/scd/Statement.vue';

const rectRef = ref(null);
const maxWidth = ref(200);

const props = defineProps({
    x: Number,
    y: Number,
    name: String,
    data:Object,
    selected:Boolean,
    params: Array,
    statements: Array,
    returnParams: Object
});


const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: maxWidth.value, // Bind to dynamic maxWidth
    height: 100,
    stroke: 'black',
    strokeWidth: 1,
    dash: [3, 2],
});

const nameConfig = ref({
    x: props.x + 10,
    y: props.y + 5,
    fontSize: 12,
    text: props.name,
    data:props.data
});

const nameUnderLineConfig = ref({
    points: [
        rectConfig.value.x,
        rectConfig.value.y + nameConfig.value.fontSize + 10,
        rectConfig.value.x + rectConfig.value.width,
        rectConfig.value.y + nameConfig.value.fontSize + 10
    ],
    stroke: 'black',
    strokeWidth: 1,
    lineJoin: 'round',
    dash: [3, 2],
});

const returnConfig = ref({
    x: props.x,
    y: props.y + rectConfig.value.height
});

const paramsConfig = ref({
    x: props.x,
    y: props.y,
});

const selectionConfig = ref({
    x: props.x,
    y: props.y,
    width: rectConfig.value.width, // Bind to dynamic maxWidth
    height: rectConfig.value.height,
    stroke: '#3498db',
    strokeWidth: 1.5,
})

// Function to update the rectangle width dynamically
const updateRectWidth = (width) => {
    if (width > maxWidth.value) {
        maxWidth.value = width;
        rectConfig.value.width = width + 20; // Add some padding
        selectionConfig.value.width = rectConfig.value.width
        selectionConfig.value.height = rectConfig.value.height
        nameUnderLineConfig.value.points = [
            rectConfig.value.x,
            rectConfig.value.y + nameConfig.value.fontSize + 10,
            rectConfig.value.x + rectConfig.value.width,
            rectConfig.value.y + nameConfig.value.fontSize + 10
        ]
    }
};
</script>