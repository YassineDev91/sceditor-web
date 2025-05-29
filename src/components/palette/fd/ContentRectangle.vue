<template>

    <v-group>
        <v-rect :config="rectConfig">

        </v-rect>
        <v-text :config="textConfig">

        </v-text>
    </v-group>

</template>
<script setup>
import { onMounted, ref } from 'vue';
const props = defineProps({
    config: {
        x: Number,
        y: Number,
        height:Number,
        width:Number,
        content: String,
        fillColor: String,
        borderColor: String,
        fontSize:Number
    }
})

const rectConfig = ref({
    x: props.config.x,
    y: props.config.y+10,
    height: props.config.height,
    width: props.config.width,
    fill: props.config.fillColor,
    stroke: props.config.borderColor,
    strokeWidth: 0.5,
    cornerRadius: 5,
})
const textConfig = ref({
    x: rectConfig.value.x + (rectConfig.value.width - props.config.content.length * 8) / 2,
    y: rectConfig.value.y + (rectConfig.value.height - 15) / 2,
    text: props.config.content,
    color: "black",
    fontSize:props.config.fontSize
})
onMounted(()=>{
    console.log(props.config.content.length);
    
})

</script>