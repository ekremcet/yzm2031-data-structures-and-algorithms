import { useState } from 'react'
import './Controls.css'

export default function Controls({ mode, onModeChange, onInsert, onDelete, onClear, isAnimating }) {
  const [insertValue, setInsertValue] = useState('')
  const [deleteValue, setDeleteValue] = useState('')

  const handleInsertSubmit = (e) => {
    e.preventDefault()
    const value = parseInt(insertValue)
    if (!isNaN(value) && !isAnimating) {
      onInsert(value)
      setInsertValue('')
    }
  }

  const handleDeleteSubmit = (e) => {
    e.preventDefault()
    const value = parseInt(deleteValue)
    if (!isNaN(value) && !isAnimating) {
      onDelete(value)
      setDeleteValue('')
    }
  }

  return (
    <div className={`controls ${isAnimating ? 'animating' : ''}`}>
      <div className="mode-selector">
        <button 
          className={`mode-btn ${mode === 'bst' ? 'active' : ''}`}
          onClick={() => onModeChange('bst')}
          disabled={isAnimating}
        >
          BST
        </button>
        <button 
          className={`mode-btn ${mode === 'avl' ? 'active' : ''}`}
          onClick={() => onModeChange('avl')}
          disabled={isAnimating}
        >
          AVL
        </button>
        <button 
          className={`mode-btn rb ${mode === 'rb' ? 'active' : ''}`}
          onClick={() => onModeChange('rb')}
          disabled={isAnimating}
        >
          <span className="rb-text">Red-Black</span>
        </button>
      </div>

      <div className="operations-row">
        <form className="input-group" onSubmit={handleInsertSubmit}>
          <input
            type="number"
            value={insertValue}
            onChange={(e) => setInsertValue(e.target.value)}
            placeholder="Value..."
            disabled={isAnimating}
          />
          <button 
            type="submit" 
            className="action-btn primary"
            disabled={isAnimating}
          >
            Insert
          </button>
        </form>

        <form className="input-group" onSubmit={handleDeleteSubmit}>
          <input
            type="number"
            value={deleteValue}
            onChange={(e) => setDeleteValue(e.target.value)}
            placeholder="Value..."
            disabled={isAnimating}
          />
          <button 
            type="submit" 
            className="action-btn danger"
            disabled={isAnimating}
          >
            Delete
          </button>
        </form>

        <button 
          type="button" 
          className="action-btn secondary" 
          onClick={onClear}
        >
          {isAnimating ? 'Stop' : 'Clear'}
        </button>
      </div>
    </div>
  )
}
