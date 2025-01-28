<template>
  <div class="flex flex-col">
    <Palette class="mb-2"></Palette>
    <div class="flex flex-row">
      <v-stage :config="{ width: 700, height: 720 }">
        <v-layer>

          <contract :name="fileStore.contract.name" :x="fileStore.contract.x" :y="fileStore.contract.y">

          </contract>
          <!-- <variable v-for="variable in fileStore.contract.variables" :key="variable.name" :name="variable.name"
            :data="variable" :x="variable.x" :y="variable.y" @click="fileStore.showProperties" />
          <struct v-for="struct in fileStore.contract.structs" :key="struct.name" :name="struct.name"
            :literals="struct.literals" :x="struct.x" :y="struct.y" @click="fileStore.showProperties" />
          <function v-for="_function in fileStore.contract.functions" :key="_function.name" :name="_function.name"
            :x="_function.x" :y="_function.y" :params="_function.params" :_return="_function._return" @click="fileStore.showProperties" />
          <function v-if="fileStore.contract.constructor" :name="fileStore.contract.constructor.name"
            :x="fileStore.contract.constructor.x" :y="fileStore.contract.constructor.y" /> -->
        </v-layer>
      </v-stage>
      <Properties :element="fileStore.selectedElement"></Properties>
    </div>

  </div>


</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import Palette from './components/inc/Palette.vue'
import Properties from './components/inc/Properties.vue'
import Contract from './components/palette/scd/Contract.vue'
import Variable from './components/palette/scd/Variable.vue'
import Struct from './components/palette/scd/Struct.vue'
import Function from './components/palette/scd/Function.vue'
import { useContractStorage } from '@/stores/contract'
var fileStore = useContractStorage()

onBeforeMount(() => {
  fileStore.selectedElement = reactive({ name: "", type: "", visibility: "" })
  // fileStore.contract = reactive({
  //   name: 'Ballot',
  //   x: 10,
  //   y: 10,
  //   variables: [
  //     {
  //       name: 'chairperson',
  //       type: 'address',
  //       visibility: 'public',
  //       x: 300,
  //       y: 100,
  //     },
  //     {
  //       name: 'Voters',
  //       type: 'mapping(address => Voter)',
  //       visibility: 'public',
  //       x: 300,
  //       y: 150,
  //     },
  //   ],
  //   constructor: {
  //     name: "<<constructor>>",
  //     x: 370,
  //     y: 200,
  //     params: [
  //       {
  //         name: 'proposalNames',
  //         type: 'byte32[]',
  //         modifiers: ['memory']
  //       }
  //     ],
  //     body: [
  //       {
  //         type: 'AssignmentStatement',
  //         // left: contract.variables.filter((elm) => elm.name == 'chairperson'),
  //         right: 'msg.sender'
  //       },
  //       {
  //         type: 'LoopStatement',
  //         init: 'uint i = 0',
  //         condition: 'i < proposalNames.length',
  //         step: 1
  //       }
  //     ]
  //   },
  //   structs: [
  //     {
  //       name: 'Voter',
  //       x: 20,
  //       y: 30,
  //       literals: [
  //         {
  //           visibility: 'public',
  //           type: 'uint',
  //           name: 'wight',

  //         },
  //         {
  //           visibility: 'public',
  //           type: 'boot',
  //           name: 'voted',

  //         },
  //         {
  //           visibility: 'public',
  //           type: 'address',
  //           name: 'delegate',

  //         },
  //         {
  //           visibility: 'public',
  //           type: 'uint',
  //           name: 'vote',

  //         },

  //       ]
  //     }
  //   ],
  //   functions: [
  //     {
  //       name: 'giveRightToVote',
  //       x: 370,
  //       y: 50,
  //       params: [
  //         {
  //           name: 'voter',
  //           type: 'address'
  //         }
  //       ],
  //       // _return: { name: 'winningProposal' },
  //       modifiers: ['external']
  //     }
  //   ],
  // })

  const scd = reactive({
    struct: [],
    variables: [],
    functions: [],
  })
  var configKonva = ref({
    width: window.innerWidth,
    height: window.innerHeight
  })



})

const showProperties = (element) => {
  console.log(element);
  if (element?.target?.attrs?.data) {
    fileStore.selectedElement = element.target.attrs.data;
    console.log(fileStore.selectedElement);
  } else {
    console.log("element not selected !");
  }
}

</script>