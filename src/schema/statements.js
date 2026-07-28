export function createEmitStatement(eventId, args = []) {
  if (!eventId) {
    throw new Error('createEmitStatement requires an event id')
  }
  return { cmp_type: 'EmitStatement', eventRef: eventId, args, description: '' }
}

export function createRevertStatement(errorId, args = []) {
  if (!errorId) {
    throw new Error('createRevertStatement requires an error declaration id')
  }
  return { cmp_type: 'RevertStatement', errorRef: errorId, args, description: '' }
}
