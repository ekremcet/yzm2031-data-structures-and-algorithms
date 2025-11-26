import './InfoPanel.css'

export default function InfoPanel({ stats, logs, mode }) {
  const isRedBlack = mode === 'rb'
  const isAVL = mode === 'avl'

  return (
    <div className="info-panel">
      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Mode</span>
          <span className={`stat-value ${isRedBlack ? 'rb-mode' : ''}`}>{stats.mode}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Nodes</span>
          <span className="stat-value">{stats.nodeCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Height</span>
          <span className="stat-value">{stats.height}</span>
        </div>
      </div>

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

      <div className="legend">
        <h3>Legend</h3>
        {isRedBlack ? (
          <>
            <div className="legend-item">
              <span className="legend-color rb-red"></span>
              <span>Red Node</span>
            </div>
            <div className="legend-item">
              <span className="legend-color rb-black"></span>
              <span>Black Node</span>
            </div>
          </>
        ) : isAVL ? (
          <>
            <div className="legend-item">
              <span className="legend-color balanced"></span>
              <span>Balanced (BF: -1, 0, +1)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color unbalanced"></span>
              <span>Unbalanced (|BF| &gt; 1)</span>
            </div>
          </>
        ) : (
          <>
            <div className="legend-item">
              <span className="legend-color balanced"></span>
              <span>Node</span>
            </div>
          </>
        )}
        <div className="legend-item">
          <span className="legend-color new-node"></span>
          <span>Newly inserted</span>
        </div>
        <div className="legend-item">
          <span className="legend-color deleting"></span>
          <span>Being deleted</span>
        </div>
        <div className="legend-item">
          <span className="legend-color successor"></span>
          <span>Successor</span>
        </div>
      </div>

      {isRedBlack && (
        <div className="rb-rules">
          <h3>Red-Black Properties</h3>
          <ol>
            <li>Every node is Red or Black</li>
            <li>Root is always Black</li>
            <li>No two adjacent Red nodes</li>
            <li>Same Black-height on all paths</li>
          </ol>
        </div>
      )}
    </div>
  )
}
