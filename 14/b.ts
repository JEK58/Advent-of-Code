// 961
// 26375
const input = await Deno.readTextFile("input.txt");
const paths = input
  .split(/\r?\n/g)
  .map((s) => s.split(" -> ").map((s) => s.split(",").map((s) => +s)));

type Position = [number, number];

const sandSource: Position = [500, 0];
const blocked = getBlockedPositions(paths as Position[][]);

const groundLevel = Math.max(...paths.map((s) => s.map((s) => s[1])).flat());

let fallenUnits = 0;

while (true) {
  let sandPosition = sandSource;
  let pathBlocked = false;

  while (!pathBlocked) {
    const directions = getDirections(sandPosition);
    if (validPosition(directions[0], sandPosition)) {
      sandPosition = directions[0];
    } else if (validPosition(directions[1], sandPosition)) {
      sandPosition = directions[1];
    } else if (validPosition(directions[2], sandPosition)) {
      sandPosition = directions[2];
    } else {
      blocked.add(posToString(sandPosition));
      pathBlocked = true;
    }
  }
  fallenUnits++;
  if (sandPosition == sandSource) break;
}
console.log("Cave Filled", fallenUnits);

function getDirections(pos: Position): Position[] {
  const [x, y] = pos;
  return [
    [x, y + 1],
    [x - 1, y + 1],
    [x + 1, y + 1],
  ];
}

function getBlockedPositions(paths: Position[][]) {
  const _blocked = new Set<string>();
  for (const path of paths) {
    for (let i = 0; i < path.length - 1; i++) {
      let [x1, y1] = path[i];
      let [x2, y2] = path[i + 1];

      [x1, x2] = [x1, x2].sort((a, b) => a - b);
      [y1, y2] = [y1, y2].sort((a, b) => a - b);

      for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
          _blocked.add(posToString([x, y]));
        }
      }
    }
  }
  return _blocked;
}

function posToString(pos: Position) {
  return pos[0] + "," + pos[1];
}

function validPosition(pos: Position, sandPosition: Position) {
  return !blocked.has(posToString(pos)) && sandPosition[1] < groundLevel + 1;
}
