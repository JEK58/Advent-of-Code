const input = await Deno.readTextFile("input.txt");
const map = input
  .split(/\r?\n/g)
  .map((l) => l.split("").filter((f) => f != "#")) as Map;

map.pop();
map.shift();

type Position = [number, number];
type Map = Element[][];
type BlizzardDirection = "<" | ">" | "v" | "^";
type Blizzard = [BlizzardDirection, Position];
type Element = "#" | "." | "E" | BlizzardDirection;

const blizDirections = {
  "<": [0, -1] as Position,
  ">": [0, 1] as Position,
  v: [1, 0] as Position,
  "^": [-1, 0] as Position,
};

function findBlizzards(map: Map) {
  const blizzards: Blizzard[] = [];
  for (let l = 0; l < map.length; l++) {
    for (let c = 0; c < map[0].length; c++) {
      const el = map[l][c];
      // @ts-ignore TODO: Why?
      if (el != "#" && el != ".") blizzards.push([el, [l, c]]);
    }
  }
  return blizzards;
}

function getConstraints(map: Map) {
  const hor = map[0].length;
  const vert = map.length;
  return [hor, vert];
}

function moveBlizzard(blizzard: Blizzard, map: Map): Blizzard {
  const [hor, vert] = getConstraints(map);
  // console.log(hor, vert);
  const dir = blizDirections[blizzard[0]];
  let x = blizzard[1][1];
  let y = blizzard[1][0];

  if (blizzard[0] == "<" || blizzard[0] == ">") {
    // console.log("move hor");
    x = mod(x + dir[1], hor);
  }

  if (blizzard[0] == "v" || blizzard[0] == "^") {
    // console.log("move vert");
    y = mod(y + dir[0], vert);
  }
  return [blizzard[0], [y, x]];
}

function mod(num: number, mod: number) {
  return ((num % mod) + mod) % mod;
}

function combinePositions(pos1: Position, pos2: Position): Position {
  return [pos1[0] + pos2[0], pos1[1] + pos2[1]];
}

function getFreePositions(map: Map) {
  const [w, h] = getConstraints(map);
  const maxStates = w * h;

  const freePositions: Set<string>[] = [];

  let blizzards = findBlizzards(map);

  for (let i = 0; i < maxStates; i++) {
    const blizPos = new Set(blizzards.map((b) => posToString(b[1])));

    const free: Position[] = [];
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        if (!blizPos.has(posToString([i, j]))) free.push([i, j]);
      }
    }

    freePositions.push(new Set(free.map((b) => posToString(b))));

    const newPositions: Blizzard[] = [];

    for (const blizzard of blizzards) {
      newPositions.push(moveBlizzard(blizzard, map));
    }

    blizzards = JSON.parse(JSON.stringify(newPositions)) as Blizzard[];
  }

  return freePositions;
}

function getStartEndPos(map: Map) {
  const start: Position = [-1, 0];
  const end: Position = [map.length, map[0].length - 1];
  return [start, end];
}

function getPossibleMoves(
  pack: Position,
  free: Set<string>,
  start: Position,
  end: Position
) {
  const dirs: Position[] = [
    [0, 0],
    [0, -1],
    [0, 1],
    [1, 0],
    [-1, 0],
  ];
  const possibleDirs = dirs
    .map((d) => combinePositions(pack, d))
    .map((n) => {
      const [y, x] = n;
      if (y >= 0 && x >= 0 && free.has(posToString([y, x]))) return n;
      if (y == start[0] && x == start[1]) return n;
      if (y == end[0] && x == end[1]) return n;
    })
    .filter((f) => !!f);

  if (possibleDirs.length) return possibleDirs as Position[];
  return;
}

type Q = [Position, number];

function bfs(start: Position, end: Position, map: Map, startTime: number) {
  const freePositions = getFreePositions(map);

  const Q: Q[] = [[start, startTime]];
  const visited = new Set(posToString(start) + "#" + startTime);
  while (Q.length) {
    const item = Q.shift();
    if (!item) break;
    const [packPos, time] = item;
    const [w, h] = getConstraints(map);
    const index = time % (w * h);
    // console.log("Index:", index);

    const options = getPossibleMoves(packPos, freePositions[index], start, end);
    if (!options) continue;
    // console.log(options);
    // console.log(freePositions[index]);

    for (const option of options) {
      const item: Q = [option, time + 1];
      const hash = posToString(item[0]) + "#" + item[1];

      if (!visited.has(hash)) {
        visited.add(hash);
        if (posToString(option) == posToString(end)) return time;
        Q.push(item);
      }
    }
  }
}

function posToString(pos: Position) {
  return pos[0] + "," + pos[1];
}

function solve(_map: Map) {
  const map = JSON.parse(JSON.stringify(_map)) as Map;

  const [start, end] = getStartEndPos(map);

  return bfs(start, end, map, 0);
}

function solve2(_map: Map) {
  const map = JSON.parse(JSON.stringify(_map)) as Map;

  const [start, end] = getStartEndPos(map);

  let time = bfs(start, end, map, 0);
  time = bfs(end, start, map, time);
  time = bfs(start, end, map, time);

  return time;
}
// 240
console.log(solve(map));
// 717
console.log(solve2(map));
