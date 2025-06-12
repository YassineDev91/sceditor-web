<template>
    <div class="h-full w-full overflow-y-auto text-xs">
        <h3 class="text-center font-bold my-2">Edit Panel</h3>
        <div v-if="element?.cmp_type">
            <component :is="activeComponent" :element="element" />
        </div>
        <div v-else class="text-center text-gray-500">No element selected</div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useContractStorage } from '@/stores/contract'
import StructuralProperties from './StructuralProperties.vue'
import StatementProperties from './StatementProperties.vue'

const fileStore = useContractStorage()

const element = computed(() => fileStore.selectedElement)

const activeComponent = computed(() => {
    
    const type = element.value?.cmp_type

    console.log("📦 Properties element type:", type);
    if (!type) return null
    if (["AssignmentStatement", "CallStatement", "LoopStatement", "EmitStatement", "ReturnStatement", "IfStatement"].includes(type)) {
        return StatementProperties
    }
    return StructuralProperties
})
</script>