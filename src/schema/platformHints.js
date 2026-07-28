const KNOWN_TARGETS = ['solidity', 'vyper', 'ink', 'solana']

export function withPlatformHints(element, target, hints) {
  if (!KNOWN_TARGETS.includes(target)) {
    throw new Error(`Unknown platform target "${target}". Expected one of: ${KNOWN_TARGETS.join(', ')}`)
  }
  const existingHints = element.platformHints || {}
  return {
    ...element,
    platformHints: {
      ...existingHints,
      [target]: { ...(existingHints[target] || {}), ...hints },
    },
  }
}
