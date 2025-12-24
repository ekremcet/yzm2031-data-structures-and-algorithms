/**
 * Selection Sort - O(N²)
 * Finds minimum element and places it at the beginning.
 * Divides array into sorted (left) and unsorted (right) parts.
 */

export const selectionSortInfo = {
  name: 'Selection Sort',
  timeComplexity: {
    best: 'O(N²)',
    average: 'O(N²)',
    worst: 'O(N²)'
  },
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  description: 'Divides array into sorted and unsorted regions. Repeatedly selects the minimum from unsorted region and moves it to sorted region.'
}

export function* selectionSort(arr) {
  const array = [...arr]
  const n = array.length
  const sorted = new Set()

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    yield {
      type: 'select',
      indices: [i],
      minIndex: minIdx,
      array: [...array],
      sorted: [...sorted],
      message: `Starting pass ${i + 1}: Finding minimum in unsorted region`
    }

    // Find minimum in unsorted region
    for (let j = i + 1; j < n; j++) {
      yield {
        type: 'compare',
        indices: [minIdx, j],
        minIndex: minIdx,
        array: [...array],
        sorted: [...sorted],
        message: `Comparing current min ${array[minIdx]} with ${array[j]}`
      }

      if (array[j] < array[minIdx]) {
        minIdx = j
        yield {
          type: 'newMin',
          indices: [j],
          minIndex: minIdx,
          array: [...array],
          sorted: [...sorted],
          message: `New minimum found: ${array[minIdx]}`
        }
      }
    }

    // Swap if minimum is not already in place
    if (minIdx !== i) {
      ;[array[i], array[minIdx]] = [array[minIdx], array[i]]
      yield {
        type: 'swap',
        indices: [i, minIdx],
        array: [...array],
        sorted: [...sorted],
        message: `Swapping ${array[minIdx]} with ${array[i]}`
      }
    }

    // Mark as sorted
    sorted.add(i)
    yield {
      type: 'sorted',
      indices: [i],
      array: [...array],
      sorted: [...sorted],
      message: `Element ${array[i]} is now in its final position`
    }
  }

  // Last element is automatically sorted
  sorted.add(n - 1)
  yield {
    type: 'done',
    indices: [],
    array: [...array],
    sorted: [...sorted],
    message: 'Sorting complete!'
  }
}
