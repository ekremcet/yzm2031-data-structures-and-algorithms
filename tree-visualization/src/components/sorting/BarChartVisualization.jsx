import { motion } from 'framer-motion'
import './BarChartVisualization.css'

export default function BarChartVisualization({ 
  array, 
  currentStep,
  maxValue 
}) {
  const getBarClass = (index) => {
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
  const calculatedMax = maxValue || (isEmpty ? 100 : Math.max(...array, 1))
  const barWidth = isEmpty ? 30 : Math.min(40, Math.max(20, 600 / array.length - 4))

  return (
    <div className="bar-chart-visualization">
      <h3 className="viz-title">Bar Chart View</h3>
      <div className="bar-chart-container">
        {isEmpty ? (
          <div className="empty-chart-message">
            <span className="empty-icon">📈</span>
            <p>Generate or enter an array to visualize</p>
          </div>
        ) : (
          array.map((value, index) => {
            const heightPercent = (value / calculatedMax) * 100
            
            return (
              <motion.div
                key={index}
                className={`bar-wrapper`}
                style={{ width: barWidth }}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <motion.div
                  className={`bar ${getBarClass(index)}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 25 
                  }}
                >
                  <span className="bar-value">{value}</span>
                </motion.div>
                <span className="bar-index">{index}</span>
              </motion.div>
            )
          })
        )}
      </div>
      
      {/* Scale indicator */}
      {!isEmpty && (
        <div className="scale-indicator">
          <span className="scale-max">{calculatedMax}</span>
          <span className="scale-mid">{Math.round(calculatedMax / 2)}</span>
          <span className="scale-min">0</span>
        </div>
      )}
    </div>
  )
}
