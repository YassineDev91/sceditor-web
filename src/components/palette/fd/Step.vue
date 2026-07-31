<!-- Step.vue -->
<template>
    <v-group ref="groupRef" :config="groupConfig" @dragmove="(e) => emit('dragging', e)" @dragend="(e) => emit('dragend', e)" @mousedown="handleSelect">
        <v-line v-if="isDecision" :config="diamondConfig"></v-line>
        <v-rect v-else ref="rectRef" :config="rectConfig"></v-rect>
        <v-text :config="textConfig" />
        <v-image :config="iconConfig" />
        <ContentRectangle v-if="secondaryLabel && !isDecision" :config="secondaryRect" />
        <v-circle :config="connectorHitConfig" @mousedown="handleStartConnect"></v-circle>
        <v-circle :config="connectorHandleConfig" :listening="false"></v-circle>
        <v-text v-if="props.isStart" :config="startMarkerConfig" />
        <v-circle :config="startHitConfig" @mousedown="handleSetStart"></v-circle>
        <v-circle :config="startHandleConfig" :listening="false"></v-circle>
    </v-group>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useImage } from 'vue-konva';
import { useContractStorage } from '@/stores/contract';
import ContentRectangle from './ContentRectangle.vue';
import { SPACING_UNIT, ICON_SIZE, CORNER_RADIUS, STROKE_WIDTH_NORMAL, HANDLE_VISIBLE_RADIUS, HANDLE_HIT_RADIUS } from '@/constants/nodeStyleTokens';

const emit = defineEmits(['dragging', 'dragend', 'select', 'start-connect', 'set-start']);
const fileStore = useContractStorage();

const props = defineProps({
    x: Number,
    y: Number,
    step: Object,
    isStart: Boolean,
});

const WIDTH = 200;
const HEIGHT = 80;

const KIND_STYLE = {
    Action:   { fill: '#E7F4FE', stroke: '#84B2E9', icon: 'assignment_icon.png' },
    Call:     { fill: '#E9F9EA', stroke: '#7CC9AE', icon: 'call_icon.png' },
    Emit:     { fill: '#FFDBD4', stroke: '#FA9580', icon: 'emit_icon.png' },
    Decision: { fill: '#FFECD1', stroke: '#FABB81', icon: 'git.png' },
    Return:   { fill: '#EDE7F6', stroke: '#9575CD', icon: 'call_icon.png' },
    Revert:   { fill: '#FDECEA', stroke: '#E57373', icon: 'error.png' },
};

const style = KIND_STYLE[props.step?.cmp_type] || KIND_STYLE.Action;
const isDecision = props.step?.cmp_type === 'Decision';

const groupRef = ref({});
const rectRef = ref({});

const rectConfig = computed(() => ({
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT,
    cornerRadius: CORNER_RADIUS,
    fill: style.fill,
    stroke: style.stroke,
    strokeWidth: STROKE_WIDTH_NORMAL,
}));

const diamondConfig = computed(() => ({
    points: [
        WIDTH / 2, 0,
        WIDTH, HEIGHT / 2,
        WIDTH / 2, HEIGHT,
        0, HEIGHT / 2,
    ],
    closed: true,
    fill: style.fill,
    stroke: style.stroke,
    strokeWidth: STROKE_WIDTH_NORMAL,
}));

// Decision's diamond interior is much narrower than the rect-sized layout
// used by every other kind, so it gets its own small, centered content
// region instead of the normal top-left-anchored layout.
const textConfig = computed(() => isDecision
    ? {
        x: WIDTH / 2 - 40,
        y: HEIGHT / 2 + 6,
        text: props.step?.name || props.step?.cmp_type,
        fontSize: 13,
    }
    : {
        x: SPACING_UNIT * 3 + ICON_SIZE + SPACING_UNIT, // 40
        y: 12,
        text: props.step?.name || props.step?.cmp_type,
        fontSize: 13,
    });

// Call/Emit/Revert show their resolved reference name; everything else falls
// back to the free-text description. Reactive (not computed once) because
// the referenced Function/Event/ErrorDeclaration can be renamed elsewhere
// while this step stays on screen, matching EmitStatement.vue's precedent.
const referenceLabel = computed(() => {
    const step = props.step;
    if (!step) return '';
    if (step.cmp_type === 'Call') {
        return fileStore.contract.functions.find(f => f.id === step.target)?.name || 'no function selected';
    }
    if (step.cmp_type === 'Emit') {
        return (fileStore.contract.events || []).find(e => e.id === step.eventRef)?.name || 'no event selected';
    }
    if (step.cmp_type === 'Revert') {
        return (fileStore.contract.errorDeclarations || []).find(e => e.id === step.errorRef)?.name || 'no error selected';
    }
    return '';
});

const secondaryLabel = computed(() => referenceLabel.value || props.step?.description || '');

const secondaryRect = computed(() => ({
    x: SPACING_UNIT * 2,      // 8
    y: SPACING_UNIT * 11,     // 44 — was ContentRectangle's implicit +10 on top of the old y:34; now explicit here since ContentRectangle no longer adds an offset (Task 9, Step 4)
    content: secondaryLabel.value,
    height: SPACING_UNIT * 6, // 24
    width: WIDTH - SPACING_UNIT * 4, // 184
    fillColor: '#FEFDF8',
    borderColor: style.stroke,
    fontSize: 12,
}));

const [image] = useImage('src/assets/icons/' + style.icon);
const iconConfig = computed(() => isDecision
    ? {
        x: WIDTH / 2 - ICON_SIZE / 2,
        y: HEIGHT / 2 - 20,
        width: ICON_SIZE,
        height: ICON_SIZE,
        image: image.value,
    }
    : {
        x: SPACING_UNIT * 3, // 12
        y: SPACING_UNIT * 2, // 8
        width: ICON_SIZE,
        height: ICON_SIZE,
        image: image.value,
    });

const connectorHandleConfig = ref({
    x: WIDTH + 8,
    y: HEIGHT / 2,
    radius: HANDLE_VISIBLE_RADIUS,
    fill: '#666666',
});

const connectorHitConfig = ref({
    x: WIDTH + HANDLE_HIT_RADIUS,
    y: HEIGHT / 2,
    radius: HANDLE_HIT_RADIUS,
    fill: 'transparent',
});

// The start marker (a small label + a dedicated hotspot to (re)designate this
// step as the entry point) mirrors the Lifecycle diagram's initial-state
// marker from the notation spec — every step graph should make its entry
// point explicit, not leave it implicit.
const startMarkerConfig = ref({
    x: 0,
    y: -16,
    text: '▶ START',
    fontSize: 11,
    fill: '#2E7D32',
    fontStyle: 'bold',
});

const startHandleConfig = ref({
    x: -8,
    y: HEIGHT / 2,
    radius: HANDLE_VISIBLE_RADIUS,
    fill: '#2E7D32',
});

const startHitConfig = ref({
    x: -HANDLE_HIT_RADIUS,
    y: HEIGHT / 2,
    radius: HANDLE_HIT_RADIUS,
    fill: 'transparent',
});

function handleSetStart(e) {
    e.cancelBubble = true;
    emit('set-start', props.step);
}

const groupConfig = computed(() => ({
    x: props.x,
    y: props.y,
    draggable: true,
    type: props.step?.cmp_type || 'Action',
    name: props.step?.name || 'Step',
    data: props.step,
}));

function handleSelect() {
    console.log('✅ Step clicked:', props.step);
    emit('select', props.step);
}

function handleStartConnect(e) {
    e.cancelBubble = true;
    emit('start-connect', props.step);
}

onMounted(() => {
    groupRef.value.getNode().width(WIDTH);
    groupRef.value.getNode().height(HEIGHT);
});
</script>
