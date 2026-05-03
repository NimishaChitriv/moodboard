# BRIEF.md — Digital Moodboard App

## What we are building
A spatial canvas web app where the user can freely place and drag "index cards"
on a freeform board — like a physical pinboard or sticky-note wall.
The user cannot think in linear lists. This is their primary thinking tool.

---

## Tech stack
- React (Vite scaffold)
- react-rnd  (drag only — no resize)
- localStorage for persistence (no backend, no auth)

---

## Card types
Two fixed sizes. No resizing by the user.

| Type    | Shape     | Dimensions  | Purpose                        |
|---------|-----------|-------------|--------------------------------|
| heading | wide rect | 200 x 48px  | Section label / group title    |
| body    | square    | 160 x 160px | Note, idea, detail             |

---

## Colours
Three options only. No other colours.

| Name  | Background | Text      |
|-------|------------|-----------|
| gray  | #F1EFE8    | #444441   |
| blue  | #E6F1FB    | #0C447C   |
| green | #EAF3DE    | #27500A   |

---

## Features — MVP (build all of these)

1. **Toolbar** (top center, pill shape)
   - Card type toggle: Heading | Body
   - Colour picker: 3 swatches (gray, blue, green)

2. **Canvas**
   - Full viewport, light warm-gray background (#F7F6F2)
   - Pan by click-dragging the empty canvas (no zoom needed)
   - Double-click empty canvas → creates a new card at that position

3. **Cards**
   - Draggable anywhere on canvas via react-rnd (drag only, disable resize)
   - Click-to-select (shows subtle ring)
   - Double-click card text → inline edit (contenteditable or textarea)
   - Press Escape or click away → save text, exit edit
   - Hover → show small × delete button (top-right corner)
   - Last clicked card comes to front (zIndex management)
   - Card border: 0.5px solid rgba(0,0,0,0.12)
   - Border radius: 8px for body, 6px for heading

4. **Multiple boards**
   - Sidebar (left, collapsible) listing saved boards
   - "New board" button → prompts for a name
   - Active board name shown in top bar
   - Each board stored separately in localStorage

5. **Auto-save**
   - Debounced save to localStorage on every card move/edit/create/delete
   - On app load, restore last active board

---

## Data schema (localStorage)

Key: `moodboard:state`

```json
{
  "activeBoard": "board_abc123",
  "boards": {
    "board_abc123": {
      "id": "board_abc123",
      "name": "HR Policy Map",
      "createdAt": 1717000000000,
      "cards": {
        "card_001": {
          "id": "card_001",
          "type": "heading",
          "color": "gray",
          "text": "My contract",
          "x": 320,
          "y": 140,
          "zIndex": 3
        }
      }
    }
  }
}
```

---

## Out of scope (do not build)
- User authentication
- Cloud sync or backend
- Multiplayer / collaboration
- Zoom / minimap
- Images or file attachments on cards
- Connectors or arrows between cards
- Undo / redo
- Card resizing
- Export or share

---

## Folder structure to generate
```
moodboard/
  src/
    App.jsx
    main.jsx
    components/
      Canvas.jsx
      Card.jsx
      Toolbar.jsx
      Sidebar.jsx
    hooks/
      useBoard.js
      usePan.js
    utils/
      storage.js
      ids.js
    styles/
      global.css
  index.html
  vite.config.js
  package.json
```

---

## Opening prompt for Claude Code
Paste this verbatim when Claude Code starts:

> Read BRIEF.md carefully. Scaffold a React + Vite project in this folder,
> install react-rnd, then build every feature listed under "Features — MVP"
> exactly as specified. Use the data schema and folder structure from the brief.
> Do not add features not listed. Start by running: npm create vite@latest . -- --template react
