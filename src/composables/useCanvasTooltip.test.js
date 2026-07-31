// src/composables/useCanvasTooltip.test.js
import { describe, it, expect, vi } from 'vitest'

// useCanvasTooltip.js statically imports measureTextWidth from
// '@/utils/measureText', which statically imports 'konva'. Under this
// project's Vitest `environment: 'node'`, Konva resolves to its Node entry
// point (konva/lib/index-node.js), which unconditionally does
// `require('canvas')` at import time — and the native `canvas` package is
// not installed in this repo (mirrors why Task 1 skipped an automated test
// for measureText.js). That import-time crash happens regardless of
// whether tooltipRectConfig is ever called, so this suite — which
// deliberately never touches tooltipRectConfig — stubs out
// measureTextWidth purely to keep Konva out of the module graph during the
// test run. Nothing about useCanvasTooltip.js's real behavior is mocked.
vi.mock('@/utils/measureText', () => ({
  measureTextWidth: () => 0,
}))

import { useCanvasTooltip } from './useCanvasTooltip.js'

describe('useCanvasTooltip', () => {
  it('starts hidden', () => {
    const { visible } = useCanvasTooltip()
    expect(visible.value).toBe(false)
  })

  it('showTooltip makes it visible and stores the text', () => {
    const { visible, showTooltip, tooltipTextConfig } = useCanvasTooltip()
    showTooltip('full untruncated text', 100, 200)
    expect(visible.value).toBe(true)
    expect(tooltipTextConfig.value.text).toBe('full untruncated text')
  })

  it('positions the text 12px past the given pointer coordinates', () => {
    const { showTooltip, tooltipTextConfig } = useCanvasTooltip()
    showTooltip('x', 100, 200)
    expect(tooltipTextConfig.value.x).toBe(112)
    expect(tooltipTextConfig.value.y).toBe(212)
  })

  it('hideTooltip hides it again', () => {
    const { visible, showTooltip, hideTooltip } = useCanvasTooltip()
    showTooltip('x', 0, 0)
    hideTooltip()
    expect(visible.value).toBe(false)
  })
})
