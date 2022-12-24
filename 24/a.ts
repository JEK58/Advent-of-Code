const input = await Deno.readTextFile("input.txt");
const map = input.split(/\r?\n/g).map((l) => l.split("")) as Map;

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

function printMap(_map: Map, packPos: Position) {
  const map = JSON.parse(JSON.stringify(_map)) as Map;
  map[packPos[0]][packPos[1]] = "E";
  for (const line of map) console.log(line.join(""));
}

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
  const hor = map[0].length - 2;
  const vert = map.length - 2;
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
    x = mod(x - 1 + dir[1], hor) + 1;
  }

  if (blizzard[0] == "v" || blizzard[0] == "^") {
    // console.log("move vert");
    y = mod(y - 1 + dir[0], vert) + 1;
  }
  return [blizzard[0], [y, x]];
}

function mod(num: number, mod: number) {
  return ((num % mod) + mod) % mod;
}

function combinePositions(pos1: Position, pos2: Position): Position {
  return [pos1[0] + pos2[0], pos1[1] + pos2[1]];
}

function nextBlizzardPositions(list: Blizzard[], map: Map) {
  const newPositions: Blizzard[] = [];
  for (const blizzard of list) {
    newPositions.push(moveBlizzard(blizzard, map));
  }
  return newPositions;
}

function updateMap([...map]: Map, blizzards: Blizzard[]) {
  for (let l = 0; l < map.length; l++) {
    for (let c = 0; c < map[0].length; c++) {
      const el = map[l][c];
      if (el != "#" && el != ".") map[l][c] = ".";
    }
  }
  for (const blizzard of blizzards) {
    const [y, x] = blizzard[1];
    map[y][x] = blizzard[0];
  }
  return map;
}

function getStartEndPos(map: Map) {
  const start: Position = [0, 1];
  const end: Position = [map.length - 1, map[0].length - 2];
  return [start, end];
}

function movePack(_map: Map, pack: Position) {
  const map = JSON.parse(JSON.stringify(_map)) as Map;

  const dirs: Position[] = [
    [0, -1],
    [0, 1],
    [1, 0],
    [-1, 0],
  ];
  const possibleDirs = dirs
    .map((d) => combinePositions(pack, d))
    .map((n) => {
      const [y, x] = n;
      if (y >= 0 && x >= 0 && map[y][x] == ".") return n;
    })
    .filter((f) => !!f);
  if (possibleDirs.length > 1) console.log("Multiple options");

  if (possibleDirs.length) return possibleDirs as Position[];
  return [pack];
}
type Q = [Position, Map, number];

function bfs(start: Position, end: Position, _map: Map) {
  const map = JSON.parse(JSON.stringify(_map)) as Map;

  const Q: Q[] = [[start, map, 0]];
  // const visited = new Set(start.name);
  let i = 0;
  while (Q.length && i < 19) {
    const item = Q.shift();
    if (!item) break;
    let [packPos, map, time] = item;
    console.log("New round", time);
    printMap(map, packPos);

    let blizzards = findBlizzards(map);

    blizzards = nextBlizzardPositions(blizzards, map);
    map = updateMap(map, blizzards);
    const options = movePack(map, packPos);

    for (const option of options) {
      if (posToString(option) == posToString(end)) return time;
      Q.push([option, JSON.parse(JSON.stringify(map)), time + 1]);
    }
    i++;
  }
}

function posToString(pos: Position) {
  return pos[0] + "," + pos[1];
}

function solve(_map: Map) {
  const map = JSON.parse(JSON.stringify(_map)) as Map;

  const [start, end] = getStartEndPos(map);

  return bfs(start, end, map);
}

console.log(solve(map));