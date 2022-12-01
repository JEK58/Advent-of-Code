const input = await Deno.readTextFile("input.txt");
const data = input.split(/\r?\n/);

let i = 0;

const elfs: number[] = [];
let elf = 0;

data.forEach((el) => {
  const cal = parseInt(el);
  if (el.length) {
    elf += cal;
  } else {
    elfs.push(elf);
    elf = 0;
    i++;
  }
});
elfs.push(elf);

function indexOfMax(arr: number[]) {
  if (arr.length === 0) {
    return -1;
  }

  let max = arr[0];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

console.log(elfs[indexOfMax(elfs)]);
