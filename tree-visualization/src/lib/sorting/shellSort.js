/**
 * Shell Sort - O(N^1.5) to O(N^1.25)
 * Generalization of insertion sort that allows exchange of far apart elements.
 * Uses diminishing gap sequence.
 */

export const shellSortInfo = {
  name: 'Shell Sort',
  timeComplexity: {
    best: 'O(N log N)',
    average: 'O(N^1.25)',
    worst: 'O(N²)'
  },
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  description: 'Improves insertion sort by allowing exchanges of far-apart elements. Uses gap sequence (N/2, N/4, ..., 1). Final pass with gap=1 is standard insertion sort on nearly-sorted data.'
}

export function* shellSort(arr) {
  const array = [...arr]
  const n = array.length
  const sorted = new Set()

  // Start with a large gap, then reduce
  let gap = Math.floor(n / 2)

  while (gap > 0) {
    yield {
      type: 'gap',
      gap: gap,
      indices: [],
      array: [...array],
      sorted: [...sorted],
      message: `Starting pass with gap = ${gap}`
    }

    // Perform gapped insertion sort
    for (let i = gap; i < n; i++) {
      const key = array[i]
      let j = i

      yield {
        type: 'select',
        indices: [i],
        gap: gap,
        keyValue: key,
        array: [...array],
        sorted: [...sorted],
        message: `Processing element ${key} at index ${i}`
      }

      // Compare elements that are 'gap' apart
      while (j >= gap) {
        yield {
          type: 'compare',
          indices: [j - gap, j],
          gap: gap,
          keyValue: key,
          array: [...array],
          sorted: [...sorted],
          message: `Comparing ${array[j - gap]} with ${key} (gap=${gap})`
        }

        if (array[j - gap] > key) {
          array[j] = array[j - gap]
          yield {
            type: 'shift',
            indices: [j - gap, j],
            gap: gap,
            keyValue: key,
            array: [...array],
            sorted: [...sorted],
            message: `Moving ${array[j]} to position ${j}`
          }
          j -= gap
        } else {
          break
        }
      }

      array[j] = key
      if (j !== i) {
        yield {
          type: 'insert',
          indices: [j],
          gap: gap,
          keyValue: key,
          array: [...array],
          sorted: [...sorted],
          message: `Placing ${key} at position ${j}`
        }
      }
    }

    // Reduce gap
    gap = Math.floor(gap / 2)
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
