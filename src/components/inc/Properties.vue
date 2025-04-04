<template>
    <div class="row">
        <h1 class="mb-1">
            Properties
        </h1>
        <div v-for="input in inputs" :key="input.id" class="flex flex-col mb-2">
            <label for="name" class="text-xs">{{ input.name }}</label>
            <input type="text" :name="input.name.toLocaleLowerCase()" :id="input.name.toLocaleLowerCase()"
                v-model="element[input.name.toLocaleLowerCase()]"
                class="mt-1 px-2 py-1.5 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200  border-2 outline-none focus:border-indigo-600">
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';

const inputs = ref([
    {
        name: "Name"
    },
    {
        name: "Type"
    },
    {
        name: "Visibility"
    },
    {
        name: "Modifiers"
    }
])
const props = defineProps({
    element: Object,
})
</script>

<style></style>