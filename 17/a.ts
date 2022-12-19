// WIP

const input = await Deno.readTextFile("input.txt");
const instructions = input.split("") as Instruction[];

type Instruction = "<" | ">";
type Line = [Pixel, Pixel, Pixel, Pixel, Pixel, Pixel, Pixel];
type Pixel = "#" | null;

const hbar: Line[] = [[null, null, "#", "#", "#", "#", null]];

const plus: Line[] = [
  [null, null, null, "#", null, null, null],
  [null, null, "#", "#", "#", null, null],
  [null, null, null, "#", null, null, null],
];
const l: Line[] = [
  [null, null, null, null, "#", null, null],
  [null, null, null, null, "#", null, null],
  [null, null, "#", "#", "#", null, null],
];
const vbar: Line[] = [
  [null, null, "#", null, null, null, null],
  [null, null, "#", null, null, null, null],
  [null, null, "#", null, null, null, null],
  [null, null, "#", null, null, null, null],
];
const block: Line[] = [
  [null, null, "#", "#", null, null, null],
  [null, null, "#", "#", null, null, null],
];

const rocks = [hbar, plus, l, vbar, block];
const stack: Line[] = [];

function detectCollision(a: Line, b: Line) {
  console.log("*");
  printArena([a]);
  printArena([b]);

  for (let i = 0; i < a.length; i++) {
    if (a[i] != null && b[i] != null) return true;
  }
  return false;
}

function foo(maxRocks: number) {
  let rockCount = 0;
  let instructionIndex = 0;
  const arena: Line[] = [["#", "#", "#", "#", "#", "#", "#"]];

  while (rockCount < maxRocks) {
    let rock = [...rocks[rockCount % 5]].reverse();
    const size = rock.length;
    // console.log("Rock size", size);

    let collisionHeight = 0;
    const arenaHeight = arena.length + 3;

    outerLoop: for (let i = arenaHeight - 1; i >= 0; i--) {
      console.log("New arena line", getInstruction(instructionIndex));
      rock = shiftRock(rock, getInstruction(instructionIndex));
      printArena(rock);
      instructionIndex++;
      if (!arena[i]?.length) continue;
      for (let k = 0; k <= size - 1; k++) {
        if (arena[i + k]?.length && detectCollision(arena[i + k], rock[k])) {
          collisionHeight = i;
          console.log("Collision", i);

          break outerLoop;
        }
      }
    }
    console.log("Merging line");
    for (let i = collisionHeight; i < size + collisionHeight; i++) {
      if (!arena[i + 1]?.length)
        arena.push([null, null, null, null, null, null, null]);
      arena[i + 1] = mergeLines(arena[i + 1], rock[i - collisionHeight]);
    }

    // console.log(rock.length);
    rockCount++;
  }
  printArena(arena);

  return arena.length - 1;
}
function getInstruction(index: number) {
  return instructions[index % instructions.length];
}
function shiftRock([...rock]: Line[], direction: "<" | ">"): Line[] {
  console.log("Shift rock");
  printArena(rock);

  if (direction == "<") {
    if (rock.some((v) => v[0] != null)) return rock;
    return rock.map((el) => [...el.slice(1), null]) as Line[];
  } else if (direction == ">") {
    if (rock.some((v) => v[6] != null)) return rock;
    return rock.map((el) => [null, ...el.slice(0, 6)]) as Line[];
  }
  return rock;
}
function newEmptyLine(): Line {
  return [null, null, null, null, null, null, null];
}
function printArena([...arena]: Line[]) {
  for (const line of arena.reverse()) {
    console.log(line.map((a) => (a ? "#" : ".")).join(""));
  }
}

function mergeLines(a: Line, b: Line) {
  return a.map((el, i) => {
    return el ? el : b[i];
  }) as Line;
}
console.log(foo(3));

// printArena(l);
// printArena(shiftRock(l, "<"));
