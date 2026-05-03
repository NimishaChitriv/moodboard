import { useState, useCallback, useRef, useEffect } from 'react'
import { loadState, saveState } from '../utils/storage'
import { generateId } from '../utils/ids'

function createBoard(name) {
  return {
    id: generateId('board'),
    name,
    createdAt: Date.now(),
    cards: {},
  }
}

function buildInitialState() {
  const board = createBoard('My Board')
  return { activeBoard: board.id, boards: { [board.id]: board } }
}

export function useBoard() {
  const [state, setState] = useState(null)   // null = loading
  const saveTimerRef = useRef(null)

  // Load from Firestore on mount
  useEffect(() => {
    loadState().then((saved) => {
      setState(saved && saved.boards && saved.activeBoard ? saved : buildInitialState())
    }).catch(() => {
      setState(buildInitialState())
    })
  }, [])

  const debouncedSave = useCallback((nextState) => {
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => saveState(nextState), 600)
  }, [])

  const update = useCallback((updater) => {
    setState((prev) => {
      if (!prev) return prev
      const next = updater(prev)
      debouncedSave(next)
      return next
    })
  }, [debouncedSave])

  const activeBoard = state ? state.boards[state.activeBoard] : null

  const setActiveBoard = useCallback((id) => {
    update((prev) => ({ ...prev, activeBoard: id }))
  }, [update])

  const createNewBoard = useCallback((name) => {
    const board = createBoard(name)
    update((prev) => ({
      ...prev,
      activeBoard: board.id,
      boards: { ...prev.boards, [board.id]: board },
    }))
  }, [update])

  const renameBoard = useCallback((boardId, name) => {
    update((prev) => ({
      ...prev,
      boards: {
        ...prev.boards,
        [boardId]: { ...prev.boards[boardId], name },
      },
    }))
  }, [update])

  const deleteBoard = useCallback((boardId) => {
    update((prev) => {
      const boards = { ...prev.boards }
      delete boards[boardId]
      const ids = Object.keys(boards)
      if (ids.length === 0) {
        const board = createBoard('My Board')
        boards[board.id] = board
        return { activeBoard: board.id, boards }
      }
      const activeBoard = prev.activeBoard === boardId ? ids[0] : prev.activeBoard
      return { ...prev, activeBoard, boards }
    })
  }, [update])

  const addCard = useCallback((type, color, x, y) => {
    update((prev) => {
      const board = prev.boards[prev.activeBoard]
      const maxZ = Object.values(board.cards).reduce((m, c) => Math.max(m, c.zIndex), 0)
      const card = {
        id: generateId('card'),
        type,
        color,
        text: '',
        x,
        y,
        zIndex: maxZ + 1,
      }
      return {
        ...prev,
        boards: {
          ...prev.boards,
          [prev.activeBoard]: {
            ...board,
            cards: { ...board.cards, [card.id]: card },
          },
        },
      }
    })
  }, [update])

  const updateCard = useCallback((cardId, changes) => {
    update((prev) => {
      const board = prev.boards[prev.activeBoard]
      return {
        ...prev,
        boards: {
          ...prev.boards,
          [prev.activeBoard]: {
            ...board,
            cards: {
              ...board.cards,
              [cardId]: { ...board.cards[cardId], ...changes },
            },
          },
        },
      }
    })
  }, [update])

  const deleteCard = useCallback((cardId) => {
    update((prev) => {
      const board = prev.boards[prev.activeBoard]
      const cards = { ...board.cards }
      delete cards[cardId]
      return {
        ...prev,
        boards: {
          ...prev.boards,
          [prev.activeBoard]: { ...board, cards },
        },
      }
    })
  }, [update])

  const bringToFront = useCallback((cardId) => {
    update((prev) => {
      const board = prev.boards[prev.activeBoard]
      const maxZ = Object.values(board.cards).reduce((m, c) => Math.max(m, c.zIndex), 0)
      return {
        ...prev,
        boards: {
          ...prev.boards,
          [prev.activeBoard]: {
            ...board,
            cards: {
              ...board.cards,
              [cardId]: { ...board.cards[cardId], zIndex: maxZ + 1 },
            },
          },
        },
      }
    })
  }, [update])

  return {
    state,
    loading: state === null,
    activeBoard,
    setActiveBoard,
    createNewBoard,
    renameBoard,
    deleteBoard,
    addCard,
    updateCard,
    deleteCard,
    bringToFront,
  }
}
