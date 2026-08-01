<template>
  <v-group
    :config="groupConfig"
    ref="groupRef"
    draggable
    @dragmove="$emit('dragmove', $event)"
    @click="$emit('click', $event)"
  >
    <v-rect :config="rectConfig" />

    <!-- Optional icon -->
    <v-image v-if="image" :config="iconConfig" />

    <!-- Statement label -->
    <v-text :config="textConfig" />

    <!-- Left Expression -->
    <v-group v-if="leftText" :config="leftGroupConfig">
      <v-rect :config="contentRectConfig1" />
      <v-text :config="leftTextConfig" />
    </v-group>

    <!-- Right Expression -->
    <v-group v-if="rightText" :config="rightGroupConfig">
      <v-rect :config="contentRectConfig2" />
      <v-text :config="rightTextConfig" />
    </v-group>

    <!-- Nested Slot -->
    <slot />
  </v-group>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useImage } from 'vue-konva';

const props = defineProps({
  x: Number,
  y: Number,
  title: String,
  icon: String,
  color: String,
  left: [String, Object],
  right: [String, Object]
});

const groupRef = ref(null);
const groupConfig = computed(() => ({ x: props.x, y: props.y }));
const rectConfig = computed(() => ({ width: 260, height: 60, fill: props.color, cornerRadius: 8 }));
const textConfig = computed(() => ({ x: 10, y: 10, text: props.title, fontSize: 14, fontStyle: 'bold' }));

const { image } = useImage(props.icon);
const iconConfig = computed(() => ({ image: image.value, x: 230, y: 10, width: 20, height: 20 }));

// Normalize left/right values
const normalizeExpression = (expr) => {
  if (typeof expr === 'string') return expr;
  if (typeof expr === 'object') return expr.name || expr.value || '';
  return '';
};

const leftText = computed(() => normalizeExpression(props.left));
const rightText = computed(() => normalizeExpression(props.right));

const leftGroupConfig = { x: 10, y: 35 };
const rightGroupConfig = { x: 140, y: 35 };
const contentRectConfig1 = { width: 100, height: 20, fill: '#f8fafc', cornerRadius: 4 };
const contentRectConfig2 = { width: 100, height: 20, fill: '#f8fafc', cornerRadius: 4 };
const leftTextConfig = computed(() => ({ x: 5, y: 2, text: leftText.value, fontSize: 12, fill: '#0f172a' }));
const rightTextConfig = computed(() => ({ x: 5, y: 2, text: rightText.value, fontSize: 12, fill: '#0f172a' }));
</script>