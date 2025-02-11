<template>
    <div class="flex items-center justify-center p-2">
        <div v-for="element in elements" :key="element.id" class="inline-flex m-1">
            <div @dragstart="startDrag(element)" draggable="true" @click="element.action"
                class="flex items-center justify-center p-1 bg-white border border-gray-300 rounded cursor-move">
                <span class="text-gray-700 text-sm">{{ element.label }}</span>
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
    { id: 2, label: 'Struct', type: 'struct', icon: '', action: "createStruct" },
    { id: 3, label: 'Variable', type: 'variable', icon: '' },
    { id: 4, label: 'Function', type: 'function', icon: '' },
    { id: 5, label: 'Literal', type: 'literal', icon: '' },
    { id: 6, label: 'Return', type: 'return', icon: '' },
    { id: 7, label: 'Parameter', type: 'parameter', icon: '' },
    // FD
    //   { id: 8, label: 'Image', type: 'image' },
    //   { id: 9, label: 'Arrow', type: 'arrow' },
    //   { id: 10, label: 'Star', type: 'star' },
]
function startDrag(element) {
    this.$emit('start-drag', element);
}
</script>

<style scoped></style>