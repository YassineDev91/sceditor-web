<template>
    <TransitionRoot as="template" :show="localOpen" @after-leave="$emit('contract-created');
    emit('update:open', false)">
        <Dialog class="relative z-10" @close="localOpen = false">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg">
                            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div class="sm:flex sm:items-start">
                                    <div
                                        class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:size-10">
                                        <NewspaperIcon class="size-6 text-blue-600" aria-hidden="true" />
                                    </div>
                                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle as="h3" class="text-base font-semibold text-gray-900">{{ title }}
                                        </DialogTitle>
                                        <div class="mt-2">
                                            <p class="text-sm text-gray-500">
                                                <slot></slot>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="button"
                                    class="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                    @click="newContract">Validate</button>
                                <button type="button"
                                    class="mt-3 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    @click="closeModal" ref="cancelButtonRef">Cancel</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, nextTick } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { NewspaperIcon } from '@heroicons/vue/24/outline'
import { useContractStorage } from '@/stores/contract'

const fileStore = useContractStorage()

const props = defineProps({
    open: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: "NewSmartContract"
    },
    stageRef: Object // ref from Workspace.vue

})

const emit = defineEmits(['update:open', 'contract-created'])

const localOpen = ref(props.open)

// Watch for changes in the prop and update the local state accordingly
watch(() => props.open, (newVal) => {
    localOpen.value = newVal
})

const closeModal = () => {
    localOpen.value = false
    emit('contract-created');
    emit('update:open', false)
}
const newContract = () => {
    const isContractEmpty = fileStore.contract.name == null ? true : false
    if (isContractEmpty) {
        createNewContract(contractName.value)
    } else {
        if (confirm("A new contract will replace the current one, are you sure ?", "yes or no"))
            createNewContract(contractName.value)
    }
    localOpen.value = false
    emit('contract-created');
    emit('update:open', false)
    console.log("done", contractName.value);
    nextTick(() => {
        props.stageRef?.getNode()?.draw();
        const stage = props.stageRef?.getNode();
        console.log('🔍 Stage children:', stage?.getChildren());
    });

}
const createNewContract = (name) => {
    fileStore.contract =
    {
        "name": name,
        "x": 10,
        "y": 10,
        "variables": [],
        "structs": [],
        "_constructor": {
            "x": 100,
            "y": 100,
            "params": [],
            "modifiers": [],
            "body": {
                "type": "Block",
                "statements": []
            }
        },
        "functions": [],
    }
}
</script>