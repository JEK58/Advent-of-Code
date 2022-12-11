// Due to debugging this is super verbose, because I did not read the instructions carefully…
// 5902
// 2445
const input = await Deno.readTextFile("input.txt");
const instructions = input.split(/\r?\n/);

interface Position {
  x: number;
  y: number;
}

const knots: Position[] = [];
const numOfKnots = 10;
for (let i = 0; i < numOfKnots; i++) {
  knots.push({ x: 0, y: 0 });
}

const tailHistory: Position[] = [];

for (const instruction of instructions) {
  const direction = instruction[0];
  const steps = +instruction.slice(2);
  const h = knots[knots.length - 1];

  switch (direction) {
    case "R":
      for (let i = 0; i < steps; i++) {
        h.x++;
        for (let k = knots.length - 1; k != 0; k--) {
          const h = knots[k];
          const t = knots[k - 1];

          const dist = distance(h, t);
          if (dist == 3) {
            if (t.x > h.x) t.x--;
            else t.x++;
            if (t.y > h.y) t.y--;
            else t.y++;
          }
          if (dist == 0) {
            if (t.y == h.y) {
              if (t.x > h.x) t.x--;
              else t.x++;
            }

            if (t.x == h.x) {
              if (t.y > h.y) t.y--;
              else t.y++;
            }
          }
          if (k === 1) tailHistory.push({ ...t });
        }
      }

      break;
    case "L":
      for (let i = 0; i < steps; i++) {
        h.x--;

        for (let k = knots.length - 1; k != 0; k--) {
          const h = knots[k];
          const t = knots[k - 1];

          const dist = distance(h, t);
          if (dist == 3) {
            if (t.x > h.x) t.x--;
            else t.x++;
            if (t.y > h.y) t.y--;
            else t.y++;
          }
          if (dist == 0) {
            if (t.y == h.y) {
              if (t.x > h.x) t.x--;
              else t.x++;
            }

            if (t.x == h.x) {
              if (t.y > h.y) t.y--;
              else t.y++;
            }
          }
          if (k === 1) tailHistory.push({ ...t });
        }
      }

      break;
    case "U":
      for (let i = 0; i < steps; i++) {
        h.y++;

        for (let k = knots.length - 1; k != 0; k--) {
          const h = knots[k];
          const t = knots[k - 1];

          const dist = distance(h, t);
          if (dist == 3) {
            if (t.y > h.y) t.y--;
            else t.y++;
            if (t.x > h.x) t.x--;
            else t.x++;
          }
          if (dist == 0) {
            if (t.y == h.y) {
              if (t.x > h.x) t.x--;
              else t.x++;
            }

            if (t.x == h.x) {
              if (t.y > h.y) t.y--;
              else t.y++;
            }
          }
          if (k === 1) tailHistory.push({ ...t });
        }
      }

      break;
    case "D":
      for (let i = 0; i < steps; i++) {
        h.y--;

        for (let k = knots.length - 1; k != 0; k--) {
          const h = knots[k];
          const t = knots[k - 1];

          const dist = distance(h, t);
          if (dist == 3) {
            if (t.y > h.y) t.y--;
            else t.y++;
            if (t.x > h.x) t.x--;
            else t.x++;
          }
          if (dist == 0) {
            if (t.y == h.y) {
              if (t.x > h.x) t.x--;
              else t.x++;
            }

            if (t.x == h.x) {
              if (t.y > h.y) t.y--;
              else t.y++;
            }
          }
          if (k === 1) tailHistory.push({ ...t });
        }
      }
      break;

    default:
      break;
  }
}

function distance(h: Position, t: Position) {
  const dx = Math.abs(h.x - t.x);
  const dy = Math.abs(h.y - t.y);
  if (dx == 1 && dy > 1) return 3;
  if (dy == 1 && dx > 1) return 3;
  if (dx == 2 && dy == 2) return 3;
  if (dx + dy >= 2) return 0;
}

const uniquePositions = tailHistory.filter(
  (value, index, self) =>
    index === self.findIndex((t) => t.x === value.x && t.y === value.y)
);

console.log(uniquePositions.length);
