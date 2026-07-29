<template>
    <v-group>
        <v-rect ref="textRectRef" :config="textRectConfig"></v-rect>
        <!-- <v-text ref="textRectRef" :config="visibilityConfig"></v-text> -->
        <v-text ref="literalTextRef" :config="nameConfig"></v-text>
        <v-text v-if="props.data?.type" :config="typeConfig"></v-text>
    </v-group>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { computed } from 'vue'
import { formatTypeNode } from '@/schema/typeFormat'
import { useContractStorage } from '@/stores/contract'

const fileStore = useContractStorage()

var textRectRef = ref({})
var literalTextRef = ref({})

const props = defineProps({
    x: Number,
    y: Number,
    name: String,
    data: Object,
    visibility: String
})
const textRectConfig = computed(() =>({
    x: props.x,
    y: props.y,
    width: 130,
    height: 20,
    cornerRadius: 7,
    strokeWidth:1,
    fill: '#F7F5FE',
    stroke: '#CCC7F6',
}))
const visibilityConfig = computed(() =>({
    x: props.x,
    y: props.y + 5,
    text: props.visibility,
    fontSize: 12,
}))

const nameConfig = computed(() =>({
    x: textRectConfig.value.x + 30,
    y: textRectConfig.value.y + 5,
    text: props.name,
    fontSize: 12,
}))
const typeConfig = computed(() => ({
    x: nameConfig.value.x + 55,
    y: nameConfig.value.y,
    text: props.data?.type
        ? formatTypeNode(props.data.type, {
            resolveRef: (id) =>
              fileStore.contract.structs.find(s => s.id === id)?.name ||
              fileStore.contract.enums.find(e => e.id === id)?.name ||
              id,
          })
        : '',
    fontSize: 11,
    fill: '#7C6BAE',
}))
onMounted(() => {
  

})
</script>

<style></style>