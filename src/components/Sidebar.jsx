import React, { useState, useRef, useEffect } from 'react'

const SidebarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.4"/>
    <line x1="6" y1="1" x2="6" y2="17" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
)

const PencilIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5 1.5L13.5 3.5L5.5 11.5H3.5V9.5L11.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <line x1="1" y1="13.5" x2="14" y2="13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

function ContextMenu({ x, y, onRename, onDelete, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function handleDown(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleDown)
    return () => document.removeEventListener('mousedown', handleDown)
  }, [onClose])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: y,
        left: x,
        zIndex: 2000,
        background: 'white',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 9,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        padding: '4px',
        minWidth: 148,
      }}
    >
      {[
        { label: 'Rename', action: onRename },
        { label: 'Delete', action: onDelete, danger: true },
      ].map(({ label, action, danger }) => (
        <button
          key={label}
          onMouseDown={(e) => { e.preventDefault(); action(); onClose() }}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '7px 12px',
            border: 'none',
            background: 'transparent',
            borderRadius: 6,
            fontSize: 13.5,
            color: danger ? '#c0392b' : '#222',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.background = danger ? '#fff1f0' : 'rgba(0,0,0,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function BoardItem({ board, isActive, onSelect, onRename, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(board.name)
  const [hovered, setHovered] = useState(false)
  const [menu, setMenu] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  function startEdit() {
    setDraft(board.name)
    setEditing(true)
  }

  function commitEdit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== board.name) onRename(board.id, trimmed)
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditing(false)
  }

  function handleContextMenu(e) {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY })
  }

  if (editing) {
    return (
      <div style={{ padding: '2px 0' }}>
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            padding: '6px 10px',
            border: '1.5px solid rgba(0,0,0,0.18)',
            borderRadius: 7,
            fontSize: 13.5,
            fontWeight: 500,
            color: '#1a1a1a',
            background: 'white',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>
    )
  }

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onDoubleClick={startEdit}
        onContextMenu={handleContextMenu}
        onClick={onSelect}
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: 7,
          margin: '1px 0',
          padding: '7px 10px',
          background: isActive ? 'rgba(0,0,0,0.07)' : hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
          transition: 'background 0.12s',
          cursor: 'pointer',
          fontWeight: isActive ? 500 : 400,
          fontSize: 13.5,
          color: isActive ? '#1a1a1a' : '#444',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          userSelect: 'none',
        }}
      >
        {board.name}
      </div>

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onRename={startEdit}
          onDelete={() => onDelete(board.id)}
          onClose={() => setMenu(null)}
        />
      )}
    </>
  )
}

export default function Sidebar({ boards, activeBoard, setActiveBoard, createNewBoard, renameBoard, deleteBoard, collapsed, setCollapsed }) {

  function handleNew() {
    const name = prompt('Board name:')
    if (name && name.trim()) createNewBoard(name.trim())
  }

  return (
    <>
      <button
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? 'Open sidebar' : 'Close sidebar'}
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 1100,
          width: 32,
          height: 32,
          borderRadius: 7,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = '#333' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888' }}
      >
        <SidebarIcon />
      </button>

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: collapsed ? 0 : 240,
        overflow: 'hidden',
        transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 1000,
        background: '#F0EDE9',
        borderRight: '1px solid rgba(0,0,0,0.07)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ width: 240, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '10px 10px 4px',
            minHeight: 52,
          }}>
            <button
              onClick={handleNew}
              title="New board"
              style={{
                width: 32,
                height: 32,
                borderRadius: 7,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = '#333' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888' }}
            >
              <PencilIcon />
            </button>
          </div>

          <div style={{
            padding: '4px 14px 6px',
            fontSize: 11,
            fontWeight: 600,
            color: '#aaa',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}>
            Boards
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '2px 8px' }}>
            {Object.values(boards).map((b) => (
              <BoardItem
                key={b.id}
                board={b}
                isActive={b.id === activeBoard}
                onSelect={() => setActiveBoard(b.id)}
                onRename={renameBoard}
                onDelete={deleteBoard}
              />
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
