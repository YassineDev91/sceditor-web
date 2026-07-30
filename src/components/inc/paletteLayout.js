const BASE = 100;
const STEP = 30;
const COLUMNS = 8;

export function nextPalettePosition(contract) {
  const count =
    (contract.variables?.length || 0) +
    (contract.structs?.length || 0) +
    (contract.functions?.length || 0) +
    (contract.enums?.length || 0) +
    (contract.guards?.length || 0) +
    (contract.errorDeclarations?.length || 0) +
    (contract.events?.length || 0);

  return {
    x: BASE + (count % COLUMNS) * STEP,
    y: BASE + Math.floor(count / COLUMNS) * STEP,
  };
}
