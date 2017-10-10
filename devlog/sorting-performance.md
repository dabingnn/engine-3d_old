# Sorting Performance

In memop we use timsort algorithm. We have several reasons to use it:

  1. it is faster.
  1. in v8, when array length over 1000 it will create new Array for sorting.
  1. We want to sort array in range (since we use fixed length buffer and store the actual size of the array manually).

## Reference Articles

  - [Faster Sorting In Javascript](https://duvanenko.tech.blog/2017/06/15/faster-sorting-in-javascript/)
  - [Node-TimSort: Fast Sorting for Node.js](http://mziccard.me/2015/08/10/node-timsort-fast-sorting-nodejs/)
  - [Sorting Faster Than The Native js sort()](https://avraammavridis.com/blog/sorting-faster-than-the-native-js-sort)
  - [Looking for performance? Probably you should NOT use [].sort (V8)](http://blog.mgechev.com/2012/11/24/javascript-sorting-performance-quicksort-v8/)

## Solution

  - [Radix Sort](https://github.com/DragonSpit/JavaScriptAlgorithms)
  - [node-timsort](https://github.com/mziccard/node-timsort)
  - [array.sort() in v8](https://github.com/v8/v8/blob/master/src/js/array.js)
  - [array.sort() in mozilla](https://dxr.mozilla.org/seamonkey/source/js/src/jsarray.c)
