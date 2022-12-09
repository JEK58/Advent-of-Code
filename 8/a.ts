// 1713
// 268464

const input = await Deno.readTextFile("input.txt");
const horizontal = input.split(/\r?\n/);

const width = horizontal[0].length;
const height = horizontal.length;
const vertical = [];
let ans = 0;
let bestView = 0;

for (let k = 0; k < width; k++) {
  let yc = "";
  for (let i = 0; i < height; i++) yc += horizontal[i][k];
  vertical.push(yc);
}

for (let yi = 0; yi < height; yi++) {
  for (let xi = 0; xi < width; xi++) {
    const tree = +horizontal[yi][xi];
    const left = horizontal[yi].slice(0, xi).split("").map(strToNum);
    const right = horizontal[yi]
      .slice(xi + 1, width)
      .split("")
      .map(strToNum);
    const above = vertical[xi].slice(0, yi).split("").map(strToNum);
    const under = vertical[xi]
      .slice(yi + 1, height)
      .split("")
      .map(strToNum);

    const htl = isHighestTo(left.reverse(), tree);
    const htr = isHighestTo(right, tree);
    const hta = isHighestTo(above.reverse(), tree);
    const htu = isHighestTo(under, tree);
    if (htl || htr || hta || htu) ans++;

    const vtl = calcView(left, tree);
    const vtr = calcView(right, tree);
    const vta = calcView(above, tree);
    const vtu = calcView(under, tree);

    const viewScore = vtl * vtr * vta * vtu;

    if (viewScore > bestView) bestView = viewScore;
  }
}

console.log(ans);
console.log(bestView);

function calcView(trees: number[], tree: number) {
  if (!trees.length) return 0;

  let score = 0;
  let prev = -1;

  for (let i = 0; i < trees.length; i++) {
    const el = trees[i];
    if (tree > prev) {
      prev = el;
      score++;
    }
  }
  return score;
}
function isHighestTo(input: number[], tree: number) {
  return Math.max(...input) < tree;
}

function strToNum(string: string) {
  return +string;
}
