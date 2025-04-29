<template>
    <div class="flex flex-col p-2">
        <div v-for="element in getPaletteElements()" :key="element.id" class="m-0.5">
            <div @dragstart="startDrag(element)" draggable="true" @click="element.action"
                class="flex p-1 bg-white dark:bg-slate-300/15 hover:dark:bg-slate-300/20 dark:text-white rounded-sm space-x-2 items-center">
                <div class="bg-slate-200 rounded-sm shadow-md">
                    <img :src="'src/assets/icons/' + element.icon + '.png'"
                        class="w-5 h-5 p-1 shadow-sm object-contain">
                </div>
                <span class="text-xs">{{ element.label }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useContractStorage } from '@/stores/contract'
var fileStore = useContractStorage()


const elements = [
    // SCD
    { label: 'Struct', type: 'struct', icon: 'struct', stage: 'SCD', action: () => { createStruct() } },
    { label: 'Variable', type: 'variable', icon: 'variable', stage: 'SCD', action: () => { createVaribale() } },
    { label: 'Function', type: 'function', icon: 'function', stage: 'SCD', action: () => { createFunction() } },
    { label: 'Literal', type: 'literal', icon: 'three-point', stage: 'SCD', },
    // {  label: 'Return', type: 'return', icon: '' },
    // {  label: 'Parameter', type: 'parameter', icon: '' },

    // FD
    { label: 'Assignment', icon: 'assignment', type: 'image', stage: 'FD', action: () => createStatement('assignment') },
    { label: 'Call', icon: 'event', type: 'arrow', stage: 'FD', action: () => createStatement('callback') },
    { label: 'Condition', icon: 'git', type: 'star', stage: 'FD', action: () => createStatement('condition') },
    { label: 'Loop', icon: 'loop', type: 'star', stage: 'FD', action: () => createStatement('loop') },
    { label: 'Literal', icon: 'three-point', type: 'star', stage: 'FD', action: () => createStatement('literal') },
]
function startDrag(element) {
    // this.$emit('start-drag', element);
}
function getPaletteElements() {

    return elements.filter((elm) => {
        if (fileStore.scdStage)
            return elm.stage == 'SCD'
        return elm.stage == 'FD'
    }
    )
}
function createStruct() {
    fileStore.contract.structs.push({
        name: "new_struct",
        x: 100,
        y: 100
    })
}

function createVaribale() {
    fileStore.contract.variables.push({
        name: "new_variable",
        x: 100,
        y: 100
    })
}

function createFunction() {
    fileStore.contract.functions.push({
        name: "new_function",
        x: 100,
        y: 100
    })
}

function createStatement(type) {
    switch (type) {
        case 'assignment':
            console.log('creating assignment statement ...');
            fileStore.selectedFunction.body.push({
                type: "AssignmentStatement",
                expressions: {
                    left: "",
                    right: ""
                }
            })
            break;
        case 'loop':
            console.log('creating loop statement ...');

            fileStore.selectedFunction.body.push({
                type: "LoopStatement",
                condition: {
                    type: "BinaryExpression",
                    left: "",
                    operator: "",
                    right: ""
                },
                body: []
            })
            break;

        default:
            break;
    }
}
</script>

<style scoped></style>