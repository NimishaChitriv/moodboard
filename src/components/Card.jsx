import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Rnd } from 'react-rnd'

const COLOR_MAP = {
  gray:  { bg: '#F1EFE8', text: '#444441' },
  blue:  { bg: '#E6F1FB', text: '#0C447C' },
  green: { bg: '#EAF3DE', text: '#27500A' },
}

const DIMS = {
  heading: { width: 200, height: 48 },
  body:    { width: 160, height: 160 },
}

export default function Card({ card, selected, onSelect, onDelete, onMove, onTextChange, onBringToFront, panOffset }) {
  const [editing, setEditing] = useState(false)
  const [hovered, setHovered] = useState(false)
  const textRef = useRef(null)
  const editingRef = useRef(false)

  const { bg, text: textColor } = COLOR_MAP[card.color] || COLOR_MAP.gray
  const { width, height } = DIMS[card.type] || DIMS.body
  const borderRadius = card.type === 'body' ? 8 : 6

  // Keep DOM in sync with card.text when not editing
  useEffect(() => {
    if (!editingRef.current && textRef.current) {
      textRef.current.innerText = card.text || ''
    }
  }, [card.text])

  // Focus and place cursor at end when entering edit mode
  useEffect(() => {
    if (editing && textRef.current) {
      editingRef.current = true
      textRef.current.innerText = card.text || ''
      textRef.current.focus()
      const range = document.createRange()
      range.selectNodeContents(textRef.current)
      range.collapse(false)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }, [editing])

  const exitEdit = useCallback(() => {
    if (!editingRef.current) return
    editingRef.current = false
    if (textRef.current) {
      onTextChange(card.id, textRef.current.innerText.trim())
    }
    setEditing(false)
  }, [card.id, onTextChange])

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      exitEdit()
    }
  }

  function handleClick(e) {
    e.stopPropagation()
    onSelect(card.id)
    onBringToFront(card.id)
    setEditing(true)
  }

  const isEmpty = !card.text || card.text.trim() === ''

  return (
    <Rnd
      position={{ x: card.x + panOffset.x, y: card.y + panOffset.y }}
      size={{ width, height }}
      enableResizing={false}
      disableDragging={editing}
      onDragStart={(e) => {
        e.stopPropagation()
        onSelect(card.id)
        onBringToFront(card.id)
      }}
      onDragStop={(e, d) => {
        onMove(card.id, d.x - panOffset.x, d.y - panOffset.y)
      }}
      bounds="parent"
      style={{ zIndex: card.zIndex }}
      cancel=".card-text"
    >
      <div
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          height: '100%',
          background: bg,
          border: selected
            ? `1.5px solid ${textColor}`
            : '0.5px solid rgba(0,0,0,0.12)',
          borderRadius,
          padding: card.type === 'heading' ? '0 10px' : '10px',
          display: 'flex',
          alignItems: card.type === 'heading' ? 'center' : 'flex-start',
          position: 'relative',
          cursor: editing ? 'text' : 'grab',
          userSelect: 'none',
          boxShadow: selected ? `0 0 0 2px ${bg}, 0 0 0 3.5px ${textColor}` : 'none',
          transition: 'box-shadow 0.1s',
        }}
      >
        {hovered && !editing && (
          <button
            onMouseDown={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onDelete(card.id)
            }}
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.15)',
              background: 'white',
              cursor: 'pointer',
              fontSize: 12,
              lineHeight: '16px',
              textAlign: 'center',
              color: '#666',
              zIndex: 10,
              padding: 0,
            }}
          >
            ×
          </button>
        )}

        {/* Placeholder shown when empty and not editing */}
        {isEmpty && !editing && (
          <span style={{
            position: 'absolute',
            opacity: 0.3,
            fontSize: card.type === 'heading' ? 14 : 13,
            fontWeight: card.type === 'heading' ? 600 : 400,
            color: textColor,
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            {card.type === 'heading' ? 'Heading…' : 'Note…'}
          </span>
        )}

        <div
          className="card-text"
          ref={textRef}
          contentEditable={editing}
          suppressContentEditableWarning
          onBlur={exitEdit}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            outline: 'none',
            fontSize: card.type === 'heading' ? 14 : 13,
            fontWeight: card.type === 'heading' ? 600 : 400,
            color: textColor,
            lineHeight: 1.45,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            cursor: editing ? 'text' : 'inherit',
            userSelect: editing ? 'text' : 'none',
            minHeight: '1em',
          }}
        />
      </div>
    </Rnd>
  )
}
