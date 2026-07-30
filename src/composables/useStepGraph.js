import { ref } from 'vue';
import { useContractStorage } from '@/stores/contract';
import { normalizeBody } from '@/schema/steps';

export function useStepGraph(layerRef, stageRef) {
  const fileStore = useContractStorage();

  // Set while the user is dragging from a step's connector handle toward
  // another step, to draw a new FlowEdge.
  const pendingConnection = ref(null); // { fromStepId } | null
  const connectingLineConfig = ref(null);

  const graphOf = (bodyOwner) => normalizeBody(bodyOwner?.body);

  const handleStepDragMove = (bodyOwner, e, step) => {
    const node = e.target;
    const { x, y } = node.position();
    fileStore.updateBodyStepPosition(bodyOwner, step.id, x, y);
  };

  const startConnection = (step) => {
    pendingConnection.value = { fromStepId: step.id };
  };

  const updateConnectionPreview = () => {
    if (!pendingConnection.value) return;
    const stage = stageRef.value?.getNode();
    const layer = layerRef.value?.getNode();
    if (!stage || !layer) return;

    const fromNode = layer.findOne((n) => n.attrs.data?.id === pendingConnection.value.fromStepId);
    if (!fromNode) return;

    const fromBox = fromNode.getClientRect({ relativeTo: layer });
    const pos = layer.getRelativePointerPosition();
    if (!pos) return;

    connectingLineConfig.value = {
      points: [fromBox.x + fromBox.width, fromBox.y + fromBox.height / 2, pos.x, pos.y],
      stroke: '#999999',
      dash: [4, 4],
      listening: false,
    };
  };

  const finishConnectionAtPointer = (bodyOwner) => {
    if (!pendingConnection.value) return;
    const { fromStepId } = pendingConnection.value;
    pendingConnection.value = null;
    connectingLineConfig.value = null;

    const stage = stageRef.value?.getNode();
    const pos = stage?.getPointerPosition();
    if (!stage || !pos) return;

    const shape = stage.getIntersection(pos);
    const group = shape?.findAncestor('Group', true);
    const targetStep = group?.attrs?.data;
    if (!targetStep || targetStep.id === fromStepId) return;

    fileStore.addBodyFlowEdge(bodyOwner, fromStepId, targetStep.id);
  };

  const cancelConnection = () => {
    pendingConnection.value = null;
    connectingLineConfig.value = null;
  };

  const edgeArrowConfig = (bodyOwner, edge) => {
    const layer = layerRef.value?.getNode();
    if (!layer) return { id: edge.id, points: [0, 0, 0, 0] };

    const fromNode = layer.findOne((n) => n.attrs.data?.id === edge.from);
    const toNode = layer.findOne((n) => n.attrs.data?.id === edge.to);
    if (!fromNode || !toNode) return { id: edge.id, points: [0, 0, 0, 0] };

    const fromBox = fromNode.getClientRect({ relativeTo: layer });
    const toBox = toNode.getClientRect({ relativeTo: layer });

    const fromX = fromBox.x + fromBox.width;
    const fromY = fromBox.y + fromBox.height / 2;
    const toX = toBox.x;
    const toY = toBox.y + toBox.height / 2;

    return {
      id: edge.id,
      points: [fromX, fromY, toX, toY],
      stroke: 'black',
      fill: 'black',
      pointerLength: 8,
      pointerWidth: 8,
      listening: false,
    };
  };

  return {
    graphOf,
    handleStepDragMove,
    startConnection,
    updateConnectionPreview,
    finishConnectionAtPointer,
    cancelConnection,
    pendingConnection,
    connectingLineConfig,
    edgeArrowConfig,
  };
}
