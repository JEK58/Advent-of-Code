const input = await Deno.readTextFile("input.txt");
const map = input.split(/\r?\n/g).map((l) => l.split(""));

const directions = {
  N: [-1, 0] as Position,
  NE: [-1, 1] as Position,
  E: [0, 1] as Position,
  SE: [1, 1] as Position,
  S: [1, 0] as Position,
  SW: [1, -1] as Position,
  W: [0, -1] as Position,
  NW: [-1, -1] as Position,
};

type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
type Position = [number, number];
type Map = string[][];

function printMap(map: Map) {
  for (const line of map) console.log(line.join(""));
}

function getElvePositions(map: Map) {
  const positions: Position[] = [];
  for (let l = 0; l < map.length; l++) {
    for (let p = 0; p < map[l].length; p++) {
      if (map[l][p] == "#") positions.push([l, p]);
    }
  }
  return positions;
}

function adjPosIsFree(map: Map, pos: Position, dir: Direction) {
  if (map[pos[0] + directions[dir][0]][pos[1] + directions[dir][1]] == "#")
    return false;
  return true;
}

function combinePositions(pos1: Position, pos2: Position): Position {
  return [pos1[0] + pos2[0], pos1[1] + pos2[1]];
}

function validDirection(map: Map, pos: Position, round: number) {
  const dirOrder = [
    ["N", "NE", "NW"],
    ["S", "SE", "SW"],
    ["W", "NW", "SW"],
    ["E", "NE", "SE"],
  ] as const;

  const freeStanding = !dirOrder
    .flat()
    .map((d) => adjPosIsFree(map, pos, d))
    .includes(false);

  if (freeStanding) return;

  for (let i = 0; i < dirOrder.length; i++) {
    const dirs = dirOrder[(round + i - 1) % 4];
    if (!dirs.map((d) => adjPosIsFree(map, pos, d)).includes(false))
      return combinePositions(pos, directions[dirs[0]]);
  }
}

function posToString(pos: Position) {
  return pos[0] + "," + pos[1];
}

function filterMoves([...moves]: Position[][]) {
  const validMoves: Position[][] = [];
  moves.forEach((t) => {
    if (moves.filter((m) => posToString(m[1]) == posToString(t[1])).length == 1)
      validMoves.push(t);
  });
  return validMoves;
}

function expandMap([...map]: Map) {
  if (map[0].filter((c) => c == "#").length)
    map.unshift(map[0].map((_) => "."));
  if (map[map.length - 1].filter((c) => c == "#").length)
    map.push(map[0].map((_) => "."));
  if (map.map((c) => c[0]).filter((v) => v == "#").length)
    map.map((m) => m.unshift("."));
  if (map.map((c) => c[map[0].length - 1]).filter((v) => v == "#").length)
    map.map((m) => m.push("."));
  return map;
}

function shrinkMap([...map]: Map) {
  if (!map[0].filter((c) => c == "#").length) map.shift();
  if (!map[map.length - 1].filter((c) => c == "#").length) map.pop();
  if (!map.map((c) => c[0]).filter((v) => v == "#").length)
    map.map((m) => m.shift());
  if (!map.map((c) => c[map[0].length - 1]).filter((v) => v == "#").length)
    map.map((m) => m.pop());
  return map;
}

function solve([..._map]: Map, rounds: number) {
  let map = [..._map];
  for (let i = 1; i <= rounds; i++) {
    map = expandMap(map);

    const moves: Position[][] = [];
    const elves = getElvePositions(map);

    for (const elve of elves) {
      const move = validDirection(map, elve, i);
      if (move) moves.push([elve, move]);
    }
    const filteredMoves = filterMoves(moves);
    if (!moves.length) return i;
    for (const move of filteredMoves) {
      map[move[0][0]][move[0][1]] = ".";
      map[move[1][0]][move[1][1]] = "#";
    }
    //  This is hacky but i need to sleep:D
    map = shrinkMap(map);
    map = shrinkMap(map);
  }
  return map.flat().filter((c) => c == ".").length;
}

// TODO: Prevent modifying the original array. Spreading is not enough
// 3923
// console.log(solve(map, 10));
// 1019;
console.log(solve(map, Number.MAX_SAFE_INTEGER));
