import { ref } from 'vue';
import { useContractStorage } from '@/stores/contract';

export function keepWithinBounds(x, y, width, height, canvasWidth, canvasHeight) {
  const maxX = canvasWidth - width;
  const maxY = canvasHeight - height;

  return {
    x: Math.max(0, Math.min(x, maxX)),
    y: Math.max(0, Math.min(y, maxY))
  };
}

function generateConnectors(nodes) {
  const results = [];
  for (let index = 0; index < nodes.length - 1; index++) {
    const from = nodes[index];
    const to = nodes[index + 1];
    const fromPos = from.getAbsolutePosition();
    const toPos = to.getAbsolutePosition();

    const connector = {
      id: from._id + '-' + to._id,
      points: [
        fromPos.x + from.width() / 2,
        fromPos.y + from.height(),
        toPos.x + to.width() / 2,
        toPos.y
      ],
      stroke: 'black',
      fill: 'black',
      from,
      to
    };

    results.push(connector);
  }
  return results;
}

export function useFunctionLayerConnectors(functionLayer, stageRef, widthCanvaRef, heightCanvaRef) {
  const fileStore = useContractStorage();

  const targets = ref([]);
  const connectors = ref([]);

  const loadFLayersNode = () => {
    const layer = functionLayer.value?.getNode();
    if (!layer) return;
    targets.value = layer.getChildren();
    connectors.value = generateConnectors(targets.value);
  };

  const resetConnectors = () => {
    connectors.value = [];
    targets.value = [];
  };

  const handleDragMove = () => {
    const layer = functionLayer.value?.getNode();
    if (!layer) return;

    const children = layer.getChildren().filter(node => node.getType() === 'Group');

    children.forEach((node) => {
      if (!node.draggable()) return;

      const width = node.width?.() || node.getClientRect().width;
      const height = node.height?.() || node.getClientRect().height;

      const { x, y } = keepWithinBounds(node.x(), node.y(), width, height, widthCanvaRef.value, heightCanvaRef.value);

      node.position({ x, y });
    });

    connectors.value = generateConnectors(children);
    layer.draw();

    functionLayer.value.getNode().getChildren().forEach((node) => {
      const events = node._eventListeners;
      if (events) {
        Object.entries(events).forEach(([type, handlers]) => {
          handlers.forEach((h) => {
            if (typeof h.handler !== 'function') {
              console.warn("💥 Faulty handler:", { node, type, handler: h.handler });
            }
          });
        });
      }
    });
  };

  const getArrowConfig = (connector) => {
    const from = targets.value.find(t => t._id === connector.from._id);
    const to = targets.value.find(t => t._id === connector.to._id);
    if (!from || !to) return { points: [0, 0, 0, 0] };

    const stage = stageRef.value.getNode();
    const fromBox = from.getClientRect({ relativeTo: stage });
    const toBox = to.getClientRect({ relativeTo: stage });

    const fromX = fromBox.x + fromBox.width / 2;
    const fromY = fromBox.y + fromBox.height;
    const toX = toBox.x + toBox.width / 2;
    const toY = toBox.y;

    const midY = (fromY + toY) / 2;

    return {
      id: connector.id,
      points: [
        fromX, fromY,
        fromX, midY,
        toX, midY,
        toX, toY
      ],
      stroke: 'black',
      fill: 'black',
      pointerLength: 8,
      pointerWidth: 8,
      tension: 0,
      lineCap: 'round',
      lineJoin: 'round'
    };
  };

  const handleStatementSelect = (statement) => {
    console.log('📍 Statement selected in Workspace:', statement);
    fileStore.showProperties(statement);
  };

  return {
    connectors,
    loadFLayersNode,
    resetConnectors,
    handleDragMove,
    getArrowConfig,
    handleStatementSelect,
  };
}
