<template>
  <div class="flex flex-col">
    <Palette class="mb-2"></Palette>
    <button class="text-left" @click="toggleLayer" v-if="!isMainLayerVisible">back</button>
    <div class=" flex flex-row">
      <v-stage :config="{ width: 970, height: 720 }">
        <v-layer>
          <contract :name="fileStore.contract.name" :x="fileStore.contract.x" :y="fileStore.contract.y" />
        </v-layer>
        <v-layer ref="mainLayer" :visible="isMainLayerVisible">
          <variable v-for="variable in fileStore.contract.variables" :key="variable.name" :name="variable.name"
            :data="variable" :x="variable.x" :y="variable.y" @click="fileStore.showProperties" />

          <struct v-for="struct in fileStore.contract.structs" :key="struct.name" :name="struct.name"
            :literals="struct.literals" :x="struct.x" :y="struct.y" @click="fileStore.showProperties" />

          <function v-for="_function in fileStore.contract.functions" :key="_function.name" :name="_function.name"
            :x="_function.x" :y="_function.y" :params="_function.params" :statements="_function.body"
            :_return="_function._return" @click="fileStore.showProperties" @dblclick="showFunctionLayer(_function)" />

          <function v-if="fileStore.contract.constructor" :name="fileStore.contract.constructor.name"
            :x="fileStore.contract.constructor.x" :y="fileStore.contract.constructor.y" />

        </v-layer>
        <v-layer :visble="isFunctionLayerVisible" v-if="isFunctionLayerVisible">

          <AssignmentStatement
            v-for="(assignmentStatement, index) in selectedFunction.body.filter(elm => elm.type == 'AssignmentStatement')"
            :x="50" :y="110 * (index + 1)" :expressions="assignmentStatement.expressions" />
        </v-layer>
      </v-stage>
      <div class="flex flex-col m-3">
        <Properties :element="fileStore.selectedElement"></Properties>

        <SmartContractGenerator />

      </div>

    </div>

  </div>


</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref, useTemplateRef } from 'vue'
import SmartContractGenerator from './components/SmartContractGenerator.vue'
import Palette from './components/inc/Palette.vue'
import Properties from './components/inc/Properties.vue'
import Contract from './components/palette/scd/Contract.vue'
import Variable from './components/palette/scd/Variable.vue'
import Struct from './components/palette/scd/Struct.vue'
import Function from './components/palette/scd/Function.vue'
import AssignmentStatement from './components/palette/fd/AssignmentStatement.vue'
import { useContractStorage } from '@/stores/contract'
var fileStore = useContractStorage()

onBeforeMount(() => {
  fileStore.selectedElement = reactive({ name: "", type: "", visibility: "" })

  const scd = reactive({
    struct: [],
    variables: [],
    functions: [],
  })
  var configKonva = ref({
    width: window.innerWidth,
    height: window.innerHeight
  })

})

var isMainLayerVisible = ref(true);
var isFunctionLayerVisible = ref(!isMainLayerVisible.value)
var selectedFunction = ref(null)


const toggleLayer = () => {

  isMainLayerVisible.value = !isMainLayerVisible.value
  isFunctionLayerVisible.value = !isFunctionLayerVisible.value

}

const showFunctionLayer = (func) => {
  selectedFunction = func
  toggleLayer()
}


</script>