<template>
    <div class="row">
        <div class="flex flex-col">
        <label for="name" class=" text-sm">Name</label>
        <input type="text" name="name" id="name" placeholder="name" :value="element.name"
            class="mt-2 px-2 py-1 border-gray-500 border-x border-y focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-sm">
    </div>
    <div class="flex flex-col">
        <label for="type" class=" text-sm">Type</label>
        <input type="text" name="type" id="type" placeholder="type" :value="element.type"
            class="mt-2 px-2 py-1 border-gray-500 border-x border-y focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-sm">
    </div>
    </div>
   
</template>

<script setup>
const props = defineProps({
    element: Object,
})
</script>

<style></style>