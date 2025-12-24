/**
 * Bubble Sort - O(N²)
 * Repeatedly swaps adjacent elements if they are in wrong order.
 * Large elements "bubble" to the end.
 */

export const bubbleSortInfo = {
  name: 'Bubble Sort',
  timeComplexity: {
    best: 'O(N)',
    average: 'O(N²)',
    worst: 'O(N²)'
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true,
  description: 'Repeatedly swaps adjacent elements if they are in the wrong order. Optimized version stops early if no swaps occur in a pass.'
}

export function* bubbleSort(arr) {
  const array = [...arr]
  const n = array.length
  const sorted = new Set()

  for (let i = 0; i < n - 1; i++) {
    let swapped = false

    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      yield {
        type: 'compare',
        indices: [j, j + 1],
        array: [...array],
        sorted: [...sorted],
        message: `Comparing ${array[j]} and ${array[j + 1]}`
      }

      if (array[j] > array[j + 1]) {
        // Swap them
        ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
        swapped = true

        yield {
          type: 'swap',
          indices: [j, j + 1],
          array: [...array],
          sorted: [...sorted],
          message: `Swapping ${array[j + 1]} and ${array[j]}`
        }
      }
    }

    // Mark the last element of this pass as sorted
    sorted.add(n - i - 1)
    yield {
      type: 'sorted',
      indices: [n - i - 1],
      array: [...array],
      sorted: [...sorted],
      message: `Element ${array[n - i - 1]} is now in its final position`
    }

    // Early termination if no swaps occurred
    if (!swapped) {
      // Mark all remaining as sorted
      for (let k = 0; k < n - i - 1; k++) {
        sorted.add(k)
      }
      yield {
        type: 'done',
        indices: [],
        array: [...array],
        sorted: [...sorted],
        message: 'No swaps needed - array is sorted!'
      }
      return
    }
  }

  // Mark the first element as sorted
  sorted.add(0)
  yield {
    type: 'done',
    indices: [],
    array: [...array],
    sorted: [...sorted],
    message: 'Sorting complete!'
  }
}
