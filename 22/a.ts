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
  if (posToString(dir) == "0,1" || posToString(dir) == "0,-1") {
    // console.log("Move hor", instruction);
    return moveHor(map[pos[0]], pos, dir, instruction);
  }
  if (posToString(dir) == "1,0" || posToString(dir) == "-1,0") {
    // console.log("Move vert", instruction);
    return moveVert(map, pos, dir, instruction);
  }
  Deno.exit(1);
}

function mod(num: number, mod: number) {
  return ((num % mod) + mod) % mod;
}

function moveHor(line: string[], pos: number[], dir: number[], steps: number) {
  if (steps == 0) return pos;
  const [lo, hi] = getLineConstraints(line);
  const diff = hi - lo + 1;

  const [yStart, xStart] = pos;
  let x = xStart;
  const offset = xStart - lo;

  for (let i = 1; i <= Math.abs(steps); i++) {
    x = lo + mod(offset + i * dir[1], diff);

    if (line[x] == "#") {
      // console.log("Blocked at ", x);
      return [yStart, lo + mod(offset + (i - 1) * dir[1], diff)];
    }
  }
  return [yStart, x];
}

function moveVert(
  map: string[][],
  pos: number[],
  dir: number[],
  steps: number
) {
  if (steps == 0) return pos;
  const [lo, hi] = getColConstraints(map, pos[1]);
  const diff = hi - lo + 1;

  const [yStart, xStart] = pos;
  let y = yStart;
  const offset = yStart - lo;

  for (let i = 1; i <= Math.abs(steps); i++) {
    y = lo + mod(offset + i * dir[0], diff);

    if (map[y][xStart] == "#") {
      return [lo + mod(offset + (i - 1) * dir[0], diff), xStart];
    }
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
