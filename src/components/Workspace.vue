<template>
    {{ fileStore.stage }}
    <div v-if="fileStore.contract.name" class="h-full w-full dark:bg-slate-200 rounded-sm">
        <button class="text-left text-black text-xs mx-1 mt-1 flex flex-row items-center space-x-1" @click="toggleLayer"
            v-if="!isMainLayerVisible">
            <ArrowLeftCircleIcon class="w-5"></ArrowLeftCircleIcon>
            <span>Back</span>
        </button>
        <div class=" flex flex-row">
            <v-stage ref="stageRef" :config="{ width: 970, height: 720 }">
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
                        :params="_function.params" :statements="_function.body" :_return='_function._return'
                        @click="fileStore.showProperties" @dblclick="showFunctionLayer(_function)"
                        :selected="_function.isSelected" />

                    <function v-if="fileStore.contract.constructor" :name="fileStore.contract.constructor.name"
                        :x="fileStore.contract.constructor.x" :y="fileStore.contract.constructor.y" />

                </v-layer>

                <v-layer ref="functionLayer" :visble="isFunctionLayerVisible" v-if="isFunctionLayerVisible"
                    @vue:mounted="loadFLayersNode">

                    <Statement v-for="(statement, index) in selectedFunction.body" :x="50" :y="110 * (index + 1)"
                        :expressions="statement.expressions" :type="statement.type" @dragmove="handleDragMove" />

                    <v-arrow v-for="connector in connectors" :config="connector">

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

const loadFLayersNode = () => {
    const layer = functionLayer.value.getNode();

    targets.value = layer.getChildren()

    // targets.value = generateTargets(layer.getChildren())
    // connectors.value = generateConnectors(layer.getChildren())

    defineTargetsOnNodes(targets.value)



    // console.log("Connectors:", connectors.value);

}

// for connecting nodes
const targets = ref([]);
const connectors = ref([]);

const toggleLayer = () => {
    fileStore.scdStage = !fileStore.scdStage
    isMainLayerVisible.value = !isMainLayerVisible.value
    isFunctionLayerVisible.value = !isFunctionLayerVisible.value


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
// ------------- Connecting nodes begin ----------------------------------
// Generate initial targets
// const generateTargets = (targets) => {


//     const result = [];
//     for (let index = 0; index < targets.length; index++) {

//         targets[index].id = 'target-' + result.length
//         result.push(targets[index])

//     }
//     return result;
// };

// const generateConnectors = (targets) => {
//     const result = [];
//     console.log('number of nodes: ' + targets.length);
//     console.log(targets);

//     for (let index = 0; index < targets.length ; index++) {
//         const from = 'target-' + index;
//         const to = 'target-' + index + 1;
//         result.push({
//             id: 'connector-' + result.length,
//             from,
//             to,
//         });
//     }

//     // while (result.length < targets.length) {
//     //     const from = 'target-' + Math.floor(Math.random() * targets.length);
//     //     const to = 'target-' + Math.floor(Math.random() * targets.length);
//     //     if (from === to) {
//     //         continue;
//     //     }

//     // }
//     // result.forEach((e) => {
//     //     console.log(e)
//     // })
//     return result;
// };

// not used
// const getConnectorPoints = (from, to) => {
//     const dx = from.attrs?.x - to.attrs?.x
//     const dy = from.attrs?.y - to.attrs?.y

//     let angle = Math.atan2(-dy, dx);

//     const radius = 50;


//     const points = [
//         // from.children[1].attrs?.x + -radius * Math.cos(angle + Math.PI),
//         // from.children[1].attrs?.y + radius * Math.sin(angle + Math.PI),
//         // to.children[1].attrs?.x + -radius * Math.cos(angle),
//         // to.children[1].attrs?.y + radius * Math.sin(angle),
//         from.attrs?.x,
//         from.attrs?.y,
//         to.attrs?.x,
//         to.attrs?.y
//     ]
//     console.log('x1', Math.round(points[0]), 'y1', points[1], 'x2', points[2], 'y2', points[3])
//     // console.log('y : ',angle);

//     return points
// }

// const getArrowConfig = (connector) => {

//     let fromNode = targets.value.find((t) => t.id == connector.from);
//     let toNode = targets.value.find((t) => t.id == connector.to);


//     // console.log("from", fromNode.children[0].attrs.x);
//     // console.log("to", toNode.children[0].attrs.x);


//     // console.log(targets.value.find((t) => console.log(t.id)));
//     // console.log("getting connector points ", fromNode, toNode)
//     // console.log('x1', Math.round(points[0]),'y1',points[1],'x2',points[2],'y2',points[3])

//     // var points = [10, 20, 30, 50]
//     // if (fromNode.attrs.x && toNode.attrs.x)

//     var points = [
//         fromNode.attrs?.x + 100,
//         fromNode.attrs?.y + 105,
//         toNode.attrs?.x + 100,
//         toNode.attrs?.y + 200
//     ]

//     console.log('x1', Math.round(points[0]), 'y1', points[1], 'x2', points[2], 'y2', points[3])

//     const connectorConfig = {
//         id: connector.id,
//         points: points,
//         fill: 'black',
//         stroke: 'black',
//         draggable: true
//     };

//     // console.log('connector config:', connectorConfig.id)
//     return connectorConfig
// };

// const handleDragMove = (e) => {
//     const id = e.target.id;
//     console.log("---------------------------before map---------------------------");

//     targets.value = targets.value.map((target) =>
//         target.id === id
//             ? { ...target, x: e.target.attrs.x, y: e.target.attrs.y }
//             : target
//     );
//     console.log("---------------------------after map---------------------------");

//     // console.log('dragMove: ', targets.value[0].attrs?.x)

// };

/*  
    ********************************************************************* 
    ---------------------- my way for linking nodes ----------------
    ********************************************************************* 
*/

const defineTargetsOnNodes = (nodes) => {

    for (let index = 1; index < nodes.length - 1; index++) {


        const from = nodes[index];
        const to = nodes[index + 1]

        console.log(from.getClassName())


        const connector = {
            points: [from.x() + 150, from.y() + 100 * index, to.x() + 150, to.y() + 100 * index],
            stroke: 'black',
            fill: 'black',
        }

        console.log(connector.points)
        connectors.value.push(connector)

    }

}

const handleDragMove = (e) => {
    const id = e.target.id;

    // targets.value = targets.value.map((target) =>
    //     target.id === id
    //         ? { ...target, x: e.target.x(), y: e.target.y() }
    //         : target
    // );

    targets.value = targets.value.map((target) => {

        if (target._id == e.target._id) {
            console.log("e", e.target._id)
            console.log("target", target._id)
            console.log("x", e.target.x(), 'y', e.target.y())
            return { ...target, x: e.target.x(), y: e.target.y() }

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