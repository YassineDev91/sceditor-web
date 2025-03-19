<template>
    <div class="flex flex-col h-full">
        <div class="h-3 my-4 mx-3">
            <Logo></Logo>
        </div>
        <ul class="flex flex-col mt-10 space-y-3">
            <Palette></Palette>
        </ul>
        <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700">
        <div class="col-auto mx-3 mt-2">
            <Properties :element="fileStore.selectedElement"></Properties>
        </div>
        
        <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700">
        <div class="col-auto mx-3 mt-2">
            <SmartContractGenerator />
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