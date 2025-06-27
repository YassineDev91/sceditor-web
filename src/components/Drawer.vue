<template>
    <TransitionRoot as="template" :show="localOpen" @after-leave="$emit('update:open', false)">
        <Dialog class="relative z-10" @close="localOpen = false">
            <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0"
                enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                    <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <TransitionChild as="template"
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enter-from="translate-x-full" enter-to="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leave-from="translate-x-0" leave-to="translate-x-full">
                            <DialogPanel class="pointer-events-auto relative w-screen max-w-md">
                                <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0"
                                    enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100"
                                    leave-to="opacity-0">
                                    <div class="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                                        <button type="button"
                                            class="relative rounded-md text-gray-300 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden"
                                            @click="closeDrawer">
                                            <span class="absolute -inset-2.5" />
                                            <span class="sr-only">Close panel</span>
                                            <XMarkIcon class="size-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                </TransitionChild>
                                <div class="flex h-full flex-col overflow-y-scroll bg-slate-700 py-6 shadow-xl">
                                    <div class="px-4 sm:px-6">
                                        <DialogTitle class="text-base font-semibold text-white">
                                            <div class="grid grid-cols-2">
                                                <span>{{ props.title }}</span>
                                                <!-- align this item at the end -->
                                                <div>
                                                    <TransitionRoot as="template" :show="true">
                                                        <TransitionChild as="template"
                                                            enter="transition ease-out duration-300"
                                                            enter-from="opacity-0 scale-95"
                                                            enter-to="opacity-100 scale-100"
                                                            leave="transition ease-in duration-200"
                                                            leave-from="opacity-100 scale-100"
                                                            leave-to="opacity-0 scale-95">
                                                            <div>
                                                                <button v-if="!cpClicked" @click="copyFromSlot"
                                                                    class="text-gray-300 hover:text-white focus:ring-2 focus:ring-white">
                                                                    <ClipboardDocumentIcon class="size-6" />
                                                                </button>
                                                                <span v-else>
                                                                    <CheckCircleIcon class="size-6 text-green-500" />
                                                                </span>
                                                            </div>
                                                        </TransitionChild>
                                                    </TransitionRoot>
                                                </div>
                                            </div>
                                        </DialogTitle>
                                    </div>
                                    <div class="relative mt-6 flex-1 px-4 sm:px-6">
                                        <div ref="codeSlot">
                                            <pre><slot/></pre>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ClipboardDocumentIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { CheckBadgeIcon, CheckCircleIcon, CheckIcon } from '@heroicons/vue/20/solid'

const cpClicked = ref(false)
const codeSlot = ref(null)

const props = defineProps({
    title: {
        type: String,
        default: "Code"
    },
    open: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['update:open'])

const localOpen = ref(props.open)

// Watch for changes in the prop and update the local state accordingly
watch(() => props.open, (newVal) => {
    localOpen.value = newVal
})
async function copyFromSlot() {
    await nextTick();

    if (codeSlot.value) {
        const text = codeSlot.value.innerText.trim();
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log("✅ Copied:", text);
                cpClicked.value = true;
                setTimeout(() => (cpClicked.value = false), 1500);
            })
            .catch(err => {
                console.error("❌ Failed to copy:", err);
            });
    } else {
        console.warn("⚠️ codeSlot ref is null!");
    }
}
const closeDrawer = () => {
    localOpen.value = false
    emit('update:open', false)
}

</script>