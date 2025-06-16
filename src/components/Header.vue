<template>
  <div class="flex flex-row my-4 w-full gap-4 items-center">
    <h1 class="col-auto w-1/3">
      <span class="text-blue-500">Contract:</span> {{ props.sctitle }}
    </h1>

    <div class="flex flex-row">
      <button @click="showModal = true"
        class=" rounded-l-md border-r-0 border border-gray-600 inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800">
        New
      </button>

      <button
        class="border border-gray-600 inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800"
        @click="importContractFromJson">
        Import
      </button>

      <button @click="isExportButtonPressed = !isExportButtonPressed"
        class="rounded-r-md border border-l-0 border-gray-600 inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800">
        Export as
      </button>
      <Transition name="ease-in-fade">
      <div v-if="isExportButtonPressed"
        class="inline-block text-xs font-medium  focus:relative ml-1">
        <button @click="callWorkspaceHandleExportFunction"
          class="inline-flex items-center rounded-md px-4 py-2     hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
          <PhotoIcon class="mr-2 h-5 w-5 text-blue-400" aria-hidden="true" />
          Export to Image
        </button>
        <button @click="exportToJsonFile"
          class="inline-flex items-center rounded-md px-4 py-2    hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
          <CodeBracketIcon class="mr-2 h-5 w-5 text-blue-400" aria-hidden="true" />
          JSON
          </button>

      </div>
      </Transition>


    </div>

    <div class="ml-auto right-0">
      <!-- <img src="#" alt="profile"> -->
      <UserCircleIcon class="mx-3 w-10 h-10"></UserCircleIcon>
    </div>
  </div>
  <Modal v-model:open="showModal" title="New Smart Contract Diagram">
    <div class="flex flex-col gap-2">
      <label for="contractName">Title</label>
      <input type="text" name="contractName" id="contractName" :value="fileStore.contract.name"
        class="p-1 outline-none border border-1 rounded focus:border-blue-600">
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue';
import Modal from './Modal.vue';
import { useContractStorage } from '@/stores/contract';
import { CircleStackIcon, UserCircleIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon, CodeBracketIcon, PhotoIcon, TrashIcon } from '@heroicons/vue/20/solid'
import IconDocumentation from './icons/IconDocumentation.vue';

var fileStore = useContractStorage()
const showModal = ref(false)
const isExportButtonPressed = ref(false)
const props = defineProps({
  sctitle: {
    type: String,
    default: ""
  },
  workspace: Object

})
// Function to call the function inside Workspace
const callWorkspaceHandleExportFunction = () => {
  console.log("exporting");

  if (props.workspace && props.workspace.handleExport) {
    props.workspace.handleExport();
  }
};

const exportToJsonFile = () => {
  const data = JSON.stringify(fileStore.contract, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileStore.contract.name}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


const importContractFromJson = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          fileStore.contract = data;
          fileStore.contract.name = data.name || 'Imported Contract';
          console.log('Contract imported successfully:', fileStore.contract);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
};

</script>

<style scoped>
.ease-in-fade-enter-active {
  transition: all 0.4s ease-in;
}
.ease-in-fade-leave-active {
  transition: all 0.3s ease-out;
}
.ease-in-fade-enter-from,
.ease-in-fade-leave-to {
  opacity: 0;
  transform: translateX(0);
}
.ease-in-fade-enter-to,
.ease-in-fade-leave-from {
  opacity: 1;
  transform: translateX(10);
}
</style>