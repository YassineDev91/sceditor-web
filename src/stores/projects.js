import { defineStore } from "pinia";
import {
  listProjects,
  getProject,
  putProject,
  deleteProject as dbDeleteProject,
} from "@/db/projects";
import { createId } from "@/schema/id";
import { useContractStorage } from "./contract";

export const useProjectsStore = defineStore("projects", {
  state: () => ({
    projects: [],
    activeProjectId: null,
  }),
  actions: {
    async loadProjectList() {
      const records = await listProjects();
      this.projects = records
        .map((r) => ({ id: r.id, name: r.name, updatedAt: r.updatedAt }))
        .sort((a, b) => b.updatedAt - a.updatedAt);
    },

    async _persistNewRecord(name, contract) {
      const id = createId("proj");
      const now = Date.now();
      const record = { id, name, contract, createdAt: now, updatedAt: now };
      await putProject(record);
      await this.loadProjectList();
      return record;
    },

    async _flushActive() {
      if (this.activeProjectId) {
        await this.saveActiveProject();
      }
    },

    async createProject(name) {
      await this._flushActive();
      const contractStore = useContractStorage();
      contractStore.initNewContract(name);
      const serialized = JSON.parse(JSON.stringify(contractStore.contract));
      const record = await this._persistNewRecord(name, serialized);
      this.activeProjectId = record.id;
    },

    async createProjectFromContract(contract) {
      await this._flushActive();
      const contractStore = useContractStorage();
      contractStore.contract = contract;
      contractStore.initHistory();
      const name = contract.name || "Imported Contract";
      const record = await this._persistNewRecord(name, contract);
      this.activeProjectId = record.id;
    },

    async openProject(id) {
      await this._flushActive();
      const record = await getProject(id);
      if (!record) return;
      const contractStore = useContractStorage();
      contractStore.contract = record.contract;
      contractStore.initHistory();
      this.activeProjectId = id;
    },

    async renameProject(id, name) {
      const trimmed = (name || "").trim();
      if (!trimmed) return;
      if (id === this.activeProjectId) {
        const contractStore = useContractStorage();
        contractStore.contract.name = trimmed;
        await this.saveActiveProject();
      } else {
        const record = await getProject(id);
        if (!record) return;
        record.name = trimmed;
        record.contract.name = trimmed;
        record.updatedAt = Date.now();
        await putProject(record);
      }
      await this.loadProjectList();
    },

    async deleteProject(id) {
      if (!confirm("Delete this project? This cannot be undone.")) return;
      await dbDeleteProject(id);
      if (id === this.activeProjectId) {
        this.activeProjectId = null;
        const contractStore = useContractStorage();
        contractStore.contract = {};
        contractStore.clearHistory();
      }
      await this.loadProjectList();
    },

    async duplicateProject(id) {
      await this._flushActive();
      const record = await getProject(id);
      if (!record) return;
      const newName = `${record.name} (copy)`;
      await this._persistNewRecord(newName, { ...record.contract, name: newName });
    },

    async saveActiveProject() {
      if (!this.activeProjectId) return;
      const contractStore = useContractStorage();
      const record = await getProject(this.activeProjectId);
      if (!record) return;
      record.contract = JSON.parse(JSON.stringify(contractStore.contract));
      record.name = contractStore.contract.name || record.name;
      record.updatedAt = Date.now();
      await putProject(record);
      await this.loadProjectList();
    },

    async migrateLegacyLocalStorage() {
      const saved = localStorage.getItem("saved_contract");
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        const name = parsed.name || "Migrated Project";
        await this.createProjectFromContract({ ...parsed, name });
      } catch (error) {
        console.warn("⚠️ Failed to parse legacy saved contract during migration", error);
      } finally {
        localStorage.removeItem("saved_contract");
        localStorage.removeItem("saved_contract_time");
      }
    },
  },
});
