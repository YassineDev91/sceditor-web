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
        <v-text v-if="guardNames.length > 0" :config="guardChipConfig" @mouseenter="handleGuardMouseEnter" @mouseleave="canvasTooltip.hideTooltip()" />
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
import { computed, inject, ref } from "vue";
import Parameter from "./Parameter.vue";
import Return from './Return.vue';
import Statement from '@/components/palette/scd/Statement.vue';
import { useImage } from "vue-konva";
import { useContractStorage } from "@/stores/contract";
import { SPACING_UNIT, ICON_SIZE, CORNER_RADIUS, STROKE_WIDTH_NORMAL, STROKE_WIDTH_SELECTED } from '@/constants/nodeStyleTokens';
import { measureTextWidth } from '@/utils/measureText';

const canvasTooltip = inject('canvasTooltip');

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
const NAME_X = SPACING_UNIT * 2 + ICON_SIZE + SPACING_UNIT; // 36
const MIN_WIDTH = 170;
const RIGHT_PADDING = SPACING_UNIT * 2; // 8
const badgeReserve = computed(() => (isReadOnly.value ? 30 : 0) + (isPayable.value ? 20 : 0));
const maxWidth = computed(() =>
  Math.max(MIN_WIDTH, NAME_X + measureTextWidth(props.name, 12) + badgeReserve.value + RIGHT_PADDING)
);

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
    width: maxWidth.value,
    height: dynamicHeight.value,
    stroke: props.name == '<<constructor>>' ? '#D6B656' : '#ADD8F6',
    fill: props.name == '<<constructor>>' ? '#FBF7E3' : '#E0F2FE',
    cornerRadius: CORNER_RADIUS,
    strokeWidth: STROKE_WIDTH_NORMAL,
}));

const nameConfig = computed(() => ({
    x: NAME_X,
    y: SPACING_UNIT * 2, // 8
    fontSize: 12,
    text: props.name,
    data: props.data,
}));

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
    x: SPACING_UNIT * 2, // 8
    y: dynamicHeight.value - guardRowHeight + 2,
    text: guardNames.value.join(', '),
    fontSize: 9,
    fill: '#6b7280',
    width: maxWidth.value - SPACING_UNIT * 4, // 16
    ellipsis: true,
    wrap: 'none',
}));

function handleGuardMouseEnter(e) {
  const pos = e.target.getStage().getRelativePointerPosition();
  canvasTooltip.showTooltip(guardNames.value.join(', '), pos.x, pos.y);
}

const returnConfig = computed(() => ({

    y:  rectConfig.value.height
}));

const paramsConfig = computed(() => ({
    x: props.x,
    y: props.y,
}));

const selectionConfig = computed(() => ({
    width: rectConfig.value.width,
    height: rectConfig.value.height,
    stroke: '#3498db',
    cornerRadius: CORNER_RADIUS,
    strokeWidth: STROKE_WIDTH_SELECTED,
}));

const imageAddress = props.name == '<<constructor>>' ? 'src/assets/icons/constructor_icon.png' : "src/assets/icons/function.png"
const [image] = useImage(imageAddress)
const iconConfig = ref({
    x: SPACING_UNIT * 2, // 8
    y: SPACING_UNIT * 2, // 8
    width: ICON_SIZE,
    height: ICON_SIZE,
    image: image
})
</script>