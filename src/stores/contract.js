import { defineStore } from "pinia";

export const useContractStorage = defineStore("contract", {
  state: () => {
    return {
      contract: {
        name: "Ballot",
        x: 10,
        y: 10,
        variables: [
          {
            name: "chairperson",
            type: "address",
            visibility: "public",
            x: 300,
            y: 100,
          },
          {
            name: "Voters",
            type: "mapping(address => Voter)",
            visibility: "public",
            x: 300,
            y: 150,
          },
        ],
        constructor: {
          name: "<<constructor>>",
          x: 370,
          y: 200,
          params: [
            {
              name: "proposalNames",
              type: "byte32[]",
              modifiers: ["memory"],
            },
          ],
          body: [
            {
              type: "AssignmentStatement",
              // left: contract.variables.filter((elm) => elm.name == 'chairperson'),
              right: "msg.sender",
            },
            {
              type: "LoopStatement",
              init: "uint i = 0",
              condition: "i < proposalNames.length",
              step: 1,
            },
          ],
        },
        structs: [
          {
            name: "Voter",
            x: 20,
            y: 30,
            literals: [
              {
                visibility: "public",
                type: "uint",
                name: "wight",
              },
              {
                visibility: "public",
                type: "boot",
                name: "voted",
              },
              {
                visibility: "public",
                type: "address",
                name: "delegate",
              },
              {
                visibility: "public",
                type: "uint",
                name: "vote",
              },
            ],
          },
        ],
        functions: [
          {
            name: "giveRightToVote",
            x: 370,
            y: 50,
            params: [
              {
                name: "voter",
                type: "address",
              },
            ],
            // _return: { name: 'winningProposal' },
            modifiers: ["external"],
          },
        ],
      },
      selectedElement: {},
    };
  },
  actions: {
    logSomthing() {
      console.log("im calling from the store !");
    },
    showProperties(element) {
      if (element?.target?.attrs?.data) {
        this.selectedElement = element.target.attrs.data;
        console.log(this.selectedElement);
      } else {
        console.log("element not selected !");
      }
    },
  },
  getters: {
    
  },
});
