<template>
    {{ fileStore.stage }}
    <div v-if="fileStore.contract.name" class="h-full w-full dark:bg-slate-200 rounded-sm">
        <button class="text-left text-black text-xs mx-1 mt-1 flex flex-row items-center space-x-1" @click="toggleLayer"
            v-if="!isMainLayerVisible">
            <ArrowLeftCircleIcon class="w-5"></ArrowLeftCircleIcon>
            <span>Back</span>
        </button>
        <div class=" flex flex-row">
            <v-stage ref="stageRef" :config="{ width: getWindowWidth(), height: getWindowHeight() }">
                <v-layer>
                    <contract :name="fileStore.contract.name" :x="fileStore.contract.x" :y="fileStore.contract.y"
                        @click="fileStore.clearSelection" />
                </v-layer>
                <v-layer ref="mainLayer" :visible="isMainLayerVisible">
                    <variable v-for="variable in fileStore.contract.variables" :key="variable.name"
                        :name="variable.name" :data="variable" :x="variable.x" :y="variable.y"
                        @click="fileStore.showProperties" :selected="variable.isSelected" />

                    <struct v-for="struct in fileStore.contract.structs" :key="struct.name" :name="struct.name"
                        :data="struct" :literals="struct.literals" :x="struct.x" :y="struct.y"
                        @click="fileStore.showProperties" :selected="struct.isSelected" />

                    <function v-for="_function in fileStore.contract.functions" :key="_function.name"
                        :name="_function.name" :x="_function.x" :y="_function.y" :data="_function"
                        :params="_function.params" :statements="_function.body" :returnParams='_function.returnParams'
                        @click="fileStore.showProperties" @dblclick="showFunctionLayer(_function)"
                        :selected="_function.isSelected" />

                    <function v-if="fileStore.contract.constructor" name="<<constructor>>"
                        :x="fileStore.contract.constructor.x" :y="fileStore.contract.constructor.y" />

                </v-layer>

                <v-layer ref="functionLayer" :visble="isFunctionLayerVisible" v-if="isFunctionLayerVisible"
                    @vue:mounted="loadFLayersNode">

                    <Statement v-for="(statement, index) in selectedFunction.body" :x="50" :y="70*index"
                        :expressions="statement.expressions" :type="statement.type" @dragmove="handleDragMove" />

                    <v-arrow v-for="connector in connectors" :config="getArrowConfig(connector)">

                    </v-arrow>
                </v-layer>
            </v-stage>

        </div>
    </div>
    <div v-if="!fileStore.contract.name"
        class="h-full w-full dark:bg-slate-300 rounded-sm workspace flex items-center justify-center">

        <button @click="showModal = true"
            class=" w-20 h-20 border px-3 py-2 text-xl items-center text-center dark:bg-gray-500 dark:hover:bg-gray-600 bg-white hover:bg-slate-100 border-dashed border-black text-gray-400 rounded-sm">+
        </button>

    </div>

    <Modal v-model:open="showModal" title="New Smart Contract Diagram">
        <div class="flex flex-col gap-2">
            <label for="contractName">Title</label>
            <input type="text" name="contractName" id="contractName"
                class="p-1 outline-none border border-1 rounded focus:border-blue-600">
        </div>
    </Modal>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Contract from '@/components/palette/scd/Contract.vue'
import Variable from '@/components/palette/scd/Variable.vue'
import Struct from '@/components/palette/scd/Struct.vue'
import Function from '@/components/palette/scd/Function.vue'
import AssignmentStatement from '@/components/palette/fd/AssignmentStatement.vue'
import Modal from './Modal.vue';
import { useContractStorage } from '@/stores/contract'
import { ArrowLeftCircleIcon, CheckBadgeIcon } from '@heroicons/vue/24/outline';
import Statement from './palette/fd/Statement.vue';
import { Tag } from 'konva/lib/shapes/Label';

var fileStore = useContractStorage()

var isMainLayerVisible = ref(true);
var isFunctionLayerVisible = ref(!isMainLayerVisible.value)
var selectedFunction = ref(null)
const showModal = ref(false)
const stageRef = ref(null)
const mainLayer = ref(null)
const functionLayer = ref(null)
// on mount load layers

onMounted(() => {
    const layer = mainLayer.value;

})
const getWindowWidth = () => {
    return window.innerWidth
}
const getWindowHeight = () => {
    return window.innerHeight
}
const loadFLayersNode = () => {
    const layer = functionLayer.value.getNode();

    targets.value = layer.getChildren()

    // targets.value = generateTargets(layer.getChildren())
    connectors.value = generateConnectors(layer.getChildren())

    console.log('number of connections:', connectors.value.length);




    // console.log("Connectors:", connectors.value);

}

// for connecting nodes
var targets = ref([]);
var connectors = ref([]);

const toggleLayer = () => {
    fileStore.scdStage = !fileStore.scdStage
    isMainLayerVisible.value = !isMainLayerVisible.value
    isFunctionLayerVisible.value = !isFunctionLayerVisible.value

    connectors.value = []
    targets.value=[]

    // generateConnectors(selectedFunction.body)

}
const showFunctionLayer = (func) => {
    fileStore.selectedFunction = func
    selectedFunction = func
    toggleLayer()
}

const handleExport = () => {
    const dataURL = stageRef.value.getNode().toDataURL({
        pixelRatio: 2 // double resolution
    });

    const link = document.createElement('a');
    link.download = 'stage.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/*  
    ********************************************************************* 
    ---------------------- my way for linking nodes ----------------
    ********************************************************************* 
*/

const generateConnectors = (nodes) => {

    const results = []
    for (let index = 0; index < nodes.length - 1; index++) {


        const from = nodes[index];
        const to = nodes[index + 1]

        console.log(from.getClassName(), 'x', from.x(), 'y', from.y())



        const offsetX = 100
        const offsetY = 70
        const connector = {
            id: from._id + '' + to._id,
            points: [from.x() + offsetX, from.y() + offsetY, to.x() + offsetX, to.y() + offsetY],
            stroke: 'black',
            fill: 'black',
        }


        console.log(connector.points)
        connector.from = from
        connector.to = to
        results.push(connector)

    }
    return results
}

// getting arrow config
const getArrowConfig = (connector) => {
    const fromNode = targets.value.find((t) => t._id == connector.from._id)
    const toNode = targets.value.find((t) => t._id == connector.to._id)

    if (!fromNode || !toNode) return { points: [0, 0, 0, 0] };
    console.log(connector.from._id)
    let points = getConnectorPoints(fromNode, toNode)
    console.log('points', points)
    return {
        id: connector.id,
        points: points,
        fill: 'black',
        stroke: 'black',
    };

}
const getConnectorPoints = (from, to) => {

    const dx = to.x() - from.x();
    const dy = to.y() - from.y();
    let angle = Math.atan2(-dy, dx);

    const radius = 50;


    let index = targets.value.indexOf(from)

    const offsetX = 150
    const offsetY = 100 + 70 * (index)

    return [
        from.x() + offsetX,
        from.y() + offsetY,
        to.x() + offsetX,
        to.y() + offsetY-35,
    ];

}
const handleDragMove = (e) => {
    const id = e.target._id;

    targets.value = targets.value.map((target) => {
        if (target._id === id) {
            target.x(e.target.x())
            target.y(e.target.y())

        }
        return target
    }
    );

};
// ------------- Connecting nodes end -------------------------------
defineExpose({
    handleExport
})

</script>

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