// 449
// 443
const input = await Deno.readTextFile("input.txt");
const lines = input.split(/\r?\n/).map((s) => s.split(""));

type Position = [number, number];

let start: Position = [0, 0];
let dest: Position = [0, 0];
const possibleStarts: Position[] = [];

const cols = lines[0].length;
const rows = lines.length;

for (let i = 0; i < rows; i++) {
  for (let k = 0; k < cols; k++) {
    const square = lines[i][k];
    if (square === "S") start = [k, i];
    if (square === "E") dest = [k, i];
    if (square === "a" || square === "S") possibleStarts.push([k, i]);
  }
}

const heights = "SabcdefghijklmnopqrstuvwxyzE";

const possibleDirections: Position[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function formatPos([x, y]: Position) {
  return x + " " + y;
}
function isValidPosition([x, y]: Position) {
  return x >= 0 && x < cols && y >= 0 && y < rows;
}

type Node = [Position, number];
function bfs(start: Position) {
  const q: Node[] = [[start, 0]];
  const visited = new Set([formatPos(start)]);
  let res = Number.POSITIVE_INFINITY;
  while (q.length) {
    const item = q.shift();
    if (!item) break;
    const [pos, steps] = item;
    if (formatPos(pos) === formatPos(dest)) {
      res = steps;
      break;
    }
    const validPositions = possibleDirections
      .map(([dx, dy]: Position): Position => [pos[0] + dx, pos[1] + dy])
      .filter(isValidPosition)
      .filter(isReachable(lines[pos[1]][pos[0]]))
      .filter((pos) => !visited.has(formatPos(pos)));

    for (const pos of validPositions) {
      visited.add(formatPos(pos));
      q.push([pos, steps + 1]);
    }
  }
  return res;
}

function isReachable(elevation: string) {
  return ([x, y]: Position) =>
    heights.indexOf(lines[y][x]) - heights.indexOf(elevation) <= 1;
}

function getShortestHikefromA() {
  let minimumSteps = Number.POSITIVE_INFINITY;
  for (const start of possibleStarts) {
    const steps = bfs(start);
    if (steps < minimumSteps) minimumSteps = steps;
  }
  return minimumSteps;
}

console.log("Start:", start);
console.log("Dest:", dest);
console.log(bfs(start));
console.log(getShortestHikefromA());
