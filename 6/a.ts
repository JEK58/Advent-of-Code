const input = await Deno.readTextFile("input.txt");
let buffer: string[] = [];

function detectAfter(num: number) {
  for (let i = num; i < input.length; i++) {
    buffer = input.slice(i - num, i).split("");
    const res = buffer.filter((el, index) => buffer.indexOf(el) === index);
    if (res.length === num) return i;
  }
}

console.log(detectAfter(4));
console.log(detectAfter(14));
