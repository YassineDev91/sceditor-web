import { defineStore } from "pinia";
import { ref } from "vue";
import { createContract } from "@/schema/contract";
import {
  createVariable,
  createStruct,
  createFunction,
  createConstructor,
  createEnum,
  createGuard,
  createErrorDeclaration,
  createEvent,
} from "@/schema/elements";
import { primitiveType } from "@/schema/types";
import { createStep, createFlowEdge, maxOutgoingEdges, normalizeBody } from "@/schema/steps";

export const useContractStorage = defineStore("contract", {
  state: () => {
    return {
      contract: {
      },
      // History management
      history: [],
      historyIndex: -1,
      maxHistorySize: 50,
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
    initNewContract(name) {
      this.contract = createContract(name);
      this.contract._constructor = createConstructor({ x: 50, y: 120 });
      this.clearHistory();
      this.saveHistory();
    },
    createVariableElement({ x, y }) {
      this.contract.variables.push(createVariable("new_variable", primitiveType("string"), { x, y }));
      this.saveHistory();
    },
    createStructElement({ x, y }) {
      this.contract.structs.push(createStruct("new_struct", { x, y }));
      this.saveHistory();
    },
    createFunctionElement({ x, y }) {
      this.contract.functions.push(createFunction("new_function", { x, y }));
      this.saveHistory();
    },
    createEnumElement({ x, y }) {
      this.contract.enums.push(createEnum("new_enum", { x, y }));
      this.saveHistory();
    },
    createGuardElement({ x, y }) {
      this.contract.guards.push(createGuard("new_guard", { x, y }));
      this.saveHistory();
    },
    createErrorDeclarationElement({ x, y }) {
      this.contract.errorDeclarations.push(createErrorDeclaration("new_error", { x, y }));
      this.saveHistory();
    },
    createEventElement({ x, y }) {
      this.contract.events.push(createEvent("new_event", { x, y }));
      this.saveHistory();
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
      const allElements = [
        ...this.contract.variables || [],
        ...this.contract.structs || [],
        ...this.contract.functions || [],
        ...this.contract.enums || [],
        ...this.contract.guards || [],
        ...this.contract.errorDeclarations || [],
        ...this.contract.events || [],
      ];

      if (this.contract._constructor) {
        allElements.push(this.contract._constructor);
      }

      allElements.forEach(el => {
        el.isSelected = true;
      });

      this.selectedElements = allElements;

      console.log(`✅ Selected all ${this.selectedElements.length} element(s)`);
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
        ...this.contract.enums,
        ...this.contract.guards,
        ...this.contract.errorDeclarations,
        ...this.contract.events,
      ];
      if (this.contract._constructor) {
        all.push(this.contract._constructor);
      }

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
          case "Guard":
            this.contract.guards = this.contract.guards.filter(g => g !== element);
            break;
          case "ErrorDeclaration":
            this.contract.errorDeclarations = this.contract.errorDeclarations.filter(err => err !== element);
            break;
          case "Event":
            this.contract.events = this.contract.events.filter(ev => ev !== element);
            break;
          case "Action":
          case "Call":
          case "Emit":
          case "Decision":
          case "Return":
          case "Revert":
            this.deleteBodyStep(this.selectedFunction, element.id);
            break;
          default:
            console.warn("⚠️ Unknown element type:", type);
        }
      });

      console.log(`✅ Deleted ${count} element(s)`);
      this.clearSelection();
      this.saveHistory();
    },

    // Step-graph actions (Function/Guard/Constructor bodies)
    createBodyStep(bodyOwner, kind, name, { x, y } = {}) {
      const body = normalizeBody(bodyOwner.body);
      const step = createStep(kind, name, { x: x ?? 0, y: y ?? 0 });
      body.steps.push(step);
      if (!body.startStepId) {
        body.startStepId = step.id;
      }
      bodyOwner.body = body;
      this.saveHistory();
      return step;
    },

    deleteBodyStep(bodyOwner, stepId) {
      const body = normalizeBody(bodyOwner.body);
      body.steps = body.steps.filter(s => s.id !== stepId);
      body.edges = body.edges.filter(e => e.from !== stepId && e.to !== stepId);
      if (body.startStepId === stepId) {
        body.startStepId = body.steps[0]?.id ?? null;
      }
      bodyOwner.body = body;
      this.saveHistory();
    },

    addBodyFlowEdge(bodyOwner, fromStepId, toStepId, label = '') {
      const body = normalizeBody(bodyOwner.body);
      const fromStep = body.steps.find(s => s.id === fromStepId);
      if (!fromStep) {
        console.warn("⚠️ addBodyFlowEdge: source step not found:", fromStepId);
        return null;
      }
      const existingOutgoing = body.edges.filter(e => e.from === fromStepId).length;
      if (existingOutgoing >= maxOutgoingEdges(fromStep.cmp_type)) {
        console.warn(`⚠️ ${fromStep.cmp_type} steps allow at most ${maxOutgoingEdges(fromStep.cmp_type)} outgoing edge(s)`);
        return null;
      }
      const edge = createFlowEdge(fromStepId, toStepId, { label });
      body.edges.push(edge);
      bodyOwner.body = body;
      this.saveHistory();
      return edge;
    },

    deleteBodyFlowEdge(bodyOwner, edgeId) {
      const body = normalizeBody(bodyOwner.body);
      body.edges = body.edges.filter(e => e.id !== edgeId);
      bodyOwner.body = body;
      this.saveHistory();
    },

    updateBodyStepPosition(bodyOwner, stepId, x, y) {
      const body = normalizeBody(bodyOwner.body);
      const step = body.steps.find(s => s.id === stepId);
      if (step) {
        step.x = x;
        step.y = y;
      }
      bodyOwner.body = body;
      this.saveHistory();
    },

    setBodyStartStep(bodyOwner, stepId) {
      const body = normalizeBody(bodyOwner.body);
      body.startStepId = stepId;
      bodyOwner.body = body;
      this.saveHistory();
    },

    // History management
    saveHistory() {
      // Create a deep copy of the current contract state
      const snapshot = JSON.parse(JSON.stringify(this.contract));

      // Remove any history after current index (for new branch)
      this.history = this.history.slice(0, this.historyIndex + 1);

      // Add new snapshot
      this.history.push(snapshot);

      // Limit history size
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
      } else {
        this.historyIndex++;
      }

      console.log(`📝 History saved (${this.historyIndex + 1}/${this.history.length})`);
    },

    undo() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.contract = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
        console.log(`↩️ Undo: Restored to state ${this.historyIndex + 1}`);
      } else {
        console.warn("⚠️ Nothing to undo");
      }
    },

    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.contract = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
        console.log(`↪️ Redo: Restored to state ${this.historyIndex + 1}`);
      } else {
        console.warn("⚠️ Nothing to redo");
      }
    },

    clearHistory() {
      this.history = [];
      this.historyIndex = -1;
      console.log("🗑️ History cleared");
    },

    initHistory() {
      // Save initial state
      if (this.contract && Object.keys(this.contract).length > 0) {
        this.clearHistory();
        this.saveHistory();
      }
    }
  },
  getters: {
    canUndo: (state) => state.historyIndex > 0,
    canRedo: (state) => state.historyIndex < state.history.length - 1,
    undoCount: (state) => state.historyIndex,
    redoCount: (state) => state.history.length - state.historyIndex - 1,
  },
});
