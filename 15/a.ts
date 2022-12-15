// 961

const input = await Deno.readTextFile("input.txt");
const sensors = input
  .replaceAll("Sensor at x=", "")
  .replaceAll(": closest beacon is at x=", ",")
  .replaceAll(" y=", "")
  .split(/\r?\n/g)
  .map((s) => s.split(",").map((s) => +s));

type Position = [number, number];

function getPositionsWithoutBeacon(row: number) {
  const coverage = new Map();
  for (const devices of sensors) {
    const [xs, ys, xb, yb] = devices;
    const [x1, x2] = [xs, xb].sort((a, b) => a - b);
    const [y1, y2] = [ys, yb].sort((a, b) => a - b);

    const distance = x2 - x1 + y2 - y1;

    // Shrinking and growing coverage of the x axis
    let horCov = 0;
    let centerReached = false;

    for (let y = ys - distance; y <= ys + distance; y++) {
      if (y == row)
        for (let x = xs - horCov; x <= xs + horCov; x++) {
          if (posIsFree(x, y)) {
            if (!coverage.get(y)) coverage.set(y, new Set([x]));
            else coverage.get(y).add(x);
          }
        }
      if (horCov == distance) centerReached = true;
      centerReached ? horCov-- : horCov++;
    }
  }
  return coverage.get(row).size;
}

function posIsFree(x: number, y: number) {
  for (const device of sensors) {
    if (
      (x == device[0] && y == device[1]) ||
      (x == device[2] && y == device[3])
    )
      return false;
  }
  return true;
}

interface Sensor {
  distance: number;
  center: Position;
  beacon: Position;
}

function getDistance(pos1: Position, pos2: Position) {
  return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
}

const sensorsWithDist: Sensor[] = [];
for (const devices of sensors) {
  const [xs, ys, xb, yb] = devices;
  const distance = getDistance([xs, ys], [xb, yb]);
  sensorsWithDist.push({ distance, center: [xs, ys], beacon: [xb, yb] });
}

function getUncoveredPosition(limit: number) {
  let found = false;
  outerLoop: for (const sensor of sensorsWithDist) {
    const [x, y] = sensor.center;
    const d = sensor.distance + 1;

    for (let i = 0; i < d; i++) {
      if ((found ||= posIsCovered([x + i, y - d + i], limit))) break outerLoop;
      if ((found ||= posIsCovered([x + d - i, y + 1], limit))) break outerLoop;
      if ((found ||= posIsCovered([x - i, y - d - i], limit))) break outerLoop;
      if ((found ||= posIsCovered([x - i, y - d - i], limit))) break outerLoop;
    }
  }
}

function posIsCovered(pos: Position, limit: number) {
  if (pos[0] < 0) return false;
  if (pos[1] < 0) return false;
  if (pos[0] > limit) return false;
  if (pos[1] > limit) return false;

  for (const sensor of sensorsWithDist) {
    const d = getDistance(sensor.center, pos);
    const distPosToBeacon = getDistance(pos, sensor.beacon);

    if (d <= sensor.distance || distPosToBeacon == 0) return false;
  }
  console.log(pos[0] * 4000000 + pos[1]);

  return true;
}

// 5040643 at row 2000000
console.log(getPositionsWithoutBeacon(2000000));
getUncoveredPosition(4000000);
