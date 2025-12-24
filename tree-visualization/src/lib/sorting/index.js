// Sorting Algorithms Index
export { bubbleSort, bubbleSortInfo } from './bubbleSort'
export { selectionSort, selectionSortInfo } from './selectionSort'
export { insertionSort, insertionSortInfo } from './insertionSort'
export { shellSort, shellSortInfo } from './shellSort'
export { mergeSort, mergeSortInfo } from './mergeSort'
export { quickSort, quickSortInfo } from './quickSort'
export { heapSort, heapSortInfo } from './heapSort'

// Algorithm metadata for UI
export const sortingAlgorithms = {
  bubble: {
    name: 'Bubble',
    generator: 'bubbleSort',
    info: 'bubbleSortInfo'
  },
  selection: {
    name: 'Selection',
    generator: 'selectionSort',
    info: 'selectionSortInfo'
  },
  insertion: {
    name: 'Insertion',
    generator: 'insertionSort',
    info: 'insertionSortInfo'
  },
  shell: {
    name: 'Shell',
    generator: 'shellSort',
    info: 'shellSortInfo'
  },
  merge: {
    name: 'Merge',
    generator: 'mergeSort',
    info: 'mergeSortInfo'
  },
  quick: {
    name: 'Quick',
    generator: 'quickSort',
    info: 'quickSortInfo'
  },
  heap: {
    name: 'Heap',
    generator: 'heapSort',
    info: 'heapSortInfo'
  }
}
