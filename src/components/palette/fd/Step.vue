<!-- Step.vue -->
<template>
    <v-group ref="groupRef" :config="groupConfig" @dragmove="(e) => emit('dragmove', e)" @mousedown="handleSelect">
        <v-line v-if="isDecision" :config="diamondConfig"></v-line>
        <v-rect v-else ref="rectRef" :config="rectConfig"></v-rect>
        <v-text :config="textConfig" />
        <v-image :config="iconConfig" />
        <ContentRectangle v-if="secondaryLabel && !isDecision" :config="secondaryRect" />
        <v-circle :config="connectorHandleConfig" @mousedown="handleStartConnect"></v-circle>
        <v-text v-if="props.isStart" :config="startMarkerConfig" />
        <v-circle :config="startHandleConfig" @mousedown="handleSetStart"></v-circle>
    </v-group>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useImage } from 'vue-konva';
import { useContractStorage } from '@/stores/contract';
import ContentRectangle from './ContentRectangle.vue';

const emit = defineEmits(['dragmove', 'select', 'start-connect', 'set-start']);
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

const rectConfig = ref({
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT,
    cornerRadius: 5,
    fill: style.fill,
    stroke: style.stroke,
    strokeWidth: 1,
});

const diamondConfig = ref({
    points: [
        WIDTH / 2, 0,
        WIDTH, HEIGHT / 2,
        WIDTH / 2, HEIGHT,
        0, HEIGHT / 2,
    ],
    closed: true,
    fill: style.fill,
    stroke: style.stroke,
    strokeWidth: 1,
});

// Decision's diamond interior is much narrower than the rect-sized layout
// used by every other kind, so it gets its own small, centered content
// region instead of the normal top-left-anchored layout.
const textConfig = ref(isDecision
    ? {
        x: WIDTH / 2 - 40,
        y: HEIGHT / 2 + 6,
        text: props.step?.name || props.step?.cmp_type,
        fontSize: 13,
    }
    : {
        x: 45,
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
    x: 10,
    y: 34,
    content: secondaryLabel.value,
    height: 22,
    width: WIDTH - 20,
    fillColor: '#FEFDF8',
    borderColor: style.stroke,
    fontSize: 12,
}));

const [image] = useImage('src/assets/icons/' + style.icon);
const iconConfig = ref(isDecision
    ? {
        x: WIDTH / 2 - 11,
        y: HEIGHT / 2 - 19,
        width: 22,
        height: 22,
        image: image,
    }
    : {
        x: 12,
        y: 8,
        width: 22,
        height: 22,
        image: image,
    });

const connectorHandleConfig = ref({
    x: WIDTH + 8,
    y: HEIGHT / 2,
    radius: 6,
    fill: '#666666',
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
    radius: 6,
    fill: '#2E7D32',
});

function handleSetStart(e) {
    e.cancelBubble = true;
    emit('set-start', props.step);
}

const groupConfig = ref({
    x: props.x,
    y: props.y,
    draggable: true,
    type: props.step?.cmp_type || 'Action',
    name: props.step?.name || 'Step',
    data: props.step,
});

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
