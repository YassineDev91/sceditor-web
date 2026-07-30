import { createId } from './id.js'
import { createStepGraph } from './steps.js'

function baseElement(cmp_type, name, x, y, extra = {}) {
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

export function createParameter(name, type) {
  return { name, type }
}

export function createVariable(name, type, { x = 0, y = 0, visibility = 'public' } = {}) {
  return baseElement('Variable', name, x, y, { type, visibility })
}

export function createStructField(name, type) {
  return { name, type }
}

export function createStruct(name, { x = 0, y = 0, literals = [] } = {}) {
  return baseElement('Struct', name, x, y, { literals })
}

export function createEnumValue(name) {
  return { name }
}

export function createEnum(name, { x = 0, y = 0, values = [] } = {}) {
  return baseElement('Enum', name, x, y, { values })
}

export function createGuard(name, { x = 0, y = 0, parameters = [], body = createStepGraph() } = {}) {
  return baseElement('Guard', name, x, y, { parameters, body })
}

export function createGuardRef(guardId, args = []) {
  if (!guardId) {
    throw new Error('createGuardRef requires a guard id')
  }
  return { ref: guardId, args }
}

const MUTABILITY_VALUES = ['pure', 'view', 'write']
const VISIBILITY_VALUES = ['external', 'internal']

function assertMutability(mutability) {
  if (!MUTABILITY_VALUES.includes(mutability)) {
    throw new Error(`Invalid mutability "${mutability}". Expected one of: ${MUTABILITY_VALUES.join(', ')}`)
  }
}

function assertVisibility(visibility) {
  if (!VISIBILITY_VALUES.includes(visibility)) {
    throw new Error(`Invalid visibility "${visibility}". Expected one of: ${VISIBILITY_VALUES.join(', ')}`)
  }
}

export function createFunction(name, {
  x = 0,
  y = 0,
  params = [],
  returnParams = null,
  mutability = 'write',
  acceptsValue = false,
  visibility = 'external',
  guards = [],
  body = createStepGraph(),
} = {}) {
  assertMutability(mutability)
  assertVisibility(visibility)
  return baseElement('Function', name, x, y, {
    params, returnParams, mutability, acceptsValue, visibility, guards, body,
  })
}

export function createConstructor({
  x = 0,
  y = 0,
  params = [],
  mutability = 'write',
  acceptsValue = false,
  guards = [],
  body = createStepGraph(),
} = {}) {
  assertMutability(mutability)
  return {
    id: createId('constructor'),
    cmp_type: 'Constructor',
    x,
    y,
    description: '',
    params,
    mutability,
    acceptsValue,
    guards,
    body,
  }
}

export function createEvent(name, { x = 0, y = 0, parameters = [] } = {}) {
  return baseElement('Event', name, x, y, { parameters })
}

export function createErrorDeclaration(name, { x = 0, y = 0, parameters = [] } = {}) {
  return baseElement('ErrorDeclaration', name, x, y, { parameters })
}
