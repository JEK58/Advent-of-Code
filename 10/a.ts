const input = await Deno.readTextFile("input.txt");
const lines = input.split(/\r?\n/g).map((s) => s.split(" "));

const cyclesToInspect = [20, 60, 100, 140, 180, 220];

type Pixel = "." | "#";
let x = 1;
let cycle = 0;
let sum = 0;
const pixels: Pixel[] = [];

for (const command of lines) {
  const [operation, val] = command;
  cycle += drawPixel();
  sum += inspect();
  if (operation == "noop") continue;
  cycle += drawPixel();
  sum += inspect();
  x += +val;
}
function inspect() {
  if (cyclesToInspect.indexOf(cycle) != -1) return cycle * x;
  return 0;
}

function drawPixel() {
  const position = cycle % 40;
  if (position <= x + 1 && position >= x - 1) pixels.push("#");
  else pixels.push(".");
  return 1;
}

function renderScreen(pixels: string[], screenWidth: number) {
  const lines = pixels.length / screenWidth;
  for (let i = 0; i < lines; i++) {
    console.log(
      pixels
        .slice(i * screenWidth, i * screenWidth + screenWidth)
        .reduce((prev, curr) => prev + curr)
    );
  }
}
// 17380
console.log(sum);
// FGCUZREC
renderScreen(pixels, 40);
