<template>
    <div class="flex flex-row my-4 w-full gap-4 items-center">
        <h1 class="col-auto w-1/3">
          <span class="text-blue-500">Contract:</span>  {{ props.sctitle }}
        </h1>

        <div class="flex flex-row">
            <button
                class=" rounded-l-md border-r-0 border border-gray-600 inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800">
                New
            </button>

            <button
                class="border border-gray-600 inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800">
                Import
            </button>

            <button
                class="rounded-r-md border border-l-0 border-gray-600 inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800">
                Export as
            </button>
        </div>

        <div class="ml-auto right-0">
            <img src="#" alt="profile">
        </div>
    </div>

</template>

<script setup>
const props = defineProps({
    sctitle: {
        type: String,
        default: ""
    }
})
</script>