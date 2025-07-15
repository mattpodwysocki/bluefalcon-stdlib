import { Comparator, defaultComparer } from "./collection.js";

/**
 * Non-destructive quicksort for arrays of numbers or with a comparator.
 */
export function quickSort<T>(arr: T[], compareFn: Comparator<T> = defaultComparer): T[] {
  const copy = [...arr];
  function sort(start: number, end: number) {
    if (start >= end) return;
    const pivotIdx = partition(start, end);
    sort(start, pivotIdx - 1);
    sort(pivotIdx + 1, end);
  }
  function partition(start: number, end: number): number {
    const pivot = copy[end];
    let i = start;
    for (let j = start; j < end; j++) {
      if (compareFn(copy[j], pivot) < 0) {
        [copy[i], copy[j]] = [copy[j], copy[i]];
        i++;
      }
    }
    [copy[i], copy[end]] = [copy[end], copy[i]];
    return i;
  }
  sort(0, copy.length - 1);
  return copy;
}

/**
 * Non-destructive insertion sort for small or nearly sorted arrays.
 */
export function insertionSort<T>(arr: T[], compareFn: Comparator<T> = defaultComparer): T[] {
  const copy = [...arr];
  for (let i = 1; i < copy.length; i++) {
    let j = i;
    const temp = copy[i];
    while (j > 0 && compareFn(copy[j - 1], temp) > 0) {
      copy[j] = copy[j - 1];
      j--;
    }
    copy[j] = temp;
  }
  return copy;
}

/**
 * Non-destructive merge sort for stable sorting.
 */
export function mergeSort<T>(arr: T[], compareFn: Comparator<T> = defaultComparer): T[] {
  if (arr.length <= 1) return [...arr];
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compareFn);
  const right = mergeSort(arr.slice(mid), compareFn);
  const result: T[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (compareFn(left[i], right[j]) <= 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);
  return result;
}

/**
 * Returns a sorted copy of the array using the built-in sort (not stable for all engines).
 */
export function nativeSort<T>(arr: T[], compareFn?: Comparator<T>): T[] {
  return [...arr].sort(compareFn);
}
