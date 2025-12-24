/**
 * Heap Sort - O(N log N)
 * Uses a max-heap data structure.
 * Build heap, then repeatedly extract maximum.
 */

export const heapSortInfo = {
  name: 'Heap Sort',
  timeComplexity: {
    best: 'O(N log N)',
    average: 'O(N log N)',
    worst: 'O(N log N)'
  },
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  description: 'Uses max-heap property. First builds a max-heap from the array, then repeatedly extracts the maximum and places it at the end. Guaranteed O(N log N) and in-place.'
}

export function* heapSort(arr) {
  const array = [...arr]
  const n = array.length
  const sorted = new Set()

  yield {
    type: 'phase',
    phase: 'build',
    indices: [],
    array: [...array],
    sorted: [...sorted],
    message: 'Phase 1: Building max-heap'
  }

  // Build max-heap (heapify from bottom-up)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(array, n, i, sorted, 'build')
  }

  yield {
    type: 'heapBuilt',
    indices: [],
    array: [...array],
    sorted: [...sorted],
    message: 'Max-heap built! Root contains maximum element'
  }

  yield {
    type: 'phase',
    phase: 'extract',
    indices: [],
    array: [...array],
    sorted: [...sorted],
    message: 'Phase 2: Extracting elements from heap'
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    yield {
      type: 'extractMax',
      indices: [0, i],
      array: [...array],
      sorted: [...sorted],
      message: `Extracting max ${array[0]} to position ${i}`
    }

    // Move current root to end
    ;[array[0], array[i]] = [array[i], array[0]]
    
    yield {
      type: 'swap',
      indices: [0, i],
      array: [...array],
      sorted: [...sorted],
      message: `Swapped ${array[i]} (max) with ${array[0]}`
    }

    // Mark as sorted
    sorted.add(i)
    yield {
      type: 'sorted',
      indices: [i],
      array: [...array],
      sorted: [...sorted],
      message: `${array[i]} is now in its final position`
    }

    // Heapify the reduced heap
    yield* heapify(array, i, 0, sorted, 'extract')
  }

  // First element is automatically sorted
  sorted.add(0)
  yield {
    type: 'done',
    indices: [],
    array: [...array],
    sorted: [...sorted],
    message: 'Sorting complete!'
  }
}

function* heapify(array, heapSize, rootIndex, sorted, phase) {
  let largest = rootIndex
  const left = 2 * rootIndex + 1
  const right = 2 * rootIndex + 2

  yield {
    type: 'heapify',
    indices: [rootIndex],
    left: left < heapSize ? left : null,
    right: right < heapSize ? right : null,
    heapSize: heapSize,
    array: [...array],
    sorted: [...sorted],
    message: `Heapifying at index ${rootIndex} (value: ${array[rootIndex]})`
  }

  // Compare with left child
  if (left < heapSize) {
    yield {
      type: 'compare',
      indices: [largest, left],
      heapSize: heapSize,
      array: [...array],
      sorted: [...sorted],
      message: `Comparing ${array[largest]} with left child ${array[left]}`
    }

    if (array[left] > array[largest]) {
      largest = left
      yield {
        type: 'newLargest',
        indices: [largest],
        array: [...array],
        sorted: [...sorted],
        message: `Left child ${array[largest]} is larger`
      }
    }
  }

  // Compare with right child
  if (right < heapSize) {
    yield {
      type: 'compare',
      indices: [largest, right],
      heapSize: heapSize,
      array: [...array],
      sorted: [...sorted],
      message: `Comparing ${array[largest]} with right child ${array[right]}`
    }

    if (array[right] > array[largest]) {
      largest = right
      yield {
        type: 'newLargest',
        indices: [largest],
        array: [...array],
        sorted: [...sorted],
        message: `Right child ${array[largest]} is larger`
      }
    }
  }

  // If largest is not root, swap and continue heapifying
  if (largest !== rootIndex) {
    ;[array[rootIndex], array[largest]] = [array[largest], array[rootIndex]]
    
    yield {
      type: 'swap',
      indices: [rootIndex, largest],
      array: [...array],
      sorted: [...sorted],
      message: `Swapping ${array[largest]} with ${array[rootIndex]}`
    }

    // Recursively heapify the affected subtree
    yield* heapify(array, heapSize, largest, sorted, phase)
  }
}
