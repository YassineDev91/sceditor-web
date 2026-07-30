import { createId } from './id.js'

function baseStep(cmp_type, name, x, y, extra = {}) {
  return {
    id: createId(cmp_type.toLowerCase()),
    cmp_type,
    name,
    x,
    y,
    description: '',
    ...extra,
  }
}

export function createActionStep(name, { x = 0, y = 0 } = {}) {
  return baseStep('Action', name, x, y)
}

export function createCallStep(name, { x = 0, y = 0, target = null } = {}) {
  return baseStep('Call', name, x, y, { target })
}

export function createEmitStep(name, { x = 0, y = 0, eventRef = null } = {}) {
  return baseStep('Emit', name, x, y, { eventRef })
}

export function createDecisionStep(name, { x = 0, y = 0 } = {}) {
  return baseStep('Decision', name, x, y)
}

export function createReturnStep(name, { x = 0, y = 0 } = {}) {
  return baseStep('Return', name, x, y)
}

export function createRevertStep(name, { x = 0, y = 0, errorRef = null } = {}) {
  return baseStep('Revert', name, x, y, { errorRef })
}

const STEP_FACTORIES = {
  Action: createActionStep,
  Call: createCallStep,
  Emit: createEmitStep,
  Decision: createDecisionStep,
  Return: createReturnStep,
  Revert: createRevertStep,
}

export function createStep(kind, name, options = {}) {
  const factory = STEP_FACTORIES[kind]
  if (!factory) {
    throw new Error(`Unknown step kind "${kind}". Expected one of: ${Object.keys(STEP_FACTORIES).join(', ')}`)
  }
  return factory(name, options)
}

// Only Decision steps may branch. Return/Revert end execution along that
// path (no outgoing edge). Everything else has exactly one next step.
const TERMINAL_KINDS = ['Return', 'Revert']
const BRANCHING_KINDS = ['Decision']

export function maxOutgoingEdges(kind) {
  if (TERMINAL_KINDS.includes(kind)) return 0
  if (BRANCHING_KINDS.includes(kind)) return Infinity
  return 1
}

export function createFlowEdge(from, to, { label = '' } = {}) {
  if (!from || !to) {
    throw new Error('createFlowEdge requires both a "from" and a "to" step id')
  }
  return { id: createId('edge'), from, to, label }
}

export function createStepGraph({ steps = [], edges = [], startStepId = null } = {}) {
  return { steps, edges, startStepId }
}

// Tolerant read: pre-redesign bodies only ever had `{ statements: [] }`.
// Rather than migrating that data, callers get an empty graph back so old
// saved contracts render blank (not crash) until re-authored in the new
// model. The first store action that adds a step replaces the body outright
// with a fresh new-shape graph - see contract.js's createBodyStep.
export function normalizeBody(body) {
  if (body && Array.isArray(body.steps)) {
    return {
      steps: body.steps,
      edges: Array.isArray(body.edges) ? body.edges : [],
      startStepId: body.startStepId ?? null,
    }
  }
  return { steps: [], edges: [], startStepId: null }
}

const STEP_BASE_X = 50
const STEP_BASE_Y = 50
const STEP_VERTICAL_GAP = 200

// Simple non-overlapping cascade for newly created steps (matches the
// Palette's structural-element positioning fix, sized for a 200x80 step box
// instead of a ~160x100 structural element).
export function nextStepPosition(bodyOwner) {
  const body = normalizeBody(bodyOwner?.body)
  return { x: STEP_BASE_X, y: STEP_BASE_Y + body.steps.length * STEP_VERTICAL_GAP }
}
