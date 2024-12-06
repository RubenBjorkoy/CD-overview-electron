function shuffle1() {
  let arr1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  let len = arr1.length;
  let arr2 = [];
  for (let i = 0; i < len; i++) {
    let rand = Math.floor(Math.random() * arr1.length);
    arr2.push(arr1[rand]);
    arr1.splice(rand, 1);
  }
  console.log(arr2);
}

function shuffle2() {
  let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  for (let i = 0; i < arr.length; i++) {
    let x = Math.floor(Math.random() * arr.length);
    while (x < i) {
      x = Math.floor(Math.random() * arr.length);
    }
    let num = arr[x];
    arr.splice(x, 1);
    arr.splice(i, 0, num);
  }
  console.log(arr);
}

function duplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i == j) break;
      if (arr[i] == arr[j]) return console.log('There is a duplicate');
    }
  }
  return console.log('There is no duplicates');
}

function shuffle11(array) {
  let arr1 = array.slice(); // Make a copy of the original array
  let len = arr1.length;
  let arr2 = [];
  for (let i = 0; i < len; i++) {
    let rand = Math.floor(Math.random() * arr1.length);
    arr2.push(arr1[rand]);
    arr1.splice(rand, 1);
  }
  return arr2;
}

function shuffle21(array) {
  let arr = array.slice(); // Make a copy of the original array
  for (let i = 0; i < arr.length; i++) {
    let x = Math.floor(Math.random() * arr.length);
    while (x < i) {
      x = Math.floor(Math.random() * arr.length);
    }
    let num = arr[x];
    arr.splice(x, 1);
    arr.splice(i, 0, num);
  }
  return arr;
}

// Create an array of 10000 unique numbers
let array = Array.from({ length: 10000 }, (v, k) => k);

// Measure the time it takes for shuffle1 to run
let t1 = performance.now();

// Get the initial memory usage
let initialUsage = process.memoryUsage();

// Shuffle the array using shuffle1
shuffle11(array);

// Get the final memory usage
let finalUsage = process.memoryUsage();

// Calculate the difference in memory usage
let usage1 = finalUsage.rss - initialUsage.rss;

let t2 = performance.now();
let time1 = t2 - t1;

// Measure the time it takes for shuffle2 to run
t1 = performance.now();

// Get the initial memory usage
initialUsage = process.memoryUsage();

// Shuffle the array using shuffle2
shuffle21(array);

// Get the final memory usage
finalUsage = process.memoryUsage();

// Calculate the difference in memory usage
let usage2 = finalUsage.rss - initialUsage.rss;

t2 = performance.now();
let time2 = t2 - t1;

console.log(`shuffle1 took ${time1} milliseconds to run and used ${usage1} bytes of memory.`);
console.log(`shuffle2 took ${time2} milliseconds to run and used ${usage2} bytes of memory.`);
