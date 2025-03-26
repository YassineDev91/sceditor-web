<template>
    <div class="flex flex-col p-2">
        <div v-for="element in getPaletteElements()" :key="element.id" class="m-0.5">
            <div @dragstart="startDrag(element)" draggable="true" @click="element.action"
                class="flex p-1 bg-white dark:bg-slate-300/15 hover:dark:bg-slate-300/20 dark:text-white rounded-sm space-x-2 items-center">
                <img :src="'src/assets/icons/' + element.icon + '.png'" class="w-5 h-5 rounded-sm p-1 shadow-sm object-contain bg-slate-300">
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
    // {
    //     id: 1, label: 'Contract', type: 'contract', icon: '', action: () => {
    //         fileStore.contract.variables.push({
    //             name: 'var_created',
    //             type: 'uint',
    //             visibility: 'public',
    //             x: 400,
    //             y: 100,
    //         },);
    //         console.log('variable created !');

    //     }
    // },
    { label: 'Struct', type: 'struct', icon: 'struct', stage: 'SCD', action: () => { createStruct() } },
    { label: 'Variable', type: 'variable', icon: 'variable', stage: 'SCD', action: () => { createVaribale() } },
    { label: 'Function', type: 'function', icon: 'function', stage: 'SCD', action: () => { createFunction() } },
    { label: 'Literal', type: 'literal', icon: 'three-point', stage: 'SCD', },
    // {  label: 'Return', type: 'return', icon: '' },
    // {  label: 'Parameter', type: 'parameter', icon: '' },
    // FD
    { label: 'Assignment', icon:'assignment', type: 'image', stage: 'FD' },
    { label: 'Call', icon:'event', type: 'arrow', stage: 'FD' },
    { label: 'Condition', icon:'git', type: 'star', stage: 'FD' },
    { label: 'Loop', icon:'loop', type: 'star', stage: 'FD' },
    { label: 'Literal', icon:'three-point', type: 'star', stage: 'FD' },
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
</script>

<style scoped></style>