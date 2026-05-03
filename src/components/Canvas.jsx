import React, { useState, useCallback, useRef } from 'react'
import Card from './Card'
import { usePan } from '../hooks/usePan'

export default function Canvas({ board, addCard, updateCard, deleteCard, bringToFront, cardType, cardColor }) {
  const [selectedId, setSelectedId] = useState(null)
  const { pan, onMouseDown, onMouseMove, onMouseUp } = usePan()
  const lastPointerDownTime = useRef(0)
  const lastPointerDownTarget = useRef(null)

  const handleCanvasDoubleClick = useCallback((e) => {
    if (e.target !== e.currentTarget) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - pan.x
    const y = e.clientY - rect.top - pan.y
    addCard(cardType, cardColor, x, y)
  }, [addCard, cardType, cardColor, pan])

  const handleCanvasClick = useCallback((e) => {
    if (e.target === e.currentTarget) setSelectedId(null)
  }, [])

  const cards = board ? Object.values(board.cards) : []

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        position: 'relative',
        background: '#FAFAF8',
        overflow: 'hidden',
        cursor: 'default',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onClick={handleCanvasClick}
      onDoubleClick={handleCanvasDoubleClick}
    >
      {cards
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((card) => (
          <Card
            key={card.id}
            card={card}
            selected={selectedId === card.id}
            panOffset={pan}
            onSelect={setSelectedId}
            onDelete={deleteCard}
            onMove={(id, x, y) => updateCard(id, { x, y })}
            onTextChange={(id, text) => updateCard(id, { text })}
            onBringToFront={bringToFront}
          />
        ))}
    </div>
  )
}
