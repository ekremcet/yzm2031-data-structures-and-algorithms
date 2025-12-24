/**
 * Merge Sort - O(N log N)
 * Divide and conquer algorithm.
 * Splits array in half, recursively sorts, then merges.
 */

export const mergeSortInfo = {
  name: 'Merge Sort',
  timeComplexity: {
    best: 'O(N log N)',
    average: 'O(N log N)',
    worst: 'O(N log N)'
  },
  spaceComplexity: 'O(N)',
  stable: true,
  inPlace: false,
  description: 'Divide and conquer algorithm. Splits array in half recursively until single elements, then merges sorted halves. Guaranteed O(N log N) but requires extra space.'
}

export function* mergeSort(arr) {
  const array = [...arr]
  const n = array.length
  const sorted = new Set()
  
  // Use iterative bottom-up merge sort for better visualization
  yield* mergeSortIterative(array, sorted)
}

function* mergeSortIterative(array, sorted) {
  const n = array.length
  
  // Start with subarrays of size 1, then 2, 4, 8...
  for (let size = 1; size < n; size *= 2) {
    yield {
      type: 'phase',
      size: size,
      indices: [],
      array: [...array],
      sorted: [...sorted],
      message: `Merge phase: combining subarrays of size ${size}`
    }

    // Merge adjacent subarrays
    for (let left = 0; left < n - size; left += 2 * size) {
      const mid = left + size - 1
      const right = Math.min(left + 2 * size - 1, n - 1)

      yield {
        type: 'split',
        indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        leftRange: [left, mid],
        rightRange: [mid + 1, right],
        array: [...array],
        sorted: [...sorted],
        message: `Merging [${left}..${mid}] with [${mid + 1}..${right}]`
      }

      yield* merge(array, left, mid, right, sorted)
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

function* merge(array, left, mid, right, sorted) {
  const leftArr = array.slice(left, mid + 1)
  const rightArr = array.slice(mid + 1, right + 1)
  
  let i = 0, j = 0, k = left

  while (i < leftArr.length && j < rightArr.length) {
    yield {
      type: 'compare',
      indices: [left + i, mid + 1 + j],
      comparing: [leftArr[i], rightArr[j]],
      array: [...array],
      sorted: [...sorted],
      message: `Comparing ${leftArr[i]} and ${rightArr[j]}`
    }

    if (leftArr[i] <= rightArr[j]) {
      array[k] = leftArr[i]
      yield {
        type: 'write',
        indices: [k],
        value: leftArr[i],
        array: [...array],
        sorted: [...sorted],
        message: `Writing ${leftArr[i]} to position ${k}`
      }
      i++
    } else {
      array[k] = rightArr[j]
      yield {
        type: 'write',
        indices: [k],
        value: rightArr[j],
        array: [...array],
        sorted: [...sorted],
        message: `Writing ${rightArr[j]} to position ${k}`
      }
      j++
    }
    k++
  }

  // Copy remaining elements from left array
  while (i < leftArr.length) {
    array[k] = leftArr[i]
    yield {
      type: 'write',
      indices: [k],
      value: leftArr[i],
      array: [...array],
      sorted: [...sorted],
      message: `Copying remaining ${leftArr[i]} to position ${k}`
    }
    i++
    k++
  }

  // Copy remaining elements from right array
  while (j < rightArr.length) {
    array[k] = rightArr[j]
    yield {
      type: 'write',
      indices: [k],
      value: rightArr[j],
      array: [...array],
      sorted: [...sorted],
      message: `Copying remaining ${rightArr[j]} to position ${k}`
    }
    j++
    k++
  }

  yield {
    type: 'merged',
    indices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
    array: [...array],
    sorted: [...sorted],
    message: `Merged segment [${left}..${right}]`
  }
}
