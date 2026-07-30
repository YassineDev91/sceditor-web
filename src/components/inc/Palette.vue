<template>
    <div class="text-indigo-400 ml-3 font-semibold">
        <span v-if="fileStore.scdStage">
            Structural Diagram
        </span>
        <span v-else>
            Functional Diagram
        </span>
    </div>
    <div class="flex flex-col p-2">
        <div v-for="element in getPaletteElements()" :key="element.id" class="m-0.5">
            <div @dragstart="startDrag($event, element)" draggable="true" @click="element.action"
                class="flex p-1.5 cursor-pointer rounded-md border bg-slate-800/25 border-slate-700 hover:dark:bg-slate-300/20 dark:text-white space-x-2 items-center">
                <div class="bg-slate-200 rounded-sm shadow-md">
                    <img :src="'src/assets/icons/' + element.icon + '.png'"
                        class="w-6 h-6 p-1 shadow-sm object-contain">
                </div>
                <span class="text-xs">{{ element.label }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useContractStorage } from '@/stores/contract'
import { nextPalettePosition } from './paletteLayout.js'
import { nextStepPosition } from '@/schema/steps'
var fileStore = useContractStorage()


const elements = [
    // SCD
    { label: 'Struct', type: 'struct', icon: 'struct', stage: 'SCD', action: () => { fileStore.createStructElement(nextPalettePosition(fileStore.contract)) } },
    { label: 'Variable', type: 'variable', icon: 'variable', stage: 'SCD', action: () => { fileStore.createVariableElement(nextPalettePosition(fileStore.contract)) } },
    { label: 'Function', type: 'function', icon: 'function', stage: 'SCD', action: () => { fileStore.createFunctionElement(nextPalettePosition(fileStore.contract)) } },
    { label: 'Enum', type: 'enum', icon: 'enum', stage: 'SCD', action: () => { fileStore.createEnumElement(nextPalettePosition(fileStore.contract)) }},
    { label: 'Guard', type: 'guard', icon: 'modifier', stage: 'SCD', action: () => { fileStore.createGuardElement(nextPalettePosition(fileStore.contract)) }},
    { label: 'ErrorDeclaration', type: 'error', icon: 'error', stage: 'SCD', action: () => { fileStore.createErrorDeclarationElement(nextPalettePosition(fileStore.contract)) }},
    { label: 'Event', type: 'event', icon: 'emit', stage: 'SCD', action: () => { fileStore.createEventElement(nextPalettePosition(fileStore.contract)) }},
    { label: 'Literal', type: 'literal', icon: 'three-point', stage: 'SCD', },
    // {  label: 'Return', type: 'return', icon: '' },
    // {  label: 'Parameter', type: 'parameter', icon: '' },

    // FD
    { label: 'Action', icon: 'assignmentStatementIcon', type: 'image', stage: 'FD', action: () => addStep('Action', 'new_action') },
    { label: 'Call', icon: 'callStatementIcon', type: 'call', stage: 'FD', action: () => addStep('Call', 'new_call') },
    { label: 'Decision', icon: 'git', type: 'star', stage: 'FD', action: () => addStep('Decision', 'new_decision') },
    { label: 'Emit', icon: 'emit', type: 'arrow', stage: 'FD', action: () => addStep('Emit', 'new_emit') },
    { label: 'Return', icon: 'three-point', type: 'star', stage: 'FD', action: () => addStep('Return', 'new_return') },
    { label: 'Revert', icon: 'error', type: 'star', stage: 'FD', action: () => addStep('Revert', 'new_revert') },
]
const startDrag = (event, item) => {
    event.dataTransfer.setData('application/json', JSON.stringify(item));
};
function getPaletteElements() {

    return elements.filter((elm) => {
        if (fileStore.scdStage)
            return elm.stage == 'SCD'
        return elm.stage == 'FD'
    }
    )
}

function addStep(kind, name) {
    if (!fileStore.selectedFunction?.id) {
        console.warn("⚠️ No function/guard open — can't add a step");
        return;
    }
    const position = nextStepPosition(fileStore.selectedFunction);
    fileStore.createBodyStep(fileStore.selectedFunction, kind, name, position);
}
</script>

<style scoped></style>