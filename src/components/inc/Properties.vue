<template>
    <div class="h-full w-full overflow-y-auto text-xs">
        <div class="flex items-center justify-between my-2 px-2">
            <h3 class="font-bold">Edit Panel</h3>
            <span v-if="selectedCount > 1" class="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                {{ selectedCount }} selected
            </span>
        </div>
        <div v-if="element?.cmp_type && selectedCount === 1">
            <component :is="activeComponent" :element="element" />

            <div>
                <label class="block text-xs font-semibold mb-1">Description:</label>
                <textarea
                    class="border bg-slate-800 p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3 w-full px-1 py-0.5  my-1 text-xs"
                    placeholder="" v-model="element.description" rows="7">
                </textarea>
            </div>


        </div>
        <div v-else-if="selectedCount > 1" class="text-center text-gray-500 mt-4">
            <p class="mb-2">{{ selectedCount }} elements selected</p>
            <p class="text-xs">Press Delete to remove all selected elements</p>
        </div>
        <div v-else class="text-center text-gray-500 mt-4">
            <p>No element selected</p>
            <p class="text-xs mt-2">Press Ctrl+A to select all</p>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useContractStorage } from '@/stores/contract'
import StructuralProperties from './StructuralProperties.vue'
import StatementProperties from './StatementProperties.vue'

const fileStore = useContractStorage()

const element = computed(() => fileStore.selectedElement)
const selectedCount = computed(() => fileStore.selectedElements.length)

const activeComponent = computed(() => {

    const type = element.value?.cmp_type

    console.log("📦 Properties element type:", type);
    if (!type) return null
    if (["AssignmentStatement", "CallStatement", "LoopStatement", "EmitStatement", "ReturnStatement", "ConditionStatement"].includes(type)) {
        return StatementProperties
    }
    return StructuralProperties
})
</script>