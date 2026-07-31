import { ref } from 'vue';
import { useContractStorage } from '@/stores/contract';
import { useSettingsStore } from '@/stores/settings';
import { normalizeBody } from '@/schema/steps';
import { snapValue } from '@/utils/snapToGrid';
import { HANDLE_VISIBLE_RADIUS, HANDLE_HIT_RADIUS, SPACING_UNIT } from '@/constants/nodeStyleTokens';

// Must match Step.vue's own WIDTH/HEIGHT constants — duplicated locally
// (same convention Step.vue itself uses) rather than imported, since these
// describe the fixed box every step renders at, not schema data.
const STEP_WIDTH = 200;
const STEP_HEIGHT = 80;

// Arrow endpoints stop short of the box edges by the same offset Step.vue's
// own connector/start handles already sit at (x: WIDTH + 8 / x: -8), so an
// edge visually starts at the connector handle and ends at the start
// handle instead of touching the plain box edge underneath them.
const EDGE_GAP = SPACING_UNIT * 2; // 8

export function useStepGraph(layerRef, stageRef, groupDrag, snapToGridEnabled) {
  const fileStore = useContractStorage();
  const settingsStore = useSettingsStore();

  // Set while the user is dragging from a step's connector handle toward
  // another step, to draw a new FlowEdge.
  const pendingConnection = ref(null); // { fromStepId } | null
  const connectingLineConfig = ref(null);

  // Bumped on every `dragmove` (not persisted to the store — persistence
  // only happens once, on `dragend`, to avoid a saveHistory() deep-clone on
  // every animation frame). Reading this inside edgeArrowConfig gives it a
  // reactive dependency that changes on every drag frame, so connected
  // arrows redraw live instead of only updating once the drag completes.
  const dragTick = ref(0);
  const bumpDragTick = () => {
    dragTick.value++;
  };

  const graphOf = (bodyOwner) => normalizeBody(bodyOwner?.body);

  const resolveStepNode = (element) => layerRef.value?.getNode()?.findOne((n) => n.attrs.data?.id === element.id);

  // dragstart: only begins a group move when the dragged step is part of an
  // active multi-selection.
  const handleStepDragStart = (bodyOwner, step) => {
    // Unconditional reset — clears any stale state left over from a drag
    // that never reached dragend (e.g. mouse released outside the window),
    // so a later single-step drag can never inherit a stale multi-step
    // group. startGroupDrag([step]) filters the dragged step out of the
    // offsets list, naturally producing an empty (inactive) group drag.
    groupDrag.startGroupDrag(step, [step]);

    const graph = graphOf(bodyOwner);
    const selectedSteps = graph.steps.filter(s => fileStore.selectedElements.includes(s));
    if (selectedSteps.length > 1 && selectedSteps.includes(step)) {
      groupDrag.startGroupDrag(step, selectedSteps);
    }
  };

  // dragmove: continuous, visual-only. Snaps the dragged step to the grid (if
  // enabled), repositions every other selected step's live node by the same
  // delta if this is a group move, and bumps dragTick so connected arrows
  // keep redrawing live (unchanged behavior, now folded into this handler
  // instead of being called separately from Workspace.vue).
  const handleStepDragMoveLive = (bodyOwner, e, step) => {
    const node = e.target;
    let { x, y } = node.position();

    if (snapToGridEnabled.value) {
      x = snapValue(x, settingsStore.editor.gridSize);
      y = snapValue(y, settingsStore.editor.gridSize);
      node.position({ x, y });
    }

    if (groupDrag.isGroupDragActive()) {
      groupDrag.applyLiveDelta(resolveStepNode, x, y);
    }

    bumpDragTick();
  };

  const handleStepDragMove = (bodyOwner, e, step) => {
    const node = e.target;
    const { x, y } = node.position();

    const body = normalizeBody(bodyOwner.body);

    const draggedStep = body.steps.find(s => s.id === step.id);
    if (draggedStep) {
      draggedStep.x = x;
      draggedStep.y = y;
    }

    if (groupDrag.isGroupDragActive()) {
      const others = groupDrag.finishGroupDrag(x, y);
      others.forEach(({ element, x: ox, y: oy }) => {
        const otherStep = body.steps.find(s => s.id === element.id);
        if (otherStep) {
          otherStep.x = ox;
          otherStep.y = oy;
        }
      });
    }

    bodyOwner.body = body;
    fileStore.saveHistory();
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

    // fromNode.x()/y() is the step group's own live local position (updated
    // by Konva in real time during a drag) — using the known box size here
    // instead of getClientRect() avoids the decorations (connector handle,
    // start handle, start marker) skewing where the line actually starts.
    const fromX = fromNode.x() + STEP_WIDTH + EDGE_GAP;
    const fromY = fromNode.y() + STEP_HEIGHT / 2;
    const pos = layer.getRelativePointerPosition();
    if (!pos) return;

    connectingLineConfig.value = {
      points: [fromX, fromY, pos.x, pos.y],
      stroke: '#999999',
      dash: [4, 4],
      listening: false,
    };
  };

  // Step.vue's outer group is the only ancestor that carries `attrs.data`
  // (the actual step object) — but several of its children (e.g.
  // ContentRectangle) wrap their own content in a nested <v-group> with no
  // `data` attr. "Nearest Group ancestor" (Konva's findAncestor('Group'))
  // can resolve to one of those inner groups instead of the step itself, so
  // walk up until a `data`-bearing node is found rather than stopping at
  // the first Group of any kind.
  const findStepNode = (node) => {
    let current = node;
    while (current && !current.attrs?.data) {
      current = current.getParent?.();
    }
    return current;
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
    const group = shape ? findStepNode(shape) : null;
    const targetStep = group?.attrs?.data;
    if (!targetStep || targetStep.id === fromStepId) return;

    fileStore.addBodyFlowEdge(bodyOwner, fromStepId, targetStep.id);
  };

  const cancelConnection = () => {
    pendingConnection.value = null;
    connectingLineConfig.value = null;
  };

  const edgeArrowConfig = (bodyOwner, edge) => {
    // No semantic use of the value itself — reading it here just gives this
    // function a reactive dependency on every drag frame (see dragTick above),
    // so the arrow redraws live while either endpoint is being dragged.
    dragTick.value;

    const layer = layerRef.value?.getNode();
    if (!layer) return { id: edge.id, points: [0, 0, 0, 0] };

    const fromNode = layer.findOne((n) => n.attrs.data?.id === edge.from);
    const toNode = layer.findOne((n) => n.attrs.data?.id === edge.to);
    if (!fromNode || !toNode) return { id: edge.id, points: [0, 0, 0, 0] };

    // .x()/.y() is each step group's own live local position — using the
    // known box size instead of getClientRect() keeps the arrow anchored to
    // the center of the plain rounded box's edges, not skewed by the
    // connector handle / start handle / start marker that also live in the
    // same group and would otherwise widen the group's bounding box.
    const fromX = fromNode.x() + STEP_WIDTH + EDGE_GAP;
    const fromY = fromNode.y() + STEP_HEIGHT / 2;
    const toX = toNode.x() - EDGE_GAP;
    const toY = toNode.y() + STEP_HEIGHT / 2;

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

  // Small clickable handle at an edge's midpoint, since the arrow itself is
  // deliberately non-interactive (listening: false — otherwise it can catch
  // a connection-drag drop meant for the step underneath it).
  const edgeDeleteHandleConfig = (bodyOwner, edge) => {
    const { points } = edgeArrowConfig(bodyOwner, edge);
    const [x1, y1, x2, y2] = points;
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
      radius: HANDLE_VISIBLE_RADIUS,
      fill: '#E57373',
      stroke: '#B71C1C',
      strokeWidth: 1,
      listening: false,
    };
  };

  const edgeDeleteHitConfig = (bodyOwner, edge) => {
    const cfg = edgeDeleteHandleConfig(bodyOwner, edge);
    return {
      x: cfg.x,
      y: cfg.y,
      radius: HANDLE_HIT_RADIUS,
      fill: 'transparent',
    };
  };

  return {
    graphOf,
    handleStepDragMove,
    handleStepDragStart,
    handleStepDragMoveLive,
    bumpDragTick,
    startConnection,
    updateConnectionPreview,
    finishConnectionAtPointer,
    cancelConnection,
    pendingConnection,
    connectingLineConfig,
    edgeArrowConfig,
    edgeDeleteHandleConfig,
    edgeDeleteHitConfig,
  };
}
