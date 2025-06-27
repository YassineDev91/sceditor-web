<template>
    <v-group :config="{ draggable: true, data: props.data }" @mousedown="handleClick">
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
            :y="rectConfig.y + (index * 30) + 30" />
        <!-- <v-text v-for="(stmt,index) in statements" :key="stmt.id" :value="statements.type" config="statementsConfig"/> -->
        <!-- Return Statement -->
        <Return v-if="returnParams" :name="returnParams.name" :x="props.x" :y="props.y + rectConfig.height" />

        <v-text :config="nameConfig"></v-text>
    </v-group>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Parameter from "./Parameter.vue";
import Return from './Return.vue';
import Statement from '@/components/palette/scd/Statement.vue';
import { useImage } from "vue-konva";
import { useContractStorage } from "@/stores/contract";

const fileStore = useContractStorage()

const rectRef = ref(null);
const maxWidth = ref(170);

const baseHeight = 50;       // fixed top area
const statementHeight = 30;  // height per statement

const dynamicHeight = computed(() => {
    return baseHeight + (props.statements?.length || 0) * statementHeight;
});

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


const rectConfig = computed(() => ({
    x: props.x,
    y: props.y,
    width: maxWidth.value, // Bind to dynamic maxWidth
    height: dynamicHeight.value,
    stroke: props.name == '<<constructor>>' ? '#D6B656' : '#ADD8F6',
    fill: props.name == '<<constructor>>' ? '#FBF7E3' : '#E0F2FE',
    cornerRadius: 5,
    strokeWidth: 1,
    // dash: [3, 2],
}));

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

const selectionConfig = computed(() => ({
    x: props.x,
    y: props.y,
    width: rectConfig.value.width, // Bind to dynamic maxWidth
    height: rectConfig.value.height,
    stroke: '#3498db',
    cornerRadius: 5,
    strokeWidth: 1.5,
}));

const imageAddress = props.name == '<<constructor>>' ? 'src/assets/icons/constructor_icon.png' : "src/assets/icons/function_icon.png"
const [image] = useImage(imageAddress)
const iconConfig = ref({
    x: props.x + 5,
    y: props.y + 5,
    width: 25,
    height: 25,
    image: image
})

onMounted(() => {
    // console.log("statements",props.statements);
    // console.log("params",props.params);
})

function handleClick() {
    console.log("✅ Clicked struct with data:", props.data);
    console.log('🧪 props.data.type =', props.data?.type)
    console.log('🧪 coordinates =', rectConfig.value.x, ",", rectConfig.value.y)
    fileStore.showProperties(props.data);
}
</script>