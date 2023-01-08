const input = await Deno.readTextFile("input.txt");
const instructions = input.split("") as Instruction[];

type Instruction = "<" | ">";
type Voxel = "#" | null;
type Line = [Voxel, Voxel, Voxel, Voxel, Voxel, Voxel, Voxel];

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
  const expectCycleAfter = 1000;

  let hash = "";
  let cycle = 0;
  let additional = 0;

  while (rockCount < maxRocks) {
    let rock = [...rocks[rockCount % 5]].reverse();
    const rockHeight = rock.length;

    let collisionLevel = 0;
    const arenaHeight = arena.length + 3;

    if (rockCount >= expectCycleAfter) {
      const currentHash =
        arena[arena.length - 1] +
        "," +
        (instructionIndex % instructions.length) +
        "," +
        (rockCount % 5);

      if (hash == currentHash) {
        const rocksLeft = maxRocks - rockCount;
        const cycleHeight = arena.length - cycle;
        const cycleAfter = rockCount - expectCycleAfter;
        additional = Math.floor(rocksLeft / cycleAfter) * cycleHeight;
        rockCount += Math.floor(rocksLeft / cycleAfter) * cycleAfter;
      }

      if (rockCount == expectCycleAfter) {
        hash = currentHash;
        cycle = arena.length;
      }
    }
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
  return arena.length - 1 + additional;
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

function mergeLines(a: Line, b: Line) {
  return a.map((el, i) => (el ? el : b[i])) as Line;
}

// Start
const start = performance.now();

// 3124
console.log(solve(2022));

// 1561176470569
console.log(solve(1000000000000));

// End
const end = performance.now();
console.log((end - start) / 1000, "ms");
