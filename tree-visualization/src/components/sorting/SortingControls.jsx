import { useState } from 'react'
import './SortingControls.css'

const algorithms = [
  { id: 'bubble', name: 'Bubble' },
  { id: 'selection', name: 'Selection' },
  { id: 'insertion', name: 'Insertion' },
  { id: 'shell', name: 'Shell' },
  { id: 'merge', name: 'Merge' },
  { id: 'quick', name: 'Quick' },
  { id: 'heap', name: 'Heap' }
]

export default function SortingControls({
  algorithm,
  onAlgorithmChange,
  onGenerateArray,
  onSetArray,
  onPlay,
  onPause,
  onStep,
  onReset,
  isPlaying,
  speed,
  onSpeedChange,
  currentStepIndex,
  totalSteps,
  disabled
}) {
  const [arrayInput, setArrayInput] = useState('')
  const [arraySize, setArraySize] = useState(10)

  const handleGenerateRandom = () => {
    onGenerateArray(arraySize)
  }

  const handleSetCustomArray = (e) => {
    e.preventDefault()
    const values = arrayInput
      .split(/[,\s]+/)
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n))
    
    if (values.length > 0) {
      onSetArray(values)
      setArrayInput('')
    }
  }

  const handlePresetArray = (type) => {
    switch (type) {
      case 'sorted':
        onSetArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        break
      case 'reversed':
        onSetArray([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
        break
      case 'nearly':
        onSetArray([1, 2, 4, 3, 5, 6, 8, 7, 9, 10])
        break
      case 'duplicates':
        onSetArray([5, 3, 8, 3, 9, 1, 5, 2, 8, 3])
        break
    }
  }

  return (
    <div className={`sorting-controls ${disabled ? 'disabled' : ''}`}>
      {/* Algorithm Selection */}
      <div className="algorithm-selector">
        {algorithms.map(algo => (
          <button
            key={algo.id}
            className={`algo-btn ${algorithm === algo.id ? 'active' : ''}`}
            onClick={() => onAlgorithmChange(algo.id)}
            disabled={isPlaying}
          >
            {algo.name}
          </button>
        ))}
      </div>

      {/* Array Controls */}
      <div className="array-controls">
        <div className="array-generate">
          <label>
            Size:
            <input
              type="number"
              min="3"
              max="30"
              value={arraySize}
              onChange={(e) => setArraySize(Math.min(30, Math.max(3, parseInt(e.target.value) || 10)))}
              disabled={isPlaying}
            />
          </label>
          <button 
            className="action-btn primary"
            onClick={handleGenerateRandom}
            disabled={isPlaying}
          >
            Random
          </button>
        </div>

        <form className="array-custom" onSubmit={handleSetCustomArray}>
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="Custom: 5, 3, 8, 1, 9..."
            disabled={isPlaying}
          />
          <button 
            type="submit" 
            className="action-btn secondary"
            disabled={isPlaying || !arrayInput.trim()}
          >
            Set
          </button>
        </form>

        <div className="preset-buttons">
          <button 
            className="preset-btn" 
            onClick={() => handlePresetArray('sorted')}
            disabled={isPlaying}
            title="Already sorted array"
          >
            Sorted
          </button>
          <button 
            className="preset-btn" 
            onClick={() => handlePresetArray('reversed')}
            disabled={isPlaying}
            title="Reverse sorted (worst case)"
          >
            Reversed
          </button>
          <button 
            className="preset-btn" 
            onClick={() => handlePresetArray('nearly')}
            disabled={isPlaying}
            title="Nearly sorted array"
          >
            Nearly
          </button>
          <button 
            className="preset-btn" 
            onClick={() => handlePresetArray('duplicates')}
            disabled={isPlaying}
            title="Array with duplicates"
          >
            Duplicates
          </button>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="playback-controls">
        <div className="playback-buttons">
          <button
            className="playback-btn"
            onClick={onReset}
            disabled={disabled && !isPlaying}
            title="Reset"
          >
            ⟲
          </button>
          
          {isPlaying ? (
            <button
              className="playback-btn pause"
              onClick={onPause}
              title="Pause"
            >
              ⏸
            </button>
          ) : (
            <button
              className="playback-btn play"
              onClick={onPlay}
              disabled={disabled}
              title="Play"
            >
              ▶
            </button>
          )}
          
          <button
            className="playback-btn"
            onClick={onStep}
            disabled={disabled || isPlaying}
            title="Step Forward"
          >
            ⏭
          </button>
        </div>

        <div className="speed-control">
          <label>Speed:</label>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={1050 - speed}
            onChange={(e) => onSpeedChange(1050 - parseInt(e.target.value))}
          />
          <span className="speed-label">
            {speed <= 200 ? 'Fast' : speed <= 500 ? 'Medium' : 'Slow'}
          </span>
        </div>

        <div className="step-counter">
          Step: {currentStepIndex + 1} / {totalSteps || '-'}
        </div>
      </div>
    </div>
  )
}
