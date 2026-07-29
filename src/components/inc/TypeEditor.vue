<template>
  <div class="flex flex-col gap-1 border border-slate-600 rounded p-1">
    <select v-model="kind" class="bg-slate-700 text-xs p-1 rounded">
      <option value="primitive">Primitive</option>
      <option value="array">Array</option>
      <option value="associative">Associative (mapping)</option>
      <option value="reference">Reference (Struct/Enum)</option>
    </select>

    <template v-if="kind === 'primitive'">
      <select v-model="primitiveName" class="bg-slate-700 text-xs p-1 rounded">
        <option v-for="n in PRIMITIVE_NAMES" :key="n" :value="n">{{ n }}</option>
      </select>
      <input v-if="showsSize" type="number" v-model.number="primitiveSize" placeholder="size"
        class="bg-slate-700 text-xs p-1 rounded" />
      <label v-if="primitiveName === 'address'" class="text-xs flex items-center gap-1">
        <input type="checkbox" v-model="primitivePayable" /> payable
      </label>
    </template>

    <template v-else-if="kind === 'array'">
      <input type="number" v-model.number="arraySize" placeholder="fixed size (blank = dynamic)"
        class="bg-slate-700 text-xs p-1 rounded" />
      <div class="ml-2 text-xs text-gray-400">element:</div>
      <TypeEditor v-model="arrayElement" />
    </template>

    <template v-else-if="kind === 'associative'">
      <div class="ml-2 text-xs text-gray-400">key:</div>
      <TypeEditor v-model="associativeKey" />
      <div class="ml-2 text-xs text-gray-400">value:</div>
      <TypeEditor v-model="associativeValue" />
    </template>

    <template v-else-if="kind === 'reference'">
      <select v-model="referenceRef" class="bg-slate-700 text-xs p-1 rounded">
        <option value="" disabled>Select a Struct or Enum</option>
        <option v-for="opt in referenceOptions" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
      </select>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useContractStorage } from '@/stores/contract'
import { primitiveType, arrayType, associativeType, referenceType } from '@/schema/types'

const PRIMITIVE_NAMES = ['address', 'bool', 'string', 'bytes', 'uint', 'int', 'timestamp', 'decimal']
const NUMERIC_PRIMITIVES = ['uint', 'int']

const fileStore = useContractStorage()
const model = defineModel({ required: true })

const kind = computed({
  get: () => model.value.kind,
  set: (newKind) => {
    if (newKind === model.value.kind) return
    if (newKind === 'primitive') model.value = primitiveType('uint')
    else if (newKind === 'array') model.value = arrayType(primitiveType('uint'))
    else if (newKind === 'associative') model.value = associativeType(primitiveType('address'), primitiveType('uint'))
    else if (newKind === 'reference') model.value = referenceType('')
  }
})

const showsSize = computed(() => NUMERIC_PRIMITIVES.includes(primitiveName.value) || primitiveName.value === 'bytes')

const primitiveName = computed({
  get: () => model.value.name,
  set: (name) => { model.value = primitiveType(name, { size: model.value.size, payable: model.value.payable }) }
})
const primitiveSize = computed({
  get: () => model.value.size,
  set: (size) => { model.value = primitiveType(primitiveName.value, { size: size || undefined, payable: model.value.payable }) }
})
const primitivePayable = computed({
  get: () => !!model.value.payable,
  set: (payable) => { model.value = primitiveType(primitiveName.value, { size: model.value.size, payable }) }
})

const arraySize = computed({
  get: () => model.value.size,
  set: (size) => { model.value = arrayType(model.value.element, size || null) }
})
const arrayElement = computed({
  get: () => model.value.element,
  set: (element) => { model.value = arrayType(element, model.value.size) }
})

const associativeKey = computed({
  get: () => model.value.key,
  set: (key) => { model.value = associativeType(key, model.value.value) }
})
const associativeValue = computed({
  get: () => model.value.value,
  set: (value) => { model.value = associativeType(model.value.key, value) }
})

const referenceRef = computed({
  get: () => model.value.ref,
  set: (ref) => { model.value = referenceType(ref) }
})
const referenceOptions = computed(() => [
  ...fileStore.contract.structs.map(s => ({ id: s.id, name: `Struct: ${s.name}` })),
  ...fileStore.contract.enums.map(e => ({ id: e.id, name: `Enum: ${e.name}` })),
])
</script>
