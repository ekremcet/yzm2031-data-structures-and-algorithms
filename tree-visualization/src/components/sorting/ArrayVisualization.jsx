import { motion, AnimatePresence } from 'framer-motion'
import './ArrayVisualization.css'

export default function ArrayVisualization({ 
  array, 
  currentStep,
  maxValue 
}) {
  const getElementClass = (index) => {
    if (!currentStep) return 'default'
    
    const { type, indices = [], sorted = [], minIndex, pivotIndex, keyIndex } = currentStep
    
    // Check if element is in sorted region
    if (sorted.includes(index)) {
      return 'sorted'
    }
    
    // Check based on step type
    if (type === 'compare' && indices.includes(index)) {
      return 'comparing'
    }
    
    if (type === 'swap' && indices.includes(index)) {
      return 'swapping'
    }
    
    if (type === 'shift' && indices.includes(index)) {
      return 'shifting'
    }
    
    if (type === 'insert' && indices.includes(index)) {
      return 'inserting'
    }
    
    if (type === 'write' && indices.includes(index)) {
      return 'writing'
    }
    
    if ((type === 'pivot' || type === 'placePivot') && index === pivotIndex) {
      return 'pivot'
    }
    
    if (type === 'newMin' && index === minIndex) {
      return 'minimum'
    }
    
    if (type === 'select' && indices.includes(index)) {
      return 'selected'
    }
    
    if (type === 'extractMax' && indices.includes(index)) {
      return 'extracting'
    }
    
    if (type === 'heapify' && indices.includes(index)) {
      return 'heapifying'
    }
    
    if (type === 'split' && indices.includes(index)) {
      return 'splitting'
    }
    
    if (type === 'merged' && indices.includes(index)) {
      return 'merged'
    }
    
    // Highlight key in insertion sort
    if (keyIndex === index) {
      return 'key'
    }
    
    return 'default'
  }

  const isEmpty = !array || array.length === 0

  return (
    <div className="array-visualization">
      <h3 className="viz-title">Array View</h3>
      <div className="array-container">
        {isEmpty ? (
          <div className="empty-array-message">
            <span className="empty-icon">📊</span>
            <p>Generate or enter an array to visualize</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {array.map((value, index) => (
              <motion.div
                key={`${index}-${value}`}
                className={`array-element ${getElementClass(index)}`}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 500, 
                  damping: 30,
                  layout: { duration: 0.3 }
                }}
              >
                <span className="element-value">{value}</span>
                <span className="element-index">{index}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      {/* Legend */}
      <div className="array-legend">
        <div className="legend-item">
          <span className="legend-color default"></span>
          <span>Unsorted</span>
        </div>
        <div className="legend-item">
          <span className="legend-color comparing"></span>
          <span>Comparing</span>
        </div>
        <div className="legend-item">
          <span className="legend-color swapping"></span>
          <span>Swapping</span>
        </div>
        <div className="legend-item">
          <span className="legend-color sorted"></span>
          <span>Sorted</span>
        </div>
      </div>
    </div>
  )
}
