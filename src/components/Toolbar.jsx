import React from 'react'

const COLORS = [
  { name: 'gray', bg: '#F1EFE8' },
  { name: 'blue', bg: '#E6F1FB' },
  { name: 'green', bg: '#EAF3DE' },
]

export default function Toolbar({ cardType, setCardType, cardColor, setCardColor }) {
  return (
    <div style={{
      position: 'fixed',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'white',
      borderRadius: 999,
      padding: '8px 16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
    }}>
      <div style={{ display: 'flex', gap: 4, background: '#F1EFE8', borderRadius: 999, padding: 3 }}>
        {['heading', 'body'].map((t) => (
          <button
            key={t}
            onClick={() => setCardType(t)}
            style={{
              padding: '4px 12px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              background: cardType === t ? 'white' : 'transparent',
              color: cardType === t ? '#222' : '#888',
              boxShadow: cardType === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => setCardColor(c.name)}
            title={c.name}
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: c.bg,
              border: cardColor === c.name ? '2px solid #555' : '1.5px solid rgba(0,0,0,0.15)',
              cursor: 'pointer',
              outline: cardColor === c.name ? '2px solid white' : 'none',
              outlineOffset: '-3px',
            }}
          />
        ))}
      </div>
    </div>
  )
}
