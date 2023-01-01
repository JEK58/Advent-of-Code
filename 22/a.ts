// Super verbose…
const input = await Deno.readTextFile("input.txt");
const lines = input.split(/\r?\n/g);

const instructions = lines
  .pop()
  ?.split(/(R|L)/g)
  .map((v) => (Number.isInteger(+v) ? +v : v));
if (!instructions) Deno.exit(1);

const map = lines.map((v) => v.split("")).filter((v) => v.length);

function getColConstraints(map: string[][], col: number) {
  let lo = Number.MAX_SAFE_INTEGER;
  let hi = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < map.length; i++) {
    if ((map[i][col] == "." || map[i][col] == "#") && lo > i) lo = i;
    if ((map[i][col] == "." || map[i][col] == "#") && hi < i) hi = i;
  }
  return [lo, hi];
}

function getLineConstraints(line: string[]) {
  let l = Number.MAX_SAFE_INTEGER;
  let r = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < line.length; i++) {
    if (line[i] != " " && l > i) l = i;
    if (line[i] != " " && r < i) r = i;
  }
  return [l, r];
}

function getNewDirection([...curr]: number[], instruction: any) {
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  if (instruction === "L") directions.reverse();
  const currIndex = directions.findIndex(
    (v) => v[0] == curr[0] && v[1] == curr[1]
  );
  const newIndex = (currIndex + 1) % directions.length;
  return directions[newIndex];
}

function move(pos: number[], dir: number[], map: string[][], instruction: any) {
  let newPos = pos;

  for (let i = 0; i < instruction; i++) {
    if (posToString(dir) == "0,1" || posToString(dir) == "0,-1") {
      newPos = moveHor(map[newPos[0]], newPos, dir);
    }
    if (posToString(dir) == "1,0" || posToString(dir) == "-1,0") {
      newPos = moveVert(map, newPos, dir);
    }
  }
  return newPos;
}
function invert(num: number) {
  const div = 50;
  const mid = div / 2 - 1;
  const diff = num - mid;

  if (num < mid) return num + Math.abs(diff + diff) + 1;
  if (num >= mid) return num - Math.abs(diff + diff) + 1;
  return num;
}

function moveCube(
  pos: number[],
  dir: number[],
  map: string[][],
  instruction: any
) {
  let newPos = pos;
  let newDir = dir;

  for (let i = 0; i < instruction; i++) {
    const [y, x] = newPos;

    // Left hor
    if (y >= 0 && y < 50 && x == 50 && newDir[1] == -1) {
      if (map[invert(y) + 100][0] == "#") return { newPos, newDir };
      newPos = [invert(y) + 100, 0];
      newDir = [0, 1];
    } else if (y >= 50 && y < 100 && x == 50 && newDir[1] == -1) {
      if (map[100][y - 50] == "#") return { newPos, newDir };
      newPos = [100, y - 50];
      newDir = [1, 0];
    } else if (y >= 100 && y < 150 && x == 0 && newDir[1] == -1) {
      if (map[invert(y - 100)][50] == "#") return { newPos, newDir };
      newPos = [invert(y - 100), 50];
      newDir = [0, 1];
    } else if (y >= 150 && y < 200 && x == 0 && newDir[1] == -1) {
      if (map[0][50 + y - 150] == "#") return { newPos, newDir };
      newPos = [0, 50 + y - 150];
      newDir = [1, 0];
    }

    // Right hor
    else if (y >= 0 && y < 50 && x == 149 && newDir[1] == 1) {
      if (map[invert(y) + 100][99] == "#") return { newPos, newDir };
      newPos = [invert(y) + 100, 99];
      newDir = [0, -1];
    } else if (y >= 50 && y < 100 && x == 99 && newDir[1] == 1) {
      if (map[49][y - 50 + 100] == "#") return { newPos, newDir };
      newPos = [49, y - 50 + 100];
      newDir = [-1, 0];
    } else if (y >= 100 && y < 150 && x == 99 && newDir[1] == 1) {
      if (map[invert(y - 100)][149] == "#") return { newPos, newDir };
      newPos = [invert(y - 100), 149];
      newDir = [0, -1];
    } else if (y >= 150 && y < 200 && x == 49 && newDir[1] == 1) {
      if (map[149][y - 150 + 50] == "#") return { newPos, newDir };
      newPos = [149, y - 150 + 50];
      newDir = [-1, 0];
    }

    // Up vert
    else if (y == 100 && x >= 0 && x < 50 && newDir[0] == -1) {
      if (map[x + 50][50] == "#") return { newPos, newDir };
      newPos = [x + 50, 50];
      newDir = [0, 1];
    } else if (y == 0 && x >= 50 && x < 100 && newDir[0] == -1) {
      if (map[x - 50 + 150][0] == "#") return { newPos, newDir };
      newPos = [x - 50 + 150, 0];
      newDir = [0, 1];
    } else if (y == 0 && x >= 100 && x < 150 && newDir[0] == -1) {
      if (map[199][x - 100] == "#") return { newPos, newDir };
      newPos = [199, x - 100];
      newDir = [-1, 0];
    }
    // Down vert
    else if (y == 199 && x >= 0 && x < 50 && newDir[0] == 1) {
      if (map[0][x + 100] == "#") return { newPos, newDir };
      newPos = [0, x + 100];
      newDir = [1, 0];
    } else if (y == 149 && x >= 50 && x < 100 && newDir[0] == 1) {
      if (map[x - 50 + 150][49] == "#") return { newPos, newDir };
      newPos = [x - 50 + 150, 49];
      newDir = [0, -1];
    } else if (y == 49 && x >= 100 && x < 150 && newDir[0] == 1) {
      if (map[x - 100 + 50][99] == "#") return { newPos, newDir };
      newPos = [x - 100 + 50, 99];
      newDir = [0, -1];
    } else if (posToString(newDir) == "0,1" || posToString(newDir) == "0,-1") {
      newPos = moveHor(map[newPos[0]], newPos, newDir);
    } else if (posToString(newDir) == "1,0" || posToString(newDir) == "-1,0") {
      newPos = moveVert(map, newPos, newDir);
    }
  }
  return { newPos, newDir };
}

function mod(num: number, mod: number) {
  return ((num % mod) + mod) % mod;
}

function moveHor(line: string[], pos: number[], dir: number[]) {
  const [lo, hi] = getLineConstraints(line);
  const diff = hi - lo + 1;

  const [yStart, xStart] = pos;
  let x = xStart;
  const offset = xStart - lo;

  x = lo + mod(offset + dir[1], diff);

  if (line[x] == "#") {
    return [yStart, lo + mod(offset, diff)];
  }

  return [yStart, x];
}

function moveVert(map: string[][], pos: number[], dir: number[]) {
  const [lo, hi] = getColConstraints(map, pos[1]);
  const diff = hi - lo + 1;

  const [yStart, xStart] = pos;
  let y = yStart;
  const offset = yStart - lo;

  y = lo + mod(offset + dir[0], diff);

  if (map[y][xStart] == "#") {
    return [lo + mod(offset, diff), xStart];
  }

  return [y, xStart];
}

function posToString(pos: number[]) {
  return pos[0] + "," + pos[1];
}

function solve(map: string[][]) {
  let position = [0, getLineConstraints(map[0])[0]];
  let dir: number[] = [0, 1];

  for (const instruction of instructions!) {
    if (Number.isInteger(instruction)) {
      position = move(position, dir, map, instruction);
    } else {
      dir = getNewDirection(dir, instruction);
    }
  }
  const res = 1000 * (position[0] + 1) + 4 * (position[1] + 1) + getFacing(dir);
  return res;
}

function solve2(map: string[][]) {
  let position = [0, getLineConstraints(map[0])[0]];
  let dir: number[] = [0, 1];

  for (const instruction of instructions!) {
    if (Number.isInteger(instruction)) {
      const res = moveCube(position, dir, map, instruction);
      position = res.newPos;
      dir = res.newDir;
    } else {
      dir = getNewDirection(dir, instruction);
    }
  }

  const res = 1000 * (position[0] + 1) + 4 * (position[1] + 1) + getFacing(dir);
  return res;
}

function getFacing(dir: number[]) {
  const facing = posToString(dir);
  const directions = ["0,1", "1,0", "0,-1", "-1,0"];

  if (facing == directions[0]) return 0;
  if (facing == directions[1]) return 1;
  if (facing == directions[2]) return 2;
  if (facing == directions[3]) return 3;
  return 0;
}
// 162186
console.log(solve(map));
// 55267
console.log(solve2(map));
