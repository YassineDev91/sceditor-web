<template>
    <div v-if="fileStore.contract.name" class="h-full w-full dark:bg-[#F7F7F7] rounded-sm relative">
        <!-- Back Button for Function Layer -->
        <button v-if="!isMainLayerVisible"
            class="text-left text-black text-xs mx-1 mt-1 flex flex-row items-center space-x-1 relative z-[9999]" @click="toggleLayer">
            <ArrowLeftCircleIcon class="w-5" />
            <span>Back</span>
        </button>

        <!-- Canvas Controls Toolbar (positioned absolutely above canvas) -->
        <CanvasControls :zoom="zoomLevel" :gridEnabled="gridVisible" :snapToGrid="snapToGridEnabled"
            :panMode="isPanMode" :canUndo="fileStore.canUndo" :canRedo="fileStore.canRedo"
            :undoCount="fileStore.undoCount" :redoCount="fileStore.redoCount" @zoom-in="handleZoomIn"
            @zoom-out="handleZoomOut" @zoom-reset="handleZoomReset" @toggle-grid="toggleGrid"
            @toggle-snap="toggleSnapToGrid" @toggle-pan="togglePanMode" @fit-to-screen="fitToScreen"
            @undo="handleUndo" @redo="handleRedo" />

        <div ref="workspaceRef" class="flex flex-row h-full w-full" @dragover.prevent @drop="handleDrop">
            <v-stage ref="stageRef" :key="fileStore.contract.name" :config="stageConfig"
                @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp">
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
                        @click="fileStore.showProperties(variable)" @dragend="(e) => handleScdDragMove(e, variable)" />

                    <struct v-for="struct in fileStore.contract.structs" :key="struct.name" :name="struct.name"
                        :data="struct" :literals="struct.literals" :x="struct.x" :y="struct.y"
                        :selected="isElementSelected(struct)" @click="fileStore.showProperties(struct)" />

                    <function v-for="_function in fileStore.contract.functions" :key="_function.id"
                        :name="_function.name" :x="_function.x" :y="_function.y" :data="_function"
                        :params="_function.params" :statements="_function.body.statements"
                        :returnParams="_function.returnParams" :selected="isElementSelected(_function)"
                        @click="fileStore.showProperties(_function)" @dblclick="showFunctionLayer(_function)"
                        @dragend="(e) => handleScdDragMove(e, _function)" />

                    <function v-if="fileStore.contract._constructor" name="<<constructor>>"
                        :x="fileStore.contract._constructor.x" :y="fileStore.contract._constructor.y"
                        :data="fileStore.contract._constructor" :params="fileStore.contract._constructor.params"
                        :statements="fileStore.contract._constructor.body.statements"
                        :selected="isElementSelected(fileStore.contract._constructor)"
                        @click="fileStore.showProperties(fileStore.contract._constructor)"
                        @dblclick="showFunctionLayer(fileStore.contract._constructor)"
                        @dragend="(e) => handleScdDragMove(e, fileStore.contract._constructor)" />

                    <Enum v-for="enumItem in fileStore.contract.enums" :key="enumItem.name" :name="enumItem.name"
                        :data="enumItem" :x="enumItem.x" :y="enumItem.y" :values="enumItem.values"
                        :selected="isElementSelected(enumItem)" @click="fileStore.showProperties(enumItem)"
                        @dragend="(e) => handleScdDragMove(e, enumItem)" />

                    <Guard v-for="guard in fileStore.contract.guards" :key="guard.id"
                        :name="guard.name" :data="guard" :x="guard.x" :y="guard.y" :params="guard.parameters"
                        :statements="guard.body.statements" :selected="isElementSelected(guard)"
                        @click="fileStore.showProperties(guard)" @dblclick="showFunctionLayer(guard)"
                        @dragend="(e) => handleScdDragMove(e, guard)" />

                    <ErrorDeclaration v-for="_error in fileStore.contract.errorDeclarations" :key="_error.name"
                        :name="_error.name" :data="_error" :x="_error.x" :y="_error.y" :literals="_error.literals"
                        :selected="isElementSelected(_error)" @click="fileStore.showProperties(_error)"
                        @dragend="(e) => handleScdDragMove(e, _error)" />

                    <Event v-for="event in fileStore.contract.events" :key="event.id"
                        :name="event.name" :data="event" :x="event.x" :y="event.y"
                        :selected="isElementSelected(event)" @click="fileStore.showProperties(event)"
                        @dragend="(e) => handleScdDragMove(e, event)" />
                </v-layer>

                <!-- Function Layer -->
                <v-layer ref="functionLayer" :visible="isFunctionLayerVisible" v-if="isFunctionLayerVisible"
                    @vue:mounted="loadFLayersNode">
                    <StatementRenderer v-for="(stmt, index) in selectedFunction.body.statements" :key="stmt.id || index"
                        :statement="stmt" :x="20" :y="80 * index" @dragmove="handleDragMove"
                        @select="handleStatementSelect" />
                    <v-arrow v-for="connector in connectors" :key="connector.id" :config="getArrowConfig(connector)" />
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
import { computed, nextTick, onMounted, ref, watch, watchEffect, onUnmounted } from 'vue';
import Contract from '@/components/palette/scd/Contract.vue'
import Variable from '@/components/palette/scd/Variable.vue'
import Struct from '@/components/palette/scd/Struct.vue'
import Function from '@/components/palette/scd/Function.vue'
import StatementRenderer from './palette/fd/StatementRenderer.vue';
import Modal from './Modal.vue';
import CanvasControls from './CanvasControls.vue';
import { useContractStorage } from '@/stores/contract'
import { useProjectsStore } from '@/stores/projects'
import { useSettingsStore } from '@/stores/settings'
import { ArrowLeftCircleIcon } from '@heroicons/vue/24/outline';
import { useUIStore } from '@/stores/uiStore';
import Enum from './palette/scd/Enum.vue';
import Guard from './palette/scd/Guard.vue';
import ErrorDeclaration from './palette/scd/ErrorDeclaration.vue';
import Event from './palette/scd/Event.vue';

const fileStore = useContractStorage()
const projectsStore = useProjectsStore()
const settingsStore = useSettingsStore()

const isMainLayerVisible = ref(true);
const isFunctionLayerVisible = ref(!isMainLayerVisible.value)
const selectedFunction = ref(null)
const showModal = ref(false)
const newContractName = ref('')
const stageRef = ref(null)
const mainLayer = ref(null)
const functionLayer = ref(null)
const workspaceRef = ref(null)
const widthCanvaRef = ref(0);
const heightCanvaRef = ref(0);

const canvasReady = ref(false)

// Canvas controls state
const zoomLevel = ref(1);
const gridVisible = ref(settingsStore.editor.gridEnabled);
const snapToGridEnabled = ref(settingsStore.editor.snapToGrid);
const isPanMode = ref(false);

const stageConfig = computed(() => ({
    width: widthCanvaRef.value - widthCanvaRef.value * 0.1, // 10% padding
    height: heightCanvaRef.value - heightCanvaRef.value * 0.1, // 10% padding
    // draggable: true,
}));

onMounted(async () => {

    // showing constructor if it exists
    console.log("Constructor:", fileStore.contract._constructor == null)
    const stage = stageRef.value?.getNode();

    await nextTick();
    const workspace = workspaceRef.value;
    if (workspace) {
        widthCanvaRef.value = workspace.offsetWidth;
        heightCanvaRef.value = window.innerHeight;

        await nextTick();
        const workspace = workspaceRef.value;
        if (workspace) {
            widthCanvaRef.value = workspace.offsetWidth;
            heightCanvaRef.value = window.innerHeight;
            canvasReady.value = true;

            nextTick(() => {
                const stage = stageRef.value?.getNode();
                if (stage) {
                    stage.setSize({ width: widthCanvaRef.value, height: heightCanvaRef.value });
                    stage.draw();
                }
            });
        }
    }

    // ------- implementing zoom and pan functionality -------

    if (stage) {
        stage.on("wheel", (e) => {
            e.evt.preventDefault();

            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();

            const scaleBy = 1.05;
            const direction = e.evt.deltaY > 0 ? 1 : -1;
            const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

            stage.scale({ x: newScale, y: newScale });

            // To zoom centered at pointer
            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };

            stage.position(newPos);
            stage.batchDraw();
        });
    }

    // load projects: migrate any legacy single-document save, then open the most recently edited project
    await projectsStore.migrateLegacyLocalStorage();
    await projectsStore.loadProjectList();
    if (projectsStore.projects.length > 0) {
        const mostRecent = projectsStore.projects[0];
        await projectsStore.openProject(mostRecent.id);
        ui.setLastSavedTime(mostRecent.updatedAt);
        console.log("✅ Opened most recently edited project:", mostRecent.name);
    }

    // handle keyboard shortcuts
    window.addEventListener('keyup', handleListKeyPress);
    window.addEventListener('keydown', handleKeyDown);
});

const targets = ref([]);
const connectors = ref([]);

// Selection box state
const selectionBox = ref({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    startX: 0,
    startY: 0
});

// Track if we just completed a drag operation
const justDragged = ref(false);

// Helper function to check if element is selected
const isElementSelected = (element) => {
    const selected = fileStore.selectedElements.includes(element);
    if (selected) {
        console.log(`✨ isElementSelected(${element.name}): ${selected}`);
    }
    return selected;
};

const loadFLayersNode = () => {
    const layer = functionLayer.value?.getNode();
    if (!layer) return;
    targets.value = layer.getChildren();
    connectors.value = generateConnectors(targets.value);
};

const toggleLayer = () => {
    fileStore.scdStage = !fileStore.scdStage
    isMainLayerVisible.value = !isMainLayerVisible.value
    isFunctionLayerVisible.value = !isFunctionLayerVisible.value
    connectors.value = []
    targets.value = []

    // autoLayout(fileStore.contract.structs);
    // autoLayout(fileStore.contract.variables, 0, 200); // optional offset
    // autoLayout(fileStore.contract.functions, 0, 400);
}

const showFunctionLayer = (func) => {
    fileStore.selectedFunction = func
    selectedFunction.value = func
    console.log("🔍 Selected function:", func);
    toggleLayer()
}

// handle SCD positions
const handleScdDragMove = (e, cmp) => {
    const node = e.target;


    if (!node?.id) {
        console.warn("⚠️ SCD element missing data.id:", node);
        return;
    }

    const { x, y } = node.position();

    cmp.x = x
    cmp.y = y

    // Save history after drag
    fileStore.saveHistory();
};

const handleDragMove = () => {
    const layer = functionLayer.value?.getNode();
    if (!layer) return;

    const children = layer.getChildren().filter(node => node.getType() === 'Group');

    // 💡 Enforce bounds for each draggable group
    children.forEach((node) => {
        if (!node.draggable()) return;

        const width = node.width?.() || node.getClientRect().width;
        const height = node.height?.() || node.getClientRect().height;

        const { x, y } = keepWithinBounds(node.x(), node.y(), width, height);

        node.position({ x, y });
    });

    connectors.value = generateConnectors(children);
    layer.draw();

    // 🕵️‍♂️ Debug handler issues
    functionLayer.value.getNode().getChildren().forEach((node) => {
        const events = node._eventListeners;
        if (events) {
            Object.entries(events).forEach(([type, handlers]) => {
                handlers.forEach((h) => {
                    if (typeof h.handler !== 'function') {
                        console.warn("💥 Faulty handler:", { node, type, handler: h.handler });
                    }
                });
            });
        }
    });
};


const generateConnectors = (nodes) => {
    const results = [];
    for (let index = 0; index < nodes.length - 1; index++) {
        const from = nodes[index];
        const to = nodes[index + 1];
        const fromPos = from.getAbsolutePosition();
        const toPos = to.getAbsolutePosition();

        const connector = {
            id: from._id + '-' + to._id,
            points: [
                fromPos.x + from.width() / 2,
                fromPos.y + from.height(),
                toPos.x + to.width() / 2,
                toPos.y
            ],
            stroke: 'black',
            fill: 'black',
            from,
            to
        };

        results.push(connector);
    }
    return results;
};

const getArrowConfig = (connector) => {
    const from = targets.value.find(t => t._id === connector.from._id);
    const to = targets.value.find(t => t._id === connector.to._id);
    if (!from || !to) return { points: [0, 0, 0, 0] };

    const stage = stageRef.value.getNode();
    const fromBox = from.getClientRect({ relativeTo: stage });
    const toBox = to.getClientRect({ relativeTo: stage });

    const fromX = fromBox.x + fromBox.width / 2;
    const fromY = fromBox.y + fromBox.height;
    const toX = toBox.x + toBox.width / 2;
    const toY = toBox.y;

    const midY = (fromY + toY) / 2; // for a vertical step

    return {
        id: connector.id,
        points: [
            fromX, fromY, // start point (center bottom of source)
            fromX, midY,  // vertical step
            toX, midY,    // horizontal step
            toX, toY      // down to top of target
        ],
        stroke: 'black',
        fill: 'black',
        pointerLength: 8,
        pointerWidth: 8,
        tension: 0,
        lineCap: 'round',
        lineJoin: 'round'
    };
};

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

const handleDrop = (event) => {
    console.log("📦 Drop event fired");

    const raw = event.dataTransfer.getData("application/json");
    if (!raw) {
        console.warn("❌ No dataTransfer payload found");
        return;
    }

    const item = JSON.parse(raw);
    console.log("🎯 Dropped item:", item);

    const stage = stageRef.value.getNode();
    const rect = stageRef.value.$el.getBoundingClientRect();
    const pointerPosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }; console.log("🧭 Pointer position:", pointerPosition);

    const layer = mainLayer.value.getNode();
    const nodes = layer.getChildren();

    const structNode = nodes.find((node) => {
        const rect = node.getClientRect();
        return (
            (node.attrs.type === 'Struct') &&
            pointerPosition.x >= rect.x &&
            pointerPosition.x <= rect.x + rect.width &&
            pointerPosition.y >= rect.y &&
            pointerPosition.y <= rect.y + rect.height
        );
    });

    if (structNode) {
        const structName = structNode.attrs.name;
        const struct = fileStore.contract.structs.find(s => s.name === structName);
        if (struct && item.label === "Literal") {
            if (!struct.literals) {
                struct.literals = [];
            }
            struct.literals.push({
                name: "new_literal",
                type: { kind: "primitive", name: "string" },
                visibility: "public"
            });
            console.log(`✅ Added literal to struct ${structName}`);
        }
    } else {
        if (item.label == "Struct") {
            fileStore.createStructElement(pointerPosition);
        }
        if (item.label == "Variable") {
            fileStore.createVariableElement(pointerPosition);
        }
        if (item.label == "Function") {
            fileStore.createFunctionElement(pointerPosition);
        } if (item.label == "Assignment") {
            console.log("creating assignment stmt!");

        }
    }

}

watch(
    () => fileStore.contract.name,
    async (newVal) => {
        if (newVal) {
            await nextTick(); // Wait for DOM
            const workspace = workspaceRef.value;
            if (workspace) {
                widthCanvaRef.value = workspace.offsetWidth;
                heightCanvaRef.value = workspace.offsetHeight;

                nextTick(() => {
                    const stage = stageRef.value?.getNode();
                    if (stage) {
                        stage.setSize({ width: widthCanvaRef.value, height: heightCanvaRef.value });
                        stage.batchDraw();
                        console.log("✅ Stage resized after contract creation",
                            widthCanvaRef.value, heightCanvaRef.value);
                    }
                });
            }
        }
    }
);

const ui = useUIStore();

// Watch for zoom changes
watch(() => ui.stageScale, (newScale) => {
    const stage = stageRef.value?.getNode();
    if (stage) {
        stage.scale({ x: newScale, y: newScale });
        stage.batchDraw();
        console.log("✅ Stage zoom updated to:", newScale);
    }
});

// Debounced autosave function
let saveTimeout = null;
const saveContract = async () => {
    try {
        ui.setSaving(true);
        await projectsStore.saveActiveProject();
        const now = Date.now();
        ui.setLastSavedTime(now);
        console.log("💾 Contract autosaved");
        setTimeout(() => ui.setSaving(false), 500); // Show saving indicator briefly
    } catch (error) {
        console.error("❌ Failed to save contract:", error);
        ui.setSaving(false);
    }
};

// Watch diagram state to save it (deep watch with debouncing)
watch(
    () => fileStore.contract,
    () => {
        // Debounce saves to avoid excessive writes
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveContract, 1000); // Save 1 second after last change
    },
    { deep: true } // Watch nested properties
)

// Watch selections and force Konva redraw
watch(
    () => fileStore.selectedElements,
    () => {
        nextTick(() => {
            const stage = stageRef.value?.getNode();
            const layer = mainLayer.value?.getNode();
            if (stage) {
                if (layer) {
                    layer.batchDraw();
                }
                stage.batchDraw();
                console.log("🔄 Forced redraw after selection change");
            }
        });
    },
    { deep: true }
)


const onContractCreated = async () => {
    await nextTick();
    const stage = stageRef.value?.getNode();
    if (stage) {
        stage.draw();
        console.log("✅ Contract stage redrawn after creation");
    }
};

function handleStatementSelect(statement) {
    console.log('📍 Statement selected in Workspace:', statement)
    fileStore.showProperties(statement)
}


const padding = 20;
const spacingX = 180;
const spacingY = 120;
const stageWidth = widthCanvaRef.value;
const stageHeight = heightCanvaRef.value;

function autoLayout(elements, startX = 0, startY = 0) {
    let x = startX;
    let y = startY;
    let rowHeight = 0;

    elements.forEach((element, index) => {
        // Prevent overflow, go to new row if needed
        if (x + spacingX > stageWidth - padding) {
            x = startX;
            y += rowHeight + spacingY;
            rowHeight = 0;
        }

        // Assign new positions
        element.x = x;
        element.y = y;

        // Track max height in row for next row offset
        rowHeight = Math.max(rowHeight, spacingY);

        x += spacingX;
    });
}

// keep cmps within boundaries
function keepWithinBounds(x, y, width, height) {
    const maxX = widthCanvaRef.value - width;
    const maxY = heightCanvaRef.value - height;

    return {
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY))
    };
}
// Mouse drag selection handlers
const handleMouseDown = (e) => {
    const stage = stageRef.value?.getNode();
    if (!stage) return;

    const target = e.target;
    console.log("🖱️ MouseDown on:", target.getType?.(), target.attrs?.name || target.parent?.attrs?.name);

    // Check if we clicked on a draggable element (our components have draggable: true)
    // If the target or its parent is draggable, it's a component - don't start selection
    const isTargetDraggable = target.draggable && target.draggable();
    const isParentDraggable = target.parent && target.parent.draggable && target.parent.draggable();

    // Don't start selection if we clicked on a draggable component
    if (isTargetDraggable || isParentDraggable) {
        return;
    }

    const pos = stage.getPointerPosition();
    const scale = stage.scaleX();

    selectionBox.value.visible = true;
    selectionBox.value.startX = (pos.x - stage.x()) / scale;
    selectionBox.value.startY = (pos.y - stage.y()) / scale;
    selectionBox.value.x = selectionBox.value.startX;
    selectionBox.value.y = selectionBox.value.startY;
    selectionBox.value.width = 0;
    selectionBox.value.height = 0;

    console.log("📍 Selection start:", { startX: selectionBox.value.startX, startY: selectionBox.value.startY });
};

const handleMouseMove = (e) => {
    if (!selectionBox.value.visible) return;

    const stage = stageRef.value?.getNode();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    const scale = stage.scaleX();

    const currentX = (pos.x - stage.x()) / scale;
    const currentY = (pos.y - stage.y()) / scale;

    // Calculate rectangle dimensions
    const x = Math.min(selectionBox.value.startX, currentX);
    const y = Math.min(selectionBox.value.startY, currentY);
    const width = Math.abs(currentX - selectionBox.value.startX);
    const height = Math.abs(currentY - selectionBox.value.startY);

    selectionBox.value.x = x;
    selectionBox.value.y = y;
    selectionBox.value.width = width;
    selectionBox.value.height = height;
};

const handleMouseUp = () => {
    console.log("⬆️ MouseUp - selectionBox.visible:", selectionBox.value.visible);
    if (!selectionBox.value.visible) return;

    // Check if we actually dragged (moved more than 5 pixels)
    const wasDrag = selectionBox.value.width > 5 || selectionBox.value.height > 5;

    if (wasDrag) {
        // Select elements within the selection box
        selectElementsInBox();

        // Set flag to prevent click event from clearing selection
        justDragged.value = true;
        setTimeout(() => {
            justDragged.value = false;
        }, 100); // Reset after 100ms
    }

    // Hide selection box
    selectionBox.value.visible = false;
    console.log("🔲 Selection box hidden");
};

const selectElementsInBox = () => {
    if (selectionBox.value.width < 5 && selectionBox.value.height < 5) {
        // If box is too small, treat as click - clear selection
        fileStore.clearSelection();
        return;
    }

    const box = selectionBox.value;
    console.log("📦 Selection box:", {
        x: box.x.toFixed(2),
        y: box.y.toFixed(2),
        width: box.width.toFixed(2),
        height: box.height.toFixed(2)
    });

    const allElements = [
        ...fileStore.contract.variables || [],
        ...fileStore.contract.structs || [],
        ...fileStore.contract.functions || [],
        ...fileStore.contract.enums || [],
        ...fileStore.contract.guards || [],
        ...fileStore.contract.errorDeclarations || [],
        ...fileStore.contract.events || [],
    ];

    if (fileStore.contract._constructor) {
        allElements.push(fileStore.contract._constructor);
    }

    fileStore.clearSelection();

    // Check each element for intersection with selection box
    allElements.forEach(element => {
        if (element.x !== undefined && element.y !== undefined) {
            // Simple bounding box intersection
            // Assume element width ~150-200, height ~50-150
            const elemWidth = 160;
            const elemHeight = 100;

            const intersects = !(
                element.x > box.x + box.width ||
                element.x + elemWidth < box.x ||
                element.y > box.y + box.height ||
                element.y + elemHeight < box.y
            );

            console.log(`🔍 Element "${element.name}" at (${element.x}, ${element.y}): ${intersects ? '✅ SELECTED' : '❌ not selected'}`);

            if (intersects) {
                fileStore.addToSelection(element);
            }
        }
    });

    console.log(`✅ Selected ${fileStore.selectedElements.length} element(s)`);
};

// handle keyboard shortcuts
const handleKeyDown = (event) => {
    // CTRL+A or CMD+A to select all
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault(); // Prevent browser's default select all
        if (isMainLayerVisible.value) {
            fileStore.selectAll();
        }
    }
};

// Handle Contract click - only clear selection if we didn't just drag
const handleContractClick = () => {
    if (!justDragged.value) {
        console.log("📋 Contract clicked - clearing selection");
        fileStore.clearSelection();
    } else {
        console.log("🚫 Contract clicked but drag just happened - keeping selection");
    }
};

// handle element delete
const handleListKeyPress = (event) => {
    if (event.key === 'Delete') {
        fileStore.deleteElement();
    }
}

// ==================== Canvas Controls Handlers ====================

// Zoom handlers
const handleZoomIn = () => {
    const stage = stageRef.value?.getNode();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const newScale = oldScale * 1.2;

    // Center zoom at center of stage
    const center = {
        x: widthCanvaRef.value / 2,
        y: heightCanvaRef.value / 2
    };

    const mousePointTo = {
        x: (center.x - stage.x()) / oldScale,
        y: (center.y - stage.y()) / oldScale,
    };

    const newPos = {
        x: center.x - mousePointTo.x * newScale,
        y: center.y - mousePointTo.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
    zoomLevel.value = newScale;

    // Save to history after significant zoom changes
    if (Math.abs(newScale - oldScale) > 0.1) {
        fileStore.saveHistory();
    }
};

const handleZoomOut = () => {
    const stage = stageRef.value?.getNode();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const newScale = Math.max(0.1, oldScale / 1.2); // Don't zoom out too much

    const center = {
        x: widthCanvaRef.value / 2,
        y: heightCanvaRef.value / 2
    };

    const mousePointTo = {
        x: (center.x - stage.x()) / oldScale,
        y: (center.y - stage.y()) / oldScale,
    };

    const newPos = {
        x: center.x - mousePointTo.x * newScale,
        y: center.y - mousePointTo.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
    zoomLevel.value = newScale;

    // Save to history after significant zoom changes
    if (Math.abs(newScale - oldScale) > 0.1) {
        fileStore.saveHistory();
    }
};

const handleZoomReset = () => {
    const stage = stageRef.value?.getNode();
    if (!stage) return;

    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
    stage.batchDraw();
    zoomLevel.value = 1;

    fileStore.saveHistory();
};

const fitToScreen = () => {
    const stage = stageRef.value?.getNode();
    if (!stage) return;

    const layer = mainLayer.value?.getNode();
    if (!layer) return;

    // Get all nodes to calculate bounds
    const allElements = [
        ...fileStore.contract.variables || [],
        ...fileStore.contract.structs || [],
        ...fileStore.contract.functions || [],
        ...fileStore.contract.enums || [],
        ...fileStore.contract.guards || [],
        ...fileStore.contract.errorDeclarations || [],
        ...fileStore.contract.events || [],
    ];

    if (fileStore.contract._constructor) {
        allElements.push(fileStore.contract._constructor);
    }

    if (allElements.length === 0) {
        handleZoomReset();
        return;
    }

    // Find bounding box of all elements
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    allElements.forEach(el => {
        if (el.x !== undefined && el.y !== undefined) {
            minX = Math.min(minX, el.x);
            minY = Math.min(minY, el.y);
            maxX = Math.max(maxX, el.x + 200); // Approximate element width
            maxY = Math.max(maxY, el.y + 100); // Approximate element height
        }
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    // Calculate scale to fit content with padding
    const padding = 50;
    const scaleX = (widthCanvaRef.value - padding * 2) / contentWidth;
    const scaleY = (heightCanvaRef.value - padding * 2) / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%

    // Center the content
    const offsetX = (widthCanvaRef.value - contentWidth * scale) / 2 - minX * scale;
    const offsetY = (heightCanvaRef.value - contentHeight * scale) / 2 - minY * scale;

    stage.scale({ x: scale, y: scale });
    stage.position({ x: offsetX, y: offsetY });
    stage.batchDraw();
    zoomLevel.value = scale;

    fileStore.saveHistory();
};

// Grid and snap handlers
const toggleGrid = () => {
    gridVisible.value = !gridVisible.value;
    settingsStore.updateEditorPreferences({ gridEnabled: gridVisible.value });
};

const toggleSnapToGrid = () => {
    snapToGridEnabled.value = !snapToGridEnabled.value;
    settingsStore.updateEditorPreferences({ snapToGrid: snapToGridEnabled.value });
};

// Pan mode handler
const togglePanMode = () => {
    isPanMode.value = !isPanMode.value;
    const stage = stageRef.value?.getNode();
    if (stage) {
        stage.draggable(isPanMode.value);
    }
};

// Undo/Redo handlers
const handleUndo = () => {
    fileStore.undo();
};

const handleRedo = () => {
    fileStore.redo();
};

// Enhanced keyboard shortcuts
const handleCanvasKeyboard = (event) => {
    // Zoom shortcuts
    if (event.ctrlKey || event.metaKey) {
        if (event.key === '=' || event.key === '+') {
            event.preventDefault();
            handleZoomIn();
        } else if (event.key === '-' || event.key === '_') {
            event.preventDefault();
            handleZoomOut();
        } else if (event.key === '0') {
            event.preventDefault();
            handleZoomReset();
        } else if (event.key === 'f' || event.key === 'F') {
            event.preventDefault();
            fitToScreen();
        } else if (event.key === 'z' && !event.shiftKey) {
            event.preventDefault();
            handleUndo();
        } else if (event.key === 'z' && event.shiftKey) {
            event.preventDefault();
            handleRedo();
        } else if (event.key === 'y') {
            event.preventDefault();
            handleRedo();
        }
    }

    // Pan mode toggle with Space
    if (event.key === ' ' && !event.repeat) {
        event.preventDefault();
        togglePanMode();
    }
};

// Add keyboard listeners
onMounted(() => {
    window.addEventListener('keydown', handleCanvasKeyboard);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleCanvasKeyboard);
});
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