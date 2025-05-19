<template>
    <v-group :config="groupConfig">
        <v-rect :config="rectConfig"></v-rect>
        <v-text :config="textConfig" />

        <v-image :config="iconConfig" />
        <StatementRenderer :statement="statement" />
        <!-- <v-text :config="contentConfig" v-for="expression in props.statement" :text="expression.params.type" /> -->

    </v-group>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useImage } from "vue-konva";

onMounted(() => {
    console.log();

})

const props = defineProps({
    x: Number,
    y: Number,
    type: String,
    statement: Object
});
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: 200,
    height: 130,
    stroke: '#F6ECB2',
    fill: "#FFFDE4",
    cornerRadius: 5,
    strokeWidth: 2,
})
const textConfig = ref({
    x: rectConfig.value.x + 45,
    y: rectConfig.value.y + 17,
    text: "ForStatement",
    fontSize: 15,
})

const contentConfig = ref({
    x: rectConfig.value.x + 3,
    y: rectConfig.value.y + 10,
    fontSize: 12,
})

const groupConfig = ref({
    x: props.x,
    y: props.y,
    draggable: true,
})
const [image] = useImage("src/assets/icons/forStatementIcon.png")
const iconConfig = ref({
    x: rectConfig.value.x + 10,
    y: rectConfig.value.y + 10,
    width: 30,
    height: 30,
    image: image
})

onMounted(() => {
    console.log("loaded!");

})
</script>

<style></style>


<!-- stroke: '#F6ECB2', -->
<!-- fill:"#FFFDE4", -->