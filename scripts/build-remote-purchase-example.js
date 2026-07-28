import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

import { primitiveType, referenceType } from '../src/schema/types.js'
import {
  createParameter,
  createVariable,
  createEnumValue,
  createEnum,
  createGuard,
  createGuardRef,
  createFunction,
  createConstructor,
  createEvent,
  createErrorDeclaration,
} from '../src/schema/elements.js'
import { createEmitStatement, createRevertStatement } from '../src/schema/statements.js'
import { createContract } from '../src/schema/contract.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

function assignment(name, value) {
  return {
    cmp_type: 'AssignmentStatement',
    expressions: [{ left: { type: '', name }, right: { type: '', value } }],
    description: '',
  }
}

function condition(left, operator, right, body = []) {
  return { cmp_type: 'ConditionStatement', condition: { type: 'BinaryExpression', left, operator, right }, body, description: '' }
}

const contract = createContract('Purchase')

const stateEnum = createEnum('State', {
  x: 206,
  y: 56,
  values: [
    createEnumValue('Created'),
    createEnumValue('Locked'),
    createEnumValue('Release'),
    createEnumValue('Inactive'),
  ],
})
contract.enums.push(stateEnum)

contract.variables.push(
  createVariable('state', referenceType(stateEnum.id), { x: 381, y: 138 }),
  createVariable('value', primitiveType('uint', { size: 256 }), { x: 380, y: 53 }),
  createVariable('seller', primitiveType('address', { payable: true }), { x: 381, y: 94 }),
  createVariable('buyer', primitiveType('address', { payable: true }), { x: 382, y: 179 }),
)

const onlySeller = createGuard('OnlySeller', { x: 524, y: 39 })
const onlyBuyer = createGuard('OnlyBuyer', { x: 525, y: 189 })
const inState = createGuard('InState', {
  x: 522,
  y: 115,
  parameters: [createParameter('state_', referenceType(stateEnum.id))],
})
contract.guards.push(onlySeller, onlyBuyer, inState)

const errOnlySeller = createErrorDeclaration('OnlySeller', { x: 45, y: 517 })
const errOnlyBuyer = createErrorDeclaration('OnlyBuyer', { x: 46, y: 418 })
const errInvalidState = createErrorDeclaration('InvalidState', {
  x: 45,
  y: 467,
  parameters: [createParameter('expected', referenceType(stateEnum.id))],
})
const errValueNotEven = createErrorDeclaration('ValueNotEven', {
  x: 45,
  y: 564,
  parameters: [createParameter('value', primitiveType('uint', { size: 256 }))],
})
contract.errorDeclarations.push(errOnlySeller, errOnlyBuyer, errInvalidState, errValueNotEven)

const evAborted = createEvent('Aborted', { x: 700, y: 40 })
const evItemReceived = createEvent('ItemReceived', { x: 700, y: 100 })
const evPurchaseConfirmed = createEvent('PurchaseConfirmed', {
  x: 700,
  y: 160,
  parameters: [createParameter('buyer', primitiveType('address'))],
})
const evSellerRefunded = createEvent('SellerRefunded', { x: 700, y: 220 })
contract.events.push(evAborted, evItemReceived, evPurchaseConfirmed, evSellerRefunded)

contract._constructor = createConstructor({
  x: 25,
  y: 59,
  mutability: 'write',
  acceptsValue: true,
  body: {
    type: 'Block',
    statements: [
      assignment('seller', 'payable(msg.sender)'),
      assignment('value', 'msg.value / 2'),
      condition('2 * value', '!=', 'msg.value', [
        createRevertStatement(errValueNotEven.id, ['msg.value']),
      ]),
    ],
  },
})

contract.functions.push(
  createFunction('abort', {
    x: 245,
    y: 238,
    mutability: 'write',
    guards: [createGuardRef(onlySeller.id), createGuardRef(inState.id, ['State.Created'])],
    body: {
      type: 'Block',
      statements: [
        createEmitStatement(evAborted.id),
        assignment('state', 'State.Inactive'),
        { cmp_type: 'CallStatement', object: 'seller', method: 'transfer(address(this).balance)', params: [], description: '' },
      ],
    },
  }),
  createFunction('confirmPurchase', {
    x: 432,
    y: 265,
    mutability: 'write',
    acceptsValue: true,
    guards: [createGuardRef(inState.id, ['State.Created'])],
    body: {
      type: 'Block',
      statements: [
        createEmitStatement(evPurchaseConfirmed.id, ['msg.sender']),
        assignment('buyer', 'payable(msg.sender)'),
        assignment('state', 'State.Locked'),
      ],
    },
  }),
  createFunction('confirmReceived', {
    x: 250,
    y: 389,
    mutability: 'write',
    guards: [createGuardRef(onlyBuyer.id), createGuardRef(inState.id, ['State.Locked'])],
    body: {
      type: 'Block',
      statements: [
        createEmitStatement(evItemReceived.id),
        assignment('state', 'State.Release'),
        { cmp_type: 'CallStatement', object: 'buyer', method: 'transfer(value)', params: [], description: '' },
      ],
    },
  }),
  createFunction('refundSeller', {
    x: 62,
    y: 239,
    mutability: 'write',
    guards: [createGuardRef(onlySeller.id), createGuardRef(inState.id, ['State.Locked'])],
    body: {
      type: 'Block',
      statements: [
        createEmitStatement(evSellerRefunded.id),
        assignment('state', 'State.Inactive'),
        { cmp_type: 'CallStatement', object: 'seller', method: 'transfer(3 * value)', params: [], description: '' },
      ],
    },
  }),
)

const outPath = resolve(__dirname, '..', 'remote_purchase.json')
writeFileSync(outPath, JSON.stringify(contract, null, 2) + '\n')
console.log(`Wrote ${outPath}`)
