<template>
  <div class="flex flex-col bg-white dark:bg-gray-900 dark:text-white font-mono">

    <Header :sctitle="fileStore.contract.name" :workspace="workspaceRef"></Header>
    <div class="grid grid-cols-5 bg-white dark:bg-gray-900 dark:text-white font-mono">
      <SideBar class="col-span-1 h-screen"></SideBar>
      <div class="col-span-3 flex flex-col">
        <Workspace ref="workspaceRef"></Workspace>
      </div>
      <RightSideBar class="col-span-1 h-screen"></RightSideBar>
    </div>
  </div>


</template>

<script setup>
import { onBeforeMount, reactive, ref } from 'vue'
import Header from './components/Header.vue'
import SideBar from './components/SideBar.vue'
import Workspace from './components/Workspace.vue'
import { useContractStorage } from '@/stores/contract'
import RightSideBar from './components/RightSideBar.vue'
var fileStore = useContractStorage()

const workspaceRef = ref(null);


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