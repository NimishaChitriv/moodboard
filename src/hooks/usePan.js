import { useState, useCallback, useRef } from 'react'

export function usePan() {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const start = useRef({ x: 0, y: 0 })
  const startPan = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e) => {
    if (e.target !== e.currentTarget) return
    dragging.current = true
    start.current = { x: e.clientX, y: e.clientY }
    startPan.current = { ...pan }
    e.currentTarget.style.cursor = 'grabbing'
  }, [pan])

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    setPan({ x: startPan.current.x + dx, y: startPan.current.y + dy })
  }, [])

  const onMouseUp = useCallback((e) => {
    dragging.current = false
    if (e.currentTarget) e.currentTarget.style.cursor = ''
  }, [])

  return { pan, onMouseDown, onMouseMove, onMouseUp }
}
