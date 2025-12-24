/**
 * Quick Sort - O(N log N) average, O(N²) worst
 * Divide and conquer using partitioning.
 * Picks a pivot and partitions array around it.
 */

export const quickSortInfo = {
  name: 'Quick Sort',
  timeComplexity: {
    best: 'O(N log N)',
    average: 'O(N log N)',
    worst: 'O(N²)'
  },
  spaceComplexity: 'O(log N)',
  stable: false,
  inPlace: true,
  description: 'Divide and conquer using partitioning. Picks a pivot element and partitions array so smaller elements go left, larger go right. Fastest general-purpose sort in practice.'
}

export function* quickSort(arr) {
  const array = [...arr]
  const n = array.length
  const sorted = new Set()
  
  // Use iterative approach with explicit stack for better visualization
  const stack = [[0, n - 1]]

  while (stack.length > 0) {
    const [low, high] = stack.pop()

    if (low < high) {
      // Partition and get pivot index
      const pivotResult = yield* partition(array, low, high, sorted)
      const pivotIndex = pivotResult.pivotIndex

      // Mark pivot as sorted
      sorted.add(pivotIndex)
      yield {
        type: 'pivotSorted',
        indices: [pivotIndex],
        array: [...array],
        sorted: [...sorted],
        message: `Pivot ${array[pivotIndex]} is now in its final position`
      }

      // Push subarrays to stack (right first, so left is processed first)
      if (pivotIndex + 1 < high) {
        stack.push([pivotIndex + 1, high])
      }
      if (low < pivotIndex - 1) {
        stack.push([low, pivotIndex - 1])
      }

      // Handle single element subarrays
      if (pivotIndex + 1 === high) {
        sorted.add(high)
      }
      if (low === pivotIndex - 1) {
        sorted.add(low)
      }
    } else if (low === high) {
      sorted.add(low)
    }
  }

  // Mark all as sorted
  for (let i = 0; i < n; i++) {
    sorted.add(i)
  }

  yield {
    type: 'done',
    indices: [],
    array: [...array],
    sorted: [...sorted],
    message: 'Sorting complete!'
  }
}

function* partition(array, low, high, sorted) {
  // Use last element as pivot (Lomuto partition scheme)
  const pivot = array[high]
  
  yield {
    type: 'pivot',
    indices: [high],
    pivotIndex: high,
    pivotValue: pivot,
    range: [low, high],
    array: [...array],
    sorted: [...sorted],
    message: `Selected pivot = ${pivot} (last element)`
  }

  let i = low - 1

  for (let j = low; j < high; j++) {
    yield {
      type: 'compare',
      indices: [j, high],
      pivotIndex: high,
      pivotValue: pivot,
      partitionIndex: i,
      array: [...array],
      sorted: [...sorted],
      message: `Comparing ${array[j]} with pivot ${pivot}`
    }

    if (array[j] < pivot) {
      i++
      if (i !== j) {
        ;[array[i], array[j]] = [array[j], array[i]]
        yield {
          type: 'swap',
          indices: [i, j],
          pivotIndex: high,
          pivotValue: pivot,
          array: [...array],
          sorted: [...sorted],
          message: `${array[j]} < ${pivot}: Swapping ${array[j]} with ${array[i]}`
        }
      } else {
        yield {
          type: 'noSwap',
          indices: [i],
          pivotIndex: high,
          pivotValue: pivot,
          array: [...array],
          sorted: [...sorted],
          message: `${array[i]} < ${pivot}: Already in correct position`
        }
      }
    }
  }

  // Place pivot in its correct position
  ;[array[i + 1], array[high]] = [array[high], array[i + 1]]
  
  yield {
    type: 'placePivot',
    indices: [i + 1, high],
    pivotIndex: i + 1,
    pivotValue: pivot,
    array: [...array],
    sorted: [...sorted],
    message: `Placing pivot ${pivot} at position ${i + 1}`
  }

  return { pivotIndex: i + 1 }
}
