<template>
  <div class="grid grid-cols-4 bg-white dark:bg-gray-900 dark:text-white font-mono">
    <SideBar class="col-span-1 h-screen"></SideBar>
    <div class="col-span-3 flex flex-col">
      <Header :sctitle="fileStore.contract.name"></Header>
      <Workspace></Workspace>
    </div>

  </div>


</template>

<script setup>
import { onBeforeMount, reactive, ref } from 'vue'
import Header from './components/Header.vue'
import SideBar from './components/SideBar.vue'
import Workspace from './components/Workspace.vue'
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







</script>

<style></style>