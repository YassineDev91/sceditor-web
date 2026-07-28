let counter = 0

export function createId(prefix = 'el') {
  counter += 1
  const random = Math.random().toString(36).slice(2, 10)
  return `${prefix}_${Date.now().toString(36)}_${counter}_${random}`
}
