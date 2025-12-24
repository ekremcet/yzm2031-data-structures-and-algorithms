import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Controls from './components/Controls'
import TreeCanvas from './components/TreeCanvas'
import InfoPanel from './components/InfoPanel'
import { BST } from './lib/bst'
import { AVLTree } from './lib/avl'
import { RedBlackTree } from './lib/redblack'

// Sorting imports
import {
  SortingControls,
  ArrayVisualization,
  BarChartVisualization,
  SortingInfoPanel
} from './components/sorting'
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  shellSort,
  mergeSort,
  quickSort,
  heapSort
} from './lib/sorting'

import './App.css'

const ANIMATION_SPEED = 1000 // ms per step (slower for better visibility)

// Sorting algorithm map
const sortingAlgorithms = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  shell: shellSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort
}

function App() {
  // View mode: 'trees' or 'sorting'
  const [viewMode, setViewMode] = useState('trees')

  // Tree state
  const [mode, setMode] = useState('bst')
  const [bstTree, setBstTree] = useState(new BST())
  const [avlTree, setAvlTree] = useState(new AVLTree())
  const [rbTree, setRbTree] = useState(new RedBlackTree())
  const [logs, setLogs] = useState([{ type: 'info', message: 'Ready! Insert a node to begin.' }])
  const [key, setKey] = useState(0)
  const [highlightedNodes, setHighlightedNodes] = useState([])
  const [comparingNode, setComparingNode] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('Ready! Insert a node to begin.')
  const animationRef = useRef(null)

  // Sorting state
  const [sortingAlgorithm, setSortingAlgorithm] = useState('bubble')
  const [sortingArray, setSortingArray] = useState([])
  const [originalArray, setOriginalArray] = useState([])
  const [sortingSteps, setSortingSteps] = useState([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isSortingPlaying, setIsSortingPlaying] = useState(false)
  const [sortingSpeed, setSortingSpeed] = useState(500)
  const [sortingLogs, setSortingLogs] = useState([{ type: 'info', message: 'Generate or enter an array to begin' }])
  const [sortingStats, setSortingStats] = useState({ comparisons: 0, swaps: 0, arraySize: 0 })
  const sortingIntervalRef = useRef(null)

  const getCurrentTree = () => {
    if (mode === 'bst') return bstTree
    if (mode === 'avl') return avlTree
    return rbTree
  }

  const currentTree = getCurrentTree()

  const addLogs = useCallback((newLogs) => {
    setLogs(prev => [...newLogs, ...prev].slice(0, 30))
  }, [])

  const delay = (ms) => new Promise(resolve => {
    animationRef.current = setTimeout(resolve, ms)
  })

  const animateSteps = useCallback(async (steps, value, treeMode) => {
    setIsAnimating(true)
    
    // Step 1: Animate traversal
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      
      await new Promise(resolve => {
        animationRef.current = setTimeout(() => {
          switch (step.type) {
            case 'traverse':
              setHighlightedNodes(step.path || [])
              setComparingNode(step.nodeValue)
              setCurrentMessage(step.message)
              addLogs([{ type: 'info', message: step.message }])
              break
            case 'decision':
              setCurrentMessage(step.message)
              addLogs([{ type: 'info', message: step.message }])
              break
            case 'message':
              setCurrentMessage(step.message)
              addLogs([{ type: step.logType || 'info', message: step.message }])
              break
            case 'insert':
              setCurrentMessage(step.message)
              addLogs([{ type: 'insert', message: step.message }])
              break
            case 'duplicate':
              setCurrentMessage(step.message)
              addLogs([{ type: 'info', message: step.message }])
              break
          }
          resolve()
        }, ANIMATION_SPEED)
      })
    }
    
    await delay(ANIMATION_SPEED)
    setHighlightedNodes([])
    setComparingNode(null)

    // Step 2: For AVL - Insert WITHOUT balancing first to show imbalance
    if (treeMode === 'avl') {
      setCurrentMessage(`Inserting ${value} into AVL tree...`)
      
      // Insert without balancing
      const newTree = avlTree.clone()
      const insertOps = newTree.insertWithoutBalance(value)
      setAvlTree(newTree)
      addLogs(insertOps)
      setKey(k => k + 1)
      
      await delay(ANIMATION_SPEED)
      
      // Check for imbalance
      const imbalance = newTree.checkImbalance()
      
      if (imbalance) {
        // Show the imbalanced state
        setCurrentMessage(`⚠️ Imbalance detected at node ${imbalance.node} (BF: ${imbalance.balance > 0 ? '+' : ''}${imbalance.balance})`)
        addLogs([{ type: 'info', message: `⚠️ Imbalance at ${imbalance.node} (BF: ${imbalance.balance > 0 ? '+' : ''}${imbalance.balance})` }])
        
        await delay(ANIMATION_SPEED * 1.5)
        
        // Show the case
        setCurrentMessage(`${imbalance.caseType} Case: ${imbalance.rotationType}`)
        addLogs([{ type: 'info', message: `${imbalance.caseType} Case identified` }])
        
        await delay(ANIMATION_SPEED * 1.5)
        
        // Now perform the rebalancing
        setCurrentMessage(`Performing rotation...`)
        const rebalanceOps = newTree.rebalance()
        setAvlTree(newTree.clone()) // Force re-render with balanced tree
        addLogs(rebalanceOps)
        setKey(k => k + 1)
        
        await delay(ANIMATION_SPEED)
        setCurrentMessage(`✓ Tree rebalanced! Ready for next insertion.`)
      } else {
        setCurrentMessage(`✓ Node inserted. Tree is balanced. Ready for next.`)
      }
      
    } else if (treeMode === 'rb') {
      // Red-Black tree - use regular insert for now
      const newTree = rbTree.clone()
      const ops = newTree.insert(value)
      setRbTree(newTree)
      addLogs(ops)
      setKey(k => k + 1)
      
      // Show operations
      for (const op of ops) {
        if (op.type === 'rotation' || op.type === 'info') {
          setCurrentMessage(op.message)
          await delay(ANIMATION_SPEED)
        }
      }
      setCurrentMessage(`✓ Insertion complete. Ready for next.`)
      
    } else {
      // BST - simple insert
      const newTree = bstTree.clone()
      const ops = newTree.insert(value)
      setBstTree(newTree)
      addLogs(ops)
      setKey(k => k + 1)
      setCurrentMessage(`✓ Insertion complete. Ready for next.`)
    }
    
    await delay(ANIMATION_SPEED)
    setIsAnimating(false)
  }, [addLogs, avlTree, rbTree, bstTree])

  const handleInsert = useCallback((value) => {
    if (isAnimating) return
    
    const tree = getCurrentTree()
    const steps = tree.getInsertAnimationSteps ? tree.getInsertAnimationSteps(value) : []
    
    if (steps.length > 0) {
      // Has existing nodes - animate traversal then insert
      animateSteps(steps, value, mode)
    } else {
      // Empty tree - direct insert with message
      setIsAnimating(true)
      setCurrentMessage(`Inserting ${value} as root...`)
      
      setTimeout(() => {
        if (mode === 'bst') {
          const newTree = bstTree.clone()
          const ops = newTree.insert(value)
          setBstTree(newTree)
          addLogs(ops)
        } else if (mode === 'avl') {
          const newTree = avlTree.clone()
          const ops = newTree.insert(value)
          setAvlTree(newTree)
          addLogs(ops)
        } else {
          const newTree = rbTree.clone()
          const ops = newTree.insert(value)
          setRbTree(newTree)
          addLogs(ops)
        }
        setKey(k => k + 1)
        setCurrentMessage(`✓ Inserted ${value} as root. Ready for next.`)
        setIsAnimating(false)
      }, 800)
    }
  }, [mode, bstTree, avlTree, rbTree, addLogs, isAnimating, animateSteps])

  // Delete animation
  const animateDelete = useCallback(async (steps, value, treeMode) => {
    setIsAnimating(true)
    
    // Animate search steps
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      
      await new Promise(resolve => {
        animationRef.current = setTimeout(() => {
          switch (step.type) {
            case 'traverse':
              setHighlightedNodes(step.path || [])
              setComparingNode(step.nodeValue)
              setCurrentMessage(step.message)
              addLogs([{ type: 'info', message: step.message }])
              break
            case 'decision':
              setCurrentMessage(step.message)
              addLogs([{ type: 'info', message: step.message }])
              break
            case 'message':
              setCurrentMessage(step.message)
              addLogs([{ type: step.logType || 'info', message: step.message }])
              break
            case 'found':
              setCurrentMessage(step.message)
              addLogs([{ type: 'info', message: step.message }])
              // Mark node for deletion visualization
              if (treeMode === 'bst') {
                setBstTree(prev => {
                  const newTree = prev.clone()
                  newTree.markForDeletion(step.nodeValue)
                  return newTree
                })
              } else if (treeMode === 'avl') {
                setAvlTree(prev => {
                  const newTree = prev.clone()
                  newTree.markForDeletion(step.nodeValue)
                  return newTree
                })
              }
              setKey(k => k + 1)
              break
            case 'case':
              setCurrentMessage(step.message)
              addLogs([{ type: 'info', message: step.message }])
              break
            case 'successor':
              setCurrentMessage(step.message)
              addLogs([{ type: 'info', message: step.message }])
              // Mark successor
              if (treeMode === 'bst') {
                setBstTree(prev => {
                  const newTree = prev.clone()
                  newTree.markAsSuccessor(step.nodeValue)
                  return newTree
                })
              } else if (treeMode === 'avl') {
                setAvlTree(prev => {
                  const newTree = prev.clone()
                  newTree.markAsSuccessor(step.nodeValue)
                  return newTree
                })
              }
              setKey(k => k + 1)
              break
            case 'replace':
              setCurrentMessage(step.message)
              addLogs([{ type: 'info', message: step.message }])
              break
            case 'notFound':
              setCurrentMessage(step.message)
              addLogs([{ type: 'info', message: step.message }])
              break
          }
          resolve()
        }, ANIMATION_SPEED)
      })
    }
    
    // Check if node was found
    const notFoundStep = steps.find(s => s.type === 'notFound')
    if (notFoundStep) {
      await delay(ANIMATION_SPEED)
      setHighlightedNodes([])
      setComparingNode(null)
      setCurrentMessage('Value not found. Ready for next operation.')
      setIsAnimating(false)
      return
    }
    
    await delay(ANIMATION_SPEED)
    setHighlightedNodes([])
    setComparingNode(null)
    
    // Perform actual deletion
    if (treeMode === 'avl') {
      setCurrentMessage(`Deleting ${value} from AVL tree...`)
      
      // Delete without balancing first
      const newTree = avlTree.clone()
      const deleteOps = newTree.deleteWithoutBalance(value)
      setAvlTree(newTree)
      addLogs(deleteOps)
      setKey(k => k + 1)
      
      await delay(ANIMATION_SPEED)
      
      // Check for imbalance
      const imbalance = newTree.checkImbalance()
      
      if (imbalance) {
        setCurrentMessage(`⚠️ Imbalance detected at node ${imbalance.node} (BF: ${imbalance.balance > 0 ? '+' : ''}${imbalance.balance})`)
        addLogs([{ type: 'info', message: `⚠️ Imbalance at ${imbalance.node} (BF: ${imbalance.balance > 0 ? '+' : ''}${imbalance.balance})` }])
        
        await delay(ANIMATION_SPEED * 1.5)
        
        setCurrentMessage(`${imbalance.caseType} Case: ${imbalance.rotationType}`)
        addLogs([{ type: 'info', message: `${imbalance.caseType} Case identified` }])
        
        await delay(ANIMATION_SPEED * 1.5)
        
        setCurrentMessage(`Performing rotation...`)
        const rebalanceOps = newTree.rebalance()
        setAvlTree(newTree.clone())
        addLogs(rebalanceOps)
        setKey(k => k + 1)
        
        await delay(ANIMATION_SPEED)
        setCurrentMessage(`✓ Node deleted and tree rebalanced!`)
      } else {
        setCurrentMessage(`✓ Node deleted. Tree is balanced.`)
      }
      
    } else if (treeMode === 'rb') {
      const newTree = rbTree.clone()
      const ops = newTree.delete ? newTree.delete(value) : [{ type: 'info', message: 'Delete not implemented for Red-Black' }]
      setRbTree(newTree)
      addLogs(ops)
      setKey(k => k + 1)
      setCurrentMessage(`✓ Deletion complete.`)
      
    } else {
      // BST - simple delete
      const newTree = bstTree.clone()
      const ops = newTree.delete(value)
      setBstTree(newTree)
      addLogs(ops)
      setKey(k => k + 1)
      setCurrentMessage(`✓ Node deleted from BST.`)
    }
    
    await delay(ANIMATION_SPEED)
    setIsAnimating(false)
  }, [addLogs, avlTree, rbTree, bstTree])

  const handleDelete = useCallback((value) => {
    if (isAnimating) return
    
    const tree = getCurrentTree()
    
    // Check if value exists
    if (!tree.contains || !tree.contains(value)) {
      setCurrentMessage(`${value} not found in tree!`)
      addLogs([{ type: 'info', message: `${value} not found in tree` }])
      return
    }
    
    const steps = tree.getDeleteAnimationSteps ? tree.getDeleteAnimationSteps(value) : []
    
    if (steps.length > 0) {
      animateDelete(steps, value, mode)
    } else {
      setCurrentMessage(`Tree is empty. Nothing to delete.`)
      addLogs([{ type: 'info', message: 'Tree is empty' }])
    }
  }, [mode, isAnimating, animateDelete, addLogs])

  const handleClear = useCallback(() => {
    if (isAnimating) {
      clearTimeout(animationRef.current)
      setIsAnimating(false)
    }
    
    setHighlightedNodes([])
    setComparingNode(null)
    
    if (mode === 'bst') {
      setBstTree(new BST())
    } else if (mode === 'avl') {
      setAvlTree(new AVLTree())
    } else {
      setRbTree(new RedBlackTree())
    }
    addLogs([{ type: 'info', message: 'Tree cleared' }])
    setCurrentMessage('Tree cleared. Ready to insert.')
    setKey(k => k + 1)
  }, [mode, addLogs, isAnimating])

  const handleModeChange = useCallback((newMode) => {
    if (isAnimating) return
    
    setMode(newMode)
    setHighlightedNodes([])
    setComparingNode(null)
    const modeName = newMode === 'rb' ? 'Red-Black' : newMode.toUpperCase()
    addLogs([{ type: 'info', message: `Switched to ${modeName} mode` }])
    setCurrentMessage(`Switched to ${modeName} mode. Ready to insert.`)
    setKey(k => k + 1)
  }, [addLogs, isAnimating])

  // =====================
  // SORTING FUNCTIONS
  // =====================

  const generateSortingSteps = useCallback((array, algorithm) => {
    const generator = sortingAlgorithms[algorithm]
    if (!generator) return []
    
    const steps = []
    for (const step of generator(array)) {
      steps.push(step)
    }
    return steps
  }, [])

  const handleGenerateArray = useCallback((size) => {
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * 99) + 1
    )
    setSortingArray(newArray)
    setOriginalArray([...newArray])
    setCurrentStepIndex(-1)
    setIsSortingPlaying(false)
    setSortingStats({ comparisons: 0, swaps: 0, arraySize: size })
    
    // Generate steps
    const steps = generateSortingSteps(newArray, sortingAlgorithm)
    setSortingSteps(steps)
    setSortingLogs([{ type: 'info', message: `Generated random array of ${size} elements` }])
  }, [sortingAlgorithm, generateSortingSteps])

  const handleSetArray = useCallback((array) => {
    setSortingArray(array)
    setOriginalArray([...array])
    setCurrentStepIndex(-1)
    setIsSortingPlaying(false)
    setSortingStats({ comparisons: 0, swaps: 0, arraySize: array.length })
    
    // Generate steps
    const steps = generateSortingSteps(array, sortingAlgorithm)
    setSortingSteps(steps)
    setSortingLogs([{ type: 'info', message: `Set custom array of ${array.length} elements` }])
  }, [sortingAlgorithm, generateSortingSteps])

  const handleAlgorithmChange = useCallback((algo) => {
    setSortingAlgorithm(algo)
    setCurrentStepIndex(-1)
    setIsSortingPlaying(false)
    
    // Regenerate steps with original array
    if (originalArray.length > 0) {
      setSortingArray([...originalArray])
      const steps = generateSortingSteps(originalArray, algo)
      setSortingSteps(steps)
      setSortingStats(prev => ({ ...prev, comparisons: 0, swaps: 0 }))
      setSortingLogs([{ type: 'info', message: `Switched to ${algo} sort` }])
    }
  }, [originalArray, generateSortingSteps])

  const handleSortingStep = useCallback(() => {
    if (currentStepIndex >= sortingSteps.length - 1) {
      setIsSortingPlaying(false)
      return
    }

    const nextIndex = currentStepIndex + 1
    const step = sortingSteps[nextIndex]
    
    setCurrentStepIndex(nextIndex)
    setSortingArray(step.array)
    
    // Update stats
    setSortingStats(prev => ({
      ...prev,
      comparisons: prev.comparisons + (step.type === 'compare' ? 1 : 0),
      swaps: prev.swaps + (step.type === 'swap' ? 1 : 0)
    }))
    
    // Add to log
    setSortingLogs(prev => [{ type: step.type, message: step.message }, ...prev].slice(0, 20))
  }, [currentStepIndex, sortingSteps])

  const handleSortingPlay = useCallback(() => {
    if (sortingSteps.length === 0) return
    setIsSortingPlaying(true)
  }, [sortingSteps])

  const handleSortingPause = useCallback(() => {
    setIsSortingPlaying(false)
  }, [])

  const handleSortingReset = useCallback(() => {
    setIsSortingPlaying(false)
    setCurrentStepIndex(-1)
    setSortingArray([...originalArray])
    setSortingStats(prev => ({ ...prev, comparisons: 0, swaps: 0 }))
    setSortingLogs([{ type: 'info', message: 'Reset to original array' }])
  }, [originalArray])

  // Auto-play effect for sorting
  useEffect(() => {
    if (isSortingPlaying) {
      sortingIntervalRef.current = setInterval(() => {
        handleSortingStep()
      }, sortingSpeed)
    }
    
    return () => {
      if (sortingIntervalRef.current) {
        clearInterval(sortingIntervalRef.current)
      }
    }
  }, [isSortingPlaying, sortingSpeed, handleSortingStep])

  // Stop playing when steps are exhausted
  useEffect(() => {
    if (currentStepIndex >= sortingSteps.length - 1 && isSortingPlaying) {
      setIsSortingPlaying(false)
    }
  }, [currentStepIndex, sortingSteps.length, isSortingPlaying])

  const modeName = mode === 'rb' ? 'Red-Black' : mode.toUpperCase()
  
  const stats = {
    mode: modeName,
    nodeCount: currentTree.getNodeCount(),
    height: currentTree.getTreeHeight()
  }

  const currentSortingStep = currentStepIndex >= 0 ? sortingSteps[currentStepIndex] : null
  const maxValue = originalArray.length > 0 ? Math.max(...originalArray) : 100

  return (
    <div className="container">
      <header>
        <h1>{viewMode === 'trees' ? 'Tree Visualization' : 'Sorting Algorithms'}</h1>
        <p className="subtitle">
          {viewMode === 'trees' 
            ? 'Interactive BST, AVL & Red-Black Tree Demo'
            : 'Step-by-step Sorting Algorithm Visualization'}
        </p>
      </header>

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          className={`view-btn ${viewMode === 'trees' ? 'active' : ''}`}
          onClick={() => setViewMode('trees')}
        >
          🌳 Trees
        </button>
        <button
          className={`view-btn ${viewMode === 'sorting' ? 'active' : ''}`}
          onClick={() => setViewMode('sorting')}
        >
          📊 Sorting
        </button>
      </div>

      {viewMode === 'trees' ? (
        <>
          <Controls
            mode={mode}
            onModeChange={handleModeChange}
            onInsert={handleInsert}
            onDelete={handleDelete}
            onClear={handleClear}
            isAnimating={isAnimating}
          />

          <div className={`animation-message ${isAnimating ? 'active' : ''}`}>
            <span className={`status-dot ${isAnimating ? 'pulse-dot' : 'ready-dot'}`}></span>
            {currentMessage}
          </div>

          <div className="main-content">
            <div className="tree-container">
              <AnimatePresence mode="wait">
                <TreeCanvas 
                  key={key}
                  root={currentTree.root} 
                  tree={currentTree}
                  mode={mode}
                  highlightedNodes={highlightedNodes}
                  comparingNode={comparingNode}
                />
              </AnimatePresence>
              {!currentTree.root && (
                <div className="empty-message">
                  <span className="icon">🌳</span>
                  <p>Insert a node to start</p>
                </div>
              )}
            </div>

            <InfoPanel stats={stats} logs={logs} mode={mode} />
          </div>
        </>
      ) : (
        <>
          <SortingControls
            algorithm={sortingAlgorithm}
            onAlgorithmChange={handleAlgorithmChange}
            onGenerateArray={handleGenerateArray}
            onSetArray={handleSetArray}
            onPlay={handleSortingPlay}
            onPause={handleSortingPause}
            onStep={handleSortingStep}
            onReset={handleSortingReset}
            isPlaying={isSortingPlaying}
            speed={sortingSpeed}
            onSpeedChange={setSortingSpeed}
            currentStepIndex={currentStepIndex}
            totalSteps={sortingSteps.length}
            disabled={sortingArray.length === 0}
          />

          <div className={`animation-message ${isSortingPlaying ? 'active' : ''}`}>
            <span className={`status-dot ${isSortingPlaying ? 'pulse-dot' : 'ready-dot'}`}></span>
            {currentSortingStep?.message || 'Generate an array and press Play to begin'}
          </div>

          <div className="main-content sorting-layout">
            <div className="visualizations">
              <ArrayVisualization
                array={sortingArray}
                currentStep={currentSortingStep}
                maxValue={maxValue}
              />
              <BarChartVisualization
                array={sortingArray}
                currentStep={currentSortingStep}
                maxValue={maxValue}
              />
            </div>

            <SortingInfoPanel
              algorithm={sortingAlgorithm}
              currentStep={currentSortingStep}
              stats={sortingStats}
              logs={sortingLogs}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default App
