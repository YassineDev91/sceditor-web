<template>
    <div class="p-2">
        <label>Name:</label>
        <input v-model="element.name"
            class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
            placeholder="Name" />
        <template v-if="element.cmp_type == 'Variable'">
            <label class="block text-xs mb-1">Type:</label>
            <TypeEditor v-model="element.type" />
        </template>

        <template v-if="element.cmp_type == 'Struct' && element.literals !== undefined">
            <hr class="my-2 border-slate-600 border-2 rounded" />
            <div class="flex row gap-2">
                <h4 class="font-bold mb-1">Literals</h4>
                <button @click="addLiteralToStruct(element)">
                    <PlusIcon class="w-5"></PlusIcon>
                </button>
            </div>
            <div v-for="(lit, index) in element.literals" :key="index"
                class="border rounded p-2 mb-2 border-slate-600 focus:border-blue-600">
                <input v-model="lit.name"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Literal name" />
                <TypeEditor v-model="lit.type" />
                <input v-model="lit.visibility"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Visibility" />
            </div>
        </template>

        <template v-if="element.cmp_type == 'Function'">
            <hr class="my-2 border-slate-600 border-2 rounded" />
            <div class="flex row gap-2">
                <h4 class="font-bold mb-1">Parameters</h4>
                <button @click="addParameterTo(element)">
                    <PlusIcon class="w-5"></PlusIcon>
                </button>
            </div>
            <div v-for="(param, index) in element.parameters" :key="index"
                class="border rounded p-2 mb-2 border-slate-600 focus:border-blue-600">
                <input v-model="param.name"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Parameter name" />
                <TypeEditor v-model="param.type" />
                <input v-model="param.visibility"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Visibility" />
            </div>

            <hr class="my-2 border-slate-600 border-2 rounded" />
            <label>Mutability:</label>
            <select v-model="element.mutability"
                class="bg-slate-700 input border p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3">
                <option value="write">write</option>
                <option value="view">view</option>
                <option value="pure">pure</option>
            </select>
            <label>Visibility:</label>
            <select v-model="element.visibility"
                class="bg-slate-700 input border p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3">
                <option value="external">external</option>
                <option value="internal">internal</option>
            </select>
            <label class="flex items-center gap-2 mb-3">
                <input type="checkbox" v-model="element.acceptsValue" /> Accepts value (payable)
            </label>

            <hr class="my-2 border-slate-600 border-2 rounded" />
            <div class="flex row gap-2">
                <h4 class="font-bold mb-1">Guards</h4>
            </div>
            <div v-for="(guardRef, index) in element.guards" :key="index"
                class="border rounded p-2 mb-2 border-slate-600 flex items-center gap-2">
                <span class="flex-1">{{ guardName(guardRef.ref) }}</span>
                <input :value="guardRef.args.join(',')" @change="e => guardRef.args = e.target.value.split(',').map(s => s.trim()).filter(Boolean)"
                    class="bg-slate-700 input border p-1 rounded outline-none border-slate-600 focus:border-blue-600 w-24"
                    placeholder="args" />
                <button @click="element.guards.splice(index, 1)">
                    <PlusIcon class="w-4 rotate-45" />
                </button>
            </div>
            <select @change="e => attachGuard(element, e.target.value)"
                class="bg-slate-700 input border p-1 rounded outline-none border-slate-600 focus:border-blue-600">
                <option value="" selected>+ Attach a guard...</option>
                <option v-for="guard in unattachedGuards(element)" :key="guard.id" :value="guard.id">{{ guard.name }}</option>
            </select>
        </template>

        <template v-if="element.cmp_type == 'Guard'">
            <hr class="my-2 border-slate-600 border-2 rounded" />
            <div class="flex row gap-2">
                <h4 class="font-bold mb-1">Parameters</h4>
                <button @click="addParameterTo(element)">
                    <PlusIcon class="w-5"></PlusIcon>
                </button>
            </div>
            <div v-for="(param, index) in element.parameters" :key="index"
                class="border rounded p-2 mb-2 border-slate-600 focus:border-blue-600">
                <input v-model="param.name"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Parameter name" />
                <TypeEditor v-model="param.type" />
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

        <template v-if="element.cmp_type == 'Event'">
            <hr class="my-2 border-slate-600 border-2 rounded" />
            <div class="flex row gap-2">
                <h4 class="font-bold mb-1">Parameters</h4>
                <button @click="addParameterTo(element)">
                    <PlusIcon class="w-5"></PlusIcon>
                </button>
            </div>
            <div v-for="(param, index) in element.parameters" :key="index"
                class="border rounded p-2 mb-2 border-slate-600 focus:border-blue-600">
                <input v-model="param.name"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Parameter name" />
                <TypeEditor v-model="param.type" />
            </div>
        </template>

        <template v-if="element.cmp_type == 'ErrorDeclaration'">
            <hr class="my-2 border-slate-600 border-2 rounded" />
            <div class="flex row gap-2">
                <h4 class="font-bold mb-1">Parameters</h4>
                <button @click="addParameterTo(element)">
                    <PlusIcon class="w-5"></PlusIcon>
                </button>
            </div>
            <div v-for="(param, index) in element.parameters" :key="index"
                class="border rounded p-2 mb-2 border-slate-600 focus:border-blue-600">
                <input v-model="param.name"
                    class="bg-slate-700 input border  p-1 rounded outline-none border-slate-600 focus:border-blue-600 mb-3"
                    placeholder="Parameter name" />
                <TypeEditor v-model="param.type" />
            </div>
        </template>
    </div>
</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/20/solid';
import { useContractStorage } from '@/stores/contract';
import { createGuardRef } from '@/schema/elements';
import TypeEditor from './TypeEditor.vue';

const fileStore = useContractStorage();

const props = defineProps({
    element: Object
})

function addValueToEnum(element) {
    element.values.push({name:""})
    console.log("added",element)
}

function addLiteralToStruct(element) {
    if (!element.literals) {
        element.literals = [];
    }
    element.literals.push({
        name: "new_literal",
        type: { kind: "primitive", name: "string" },
        visibility: "public"
    });
    console.log("✅ Added literal to struct", element);
}

function guardName(guardId) {
    return fileStore.contract.guards.find(g => g.id === guardId)?.name || guardId;
}

function unattachedGuards(element) {
    const attachedIds = new Set((element.guards || []).map(g => g.ref));
    return fileStore.contract.guards.filter(g => !attachedIds.has(g.id));
}

function attachGuard(element, guardId) {
    if (!guardId) return;
    if (!element.guards) element.guards = [];
    element.guards.push(createGuardRef(guardId));
}

function addParameterTo(element) {
    if (!element.parameters) {
        element.parameters = [];
    }
    element.parameters.push({
        name: "new_param",
        type: { kind: "primitive", name: "uint", size: 256 }
    });
}
</script>

<style scoped>
.input {
    @apply w-full border px-1 py-0.5 rounded my-1 text-xs;
}
</style>