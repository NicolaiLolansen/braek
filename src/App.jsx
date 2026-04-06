import { useState, useCallback, useRef } from 'react'

const SPLATS = ['🤮', '🤢', '💚', '🟢', '🟩']

function Splat({ x, y, emoji, id }) {
  return (
    <span
      key={id}
      className="splat"
      style={{ left: x, top: y }}
    >
      {emoji}
    </span>
  )
}

export default function App() {
  const [puking, setPuking] = useState(false)
  const [splats, setSplats] = useState([])
  const idRef = useRef(0)

  const handlePuke = useCallback((e) => {
    e.preventDefault()
    setPuking(true)

    // spawn 3-6 random splats
    const count = 3 + Math.floor(Math.random() * 4)
    const newSplats = Array.from({ length: count }, () => {
      const angle = (Math.random() * 120 - 60) * (Math.PI / 180) - Math.PI / 2
      const dist = 80 + Math.random() * 200
      return {
        id: idRef.current++,
        x: `calc(50% + ${Math.cos(angle) * dist}px)`,
        y: `calc(50% + ${Math.sin(angle) * dist}px)`,
        emoji: SPLATS[Math.floor(Math.random() * SPLATS.length)],
      }
    })

    setSplats((prev) => [...prev, ...newSplats])

    // clean up old splats after animation
    setTimeout(() => {
      setSplats((prev) => prev.filter((s) => !newSplats.includes(s)))
    }, 1000)

    setTimeout(() => setPuking(false), 400)
  }, [])

  return (
    <div className="scene">
      {splats.map((s) => (
        <Splat key={s.id} {...s} />
      ))}
      <button
        className={`puke-btn${puking ? ' puking' : ''}`}
        onPointerDown={handlePuke}
        aria-label="puke"
      >
        🤮
      </button>
    </div>
  )
}
