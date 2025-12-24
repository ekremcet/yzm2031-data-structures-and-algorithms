import './SortingInfoPanel.css'

import {
  bubbleSortInfo,
  selectionSortInfo,
  insertionSortInfo,
  shellSortInfo,
  mergeSortInfo,
  quickSortInfo,
  heapSortInfo
} from '../../lib/sorting'

const algorithmInfoMap = {
  bubble: bubbleSortInfo,
  selection: selectionSortInfo,
  insertion: insertionSortInfo,
  shell: shellSortInfo,
  merge: mergeSortInfo,
  quick: quickSortInfo,
  heap: heapSortInfo
}

export default function SortingInfoPanel({ 
  algorithm, 
  currentStep, 
  stats,
  logs 
}) {
  const info = algorithmInfoMap[algorithm]

  return (
    <div className="sorting-info-panel">
      {/* Algorithm Info */}
      <div className="algo-info">
        <h3>{info.name}</h3>
        <p className="algo-description">{info.description}</p>
        
        <div className="complexity-grid">
          <div className="complexity-item">
            <span className="complexity-label">Best</span>
            <span className="complexity-value best">{info.timeComplexity.best}</span>
          </div>
          <div className="complexity-item">
            <span className="complexity-label">Average</span>
            <span className="complexity-value avg">{info.timeComplexity.average}</span>
          </div>
          <div className="complexity-item">
            <span className="complexity-label">Worst</span>
            <span className="complexity-value worst">{info.timeComplexity.worst}</span>
          </div>
          <div className="complexity-item">
            <span className="complexity-label">Space</span>
            <span className="complexity-value space">{info.spaceComplexity}</span>
          </div>
        </div>

        <div className="properties">
          <span className={`property ${info.stable ? 'yes' : 'no'}`}>
            {info.stable ? '✓' : '✗'} Stable
          </span>
          <span className={`property ${info.inPlace ? 'yes' : 'no'}`}>
            {info.inPlace ? '✓' : '✗'} In-Place
          </span>
        </div>
      </div>

      {/* Current Step Info */}
      <div className="step-info">
        <h3>Current Step</h3>
        <div className="step-message">
          {currentStep?.message || 'Press Play or Step to begin'}
        </div>
      </div>

      {/* Stats */}
      <div className="sorting-stats">
        <h3>Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Comparisons</span>
            <span className="stat-value">{stats.comparisons}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Swaps</span>
            <span className="stat-value">{stats.swaps}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Array Size</span>
            <span className="stat-value">{stats.arraySize}</span>
          </div>
        </div>
      </div>

      {/* Operation Log */}
      <div className="log-container">
        <h3>Operation Log</h3>
        <div className="operation-log">
          {logs.map((log, index) => (
            <div key={index} className={`log-entry ${log.type}`}>
              {log.message}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="color-legend">
        <h3>Color Legend</h3>
        <div className="legend-grid">
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
          <div className="legend-item">
            <span className="legend-color pivot"></span>
            <span>Pivot</span>
          </div>
          <div className="legend-item">
            <span className="legend-color minimum"></span>
            <span>Minimum</span>
          </div>
        </div>
      </div>
    </div>
  )
}
