const input = await Deno.readTextFile("input.txt");
const file = input.split(/\r?\n/g).map(Number);

function decrypt([...input]: number[]) {
  let array = input.map((v, i) => [v, i]);

  for (let i = 0; i < array.length; i++) {
    const index = i % array.length;
    const itemIndex = array.findIndex((v) => v[1] === index);
    array = move(array, array[itemIndex]);
  }

  return sumCoordinates(array);
}

function move([...array]: number[][], item: number[]) {
  const [num] = item;
  const negative = num < 0;
  if (negative) array.reverse();
  const index = array.indexOf(item);
  const toIndex = (index + Math.abs(num)) % (array.length - 1);
  const element = array[index];
  array.splice(index, 1);
  array.splice(toIndex, 0, element);
  if (negative) array.reverse();
  return array;
}

function sumCoordinates(array: number[][]) {
  const zeroIndex = array.findIndex((v) => v[0] === 0);
  const keys = [1000, 2000, 3000];
  let res = 0;
  keys.forEach((key) => {
    const index = key + zeroIndex;
    res += array[index % array.length][0];
  });
  return res;
}

function decryptWithKey([...file]: number[], key: number) {
  let array = file.map((v, i) => [v * key, i]);

  for (let k = 0; k < 10; k++) {
    for (let i = 0; i < array.length; i++) {
      const index = i % array.length;
      const itemIndex = array.findIndex((v) => v[1] === index);
      array = move(array, array[itemIndex]);
    }
  }
  return sumCoordinates(array);
}

// 8721
console.log(decrypt(file));
// 831878881825
console.log(decryptWithKey(file, 811589153));
