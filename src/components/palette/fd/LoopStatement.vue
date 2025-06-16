<template>
    <v-group :config="groupConfig">
        <v-rect :config="rectConfig"></v-rect>
        <v-text :config="textConfig" />

        <v-image :config="iconConfig" />
        <StatementRenderer :statement="statement" />
        <!-- <v-text :config="contentConfig" v-for="expression in props.statement" :text="expression.params.type" /> -->
        <v-group :config="contentPosition">
            <EmbededAssignmentStatement :x="10" :y="10" :statement="props.statement.init"></EmbededAssignmentStatement>
            <EmbededConditionalStatement :x="70" :y="10" :statement="props.statement.condition">
            </EmbededConditionalStatement>
            <!-- <EmbededAssignmentStatement :x="140" :y="10" :statement="props.statement.post"></EmbededAssignmentStatement> -->
            <EmbededBody :x="10" :y="30" :width="350" :statements="props.statement.body.statements" />
        </v-group>
    </v-group>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useImage } from "vue-konva";
import EmbededAssignmentStatement from "./EmbededAssignmentStatement.vue";
import EmbededConditionalStatement from "./EmbededConditionalStatement.vue";
import EmbededBody from "./EmbededBody.vue";

onMounted(() => {
    console.log();

})

const props = defineProps({
    x: Number,
    y: Number,
    type: String,
    statement: Object
});
const contentPosition = ref({
    x: props.x + 10,
    y: props.y + 40
})
const rectConfig = ref({
    x: props.x,
    y: props.y,
    width: 400,
    height: 250,
    stroke: '#F6ECB2',
    fill: "#FFFDE4",
    cornerRadius: 5,
    strokeWidth: 1,
})
const textConfig = ref({
    x: rectConfig.value.x + 45,
    y: rectConfig.value.y + 17,
    text: "LoopStatement",
    fontSize: 13,
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
    width: 25,
    height: 25,
    image: image
})

onMounted(() => {
    console.log("loaded!");

})
</script>

<style></style>


<!-- stroke: '#F6ECB2', -->
<!-- fill:"#FFFDE4", -->