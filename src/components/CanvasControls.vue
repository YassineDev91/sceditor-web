<template>
    <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-[5] pointer-events-auto">
        <div v-if="collapsed"
            class="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-blue-500 dark:border-blue-700 p-1">
            <button @click="collapsed = false" title="Expand toolbar"
                class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ChevronDownIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
        </div>
        <div v-else
            class="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-blue-500 dark:border-blue-700 p-2">

            <!-- Collapse -->
            <button @click="collapsed = true" title="Collapse toolbar"
                class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ChevronUpIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

            <!-- Undo -->
            <button @click="$emit('undo')" :disabled="!canUndo"
                :title="`Undo ${undoCount > 0 ? `(${undoCount})` : ''}`"
                class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ArrowUturnLeftIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <!-- Redo -->
            <button @click="$emit('redo')" :disabled="!canRedo"
                :title="`Redo ${redoCount > 0 ? `(${redoCount})` : ''}`"
                class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ArrowUturnRightIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

            <!-- Zoom Out -->
            <button @click="$emit('zoom-out')" title="Zoom Out (Ctrl + -)"
                class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <MinusIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <!-- Zoom Display -->
            <div class="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
                {{ Math.round(zoom * 100) }}%
            </div>

            <!-- Zoom In -->
            <button @click="$emit('zoom-in')" title="Zoom In (Ctrl + +)"
                class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <PlusIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <!-- Reset Zoom -->
            <button @click="$emit('zoom-reset')" title="Reset Zoom (Ctrl + 0)"
                class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ArrowsPointingInIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

            <!-- Grid Toggle -->
            <button @click="$emit('toggle-grid')" :title="gridEnabled ? 'Hide Grid' : 'Show Grid'"
                :class="[
                    'p-2 rounded transition-colors',
                    gridEnabled
                        ? 'bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                ]">
                <Square3Stack3DIcon class="w-5 h-5"
                    :class="gridEnabled ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'" />
            </button>

            <!-- Snap to Grid Toggle -->
            <button @click="$emit('toggle-snap')" :title="snapToGrid ? 'Disable Snap to Grid' : 'Enable Snap to Grid'"
                :class="[
                    'p-2 rounded transition-colors',
                    snapToGrid
                        ? 'bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                ]">
                <MagnifyingGlassIcon class="w-5 h-5"
                    :class="snapToGrid ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'" />
            </button>

            <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

            <!-- Pan Mode Toggle -->
            <button @click="$emit('toggle-pan')" :title="panMode ? 'Exit Pan Mode (Space)' : 'Pan Mode (Space)'"
                :class="[
                    'p-2 rounded transition-colors',
                    panMode
                        ? 'bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                ]">
                <HandRaisedIcon class="w-5 h-5"
                    :class="panMode ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'" />
            </button>

            <!-- Fit to Screen -->
            <button @click="$emit('fit-to-screen')" title="Fit to Screen (Ctrl + F)"
                class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ArrowsPointingOutIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    PlusIcon,
    MinusIcon,
    ArrowsPointingInIcon,
    ArrowsPointingOutIcon,
    Square3Stack3DIcon,
    MagnifyingGlassIcon,
    HandRaisedIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
    ChevronUpIcon,
    ChevronDownIcon
} from '@heroicons/vue/24/outline'

const collapsed = ref(false)

defineProps({
    zoom: {
        type: Number,
        default: 1
    },
    gridEnabled: {
        type: Boolean,
        default: true
    },
    snapToGrid: {
        type: Boolean,
        default: false
    },
    panMode: {
        type: Boolean,
        default: false
    },
    canUndo: {
        type: Boolean,
        default: false
    },
    canRedo: {
        type: Boolean,
        default: false
    },
    undoCount: {
        type: Number,
        default: 0
    },
    redoCount: {
        type: Number,
        default: 0
    }
})

defineEmits(['zoom-in', 'zoom-out', 'zoom-reset', 'toggle-grid', 'toggle-snap', 'toggle-pan', 'fit-to-screen', 'undo', 'redo'])
</script>
