import { defineStore } from "pinia";
import { ref } from "vue";

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
