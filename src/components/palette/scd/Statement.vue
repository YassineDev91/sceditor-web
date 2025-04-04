<template>
    <v-group ref="groupRef">
        <v-image :config="iconConfig"></v-image>
        <v-text ref="leftSide" :config="leftConfig"></v-text>
        <v-text ref="equalSign" :config="equalSignConfig"></v-text>
        <v-text ref="rightSide" :config="rightConfig"></v-text>
    </v-group>
</template>

<script setup>
import { onMounted, ref, nextTick, watch } from 'vue';

const props = defineProps({
    x: Number,
    y: Number,
    expressions: Object,
});

const emit = defineEmits(["max-width"]);

const leftSide = ref(null);
const equalSign = ref(null);
const rightSide = ref(null);
const groupRef = ref(null);
const maxWidth = ref(0);

const iconConfig = ref({
    x: props.x,
    y: props.y,
    src: '@/assets/icons/equal.png',
    width: 12,
    height: 12,
});

const leftConfig = ref({
    x: iconConfig.value.x + 10,
    y: iconConfig.value.y,
    text: props.expressions.left,
    fontSize: 12,
});

const equalSignConfig = ref({
    x: iconConfig.value.x,
    y: iconConfig.value.y,
    text: '=',
    fontSize: 12,
});

const rightConfig = ref({
    x: iconConfig.value.x + 10,
    y: iconConfig.value.y,
    text: props.expressions.right,
    fontSize: 12,
});

onMounted(() => {
    nextTick(() => {
        if (leftSide.value && equalSign.value && rightSide.value) {
            const leftTextNode = leftSide.value.getNode();
            const equalSignNode = equalSign.value.getNode();
            const rightTextNode = rightSide.value.getNode();

            // Compute total width of elements
            const totalWidth = leftTextNode.getClientRect().width + 
                              equalSignNode.getClientRect().width + 
                              rightTextNode.getClientRect().width + 20;

            // Update positions dynamically
            equalSignNode.x(leftTextNode.getClientRect().x + leftTextNode.getClientRect().width + 5);
            rightTextNode.x(equalSignNode.getClientRect().x + equalSignNode.getClientRect().width + 5);

            // Update `maxWidth` and emit the value
            if (maxWidth.value < totalWidth) {
                maxWidth.value = totalWidth;
                emit('max-width', maxWidth.value);
            }
        }
    });
});
</script>