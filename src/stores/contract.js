import { defineStore } from "pinia";
import { ref } from "vue";

export const useContractStorage = defineStore("contract", {
  state: () => {
    return {
      contract: {
      }
      // {
      //   "name": "Purchase",
      //   "x": 10,
      //   "y": 10,
      //   "variables": [
      //     {
      //       "name": "value",
      //       "type": {
      //         "base": "uint"
      //       },
      //       "visibility": "public",
      //       "x": 50,
      //       "y": 50
      //     },
      //     {
      //       "name": "seller",
      //       "type": {
      //         "base": "address",
      //         "payable": true
      //       },
      //       "visibility": "public",
      //       "x": 50,
      //       "y": 110
      //     },
      //     {
      //       "name": "buyer",
      //       "type": {
      //         "base": "address",
      //         "payable": true
      //       },
      //       "visibility": "public",
      //       "x": 50,
      //       "y": 170
      //     },
      //     {
      //       "name": "state",
      //       "type": {
      //         "base": "State"
      //       },
      //       "visibility": "public",
      //       "x": 50,
      //       "y": 230
      //     }
      //   ],
      //   "structs": [
      //     {
      //       "name": "State",
      //       "x": 150,
      //       "y": 100,
      //       "literals": [
      //         {
      //           "type": {
      //             "base": "enumLiteral"
      //           },
      //           "name": "Created"
      //         },
      //         {
      //           "type": {
      //             "base": "enumLiteral"
      //           },
      //           "name": "Locked"
      //         },
      //         {
      //           "type": {
      //             "base": "enumLiteral"
      //           },
      //           "name": "Release"
      //         },
      //         {
      //           "type": {
      //             "base": "enumLiteral"
      //           },
      //           "name": "Inactive"
      //         }
      //       ]
      //     }
      //   ],
      //   "constructor": {
      //     "x": 250,
      //     "y": 50,
      //     "params": [],
      //     "modifiers": [
      //       "payable"
      //     ],
      //     "body": {
      //       "type": "Block",
      //       "statements": [
      //         {
      //           "type": "AssignmentStatement",
      //           "expressions": [
      //             {
      //               "left": {
      //                 "type": "Variable",
      //                 "name": "seller"
      //               },
      //               "right": {
      //                 "type": "Identifier",
      //                 "value": "caller"
      //               }
      //             }
      //           ]
      //         },
      //         {
      //           "type": "AssignmentStatement",
      //           "expressions": [
      //             {
      //               "left": {
      //                 "type": "Variable",
      //                 "name": "value"
      //               },
      //               "right": {
      //                 "type": "BinaryOperation",
      //                 "operator": "/",
      //                 "left": {
      //                   "type": "Identifier",
      //                   "value": "transaction.value"
      //                 },
      //                 "right": {
      //                   "type": "Literal",
      //                   "value": 2
      //                 }
      //               }
      //             }
      //           ]
      //         },
      //         {
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
      //           "then": {
      //             "type": "Block",
      //             "statements": [
      //               {
      //                 "type": "RevertStatement",
      //                 "error": "ValueNotEven"
      //               }
      //             ]
      //           }
      //         }
      //       ]
      //     }
      //   },
      //   "functions": [
      //     {
      //       "name": "abort",
      //       "x": 450,
      //       "y": 200,
      //       "params": [],
      //       "modifiers": [
      //         "external",
      //         "onlySeller",
      //         "inState(State.Created)"
      //       ],
      //       "body": {
      //         "type": "Block",
      //         "statements": [

      //           {
      //             "type": "EmitStatement",
      //             "event": "Aborted",
      //             "args": []
      //           },
      //           {
      //             "type": "AssignmentStatement",
      //             "expressions": [
      //               {
      //                 "left": {
      //                   "type": "Variable",
      //                   "name": "state"
      //                 },
      //                 "right": {
      //                   "type": "Identifier",
      //                   "value": "State.Inactive"
      //                 }
      //               }
      //             ]
      //           },
      //           {
      //             "type": "CallStatement",
      //             "object": "seller",
      //             "method": "refund",
      //             "params": [
      //               {
      //                 "type": "BinaryOperation",
      //                 "operator": "*",
      //                 "left": {
      //                   "type": "Literal",
      //                   "value": 2
      //                 },
      //                 "right": {
      //                   "type": "Identifier",
      //                   "value": "value"
      //                 }
      //               }
      //             ]
      //           }
      //         ]
      //       }
      //     },
      //     {
      //       "name": "confirmPurchase",
      //       "x": 450,
      //       "y": 350,
      //       "params": [],
      //       "modifiers": [
      //         "external",
      //         "inState(State.Created)",
      //         "payable"
      //       ],
      //       "body": {
      //         "type": "Block",
      //         "statements": [

      //           {
      //             "type": "AssignmentStatement",
      //             "expressions": [
      //               {
      //                 "left": {
      //                   "type": "Variable",
      //                   "name": "buyer"
      //                 },
      //                 "right": {
      //                   "type": "Identifier",
      //                   "value": "caller"
      //                 }
      //               }
      //             ]
      //           },
      //           {
      //             "type": "AssignmentStatement",
      //             "expressions": [
      //               {
      //                 "left": {
      //                   "type": "Variable",
      //                   "name": "state"
      //                 },
      //                 "right": {
      //                   "type": "Identifier",
      //                   "value": "State.Locked"
      //                 }
      //               }
      //             ]
      //           },
      //           {
      //             "type": "EmitStatement",
      //             "event": "PurchaseConfirmed",
      //             "args": []
      //           },
      //           {
      //             "type": "ForStatement",
      //             "init": {
      //               "type": "AssignmentStatement",
      //               "expressions": [
      //                 {
      //                   "left": {
      //                     "type": "Variable",
      //                     "name": "i"
      //                   },
      //                   "right": {
      //                     "type": "Literal",
      //                     "value": 0
      //                   }
      //                 }
      //               ]
      //             },
      //             "condition": {
      //               "type": "BinaryOperation",
      //               "operator": "<",
      //               "left": {
      //                 "type": "Identifier",
      //                 "value": "i"
      //               },
      //               "right": {
      //                 "type": "MemberAccess",
      //                 "object": "_values",
      //                 "member": "length"
      //               }
      //             },
      //             "post": {
      //               "type": "AssignmentStatement",
      //               "expressions": [
      //                 {
      //                   "left": {
      //                     "type": "Variable",
      //                     "name": "i"
      //                   },
      //                   "right": {
      //                     "type": "BinaryOperation",
      //                     "operator": "+",
      //                     "left": {
      //                       "type": "Identifier",
      //                       "value": "i"
      //                     },
      //                     "right": {
      //                       "type": "Literal",
      //                       "value": 1
      //                     }
      //                   }
      //                 }
      //               ]
      //             },
      //             "body": {
      //               "type": "Block",
      //               "statements": [
      //                 {
      //                   "type": "IfStatement",
      //                   "condition": {
      //                     "type": "BinaryOperation",
      //                     "operator": ">=",
      //                     "left": {
      //                       "type": "Identifier",
      //                       "value": "i"
      //                     },
      //                     "right": {
      //                       "type": "MemberAccess",
      //                       "object": "bidsList",
      //                       "member": "length"
      //                     }
      //                   },
      //                   "then": {
      //                     "type": "Block",
      //                     "statements": [
      //                       {
      //                         "type": "BreakStatement"
      //                       }
      //                     ]
      //                   }
      //                 }
      //               ]
      //             }
      //           }
      //         ]
      //       }
      //     },
      //     {
      //       "name": "confirmReceived",
      //       "x": 200,
      //       "y": 400,
      //       "params": [],
      //       "modifiers": [
      //         "external",
      //         "onlyBuyer",
      //         "inState(State.Locked)"
      //       ],
      //       "body": {
      //         "type": "Block",
      //         "statements": [
      //           {
      //             "type": "EmitStatement",
      //             "event": "ItemReceived",
      //             "args": []
      //           },
      //           {
      //             "type": "AssignmentStatement",
      //             "expressions": [
      //               {
      //                 "left": {
      //                   "type": "Variable",
      //                   "name": "state"
      //                 },
      //                 "right": {
      //                   "type": "Identifier",
      //                   "value": "State.Release"
      //                 }
      //               }
      //             ]
      //           },
      //           {
      //             "type": "CallStatement",
      //             "object": "buyer",
      //             "method": "refund",
      //             "params": [
      //               {
      //                 "type": "Identifier",
      //                 "value": "value"
      //               }
      //             ]
      //           }
      //         ]
      //       }
      //     },
      //     {
      //       "name": "refundSeller",
      //       "x": 500,
      //       "y": 50,
      //       "params": [],
      //       "modifiers": [
      //         "external",
      //         "onlySeller",
      //         "inState(State.Release)"
      //       ],
      //       "body": {
      //         "type": "Block",
      //         "statements": [
      //           {
      //             "type": "EmitStatement",
      //             "event": "SellerRefunded",
      //             "args": []
      //           },
      //           {
      //             "type": "AssignmentStatement",
      //             "expressions": [
      //               {
      //                 "left": {
      //                   "type": "Variable",
      //                   "name": "state"
      //                 },
      //                 "right": {
      //                   "type": "Identifier",
      //                   "value": "State.Inactive"
      //                 }
      //               }
      //             ]
      //           },
      //           {
      //             "type": "CallStatement",
      //             "object": "seller",
      //             "method": "refund",
      //             "params": [
      //               {
      //                 "type": "BinaryOperation",
      //                 "operator": "*",
      //                 "left": {
      //                   "type": "Literal",
      //                   "value": 3
      //                 },
      //                 "right": {
      //                   "type": "Identifier",
      //                   "value": "value"
      //                 }
      //               }
      //             ]
      //           }
      //         ]
      //       }
      //     }
      //   ],
      //   // "custom": {
      //   //   "ai-hint": "Buyer-seller escrow transaction with state transitions and refund logic",
      //   //   "blockchain-agnostic": true
      //   // }
      // },
      ,
      selectedFunction: {},
      selectedElement: {}, // Keep for backward compatibility
      selectedElements: [], // Array for multi-selection
      scdStage: true,
    };
  },
  actions: {
    logSomthing() {
      console.log("im calling from the store !");
    },
    showProperties(element, multiSelect = false) {

      // If not multi-selecting, clear previous selections
      if (!multiSelect) {
        this.clearSelection();
      }

      if (element && typeof element === 'object') {
        // Toggle selection if already selected in multi-select mode
        if (multiSelect && element.isSelected) {
          this.removeFromSelection(element);
        } else {
          this.selectedElement = element;
          this.selectedElement.isSelected = true;

          // Add to selectedElements array if not already there
          if (!this.selectedElements.includes(element)) {
            this.selectedElements.push(element);
          }

          console.log("Selected Element:", this.selectedElement);
          console.log("Total selected:", this.selectedElements.length);
        }
      } else {
        console.warn("⚠️ Invalid selection!", element);
        this.selectedElement = {};
      }
    },
    clearSelection() {
      console.log("🧹 clearSelection() called - stack trace:");
      console.trace();

      // Clear all selected elements
      this.selectedElements.forEach(el => {
        if (el) el.isSelected = false;
      });
      // Create NEW array reference to trigger reactivity
      this.selectedElements = [];

      // Clear single selection for backward compatibility
      if (this.selectedElement) {
        this.selectedElement.isSelected = false;
      }
      this.selectedElement = {};
    },
    addToSelection(element) {
      if (element && !this.selectedElements.includes(element)) {
        element.isSelected = true;
        // Create NEW array reference instead of mutating
        this.selectedElements = [...this.selectedElements, element];
      }
    },
    removeFromSelection(element) {
      if (element) {
        element.isSelected = false;
        // Create NEW array reference instead of mutating
        this.selectedElements = this.selectedElements.filter(el => el !== element);
      }
    },
    selectAll() {
      // Select all elements on the current stage
      const allElements = [
        ...this.contract.variables || [],
        ...this.contract.structs || [],
        ...this.contract.functions || [],
        ...this.contract.enums || [],
        ...this.contract.modifiers || [],
        ...this.contract.errorDeclarations || [],
      ];

      // Add constructor if it exists
      if (this.contract._constructor) {
        allElements.push(this.contract._constructor);
      }

      allElements.forEach(el => {
        el.isSelected = true;
      });

      // Set entire array at once with NEW reference
      this.selectedElements = allElements;

      console.log(`✅ Selected all ${this.selectedElements.length} elements`);
    },
    showFunctionalDiagram(element) {

    },
    createStruct() {

    },
    selector(element) {

    },
    updatePosition(id, x, y) {
      const all = [
        ...this.contract.variables,
        ...this.contract.structs,
        ...this.contract.functions,
        this.contract.constructor
      ];

      const target = all.find(el => el?.id === id);
      if (target) {
        target.x = x;
        target.y = y;
        console.log(`✅ Updated position of ${target.type} (${target.name})`);
      } else {
        console.warn("⚠️ Couldn't find node to update by id:", id);
      }
    },
    deleteElement() {
      // Check if we have multiple selections or single selection
      const elementsToDelete = this.selectedElements.length > 0
        ? this.selectedElements
        : (this.selectedElement && this.selectedElement.cmp_type ? [this.selectedElement] : []);

      if (elementsToDelete.length === 0) {
        console.warn("⚠️ No element selected for deletion");
        return;
      }

      const count = elementsToDelete.length;
      const message = count === 1
        ? `Are you sure you want to delete this ${elementsToDelete[0].cmp_type}?`
        : `Are you sure you want to delete ${count} selected elements?`;

      const userConfirmed = confirm(message);
      if (!userConfirmed) return;

      // Delete each selected element
      elementsToDelete.forEach(element => {
        const type = element.cmp_type;

        // Delete based on component type
        switch (type) {
          case "Variable":
            this.contract.variables = this.contract.variables.filter(v => v !== element);
            break;
          case "Struct":
            this.contract.structs = this.contract.structs.filter(s => s !== element);
            break;
          case "Function":
            this.contract.functions = this.contract.functions.filter(f => f !== element);
            break;
          case "Enum":
            this.contract.enums = this.contract.enums.filter(e => e !== element);
            break;
          case "Modifier":
            this.contract.modifiers = this.contract.modifiers.filter(m => m !== element);
            break;
          case "ErrorDeclaration":
            this.contract.errorDeclarations = this.contract.errorDeclarations.filter(err => err !== element);
            break;
          default:
            console.warn("⚠️ Unknown element type:", type);
        }
      });

      console.log(`✅ Deleted ${count} element(s)`);
      this.clearSelection();
    }
  },
  getters: {



  },
});
