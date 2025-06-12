<template>
    <div v-if="fileStore.contract.name" class="h-full w-full dark:bg-[#F7F7F7] rounded-sm">
        <!-- Back Button for Function Layer -->
        <button v-if="!isMainLayerVisible"
            class="text-left text-black text-xs mx-1 mt-1 flex flex-row items-center space-x-1" @click="toggleLayer">
            <ArrowLeftCircleIcon class="w-5" />
            <span>Back</span>
        </button>

        <div ref="workspaceRef" class="flex flex-row h-full w-full" @dragover.prevent @drop="handleDrop">
            <v-stage ref="stageRef" :key="fileStore.contract.name" :config="stageConfig">
                <!-- Contract Layer -->
                <v-layer>
                    <Contract v-if="fileStore.contract.name" :name="fileStore.contract.name" :x="fileStore.contract.x"
                        :y="fileStore.contract.y" :dimensions="stageConfig" @click="fileStore.clearSelection">
                    </Contract>
                </v-layer>

                <!-- Structural Layer -->
                <v-layer ref="mainLayer" :visible="isMainLayerVisible">
                    <variable v-for="variable in fileStore.contract.variables" :key="variable.name" :data="variable"
                        :x="variable.x" :y="variable.y" :selected="variable.isSelected"
                        @click="fileStore.showProperties" />

                    <struct v-for="struct in fileStore.contract.structs" :key="struct.name" :name="struct.name"
                        :data="struct" :literals="struct.literals" :x="struct.x" :y="struct.y"
                        :selected="struct.isSelected" @click="fileStore.showProperties" />

                    <function v-for="_function in fileStore.contract.functions" :key="_function.name"
                        :name="_function.name" :x="_function.x" :y="_function.y" :data="_function"
                        :params="_function.params" :statements="_function.body.statements"
                        :returnParams="_function.returnParams" :selected="_function.isSelected"
                        @click="fileStore.showProperties" @dblclick="showFunctionLayer(_function)" />

                    <function v-if="fileStore.contract.constructor" name="<<constructor>>"
                        :x="fileStore.contract.constructor.x" :y="fileStore.contract.constructor.y" />
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
        :stageRef="stageRef">
        <div class="flex flex-col gap-2">
            <label for="contractName">Title</label>
            <input type="text" name="contractName" id="contractName"
                class="p-1 outline-none border border-1 rounded focus:border-blue-600" />
        </div>
    </Modal>
</template>




<script setup>
import { computed, nextTick, onMounted, ref, watch, watchEffect } from 'vue';
import Contract from '@/components/palette/scd/Contract.vue'
import Variable from '@/components/palette/scd/Variable.vue'
import Struct from '@/components/palette/scd/Struct.vue'
import Function from '@/components/palette/scd/Function.vue'
import StatementRenderer from './palette/fd/StatementRenderer.vue';
import Modal from './Modal.vue';
import { useContractStorage } from '@/stores/contract'
import { ArrowLeftCircleIcon } from '@heroicons/vue/24/outline';

const fileStore = useContractStorage()

const isMainLayerVisible = ref(true);
const isFunctionLayerVisible = ref(!isMainLayerVisible.value)
const selectedFunction = ref(null)
const showModal = ref(false)
const stageRef = ref(null)
const mainLayer = ref(null)
const functionLayer = ref(null)
const workspaceRef = ref(null)
const widthCanvaRef = ref(0);
const heightCanvaRef = ref(0);

const canvasReady = ref(false)

const stageConfig = computed(() => ({
    width: widthCanvaRef.value,
    height: heightCanvaRef.value
}));

onMounted(async () => {
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
});

const targets = ref([]);
const connectors = ref([]);

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
}

const showFunctionLayer = (func) => {
    fileStore.selectedFunction = func
    selectedFunction.value = func
    toggleLayer()
}

const handleDragMove = () => {
    const layer = functionLayer.value?.getNode();
    if (!layer) return;

    //  Recompute based on current live children
    const children = layer.getChildren().filter(node => node.getType() === 'Group');
    connectors.value = generateConnectors(children);

    layer.draw(); // optional, Konva usually handles this
    functionLayer.value.getNode().getChildren().forEach((node) => {
        const events = node._eventListeners;
        if (events) {
            Object.entries(events).forEach(([type, handlers]) => {
                handlers.forEach((h, i) => {
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
    const from = targets.value.find(t => t._id == connector.from._id);
    const to = targets.value.find(t => t._id == connector.to._id);
    if (!from || !to) return { points: [0, 0, 0, 0] };

    // const stage = stageRef.value.getNode();
    // const fromBox = from.getClientRect({ relativeTo: stage });
    // const toBox = to.getClientRect({ relativeTo: stage });
    const stage = stageRef.value.getNode();
    const fromBox = from.getClientRect({ relativeTo: stage });
    const toBox = to.getClientRect({ relativeTo: stage });

    return {
        id: connector.id,
        points: [
            fromBox.x + fromBox.width / 2,
            fromBox.y + fromBox.height,
            toBox.x + toBox.width / 2,
            toBox.y
        ],
        stroke: 'black',
        fill: 'black'
        // return {
        //     id: connector.id,
        //     points: [
        //         fromBox.x + fromBox.width / 2,
        //         fromBox.y + fromBox.height,
        //         toBox.x + toBox.width / 2,
        //         toBox.y
        //     ],
        //     stroke: 'black',
        //     fill: 'black'
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
// const handleDrop = (event) => {
//     const raw = event.dataTransfer.getData('application/json');
//     if (!raw) return;
//     const item = JSON.parse(raw);

//     const stage = stageRef.value.getNode();
//     const pointerPosition = stage.getPointerPosition();

//     const droppedX = pointerPosition.x;
//     const droppedY = pointerPosition.y;

//     // 🧠 Find target Struct node
//     const layer = mainLayer.value?.getNode();
//     const nodes = layer.getChildren();

//     const targetStruct = nodes.find((node) => {
//         return node.getClassName() === 'Group' &&
//             node.attrs.type === 'Struct' &&
//             node.getClientRect().x <= droppedX &&
//             node.getClientRect().x + node.getClientRect().width >= droppedX &&
//             node.getClientRect().y <= droppedY &&
//             node.getClientRect().y + node.getClientRect().height >= droppedY;
//     });

//     if (targetStruct) {
//         console.log("Dropped on struct:", targetStruct);
//         // Now update the corresponding struct model in fileStore
//         const structName = targetStruct.attrs.name;
//         const struct = fileStore.contract.structs.find(s => s.name === structName);
//         if (struct) {
//             struct.literals.push({ name: item.label, type: "string" });
//         }
//     }
// };

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
            node.attrs.type === 'Struct' &&
            pointerPosition.x >= rect.x &&
            pointerPosition.x <= rect.x + rect.width &&
            pointerPosition.y >= rect.y &&
            pointerPosition.y <= rect.y + rect.height
        );
    });

    if (structNode) {
        const structName = structNode.attrs.name;
        const struct = fileStore.contract.structs.find(s => s.name === structName);
        if (struct) {
            // if (!struct.literals)
            //     struct.literals = []
            struct.literals.push({ name: item.label, type: { base: "string" } }); // Example
            console.log(`Added literal "${item.label}" to struct ${structName}`);
        }
    } else {
        if (item.label == "Struct") {
            console.log("⚠️ struct created")
            fileStore.contract.structs.push({
                name: "new_struct",
                cmp_type: "Struct",

                x: pointerPosition.x,
                y: pointerPosition.y,
                literals: []
            })
        }
        if (item.label == "Variable") {
            fileStore.contract.variables.push({
                name: "new_variable",
                cmp_type: "Variable",
                type: {
                    base: "String"
                },
                x: pointerPosition.x,
                y: pointerPosition.y,
                visibility: "public",
            })
        }
        if (item.label == "Function") {
            fileStore.contract.functions.push({
                name: "new_function",
                cmp_type: "Function",
                x: pointerPosition.x,
                y: pointerPosition.y,
                body: {
                    "type": "Block",
                    "statements": []
                }
            })
        } if (item.label == "Assignment") {
            console.log("creating assignment stmt!");

        }
    }

}

// const handleDrop = (event) => {
//     const item = JSON.parse(event.dataTransfer.getData("application/json"));
//     const stage = stageRef.value.getNode();
//     const pointerPosition = stage.getPointerPosition();

//     const layer = mainLayer.value.getNode();
//     const nodes = layer.getChildren();

//     const structNode = nodes.find((node) => {
//         const rect = node.getClientRect();
//         return (
//             node.attrs.type === 'Struct' &&
//             pointerPosition.x >= rect.x &&
//             pointerPosition.x <= rect.x + rect.width &&
//             pointerPosition.y >= rect.y &&
//             pointerPosition.y <= rect.y + rect.height
//         );
//     });

//     if (structNode) {
//         const structName = structNode.attrs.name;
//         const struct = fileStore.contract.structs.find(s => s.name === structName);
//         if (struct) {
//             struct.literals.push({ name: item.label, type: { base: "string" } }); // Example
//             console.log(`Added literal "${item.label}" to struct ${structName}`);
//         }
//     }
// };
watch(
    () => fileStore.contract.name,
    async (newVal) => {
        if (newVal) {
            await nextTick(); // Wait for DOM
            const workspace = workspaceRef.value;
            if (workspace) {
                widthCanvaRef.value = workspace.offsetWidth || 400;
                heightCanvaRef.value = workspace.offsetHeight || 600;

                nextTick(() => {
                    const stage = stageRef.value?.getNode();
                    if (stage) {
                        stage.setSize({ width: widthCanvaRef.value, height: heightCanvaRef.value });
                        stage.draw();
                        console.log("✅ Stage resized after contract creation");
                    }
                });
            }
        }
    }
);

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