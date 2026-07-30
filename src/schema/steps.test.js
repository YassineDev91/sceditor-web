import { describe, it, expect } from 'vitest'
import {
  createActionStep, createCallStep, createEmitStep, createDecisionStep,
  createReturnStep, createRevertStep, createStep, createFlowEdge,
  createStepGraph, normalizeBody, maxOutgoingEdges, nextStepPosition,
} from './steps.js'

describe('step factories', () => {
  it('createActionStep has no reference field and a unique id', () => {
    const a = createActionStep('log it', { x: 10, y: 20 })
    expect(a.cmp_type).toBe('Action')
    expect(a.name).toBe('log it')
    expect(a.x).toBe(10)
    expect(a.y).toBe(20)
    expect(a.description).toBe('')
    expect(a.id).toBeTruthy()
  })

  it('createCallStep carries a target function id', () => {
    const c = createCallStep('transfer tokens', { target: 'function_abc' })
    expect(c.cmp_type).toBe('Call')
    expect(c.target).toBe('function_abc')
  })

  it('createEmitStep carries an eventRef', () => {
    const e = createEmitStep('notify', { eventRef: 'event_abc' })
    expect(e.cmp_type).toBe('Emit')
    expect(e.eventRef).toBe('event_abc')
  })

  it('createRevertStep carries an errorRef', () => {
    const r = createRevertStep('reject', { errorRef: 'error_abc' })
    expect(r.cmp_type).toBe('Revert')
    expect(r.errorRef).toBe('error_abc')
  })

  it('createDecisionStep and createReturnStep have no reference fields', () => {
    expect(createDecisionStep('check balance').cmp_type).toBe('Decision')
    expect(createReturnStep('done').cmp_type).toBe('Return')
  })

  it('two steps never share an id', () => {
    const a = createActionStep('a')
    const b = createActionStep('b')
    expect(a.id).not.toBe(b.id)
  })
})

describe('createStep dispatcher', () => {
  it('dispatches to the right factory by kind', () => {
    expect(createStep('Call', 'x', { target: 'f1' }).target).toBe('f1')
    expect(createStep('Action', 'x').cmp_type).toBe('Action')
  })

  it('throws on an unknown kind', () => {
    expect(() => createStep('Nope', 'x')).toThrow(/Unknown step kind/)
  })
})

describe('maxOutgoingEdges', () => {
  it('caps Action/Call/Emit at 1', () => {
    expect(maxOutgoingEdges('Action')).toBe(1)
    expect(maxOutgoingEdges('Call')).toBe(1)
    expect(maxOutgoingEdges('Emit')).toBe(1)
  })

  it('allows unlimited branching from Decision', () => {
    expect(maxOutgoingEdges('Decision')).toBe(Infinity)
  })

  it('terminates Return and Revert at 0', () => {
    expect(maxOutgoingEdges('Return')).toBe(0)
    expect(maxOutgoingEdges('Revert')).toBe(0)
  })
})

describe('createFlowEdge', () => {
  it('creates an edge with a unique id and optional label', () => {
    const e = createFlowEdge('step_1', 'step_2', { label: 'on success' })
    expect(e.from).toBe('step_1')
    expect(e.to).toBe('step_2')
    expect(e.label).toBe('on success')
    expect(e.id).toBeTruthy()
  })

  it('defaults label to an empty string', () => {
    expect(createFlowEdge('step_1', 'step_2').label).toBe('')
  })

  it('throws without both endpoints', () => {
    expect(() => createFlowEdge(null, 'step_2')).toThrow(/requires both/)
    expect(() => createFlowEdge('step_1', null)).toThrow(/requires both/)
  })
})

describe('normalizeBody', () => {
  it('passes through a new-shape body unchanged', () => {
    const graph = createStepGraph({ steps: [createActionStep('a')], startStepId: 's1' })
    expect(normalizeBody(graph)).toEqual(graph)
  })

  it('returns an empty graph for an old-shape body instead of crashing', () => {
    const oldBody = { type: 'Block', statements: [{ cmp_type: 'AssignmentStatement' }] }
    expect(normalizeBody(oldBody)).toEqual({ steps: [], edges: [], startStepId: null })
  })

  it('returns an empty graph for a missing/undefined body', () => {
    expect(normalizeBody(undefined)).toEqual({ steps: [], edges: [], startStepId: null })
  })
})

describe('nextStepPosition', () => {
  it('places the first step at the base position', () => {
    const owner = { body: createStepGraph() }
    expect(nextStepPosition(owner)).toEqual({ x: 50, y: 50 })
  })

  it('places each subsequent step further down, never overlapping', () => {
    const owner = { body: createStepGraph({ steps: [createActionStep('a'), createActionStep('b')] }) }
    expect(nextStepPosition(owner)).toEqual({ x: 50, y: 450 })
  })

  it('tolerates an old-shape body', () => {
    const owner = { body: { type: 'Block', statements: [{}] } }
    expect(nextStepPosition(owner)).toEqual({ x: 50, y: 50 })
  })

  it('produces strictly non-overlapping positions across consecutive step counts', () => {
    const positions = [0, 1, 2, 3].map(n => {
      const steps = Array.from({ length: n }, (_, i) => createActionStep(`s${i}`))
      return nextStepPosition({ body: createStepGraph({ steps }) }).y
    })
    expect(positions).toEqual([50, 250, 450, 650])
  })
})
