import { useEffect, useState } from 'react'

const levels = {
  easy: 6,
  medium: 8,
  hard: 12,
}

const generateShuffledCards = (count) => {
  const emojis = ['🍕', '🎮', '🚀', '🐱', '🌈', '🎵', '⚽', '🐶', '📦', '💡', '🎯', '🧃']
  const selected = emojis.slice(0, count)
  return [...selected, ...selected].sort(() => Math.random() - 0.5)
}

export default function App() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [clicks, setClicks] = useState(0)
  const [disableAll, setDisableAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState(null)

  useEffect(() => {
    if (mode) {
      const timer = setTimeout(() => setLoading(false), 1500)
      setCards(generateShuffledCards(levels[mode]))
      return () => clearTimeout(timer)
    }
  }, [mode])

  const handleFlip = (index) => {
    if (disableAll || flipped.includes(index) || matched.includes(index)) return
    setFlipped((prev) => [...prev, index])
    setClicks((prev) => prev + 1)
  }

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      setDisableAll(true)

      if (cards[first] === cards[second]) {
        setMatched((prev) => [...prev, first, second])
      }

      setTimeout(() => {
        setFlipped([])
        setDisableAll(false)
      }, 800)
    }
  }, [flipped, cards])

  const handleReset = () => {
    setFlipped([])
    setMatched([])
    setClicks(0)
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
    setCards(generateShuffledCards(levels[mode]))
  }

  const handleBackToMenu = () => {
    setMode(null)
    setFlipped([])
    setMatched([])
    setClicks(0)
    setLoading(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {!mode ? (
        <div className="text-center animate-fadeIn">
          <h1 className="text-5xl font-bold text-green-600 mb-6">Memory Card Game</h1>
          <p className="text-gray-600 text-lg mb-4">Choose your difficulty level</p>
          <div className="space-x-4">
            {Object.keys(levels).map((lvl) => (
              <button
                key={lvl}
                className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 capitalize"
                onClick={() => setMode(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      ) : loading ? (
        <div className="animate-fadeIn text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">Memory Card Game</h1>
          <p className="text-gray-500 text-lg">Loading cards...</p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4 drop-shadow-md">
            Memory Card Game ({mode})
          </h1>

          <div className="mb-4 text-gray-700 font-medium space-x-4 text-sm sm:text-base">
            <span>✅ Matches: {matched.length / 2}</span>
            <span>🖱️ Clicks: {clicks}</span>
            <button
              onClick={handleReset}
              className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
            >
              🔁 Reset
            </button>
            <button
              onClick={handleBackToMenu}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
            >
              ⬅️ Back to Menu
            </button>
          </div>

          <div
            className={`grid gap-2 animate-fadeIn text-sm sm:text-base ${
              levels[mode] <= 6 ? 'grid-cols-3' : levels[mode] === 8 ? 'grid-cols-4' : 'grid-cols-6'
            } max-w-full`}
          >
            {cards.map((icon, i) => {
              const isFlipped = flipped.includes(i) || matched.includes(i)
              return (
                <div
                  key={i}
                  onClick={() => handleFlip(i)}
                  className={`aspect-square rounded-lg shadow-md flex items-center justify-center text-xl sm:text-2xl font-bold cursor-pointer transition-transform duration-300 select-none transform ${
                    isFlipped ? 'bg-white scale-100' : 'bg-indigo-400 scale-95'
                  } hover:scale-105`}
                >
                  {isFlipped ? icon : '❓'}
                </div>
              )
            })}
          </div>

          {matched.length === cards.length && (
            <p className="mt-6 text-green-600 text-lg font-semibold animate-bounce">
              🎉 All matched! You did it in {clicks} clicks!
            </p>
          )}
        </>
      )}
    </div>
  )
}
