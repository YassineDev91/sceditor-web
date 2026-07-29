<template>
    <v-group :config="groupConfig" @click="e => emit('click', e)"
        @dragend="e => emit('dragend', e)" @dblclick="e => emit('dblclick', e)">
        <v-rect ref="rectRef" :config="rectConfig"></v-rect>
        <v-rect :config="paramsConfig"></v-rect>
        <v-rect :config="returnConfig"></v-rect>
        <v-rect :config="selectionConfig" v-if="selected"></v-rect>
        <v-image :config="iconConfig" />
        <v-text v-if="isReadOnly" :config="mutabilityBadgeConfig" />
        <v-text v-if="isPayable" :config="payableBadgeConfig" />
        <v-text v-if="guardNames.length > 0" :config="guardChipConfig" />
        <!-- Parameters -->
        <Parameter v-for="param in params" :key="param.id" :name="param.name" :x="props.x" :y="props.y - 20" />

        <!-- Statements -->
        <Statement v-for="(stmt, index) in statements" :key="stmt.id" :statement="stmt" :x="rectConfig.x"
            :y="rectConfig.y + (index * 30) + 30" />
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
import { data } from "autoprefixer";

const emit = defineEmits(['click', 'dragend', 'dblclick']);

const fileStore = useContractStorage()

const guardNames = computed(() =>
  (props.data.guards || [])
    .map(g => fileStore.contract.guards.find(guard => guard.id === g.ref)?.name)
    .filter(Boolean)
)
const isPayable = computed(() => props.data.acceptsValue === true)
const isReadOnly = computed(() => props.data.mutability && props.data.mutability !== 'write')

const groupConfig = computed(() => ({
    x: props.x,
    y: props.y,
    data: props.data,
    draggable: true,
}));    

const rectRef = ref(null);
const maxWidth = ref(170);

const baseHeight = 50;       // fixed top area
const statementHeight = 30;  // height per statement

const guardRowHeight = 18;
const dynamicHeight = computed(() => {
    const guardsHeight = guardNames.value.length > 0 ? guardRowHeight : 0;
    return baseHeight + guardsHeight + (props.statements?.length || 0) * statementHeight;
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
    x: 0,
    y: 0,
    width: maxWidth.value, // Bind to dynamic maxWidth
    height: dynamicHeight.value,
    stroke: props.name == '<<constructor>>' ? '#D6B656' : '#ADD8F6',
    fill: props.name == '<<constructor>>' ? '#FBF7E3' : '#E0F2FE',
    cornerRadius: 5,
    strokeWidth: 1,
    // dash: [3, 2],
}));

const nameConfig = computed(() => {
    const badgeReserve = (isReadOnly.value ? 30 : 0) + (isPayable.value ? 20 : 0);
    return {
        x: 35,
        y: 10,
        fontSize: 12,
        text: props.name,
        data: props.data,
        width: rectConfig.value.width - 35 - 10 - badgeReserve,
        ellipsis: true,
        wrap: 'none',
    };
});

const mutabilityBadgeConfig = computed(() => ({
    x: rectConfig.value.width - 28,
    y: 10,
    text: props.data.mutability === 'pure' ? 'pure' : 'view',
    fontSize: 9,
    fill: '#3b82f6',
}));

const payableBadgeConfig = computed(() => ({
    x: rectConfig.value.width - (isReadOnly.value ? 55 : 28),
    y: 10,
    text: '₿',
    fontSize: 11,
    fill: '#d97706',
}));

const guardChipConfig = computed(() => ({
    x: 5,
    y: dynamicHeight.value - guardRowHeight + 2,
    text: guardNames.value.join(', '),
    fontSize: 9,
    fill: '#6b7280',
    width: maxWidth.value - 10,
    ellipsis: true,
    wrap: 'none',
}));

const returnConfig = computed(() => ({

    y:  rectConfig.value.height
}));

const paramsConfig = computed(() => ({
    x: props.x,
    y: props.y,
}));

const selectionConfig = computed(() => ({
    width: rectConfig.value.width, // Bind to dynamic maxWidth
    height: rectConfig.value.height,
    stroke: '#3498db',
    cornerRadius: 5,
    strokeWidth: 1.5,
}));

const imageAddress = props.name == '<<constructor>>' ? 'src/assets/icons/constructor_icon.png' : "src/assets/icons/function.png"
const [image] = useImage(imageAddress)
const iconConfig = ref({
    x: 7,
    y:  7,
    width: 20,
    height: 20,
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