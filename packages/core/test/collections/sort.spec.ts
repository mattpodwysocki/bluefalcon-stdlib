import { describe, it, assert } from "vitest";
import { quickSort, insertionSort, mergeSort, nativeSort } from "../../src/collections/sort.js";

const unsorted = [5, 2, 9, 1, 5, 6];
const sorted = [1, 2, 5, 5, 6, 9];

describe("Sorting algorithms", () => {
  it("quickSort should sort an array of numbers", () => {
    const arr = [...unsorted];
    const result = quickSort(arr);
    assert.deepEqual(result, sorted);
    assert.deepEqual(arr, unsorted, "quickSort should not mutate the input array");
  });

  it("insertionSort should sort an array of numbers", () => {
    const arr = [...unsorted];
    const result = insertionSort(arr);
    assert.deepEqual(result, sorted);
    assert.deepEqual(arr, unsorted, "insertionSort should not mutate the input array");
  });

  it("mergeSort should sort an array of numbers", () => {
    const arr = [...unsorted];
    const result = mergeSort(arr);
    assert.deepEqual(result, sorted);
    assert.deepEqual(arr, unsorted, "mergeSort should not mutate the input array");
  });

  it("nativeSort should sort an array of numbers", () => {
    const arr = [...unsorted];
    const result = nativeSort(arr, (a, b) => a - b);
    assert.deepEqual(result, sorted);
    assert.deepEqual(arr, unsorted, "nativeSort should not mutate the input array");
  });

  it("should support custom comparators", () => {
    const arr = ["fig", "pear", "apple", "banana"];
    const byLength = (a: string, b: string) => a.length - b.length;
    assert.deepEqual(quickSort(arr, byLength), ["fig", "pear", "apple", "banana"]);
    assert.deepEqual(insertionSort(arr, byLength), ["fig", "pear", "apple", "banana"]);
    assert.deepEqual(mergeSort(arr, byLength), ["fig", "pear", "apple", "banana"]);
    assert.deepEqual(nativeSort(arr, byLength), ["fig", "pear", "apple", "banana"]);
  });

  it("should handle empty arrays", () => {
    assert.deepEqual(quickSort([]), []);
    assert.deepEqual(insertionSort([]), []);
    assert.deepEqual(mergeSort([]), []);
    assert.deepEqual(nativeSort([]), []);
  });

  it("should handle arrays with one element", () => {
    assert.deepEqual(quickSort([1]), [1]);
    assert.deepEqual(insertionSort([1]), [1]);
    assert.deepEqual(mergeSort([1]), [1]);
    assert.deepEqual(nativeSort([1]), [1]);
  });
});
