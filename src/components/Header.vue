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

    <!-- Autosave indicator -->
    <div class="ml-auto mr-4 text-xs text-gray-500 dark:text-gray-400">
      <span v-if="uiStore.isSaving" class="flex items-center gap-1">
        <svg class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Saving...
      </span>
      <span v-else-if="uiStore.lastSavedTime" class="flex items-center gap-1">
        <svg class="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        {{ getTimeSince(uiStore.lastSavedTime) }}
      </span>
    </div>

    <div class="right-0">
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
import { ref, computed } from 'vue';
import Modal from './Modal.vue';
import { useContractStorage } from '@/stores/contract';
import { useUIStore } from '@/stores/uiStore';
import { CircleStackIcon, UserCircleIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon, CodeBracketIcon, PhotoIcon, TrashIcon } from '@heroicons/vue/20/solid'
import IconDocumentation from './icons/IconDocumentation.vue';

var fileStore = useContractStorage()
const uiStore = useUIStore()
const showModal = ref(false)
const isExportButtonPressed = ref(false)

// Helper function to get "time since" text
const getTimeSince = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 10) return 'Saved just now';
  if (seconds < 60) return `Saved ${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Saved ${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Saved ${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `Saved ${days}d ago`;
}
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