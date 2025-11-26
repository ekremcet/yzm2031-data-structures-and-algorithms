import { useMemo } from 'react'
import { motion } from 'framer-motion'
import './TreeCanvas.css'

const NODE_RADIUS = 25
const LEVEL_HEIGHT = 80
const MIN_NODE_SPACING = 60
const PADDING = 50

function calculatePositions(root) {
  if (!root) return new Map()
  
  const positions = new Map()
  
  function assignPositions(node, depth, offset) {
    if (!node) return { min: Infinity, max: -Infinity }
    
    let leftResult = { min: Infinity, max: -Infinity }
    let rightResult = { min: Infinity, max: -Infinity }
    
    if (node.left) {
      leftResult = assignPositions(node.left, depth + 1, offset - MIN_NODE_SPACING)
    }
    if (node.right) {
      rightResult = assignPositions(node.right, depth + 1, offset + MIN_NODE_SPACING)
    }
    
    if (node.left && node.right) {
      const overlap = leftResult.max - rightResult.min + MIN_NODE_SPACING
      if (overlap > 0) {
        shiftTree(node.right, overlap / 2, positions)
        shiftTree(node.left, -overlap / 2, positions)
        rightResult.min += overlap / 2
        rightResult.max += overlap / 2
        leftResult.min -= overlap / 2
        leftResult.max -= overlap / 2
      }
    }
    
    let x = offset
    if (node.left && node.right) {
      const leftPos = positions.get(node.left)
      const rightPos = positions.get(node.right)
      if (leftPos && rightPos) {
        x = (leftPos.x + rightPos.x) / 2
      }
    } else if (node.left) {
      const leftPos = positions.get(node.left)
      if (leftPos) x = leftPos.x + MIN_NODE_SPACING / 2
    } else if (node.right) {
      const rightPos = positions.get(node.right)
      if (rightPos) x = rightPos.x - MIN_NODE_SPACING / 2
    }
    
    positions.set(node, { x, y: depth * LEVEL_HEIGHT + PADDING })
    
    return {
      min: Math.min(x, leftResult.min, rightResult.min),
      max: Math.max(x, leftResult.max, rightResult.max)
    }
  }
  
  function shiftTree(node, shift, positions) {
    if (!node) return
    const pos = positions.get(node)
    if (pos) pos.x += shift
    shiftTree(node.left, shift, positions)
    shiftTree(node.right, shift, positions)
  }
  
  assignPositions(root, 0, 400)
  
  let minX = Infinity, maxX = -Infinity
  positions.forEach(pos => {
    minX = Math.min(minX, pos.x)
    maxX = Math.max(maxX, pos.x)
  })
  
  const width = 800
  const offsetX = (width - (maxX - minX)) / 2 - minX
  positions.forEach(pos => { pos.x += offsetX })
  
  return positions
}

function TreeNode({ node, x, y, tree, mode, isHighlighted, isComparing }) {
  const isRedBlack = mode === 'rb'
  const balance = tree.getBalance ? tree.getBalance(node) : 0
  const isBalanced = Math.abs(balance) <= 1
  
  // Determine node class - priority order matters
  let nodeClass = 'balanced'
  if (node.isDeleting) {
    nodeClass = 'deleting'
  } else if (node.isSuccessor) {
    nodeClass = 'successor'
  } else if (isComparing) {
    nodeClass = 'comparing'
  } else if (isHighlighted) {
    nodeClass = 'highlighted'
  } else if (node.isNew) {
    nodeClass = 'new'
  } else if (isRedBlack) {
    nodeClass = node.color === 'red' ? 'rb-red' : 'rb-black'
  } else if (!isBalanced && mode === 'avl') {
    nodeClass = 'unbalanced'
  }
  
  const balanceSign = balance > 0 ? '+' : ''
  
  return (
    <motion.g
      className={`tree-node ${nodeClass}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Highlight ring for comparing/highlighted nodes */}
      {(isComparing || isHighlighted) && (
        <motion.circle 
          cx={x} 
          cy={y} 
          r={NODE_RADIUS + 8}
          className="highlight-ring"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      <circle cx={x} cy={y} r={NODE_RADIUS} />
      <text x={x} y={isRedBlack ? y : y - 2} className="value">{node.value}</text>
      {mode === 'avl' && (
        <text x={x} y={y + 12} className="bf">BF: {balanceSign}{balance}</text>
      )}
      {isRedBlack && (
        <text x={x} y={y + 12} className="color-label">{node.color === 'red' ? 'R' : 'B'}</text>
      )}
    </motion.g>
  )
}

function TreeEdge({ from, to, isRedBlack, targetNode, isHighlighted }) {
  return (
    <motion.line
      className={`tree-edge ${isRedBlack && targetNode?.color === 'red' ? 'rb-edge-red' : ''} ${isHighlighted ? 'edge-highlighted' : ''}`}
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  )
}

function renderTree(node, positions, tree, mode, edges = [], nodes = [], highlightedNodes = [], comparingNode = null) {
  if (!node) return { edges, nodes }
  
  const pos = positions.get(node)
  if (!pos) return { edges, nodes }
  const isRedBlack = mode === 'rb'
  const isHighlighted = highlightedNodes.includes(node.value)
  const isComparing = comparingNode === node.value
  
  if (node.left) {
    const leftPos = positions.get(node.left)
    const leftHighlighted = highlightedNodes.includes(node.left.value)
    if (leftPos) {
      edges.push(
        <TreeEdge 
          key={`edge-${node.value}-${node.left.value}`} 
          from={pos} 
          to={leftPos}
          isRedBlack={isRedBlack}
          targetNode={node.left}
          isHighlighted={isHighlighted && leftHighlighted}
        />
      )
    }
    renderTree(node.left, positions, tree, mode, edges, nodes, highlightedNodes, comparingNode)
  }
  
  if (node.right) {
    const rightPos = positions.get(node.right)
    const rightHighlighted = highlightedNodes.includes(node.right.value)
    if (rightPos) {
      edges.push(
        <TreeEdge 
          key={`edge-${node.value}-${node.right.value}`} 
          from={pos} 
          to={rightPos}
          isRedBlack={isRedBlack}
          targetNode={node.right}
          isHighlighted={isHighlighted && rightHighlighted}
        />
      )
    }
    renderTree(node.right, positions, tree, mode, edges, nodes, highlightedNodes, comparingNode)
  }
  
  nodes.push(
    <TreeNode 
      key={`node-${node.value}`} 
      node={node} 
      x={pos.x} 
      y={pos.y} 
      tree={tree}
      mode={mode}
      isHighlighted={isHighlighted}
      isComparing={isComparing}
    />
  )
  
  return { edges, nodes }
}

export default function TreeCanvas({ root, tree, mode, highlightedNodes = [], comparingNode = null }) {
  const positions = useMemo(() => calculatePositions(root), [root])
  
  const { edges, nodes } = useMemo(() => {
    if (!root) return { edges: [], nodes: [] }
    return renderTree(root, positions, tree, mode, [], [], highlightedNodes, comparingNode)
  }, [root, positions, tree, mode, highlightedNodes, comparingNode])
  
  let maxY = PADDING
  positions.forEach(pos => {
    maxY = Math.max(maxY, pos.y)
  })
  const svgHeight = Math.max(500, maxY + PADDING + NODE_RADIUS + 20)
  
  return (
    <svg className="tree-svg" style={{ minHeight: svgHeight }}>
      {edges}
      {nodes}
    </svg>
  )
}
