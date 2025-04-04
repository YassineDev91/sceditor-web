<template>
    <div class="flex flex-row my-4 w-full gap-4 items-center">
        <h1 class="col-auto w-1/3">
            <span class="text-blue-500">Contract:</span> {{ props.sctitle }}
        </h1>

        <div class="flex flex-row">
            <button @click="showModal = true"
                class=" rounded-l-md border-r-0 border border-gray-600 inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800">
                New
            </button>

            <button
                class="border border-gray-600 inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800">
                Import
            </button>

            <button @click="callWorkspaceHandleExportFunction"
                class="rounded-r-md border border-l-0 border-gray-600 inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800">
                Export as
            </button>
        </div>

        <div class="ml-auto right-0">
            <!-- <img src="#" alt="profile"> -->
            <UserCircleIcon class="mx-3 w-10 h-10"></UserCircleIcon>
        </div>
    </div>
    <Modal v-model:open="showModal" title="New Smart Contract Diagram">
        <div class="flex flex-col gap-2">
            <label for="contractName">Title</label>
            <input type="text" name="contractName" id="contractName" :value="fileStore.contract.name"
                class="p-1 outline-none border border-1 rounded focus:border-blue-600">
        </div>
    </Modal>
</template>s

<script setup>
import { ref } from 'vue';
import Modal from './Modal.vue';
import { useContractStorage } from '@/stores/contract';
import { CircleStackIcon, UserCircleIcon } from '@heroicons/vue/24/outline';

var fileStore = useContractStorage()
const showModal = ref(false)

const props = defineProps({
    sctitle: {
        type: String,
        default: ""
    },
    workspace: Object

})
// Function to call the function inside Workspace
const callWorkspaceHandleExportFunction = () => {
    console.log("exporting");

    if (props.workspace && props.workspace.handleExport) {
        props.workspace.handleExport();
    }
};


</script>