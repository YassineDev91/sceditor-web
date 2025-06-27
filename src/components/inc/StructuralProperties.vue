<template>
    <div class="p-2">
        <label>Name:</label>
        <input v-model="element.name"
            class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
            placeholder="Name" />
        <input v-if="element.cmp_type == 'Variable'" v-model="element.type.base"
            class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
            placeholder="Type" />

        <template v-if="element.literals">
            <hr class="my-2 border-slate-600 border-2 rounded" />
            <h4 class="font-bold mb-1">Literals</h4>
            <div v-for="(lit, index) in element.literals" :key="index"
                class="border rounded p-2 mb-2 border-slate-600 focus:border-blue-600">
                <input v-model="lit.name"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Literal name" />
                <input v-model="lit.type.base"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Type" />
                <input v-model="lit.visibility"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Visibility" />
            </div>
        </template>

        <template v-if="element.cmp_type == 'Function'">
            <hr class="my-2 border-slate-600 border-2 rounded" />
            <h4 class="font-bold mb-1">Parameters</h4>
            <div v-for="(param, index) in element.parameters" :key="index"
                class="border rounded p-2 mb-2 border-slate-600 focus:border-blue-600">
                <input v-model="param.name"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Parameter name" />
                <input v-model="param.type.base"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Type" />
                <input v-model="param.visibility"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Visibility" />
            </div>
        </template>

        <template v-if="element.cmp_type == 'Modifier'">
            <hr class="my-2 border-slate-600 border-2 rounded" />
            <h4 class="font-bold mb-1">Parameters</h4>
            <div v-for="(param, index) in element.parameters" :key="index"
                class="border rounded p-2 mb-2 border-slate-600 focus:border-blue-600">
                <input v-model="param.name"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Parameter name" />
                <input v-model="param.type.base"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Type" />
                <input v-model="param.visibility"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Visibility" />
            </div>
        </template>

        <template v-if="element.cmp_type == 'Enum'">
            <hr class="my-2 border-slate-600 border-2 rounded" />
            <div class="flex row gap-2">
                <h4 class="font-bold mb-1">Values</h4>
                <button @click="addValueToEnum(element)">
                    <PlusIcon class="w-5"></PlusIcon>
                </button>
            </div>
            <div v-for="(value, index) in element.values" :key="index"
                class="border rounded p-2 mb-2 border-slate-600 focus:border-blue-600">
                <input v-model="value.name"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="value" />
            </div>
        </template>
    </div>
</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
    element: Object
})

function addValueToEnum(element) {
    element.values.push({name:""})
    console.log("added",element)
}
</script>

<style scoped>
.input {
    @apply w-full border px-1 py-0.5 rounded my-1 text-xs;
}
</style>