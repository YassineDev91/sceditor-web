<template>
    <div class="text-indigo-400 ml-3 font-semibold">
        <span v-if="fileStore.scdStage">
            Structural Diagram
        </span>
        <span v-else>
            Functional Diagram
        </span>
    </div>
    <div class="flex flex-col p-2">
        <div v-for="element in getPaletteElements()" :key="element.id" class="m-0.5">
            <div @dragstart="startDrag($event, element)" draggable="true" @click="element.action"
                class="flex p-1.5 cursor-pointer rounded-md border bg-slate-800/25 border-slate-700 hover:dark:bg-slate-300/20 dark:text-white space-x-2 items-center">
                <div class="bg-slate-200 rounded-sm shadow-md">
                    <img :src="'src/assets/icons/' + element.icon + '.png'"
                        class="w-6 h-6 p-1 shadow-sm object-contain">
                </div>
                <span class="text-xs">{{ element.label }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useContractStorage } from '@/stores/contract'
var fileStore = useContractStorage()


const elements = [
    // SCD
    { label: 'Struct', type: 'struct', icon: 'struct', stage: 'SCD', action: () => { createStruct() } },
    { label: 'Variable', type: 'variable', icon: 'variable', stage: 'SCD', action: () => { createVariable() } },
    { label: 'Function', type: 'function', icon: 'function', stage: 'SCD', action: () => { createFunction() } },
    { label: 'Enum', type: 'enum', icon: 'enum', stage: 'SCD', action: () => { createEnum() }},
    { label: 'Modifier', type: 'modifier', icon: 'modifier', stage: 'SCD', action: () => { createModifier() }},
    { label: 'ErrorDeclaration', type: 'error', icon: 'error', stage: 'SCD', action: () => { createErrorDeclaration() }},
    { label: 'Literal', type: 'literal', icon: 'three-point', stage: 'SCD', },
    // {  label: 'Return', type: 'return', icon: '' },
    // {  label: 'Parameter', type: 'parameter', icon: '' },

    // FD
    { label: 'Assignment', icon: 'assignment', type: 'image', stage: 'FD', action: () => createStatement('assignment') },
    { label: 'Call', icon: 'event', type: 'arrow', stage: 'FD', action: () => createStatement('call') },
    { label: 'Condition', icon: 'git', type: 'star', stage: 'FD', action: () => createStatement('condition') },
    { label: 'Emit', icon: 'emit', type: 'arrow', stage: 'FD', action: () => createStatement('emit') },
    { label: 'Loop', icon: 'loop', type: 'star', stage: 'FD', action: () => createStatement('loop') },
    { label: 'Literal', icon: 'three-point', type: 'star', stage: 'FD', action: () => createStatement('literal') },
]
const startDrag = (event, item) => {
    event.dataTransfer.setData('application/json', JSON.stringify(item));
};
function getPaletteElements() {

    return elements.filter((elm) => {
        if (fileStore.scdStage)
            return elm.stage == 'SCD'
        return elm.stage == 'FD'
    }
    )
}
function createStruct() {
    fileStore.contract.structs.push({
        name: "new_struct",
        cmp_type: "Struct",
        literals: [],
        x: 100,
        y: 100,
        cmp_type: "Struct",
        details:"sdetails"
    })
    console.log("creating struct ...", fileStore.contract.structs);
}

function createVariable() {
    fileStore.contract.variables.push({
        name: "new_variable",
        x: 100,
        y: 100,
        cmp_type: "Variable",
        type: {
            base: "",
            payable: false
        },
        description:""
    })
}

function createFunction() {
    fileStore.contract.functions.push({
        name: "new_function",
        x: 100,
        y: 100,
        cmp_type: "Function",
        body: {
            "type": "Block",
            "statements": []
        },
        description:""
    })
}

function createEnum() {
    fileStore.contract.enums.push({
        name: "new_enum",
        x: 100,
        y: 100,
        cmp_type: "Enum",
        values: [],
        description:""
    })
}

function createModifier() {
    fileStore.contract.modifiers.push({
        name: "new_modifier",
        x: 100,
        y: 100,
        cmp_type: "Modifier",
        body: {
            "type": "Block",
            "statements": []
        },
        values: [],
        parameters: [], 
        description:""
    })
}
function createErrorDeclaration() {
    fileStore.contract.errorDeclarations.push({
        name: "new_error",
        x: 100,
        y: 100,
        cmp_type: "ErrorDeclaration",
        description:""
    })
}

function createStatement(type) {
    switch (type) {
        case 'assignment':
            console.log(`creating ${type} statement ...`);
            fileStore.selectedFunction.body.statements.push({
                cmp_type: "AssignmentStatement",
                expressions: [
                    {
                        "left": {
                            "type": "",
                            "name": ""
                        },
                        "right": {
                            "type": "",
                            "value": ""
                        }
                    }
                ],
                description:""
            })
            break;
        case "call":
            console.log(`creating ${type} statement ...`);
            fileStore.selectedFunction.body.statements.push({
                cmp_type: "CallStatement",
                object: "",
                method: "",
                params: [
                    {
                        "type": "BinaryOperation",
                        "operator": "*",
                        "left": {
                            "type": "Literal",
                            "value": 2
                        },
                        "right": {
                            "type": "Identifier",
                            "value": "value"
                        }
                    }
                ],
                description:""
            })
            break;
        case "condition":
            console.log(`creating ${type} statement ...`);
            fileStore.selectedFunction.body.statements.push({
                cmp_type: "IfStatement",
                condition: {
                    type: "BinaryExpression",
                    left: "",
                    operator: "",
                    right: ""
                },
                body: [],
                description:""
            })
            // {
      //           "type": "IfStatement",
      //           "condition": {
      //             "type": "BinaryOperation",
      //             "operator": "!=",
      //             "left": {
      //               "type": "BinaryOperation",
      //               "operator": "*",
      //               "left": {
      //                 "type": "Literal",
      //                 "value": 2
      //               },
      //               "right": {
      //                 "type": "Identifier",
      //                 "value": "value"
      //               }
      //             },
      //             "right": {
      //               "type": "Identifier",
      //               "value": "transaction.value"
      //             }
      //           },
            break;
        case "emit":
            console.log(`creating ${type} statement ...`);
            fileStore.selectedFunction.body.statements.push({
                cmp_type: "EmitStatement",
                event: "",
                args: [],
                description:""
            })
            break;
        case 'loop':
            console.log(`creating ${type} statement ...`);

            fileStore.selectedFunction.body.statements.push({
                cmp_type: "LoopStatement",
                init:{},
                condition: {
                    type: "BinaryExpression",
                    left: "",
                    operator: "",
                    right: ""
                },
                post:{},
                body: {},
                description:""
            })
            break;

        default:
            break;
    }
}
</script>

<style scoped></style>