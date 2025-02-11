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
            name: "voters",
            type: "mapping(address => Voter)",
            visibility: "public",
            x: 70,
            y: 50,
          },
          {
            name: "chairperson",
            type: "address",
            visibility: "public",
            x: 180,
            y: 50,
          },
          {
            name: "proposals",
            type: "Proposal[]",
            visibility: "public",
            x: 290,
            y: 50
          }
        ],

        structs: [
          {
            name: "Voter",
            x: 560,
            y: 30,
            literals: [
              {
                visibility: "public",
                type: "uint",
                name: "wieght",
              },
              {
                visibility: "public",
                type: "bool",
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
          {
            name: "Proposal",
            x: 350,
            y: 30,
            literals: [
              {
                visibility: "public",
                type: "byte32",
                name: "name"
              },
              {
                visibility: "public",
                type: "uint",
                name: "voteCount"
              }
            ]
          }
        ],
        constructor: {
          name: "<<constructor>>",
          x: 20,
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
              expressions: {
                left: 'chairperson',
                right: "msg.sender",
              }
            },
            {
              type: "AssignmentStatement",
              expressions: {
                left: 'voters[chairperson].weight',
                right: "1",
              }
            },
            {
              type: "LoopStatement",
              expressions: {
                init: "uint i = 0",
                condition: "i < proposalNames.length",
                step: 1,
              },
              body: [
                {
                  type: "CallStatement",
                  method: "push",
                  object: "proposals",
                  params: [
                    {
                      name: "",
                      type: "Proposal",
                      init: {
                        name: "proposalNames[i]",
                        voteCount: "0"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        functions: [
          {
            name: "giveRightToVote",
            x: 270,
            y: 200,
            params: [
              {
                name: "voter",
                type: "address",
              },
            ],
            modifiers: ["external"],
            body: [
              {
                type: "CallStatement",
                method: "require",
                object: "",
                params: [
                  {
                    type: "BinaryExpression",
                    left: "msg.sender",
                    operator: "==",
                    right: "chairperson"
                  },
                  {
                    type: "Literal",
                    value: "Only chairperson can give right to vote."
                  }
                ]
              },
              {
                type: "CallStatement",
                method: "require",
                object: "",
                params: [
                  {
                    type: "Literal",
                    value: "!voters[voter].voted"
                  },
                  {
                    type: "Literal",
                    value: "The voter already voted."
                  }
                ]
              },
              {
                type: "CallStatement",
                method: "require",
                object: "",
                params: [
                  {
                    type: "BinaryExpression",
                    left: "voters[voter].weight",
                    operator: "==",
                    right: "voters[voter].weight"
                  }
                ]
              },
              {
                type: "AssignmentStatement",
                expressions: {
                  left: "voters[voter.weight]",
                  right: "1"
                }
              }
            ]
          },
          {
            name: "delegate",
            x: 510,
            y: 200,
            params: [
              {
                name: "to",
                type: "address",
              },
            ],
            modifiers: ["external"],
            body: [
              {
                type: "AssignmentStatement",
                expressions: {
                  left: "Voter storage sender",
                  right: "voters[msg.sender]"
                }
              },
              {
                type: "CallStatement",
                method: "require",
                object: "",
                params: [
                  {
                    type: "BinaryExpression",
                    left: "sender.weight",
                    operator: "!=",
                    right: "0"
                  },
                  {
                    type: "Literal",
                    value: "You have no right to vote"
                  }
                ]
              },
              {
                type: "CallStatement",
                method: "require",
                object: "",
                params: [
                  {
                    type: "Literal",
                    value: "!sender.voted"
                  },
                  {
                    type: "Literal",
                    value: "You already voted."
                  }
                ]
              },
              {
                type: "CallStatement",
                method: "require",
                object: "",
                params: [
                  {
                    type: "BinaryExpression",
                    left: "to",
                    operator: "!=",
                    right: "msg.sender"
                  },
                  {
                    type: "Literal",
                    value: "Self-delegation is disallowed."
                  }
                ]
              },
              {
                type: "LoopStatement", //draft
                condition: {
                  type: "BinaryExpression",
                  left: "voters[to].delegate",
                  operator: "!=",
                  right: "address(0)"
                },
                body: [
                  {
                    type: "AssignementStatement",
                    expressions: {
                      left: "to",
                      right: "voters[to].delegate"
                    }
                  },
                  {
                    type: "CallStatement",
                    method: "require",
                    object: "",
                    params: [
                      {
                        type: "BinaryExpression",
                        left: "to",
                        operator: "!=",
                        right: "msg.sender"
                      },
                      {
                        type: "Literal",
                        value: "Found loop in delegation."
                      }
                    ]
                  },

                ]
              },
              {
                type: "AssignmentStatement",
                expressions: {
                  left: "Voter storage delegate_",
                  right: "voters[to]"
                }
              },
              {
                type: "CallStatement",
                object: "",
                method: "require",
                params: [
                  {
                    type: "BinaryExpression",
                    left: "delegate_.weight",
                    operator: ">=",
                    right: "1"
                  }
                ]
              },
              {
                type: "AssignmentStatement",
                expressions: {
                  left: "sender.voted",
                  right: "true"
                }
              },
              {
                type: "AssignmentStatement",
                expressions: {
                  left: "sender.delegate",
                  right: "to"
                }
              },
              {
                type: "ConditionalStatement",
                condition: "delegate_.voted",
                body: [
                  {
                    type: "AssignmentStatement",
                    expressions: {
                      left: "proposals[delegate_.vote].voteCount",
                      right: "proposals[delegate_.vote].voteCount + sender.weight"
                    }
                  }
                ],
                else: {
                  body: [
                    {
                      type: "AssignmentStatement",
                      expressions: {
                        left: "delegate_.weight",
                        right: "delegate_.weight + sender.weight"
                      }
                    }
                  ]
                }
              }
            ]
          },

          {
            name: "Vote",
            x: 240,
            y: 330,
            params: [
              { name: "proposal" }
            ],
            modifiers: ["external"],
            body: [
              {
                type: "AssignmentStatement",
                expressions: {
                  left: "Voter storage sender",
                  right: "voters[msg.sender]"
                }
              },
              {
                type: "CallStatement",
                object: "",
                method: "require",
                params: [
                  {
                    type: "BinaryExpression",
                    left: "sender.weight",
                    operator: "!=",
                    right: "0"
                  },
                  {
                    type: "Literal",
                    value: "Has no right to vote"
                  }
                ]
              },
              {
                type: "CallStatement",
                object: "",
                method: "require",
                params: [
                  {
                    type: "Literal",
                    value: "!sender.voted"
                  },
                  {
                    type: "Literal",
                    value: "Already voted."
                  }
                ]
              },
              {
                type: "AssignmentStatement",
                expressions: {
                  left: "sender.voted",
                  right: "true"
                }
              },
              {
                type: "AssignmentStatement",
                expressions: {
                  left: "sender.vote",
                  right: "proposal"
                }
              },
              {
                type: "AssignmentStatement",
                expressions: {
                  left: "proposals[proposal].voteCount",
                  right: "proposals[proposal].voteCount + sender.weight"
                }
              }
            ]
          },

          {
            name: "winningProposal",
            x: 20,
            y: 330,
            _return: { name: "winningProposal" },
            visibility: "public",
            modifiers: ["view"],
            body: [
              {
                type: "AssignmentStatement",
                expressions: {
                  left: "uint winningVoteCount",
                  right: "0"
                }
              },
              {
                type: "LoopStatement",
                init: "uint p = 0",
                condition: "p < proposals.length", //draft i need to check if its optimal to make it BinaryExpression instead of a literal
                step: 1,
                body:[
                  {
                    type:"ConditionalStatement",
                    condition:"proposals[p].voteCount > winningVoteCount",
                    body:[
                      {
                        type:"AssignmentStatement",
                        expressions:{
                          left:"winningVoteCount",
                          right:"proposals[p].voteCount"
                        }
                      },
                      {
                        type:"AssignmentStatement",
                        expressions:{
                          left:"winningProposal_",
                          right:"p"
                        }
                      }
                    ]
                  }
                ]
              },
            ]
          },

          {
            name: "winnerName",
            x: 20,
            y: 530,
            _return: { name: "winnerName", type:"byte32" },
            modifiers: ["external", "view"],
            body: [
              {
                type: "AssignmentStatement",
                expressions: {
                  left: "winnerName_",
                  right: "proposals[winningProposal()].name"
                }
              }
            ]
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
        this.selectedElement = {}
      }
    },
    showFunctionalDiagram(element) {

    },
    createStruct() {

    }
  },
  getters: {

    

  },
});
