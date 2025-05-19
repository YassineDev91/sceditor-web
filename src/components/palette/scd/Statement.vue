<template>
    <v-group ref="groupRef">
        <!-- <v-text ref="leftSide" :config="leftConfig"></v-text>
        <v-text ref="equalSign" :config="equalSignConfig"></v-text>
        <v-text ref="rightSide" :config="rightConfig"></v-text> -->

        <v-rect ref="textRectRef" :config="textRectConfig"></v-rect>
        <v-text ref="textRef" :config="statementTypeConfig" />
        <v-image ref="imageRef" :config="iconConfig"></v-image>

    </v-group>
</template>

<script setup>
import { onMounted, ref, nextTick, watch, onBeforeUnmount } from 'vue';
import { useImage } from 'vue-konva';

const props = defineProps({
    x: Number,
    y: Number,
    statement: Object,
});

const emit = defineEmits(["max-width"]);

const leftSide = ref(null);
const equalSign = ref(null);
const rightSide = ref(null);
const groupRef = ref(null);
const imageRef = ref({});
const textRef = ref({});
const textRectRef = ref({});
const maxWidth = ref(0);
const [image] = useImage("src/assets/icons/" + props.statement.type.toLowerCase() + 'Icon.png')
const iconConfig = ref({
    x: props.x + 12,
    y: props.y + 12,
    image: image,
    width: 15,
    height: 15,
});

const leftConfig = ref({
    x: iconConfig.value.x + 10,
    y: iconConfig.value.y,
    // text: props.expressions.left,
    fontSize: 12,
});
const statementTypeConfig = ref({
    x: props.x + 33,
    y: props.y + 12,
    fontSize: 12,
    text: props.statement.type
})
const textRectConfig = ref({
    x: props.x + 5,
    y: props.y + 6,
    width: 160,
    height: 25,
    cornerRadius: 10,
    fill: '#F7F5FE',
    stroke: '#ADD8F6',
})
const equalSignConfig = ref({
    x: iconConfig.value.x,
    y: iconConfig.value.y,
    text: '=',
    fontSize: 12,
});

const rightConfig = ref({
    x: iconConfig.value.x + 10,
    y: iconConfig.value.y,
    // text: props.expressions.right,
    fontSize: 12,
});
onBeforeUnmount(() => {
    console.log("beforeMount")
})
function getImageName() {
    let imageName = ""
    switch (props.statement.type) {
        case 'AssignmentStatement':
            imageName = "assignment"
        case 'CallStatement':
            imageName = "callStatement"
        case 'ForStatement':
            imageName = "loopStatement"

    }
    console.log('image', imageName);

    return imageName
}
onMounted(() => {
    // textRectRef.value.getNode().width(textRef.value.getNode().width() + 40)
    // textRectRef.value.getNode().height(textRef.value.getNode().fontSize()+15)
    // console.log(textRef.value.getNode().fontSize()+5);


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