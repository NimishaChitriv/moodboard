import React, { useState } from 'react'
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import { useBoard } from './hooks/useBoard'

export default function App() {
  const [cardType, setCardType] = useState('body')
  const [cardColor, setCardColor] = useState('gray')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const {
    state,
    loading,
    activeBoard,
    setActiveBoard,
    createNewBoard,
    renameBoard,
    deleteBoard,
    addCard,
    updateCard,
    deleteCard,
    bringToFront,
  } = useBoard()

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#FAFAF8', color: '#aaa', fontSize: 14 }}>
      Loading…
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        boards={state.boards}
        activeBoard={state.activeBoard}
        setActiveBoard={setActiveBoard}
        createNewBoard={createNewBoard}
        renameBoard={renameBoard}
        deleteBoard={deleteBoard}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Active board name — centered in viewport */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 800,
      }}>
        <span style={{
          fontSize: 13,
          fontWeight: 500,
          color: '#999',
          letterSpacing: '0.02em',
        }}>
          {activeBoard?.name || ''}
        </span>
      </div>

      <Toolbar
        cardType={cardType}
        setCardType={setCardType}
        cardColor={cardColor}
        setCardColor={setCardColor}
      />

      <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Canvas
          board={activeBoard}
          addCard={addCard}
          updateCard={updateCard}
          deleteCard={deleteCard}
          bringToFront={bringToFront}
          cardType={cardType}
          cardColor={cardColor}
        />
      </div>
    </div>
  )
}
