<template>
    <div class="p-2">
        <label>Name:</label>
        <input v-model="element.name" class="bg-slate-700 input" placeholder="Name" />
        <input v-if="element.cmp_type == 'Variable'" v-model="element.type.base" class="bg-slate-700 input"
            placeholder="Type" />

        <template v-if="element.literals">
            <hr class="my-2" />
            <h4 class="font-bold">Literals</h4>
            <div v-for="(lit, index) in element.literals" :key="index" class="border rounded p-2 mb-2">
                <input v-model="lit.name" class="bg-slate-700 input" placeholder="Literal name" />
                <input v-model="lit.type.base" class="bg-slate-700 input" placeholder="Type" />
                <input v-model="lit.visibility" class="bg-slate-700 input" placeholder="Visibility" />
            </div>
        </template>
    </div>
</template>

<script setup>
const props = defineProps({
    element: Object
})
</script>

<style scoped>
.input {
    @apply w-full border px-1 py-0.5 rounded my-1 text-xs;
}
</style>