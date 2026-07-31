<template>
    <div v-if="fileStore.contract.name" class="h-full w-full dark:bg-[#F7F7F7] rounded-sm relative">
        <!-- Back Button for Function Layer -->
        <button v-if="!isMainLayerVisible"
            class="text-left text-black text-xs mx-1 mt-1 flex flex-row items-center space-x-1 relative z-[9999]" @click="toggleLayer">
            <ArrowLeftCircleIcon class="w-5" />
            <span>Back</span>
        </button>

        <!-- Canvas Controls Toolbar (positioned absolutely above canvas) -->
        <CanvasControls v-if="!ui.codeDrawerOpen" :zoom="zoomLevel" :gridEnabled="gridVisible" :snapToGrid="snapToGridEnabled"
            :panMode="isPanMode" :canUndo="fileStore.canUndo" :canRedo="fileStore.canRedo"
            :undoCount="fileStore.undoCount" :redoCount="fileStore.redoCount" @zoom-in="handleZoomIn"
            @zoom-out="handleZoomOut" @zoom-reset="handleZoomReset" @toggle-grid="toggleGrid"
            @toggle-snap="toggleSnapToGrid" @toggle-pan="togglePanMode" @fit-to-screen="fitToScreen"
            @undo="handleUndo" @redo="handleRedo" />

        <div ref="workspaceRef" class="flex flex-row h-full w-full" @dragover.prevent @drop="handleDrop">
            <v-stage ref="stageRef" :key="fileStore.contract.name" :config="stageConfig"
                @mousedown="handleMouseDown"
                @mousemove="(e) => { updateConnectionPreview(); handleMouseMove(e); }"
                @mouseup="() => { finishConnectionAtPointer(selectedFunction); handleMouseUp(); }">
                <!-- Contract Layer -->
                <v-layer>
                    <Contract v-if="fileStore.contract.name" :name="fileStore.contract.name" :x="fileStore.contract.x"
                        :y="fileStore.contract.y" :dimensions="stageConfig" @click="handleContractClick">
                    </Contract>
                </v-layer>

                <!-- Structural Layer -->
                <v-layer ref="mainLayer" :visible="isMainLayerVisible">
                    <!-- Selection rectangle -->
                    <v-rect v-if="selectionBox.visible" :config="{
                        x: selectionBox.x,
                        y: selectionBox.y,
                        width: selectionBox.width,
                        height: selectionBox.height,
                        fill: 'rgba(0, 123, 255, 0.1)',
                        stroke: '#007bff',
                        strokeWidth: 1,
                        dash: [4, 4],
                        listening: false
                    }" />
                    <variable v-for="variable in fileStore.contract.variables" :key="variable.id" :data="variable"
                        :x="variable.x" :y="variable.y" :selected="isElementSelected(variable)"
                        @click="(e) => fileStore.showProperties(variable, isMultiSelectModifier(e))" @dragend="(e) => handleScdDragMove(e, variable)" />

                    <struct v-for="struct in fileStore.contract.structs" :key="struct.name" :name="struct.name"
                        :data="struct" :literals="struct.literals" :x="struct.x" :y="struct.y"
                        :selected="isElementSelected(struct)" @click="(e) => fileStore.showProperties(struct, isMultiSelectModifier(e))"
                        @dragend="(e) => handleScdDragMove(e, struct)" />

                    <function v-for="_function in fileStore.contract.functions" :key="_function.id"
                        :name="_function.name" :x="_function.x" :y="_function.y" :data="_function"
                        :params="_function.params" :statements="bodySteps(_function)"
                        :returnParams="_function.returnParams" :selected="isElementSelected(_function)"
                        @click="(e) => fileStore.showProperties(_function, isMultiSelectModifier(e))" @dblclick="showFunctionLayer(_function)"
                        @dragend="(e) => handleScdDragMove(e, _function)" />

                    <function v-if="fileStore.contract._constructor" name="<<constructor>>"
                        :x="fileStore.contract._constructor.x" :y="fileStore.contract._constructor.y"
                        :data="fileStore.contract._constructor" :params="fileStore.contract._constructor.params"
                        :statements="bodySteps(fileStore.contract._constructor)"
                        :selected="isElementSelected(fileStore.contract._constructor)"
                        @click="(e) => fileStore.showProperties(fileStore.contract._constructor, isMultiSelectModifier(e))"
                        @dblclick="showFunctionLayer(fileStore.contract._constructor)"
                        @dragend="(e) => handleScdDragMove(e, fileStore.contract._constructor)" />

                    <Enum v-for="enumItem in fileStore.contract.enums" :key="enumItem.name" :name="enumItem.name"
                        :data="enumItem" :x="enumItem.x" :y="enumItem.y" :values="enumItem.values"
                        :selected="isElementSelected(enumItem)" @click="(e) => fileStore.showProperties(enumItem, isMultiSelectModifier(e))"
                        @dragend="(e) => handleScdDragMove(e, enumItem)" />

                    <Guard v-for="guard in fileStore.contract.guards" :key="guard.id"
                        :name="guard.name" :data="guard" :x="guard.x" :y="guard.y" :params="guard.parameters"
                        :statements="bodySteps(guard)" :selected="isElementSelected(guard)"
                        @click="(e) => fileStore.showProperties(guard, isMultiSelectModifier(e))" @dblclick="showFunctionLayer(guard)"
                        @dragend="(e) => handleScdDragMove(e, guard)" />

                    <ErrorDeclaration v-for="_error in fileStore.contract.errorDeclarations" :key="_error.name"
                        :name="_error.name" :data="_error" :x="_error.x" :y="_error.y" :literals="_error.literals"
                        :selected="isElementSelected(_error)" @click="(e) => fileStore.showProperties(_error, isMultiSelectModifier(e))"
                        @dragend="(e) => handleScdDragMove(e, _error)" />

                    <Event v-for="event in fileStore.contract.events" :key="event.id"
                        :name="event.name" :data="event" :x="event.x" :y="event.y"
                        :selected="isElementSelected(event)" @click="(e) => fileStore.showProperties(event, isMultiSelectModifier(e))"
                        @dragend="(e) => handleScdDragMove(e, event)" />
                </v-layer>

                <!-- Function Layer -->
                <v-layer ref="functionLayer" :visible="isFunctionLayerVisible" v-if="isFunctionLayerVisible">
                    <Step v-for="step in stepGraph.steps" :key="step.id" :step="step" :x="step.x" :y="step.y"
                        :is-start="step.id === stepGraph.startStepId"
                        @dragging="bumpDragTick"
                        @dragend="(e) => handleStepDragMove(selectedFunction, e, step)"
                        @select="handleStatementSelect"
                        @start-connect="startConnection"
                        @set-start="(s) => fileStore.setBodyStartStep(selectedFunction, s.id)" />
                    <v-arrow v-for="edge in stepGraph.edges" :key="edge.id" :config="edgeArrowConfig(selectedFunction, edge)" />
                    <v-circle v-for="edge in stepGraph.edges" :key="'del-hit-' + edge.id"
                        :config="edgeDeleteHitConfig(selectedFunction, edge)"
                        @click="handleDeleteEdge(edge)"></v-circle>
                    <v-circle v-for="edge in stepGraph.edges" :key="'del-' + edge.id"
                        :config="edgeDeleteHandleConfig(selectedFunction, edge)"></v-circle>
                    <v-line v-if="connectingLineConfig" :config="connectingLineConfig"></v-line>
                </v-layer>

                <!-- Tooltip Layer (always on top, regardless of which layer is active) -->
                <v-layer>
                    <v-rect v-if="canvasTooltip.visible.value" :config="canvasTooltip.tooltipRectConfig.value"></v-rect>
                    <v-text v-if="canvasTooltip.visible.value" :config="canvasTooltip.tooltipTextConfig.value"></v-text>
                </v-layer>
            </v-stage>
        </div>
    </div>

    <!-- Empty Contract Placeholder -->
    <div v-else class="h-full w-full dark:bg-slate-300 rounded-sm workspace flex items-center justify-center">
        <button @click="showModal = true"
            class="w-20 h-20 border px-3 py-2 text-xl items-center text-center dark:bg-gray-500 dark:hover:bg-gray-600 bg-white hover:bg-slate-100 border-dashed border-black text-gray-400 rounded-sm">
            +
        </button>
    </div>

    <!-- Modal for Contract Creation -->
    <Modal v-model:open="showModal" @contract-created="onContractCreated" title="New Smart Contract Diagram"
        :stageRef="stageRef" :contractName="newContractName">
        <div class="flex flex-col gap-2">
            <label for="contractName">Title</label>
            <input type="text" name="contractName" id="contractName" v-model="newContractName"
                class="p-1 outline-none border border-1 rounded focus:border-blue-600" />
        </div>
    </Modal>
</template>




<script setup>
import { computed, inject, nextTick, onMounted, provide, ref } from 'vue';
import Contract from '@/components/palette/scd/Contract.vue'
import Variable from '@/components/palette/scd/Variable.vue'
import Struct from '@/components/palette/scd/Struct.vue'
import Function from '@/components/palette/scd/Function.vue'
import Step from './palette/fd/Step.vue';
import Modal from './Modal.vue';
import CanvasControls from './CanvasControls.vue';
import { useContractStorage } from '@/stores/contract'
import { useProjectsStore } from '@/stores/projects'
import { ArrowLeftCircleIcon } from '@heroicons/vue/24/outline';
import { useUIStore } from '@/stores/uiStore';
import Enum from './palette/scd/Enum.vue';
import Guard from './palette/scd/Guard.vue';
import ErrorDeclaration from './palette/scd/ErrorDeclaration.vue';
import Event from './palette/scd/Event.vue';

import { useCanvasSizing } from '@/composables/useCanvasSizing';
import { useCanvasControls } from '@/composables/useCanvasControls';
import { useSelectionBox } from '@/composables/useSelectionBox';
import { useStructuralDragAndDrop } from '@/composables/useStructuralDragAndDrop';
import { useStepGraph } from '@/composables/useStepGraph';
import { useAutosave } from '@/composables/useAutosave';
import { useCanvasKeyboardShortcuts } from '@/composables/useCanvasKeyboardShortcuts';
import { useLayerSwitching } from '@/composables/useLayerSwitching';
import { useCanvasTooltip } from '@/composables/useCanvasTooltip';
import { isMultiSelectModifier } from '@/utils/canvasEvents';

const fileStore = useContractStorage()
const projectsStore = useProjectsStore()
const ui = useUIStore();

const showModal = ref(false)
const newContractName = ref('')
const stageRef = ref(null)
const mainLayer = ref(null)
const functionLayer = ref(null)
const workspaceRef = ref(null)

const { widthCanvaRef, heightCanvaRef, stageConfig } = useCanvasSizing(workspaceRef, stageRef);

const canvasTooltip = useCanvasTooltip();
provide('canvasTooltip', canvasTooltip);

const {
  zoomLevel, gridVisible, snapToGridEnabled, isPanMode,
  handleZoomIn, handleZoomOut, handleZoomReset, fitToScreen,
  toggleGrid, toggleSnapToGrid, togglePanMode,
  handleUndo, handleRedo,
} = useCanvasControls(stageRef, mainLayer, widthCanvaRef, heightCanvaRef);

const {
  selectionBox, isElementSelected, handleMouseDown, handleMouseMove, handleMouseUp, handleContractClick,
} = useSelectionBox(stageRef, mainLayer);

const { handleDrop, handleScdDragMove } = useStructuralDragAndDrop(stageRef, mainLayer);

const {
  graphOf, handleStepDragMove, bumpDragTick, startConnection, updateConnectionPreview,
  finishConnectionAtPointer, cancelConnection, connectingLineConfig, edgeArrowConfig,
  edgeDeleteHandleConfig, edgeDeleteHitConfig,
} = useStepGraph(functionLayer, stageRef);

const bodySteps = (owner) => graphOf(owner).steps;

const stepGraph = computed(() => graphOf(selectedFunction.value));

function handleStatementSelect(statement, multiSelect = false) {
  console.log('📍 Statement selected in Workspace:', statement)
  fileStore.showProperties(statement, multiSelect)
}

function handleDeleteEdge(edge) {
  const userConfirmed = confirm('Are you sure you want to delete this connection?');
  if (!userConfirmed) return;
  fileStore.deleteBodyFlowEdge(selectedFunction.value, edge.id);
}

useAutosave();

const {
  isMainLayerVisible, isFunctionLayerVisible, selectedFunction, toggleLayer, showFunctionLayer,
} = useLayerSwitching({ onToggle: cancelConnection });

useCanvasKeyboardShortcuts(
  { handleZoomIn, handleZoomOut, handleZoomReset, fitToScreen, handleUndo, handleRedo, togglePanMode, isPanMode },
  isMainLayerVisible
);

onMounted(async () => {
  // showing constructor if it exists
  console.log("Constructor:", fileStore.contract._constructor == null)

  // load projects: migrate any legacy single-document save, then open the most recently edited project
  await projectsStore.migrateLegacyLocalStorage();
  await projectsStore.loadProjectList();
  if (projectsStore.projects.length > 0) {
    const mostRecent = projectsStore.projects[0];
    await projectsStore.openProject(mostRecent.id);
    ui.setLastSavedTime(mostRecent.updatedAt);
    console.log("✅ Opened most recently edited project:", mostRecent.name);
  }
});

defineExpose({
  handleExport: () => {
    const dataURL = stageRef.value?.getNode()?.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = 'stage.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});

const onContractCreated = async () => {
  await nextTick();
  const stage = stageRef.value?.getNode();
  if (stage) {
    stage.draw();
    console.log("✅ Contract stage redrawn after creation");
  }
};
</script>

<style scoped>
.workspace {
    flex: 1;
    background-color: #f8f9fa4f;
    background-image: radial-gradient(rgb(202, 202, 202) 1px, transparent 1px);
    background-size: 20px 20px;
    height: 100vh;
}
</style>


<style scoped>
.workspace {
    flex: 1;
    /* Take remaining space */
    background-color: #f8f9fa4f;
    /* Light background */
    background-image: radial-gradient(rgb(202, 202, 202) 1px, transparent 1px);
    background-size: 20px 20px;
    /* Adjust dot spacing */
    height: 100vh;
    /* Full height */
}
</style>