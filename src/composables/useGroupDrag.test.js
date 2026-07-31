import { describe, it, expect } from 'vitest'
import { useGroupDrag } from './useGroupDrag.js'

describe('useGroupDrag', () => {
  it('is inactive with no drag started', () => {
    const g = useGroupDrag()
    expect(g.isGroupDragActive()).toBe(false)
  })

  it('is inactive when only the dragged element is selected', () => {
    const g = useGroupDrag()
    const a = { x: 0, y: 0 }
    g.startGroupDrag(a, [a])
    expect(g.isGroupDragActive()).toBe(false)
  })

  it('records each other selected element\'s offset and applies it on finish', () => {
    const g = useGroupDrag()
    const dragged = { x: 100, y: 100 }
    const other = { x: 150, y: 80 }
    g.startGroupDrag(dragged, [dragged, other])
    expect(g.isGroupDragActive()).toBe(true)

    const finished = g.finishGroupDrag(200, 300)
    expect(finished).toEqual([{ element: other, x: 250, y: 280 }])
  })

  it('applyLiveDelta repositions every other selected element\'s live node by the same delta', () => {
    const g = useGroupDrag()
    const dragged = { x: 0, y: 0 }
    const other = { x: 10, y: 20 }
    g.startGroupDrag(dragged, [dragged, other])

    const positions = []
    const fakeNode = { position: (p) => positions.push(p) }
    g.applyLiveDelta(() => fakeNode, 5, 5)

    expect(positions).toEqual([{ x: 15, y: 25 }])
  })

  it('applyLiveDelta skips elements whose node cannot be resolved', () => {
    const g = useGroupDrag()
    const dragged = { x: 0, y: 0 }
    const other = { x: 10, y: 20 }
    g.startGroupDrag(dragged, [dragged, other])
    expect(() => g.applyLiveDelta(() => null, 5, 5)).not.toThrow()
  })

  it('finishGroupDrag clears the active drag', () => {
    const g = useGroupDrag()
    const dragged = { x: 0, y: 0 }
    const other = { x: 10, y: 10 }
    g.startGroupDrag(dragged, [dragged, other])
    g.finishGroupDrag(0, 0)
    expect(g.isGroupDragActive()).toBe(false)
  })

  it('supports more than one other selected element', () => {
    const g = useGroupDrag()
    const dragged = { x: 0, y: 0 }
    const b = { x: 10, y: 0 }
    const c = { x: 0, y: 10 }
    g.startGroupDrag(dragged, [dragged, b, c])
    const finished = g.finishGroupDrag(100, 100)
    expect(finished).toEqual([
      { element: b, x: 110, y: 100 },
      { element: c, x: 100, y: 110 },
    ])
  })
})
