<template>
    <v-group :draggable="true" @mousedown="handleClick">
        <v-rect ref="rectRef" :config="rectConfig"></v-rect>
        <v-rect :config="paramsConfig"></v-rect>
        <v-rect :config="returnConfig"></v-rect>
        <!-- <v-line :config="nameUnderLineConfig"></v-line> -->
        <v-rect :config="selectionConfig" v-if="selected"></v-rect>
        <v-image :config="iconConfig" />
        <!-- Parameters -->
        <Parameter v-for="param in params" :key="param.id" :name="param.name" :x="props.x" :y="props.y - 20" />

        <!-- Statements -->
        <Statement v-for="(stmt, index) in statements" :key="stmt.id" :statement="stmt" :x="rectConfig.x"
            :y="rectConfig.y + (index * 30) + 30" @max-width="updateRectWidth" />
        <!-- <v-text v-for="(stmt,index) in statements" :key="stmt.id" :value="statements.type" config="statementsConfig"/> -->
        <!-- Return Statement -->
        <Return v-if="returnParams" :name="returnParams.name" :x="props.x" :y="props.y + rectConfig.height" />

        <v-text :config="nameConfig"></v-text>
    </v-group>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Parameter from "./Parameter.vue";
import Return from './Return.vue';
import Statement from '@/components/palette/scd/Statement.vue';
import { useImage } from "vue-konva";
import { useContractStorage } from "@/stores/contract";

const fileStore =useContractStorage()

const rectRef = ref(null);
const maxWidth = ref(200);

const props = defineProps({
    x: Number,
    y: Number,
    name: String,
    data: Object,
    selected: Boolean,
    params: Array,
    statements: Array,
    returnParams: Object
});


const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: maxWidth.value, // Bind to dynamic maxWidth
    height: 45 * (props.statements?.length || 3),
    stroke: props.name == '<<constructor>>' ? '#D6B656' : '#ADD8F6',
    fill: props.name == '<<constructor>>' ? '#FBF7E3' : '#E0F2FE',
    cornerRadius: 5,
    strokeWidth: 1,
    // dash: [3, 2],
});

const nameConfig = ref({
    x: props.x + 35,
    y: props.y + 10,
    fontSize: 12,
    text: props.name,
    data: props.data
});

// const nameUnderLineConfig = ref({
//     points: [
//         rectConfig.value.x,
//         rectConfig.value.y + nameConfig.value.fontSize + 10,
//         rectConfig.value.x + rectConfig.value.width,
//         rectConfig.value.y + nameConfig.value.fontSize + 10
//     ],
//     stroke: 'black',
//     strokeWidth: 1,
//     lineJoin: 'round',
//     dash: [3, 2],
// });

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
    cornerRadius: 5,

    strokeWidth: 1.5,
})
const imageAddress = props.name == '<<constructor>>' ? 'src/assets/icons/constructor_icon.png' : "src/assets/icons/function_icon.png"
const [image] = useImage(imageAddress)
const iconConfig = ref({
    x: props.x + 5,
    y: props.y + 5,
    width: 25,
    height: 25,
    image: image
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
onMounted(() => {
    // console.log("statements",props.statements);
    // console.log("params",props.params);


})

function handleClick() {
  console.log("✅ Clicked struct with data:", props.data);
  console.log('🧪 props.data.type =', props.data?.type)
  fileStore.showProperties(props.data);
}
</script>