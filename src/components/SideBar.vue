<template>
    <div class="flex flex-col h-full">
        <!-- <div class="h-3 my-4 mx-3">
            <Logo></Logo>
        </div> -->
        <ul class="flex flex-col space-y-1">
            <Palette></Palette>
        </ul>
        <!-- <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"> -->
        <!-- <div class="col-auto mx-3 mt-1">
            <Properties :element="fileStore.selectedElement"></Properties>
        </div> -->

        <!-- <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700">
        <div class="col-auto mx-3 mt-1">
            <SmartContractGenerator />
        </div> -->
        <div class="flex flex-col space-y-1">
            <p class="text-gray-500 font-semibold px-3 py-1">Menu</p>
            <div class="flex flex-row space-x-2 px-3 py-1">
                <button
                    class="bg-slate-800 hover:bg-slate-800 border border-slate-500 font-semibold py-2 px-4 rounded flex flex-row gap-2 items-center">
                    <BackwardIcon class="w-5" /> <span class="text-sm">Undo </span>
                </button>
                <button
                    class=" bg-slate-800 hover:bg-slate-800 border border-slate-500 font-semibold py-2 px-4 rounded flex flex-row gap-2 items-center">
                    <BackwardIcon class="w-5 transform rotate-180" /> <span class="text-sm">
                        Redo </span>
                </button>
            </div>

        </div>
    </div>
</template>
<script setup>
import { useContractStorage } from '@/stores/contract';
import SmartContractGenerator from './SmartContractGenerator.vue';
import Logo from './Logo.vue';
import Palette from './inc/Palette.vue';
import Properties from './inc/Properties.vue';
import { ref } from 'vue';
import { BackwardIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    currentStage: String
})
var fileStore = useContractStorage()

const menu = ref([
    {
        title: "Workspace"
    },
    {
        title: "Strurtural Componenets",
        submenu: [
            {
                title: ""
            }
        ]
    },
    {
        title: "Functional Componenets"
    }
])
</script>