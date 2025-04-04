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
                    <contract :name="fileStore.contract.name" :x="fileStore.contract.x" :y="fileStore.contract.y" />
                </v-layer>
                <v-layer ref="mainLayer" :visible="isMainLayerVisible">
                    <variable v-for="variable in fileStore.contract.variables" :key="variable.name"
                        :name="variable.name" :data="variable" :x="variable.x" :y="variable.y"
                        @click="fileStore.showProperties" />

                    <struct v-for="struct in fileStore.contract.structs" :key="struct.name" :name="struct.name"
                        :literals="struct.literals" :x="struct.x" :y="struct.y" @click="fileStore.showProperties" />

                    <function v-for="_function in fileStore.contract.functions" :key="_function.name"
                        :name="_function.name" :x="_function.x" :y="_function.y" :params="_function.params"
                        :statements="_function.body" :_return='_function._return' @click="fileStore.showProperties"
                        @dblclick="showFunctionLayer(_function)" />

                    <function v-if="fileStore.contract.constructor" :name="fileStore.contract.constructor.name"
                        :x="fileStore.contract.constructor.x" :y="fileStore.contract.constructor.y" />

                </v-layer>

                <v-layer :visble="isFunctionLayerVisible" v-if="isFunctionLayerVisible">

                    <AssignmentStatement
                        v-for="(assignmentStatement, index) in selectedFunction.body.filter(elm => elm.type == 'AssignmentStatement')"
                        :x="50" :y="110 * (index + 1)" :expressions="assignmentStatement.expressions" />
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
import { ref } from 'vue';
import Contract from '@/components/palette/scd/Contract.vue'
import Variable from '@/components/palette/scd/Variable.vue'
import Struct from '@/components/palette/scd/Struct.vue'
import Function from '@/components/palette/scd/Function.vue'
import AssignmentStatement from '@/components/palette/fd/AssignmentStatement.vue'
import Modal from './Modal.vue';
import { useContractStorage } from '@/stores/contract'
import { ArrowLeftCircleIcon, CheckBadgeIcon } from '@heroicons/vue/24/outline';

var fileStore = useContractStorage()

var isMainLayerVisible = ref(true);
var isFunctionLayerVisible = ref(!isMainLayerVisible.value)
var selectedFunction = ref(null)
const showModal = ref(false)
const stageRef = ref(null)

const toggleLayer = () => {
    fileStore.scdStage = !fileStore.scdStage
    isMainLayerVisible.value = !isMainLayerVisible.value
    isFunctionLayerVisible.value = !isFunctionLayerVisible.value

}

const showFunctionLayer = (func) => {
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