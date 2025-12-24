/**
 * Insertion Sort - O(N²)
 * Builds sorted array one element at a time.
 * Like sorting playing cards in your hand.
 */

export const insertionSortInfo = {
  name: 'Insertion Sort',
  timeComplexity: {
    best: 'O(N)',
    average: 'O(N²)',
    worst: 'O(N²)'
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true,
  description: 'Builds the sorted array one element at a time. Excellent for small arrays or nearly sorted data. Adaptive - runs in O(N) for sorted input.'
}

export function* insertionSort(arr) {
  const array = [...arr]
  const n = array.length
  const sorted = new Set([0]) // First element is trivially sorted

  yield {
    type: 'sorted',
    indices: [0],
    array: [...array],
    sorted: [...sorted],
    message: `First element ${array[0]} is trivially sorted`
  }

  for (let i = 1; i < n; i++) {
    const key = array[i]
    let j = i - 1

    yield {
      type: 'select',
      indices: [i],
      keyIndex: i,
      keyValue: key,
      array: [...array],
      sorted: [...sorted],
      message: `Picking key = ${key} to insert into sorted region`
    }

    // Find the correct position for key
    while (j >= 0) {
      yield {
        type: 'compare',
        indices: [j, i],
        keyIndex: i,
        keyValue: key,
        array: [...array],
        sorted: [...sorted],
        message: `Comparing ${array[j]} with key ${key}`
      }

      if (array[j] > key) {
        // Shift element to the right
        array[j + 1] = array[j]
        yield {
          type: 'shift',
          indices: [j, j + 1],
          keyValue: key,
          array: [...array],
          sorted: [...sorted],
          message: `Shifting ${array[j]} to the right`
        }
        j--
      } else {
        break
      }
    }

    // Insert the key at the correct position
    array[j + 1] = key
    sorted.add(i)

    yield {
      type: 'insert',
      indices: [j + 1],
      keyValue: key,
      array: [...array],
      sorted: [...sorted],
      message: `Inserting ${key} at position ${j + 1}`
    }
  }

  yield {
    type: 'done',
    indices: [],
    array: [...array],
    sorted: [...sorted],
    message: 'Sorting complete!'
  }
}
