const input = await Deno.readTextFile("input.txt");
const instructions = input.split("") as Instruction[];

type Instruction = "<" | ">";
type Line = [Voxel, Voxel, Voxel, Voxel, Voxel, Voxel, Voxel];
type Voxel = "#" | null;

const rocks: Line[][] = [
  [[null, null, "#", "#", "#", "#", null]],
  [
    [null, null, null, "#", null, null, null],
    [null, null, "#", "#", "#", null, null],
    [null, null, null, "#", null, null, null],
  ],
  [
    [null, null, null, null, "#", null, null],
    [null, null, null, null, "#", null, null],
    [null, null, "#", "#", "#", null, null],
  ],
  [
    [null, null, "#", null, null, null, null],
    [null, null, "#", null, null, null, null],
    [null, null, "#", null, null, null, null],
    [null, null, "#", null, null, null, null],
  ],
  [
    [null, null, "#", "#", null, null, null],
    [null, null, "#", "#", null, null, null],
  ],
];

function detectCollision(a: Line, b: Line) {
  for (let i = 0; i < a.length; i++)
    if (a[i] != null && b[i] != null) return true;
  return false;
}

function shiftPossible(
  rock: Line[],
  instructionIndex: number,
  arena: Line[],
  level: number
) {
  const rockHeight = rock.length;
  let shiftPossible = true;
  const shiftedRock = shiftRock(rock, getInstruction(instructionIndex));

  for (let rockLevel = 0; rockLevel <= rockHeight - 1; rockLevel++) {
    if (
      arena[level + 1 + rockLevel]?.length &&
      detectCollision(arena[level + 1 + rockLevel], shiftedRock[rockLevel])
    )
      shiftPossible = false;
  }
  return shiftPossible;
}

function solve(maxRocks: number) {
  let rockCount = 0;
  let instructionIndex = 0;
  const arena: Line[] = [["#", "#", "#", "#", "#", "#", "#"]];

  while (rockCount < maxRocks) {
    let rock = [...rocks[rockCount % 5]].reverse();
    const rockHeight = rock.length;

    let collisionLevel = 0;
    const arenaHeight = arena.length + 3;

    outerLoop: for (let level = arenaHeight - 1; level >= 0; level--) {
      if (shiftPossible(rock, instructionIndex, arena, level))
        rock = shiftRock(rock, getInstruction(instructionIndex));
      instructionIndex++;

      if (!arena[level]?.length) continue;

      for (let k = 0; k <= rockHeight - 1; k++) {
        if (
          arena[level + k]?.length &&
          detectCollision(arena[level + k], rock[k])
        ) {
          collisionLevel = level;
          break outerLoop;
        }
      }
    }
    for (let i = collisionLevel; i < rockHeight + collisionLevel; i++) {
      if (!arena[i + 1]?.length)
        arena.push([null, null, null, null, null, null, null]);
      arena[i + 1] = mergeLines(arena[i + 1], rock[i - collisionLevel]);
    }

    rockCount++;
  }
  return arena.length - 1;
}
function getInstruction(index: number) {
  return instructions[index % instructions.length];
}
function shiftRock([...rock]: Line[], direction: "<" | ">"): Line[] {
  if (direction == "<") {
    if (rock.some((v) => v[0] != null)) return rock;
    return rock.map((el) => [...el.slice(1), null]) as Line[];
  } else if (direction == ">") {
    if (rock.some((v) => v[6] != null)) return rock;
    return rock.map((el) => [null, ...el.slice(0, 6)]) as Line[];
  }
  return rock;
}

function printArena([...arena]: Line[]) {
  let i = arena.length - 1;
  for (const line of arena.reverse()) {
    console.log(i, line.map((a) => (a ? "#" : ".")).join(""));
    i--;
  }
}

function mergeLines(a: Line, b: Line) {
  return a.map((el, i) => (el ? el : b[i])) as Line;
}

// Start
const start = performance.now();

// 3124
console.log(solve(2022));
//  1561176470569
console.log(solve(2022));

// End
const end = performance.now();
console.log((end - start) / 1000, "ms");
