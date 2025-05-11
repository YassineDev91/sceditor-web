<template>
    <div class="row">
        <h1 class="mb-1">
            Properties
        </h1>
        <div v-for="input in inputs" :key="input.id" class="flex flex-col mb-2">
            <label for="name" class="text-xs">{{ input.name }}</label>
            <input type="text" :name="input.name.toLowerCase()" :id="input.name.toLowerCase()"
                :value="getBaseValue(input)" @input="setBaseValue($event, input)"
                class="mt-1 px-2 py-1.5 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200  border-2 outline-none focus:border-indigo-600">
        </div>

    </div>

</template>

<script setup>
import { ref } from 'vue';

const inputs = ref([
    { name: "Name", accessedValue: "name" },
    { name: "Type", accessedValue: "type" },
    { name: "Visibility", accessedValue: "visibility" },
    { name: "Modifiers", accessedValue: "modifiers" }
]);
const props = defineProps({
    element: Object,

})
function getBaseValue(input) {
    const field = props.element?.[input.accessedValue];
    return typeof field === 'object' && field !== null ? field.base ?? '' : field ?? '';
}

function setBaseValue(event, input) {
    const value = event.target.value;
    if (props.element?.[input.accessedValue]) {
        if (typeof props.element[input.accessedValue] === 'object' && props.element[input.accessedValue] !== null) {
            props.element[input.accessedValue].base = value;
        } else {
            props.element[input.accessedValue] = value;
        }
    }
}
</script>

<style></style>