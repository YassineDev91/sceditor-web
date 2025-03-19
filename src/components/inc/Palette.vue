<template>
    <div class="flex flex-col p-2">
        <div v-for="element in elements" :key="element.id" class="m-0.5">
            <div @dragstart="startDrag(element)" draggable="true" @click="element.action"
                class="flex p-1 bg-white dark:bg-slate-300/15 hover:dark:bg-slate-300/20 dark:text-white rounded-sm space-x-2 items-center">
                <img :src="'src/assets/icons/' + element.icon + '.png'" class="w-5 h-5">
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
    { id: 2, label: 'Struct', type: 'struct', icon: 'struct', action: () => { createStruct() } },
    { id: 3, label: 'Variable', type: 'variable', icon: 'variable', action: () => { createVaribale() } },
    { id: 4, label: 'Function', type: 'function', icon: 'function', action: () => { createFunction() } },
    { id: 5, label: 'Literal', type: 'literal', icon: 'three-point' },
    // { id: 6, label: 'Return', type: 'return', icon: '' },
    // { id: 7, label: 'Parameter', type: 'parameter', icon: '' },
    // FD
    //   { id: 8, label: 'Image', type: 'image' },
    //   { id: 9, label: 'Arrow', type: 'arrow' },
    //   { id: 10, label: 'Star', type: 'star' },
]
function startDrag(element) {
    // this.$emit('start-drag', element);
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