const input = await Deno.readTextFile("input.txt");
const cubes = input.split(/\r?\n/g).map((c) => c.split(",")) as Position[];

type Position = [number | string, number | string, number | string];

function getSurface(cubes: Position[]) {
  let surface = 6 * cubes.length;

  for (const cube of cubes) {
    for (const otherCube of cubes) {
      if (cube == otherCube) continue;
      const xcom = cube[0] == otherCube[0];
      const ycom = cube[1] == otherCube[1];
      const zcom = cube[2] == otherCube[2];
      const adjx = Math.abs(+cube[0] - +otherCube[0]) == 1;
      const adjy = Math.abs(+cube[1] - +otherCube[1]) == 1;
      const adjz = Math.abs(+cube[2] - +otherCube[2]) == 1;

      if (xcom && ycom && adjz) surface--;
      if (ycom && zcom && adjx) surface--;
      if (zcom && xcom && adjy) surface--;
    }
  }
  return surface;
}

const cubeSides: Position[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

function getOuterSurface(cubes: Position[]) {
  const [xmax, ymax, zmax, xmin, ymin, zmin] = getDimensions(cubes);
  const start: Position = [xmin - 1, ymin - 1, zmin - 1];
  const end: Position = [xmax + 1, ymax + 1, zmax + 1];

  const queue = [posToString(start)];

  const visited = new Set<string>();
  const lava = new Set(cubes.map((c) => posToString(c)));
  const outside = new Set<string>();

  while (queue.length) {
    const cube = queue
      .shift()
      ?.split(",")
      .map((p) => +p) as Position;
    outside.add(posToString(cube));

    for (const posDelta of cubeSides) {
      const pos = posDelta.map((d, index) => +cube[index] + +d) as Position;

      if (pos.some((v, index) => v < start[index] || v > end[index])) continue;
      const posAsString = posToString(pos);
      if (visited.has(posAsString)) continue;
      visited.add(posAsString);
      if (lava.has(posAsString)) continue;
      queue.push(posAsString);
    }
  }
  const filledLava: Position[] = [];
  for (let x = +start[0]; x <= +end[0]; x++) {
    for (let y = +start[1]; y <= +end[1]; y++) {
      for (let z = +start[2]; z <= +end[2]; z++) {
        const cube: Position = [x, y, z];
        if (!outside.has(posToString(cube))) filledLava.push(cube);
      }
    }
  }
  return getSurface(filledLava);
}

function posToString(pos: Position | string[]) {
  return pos + "";
}

function getDimensions(cubes: string[][] | Position[]) {
  let xmax = Number.NEGATIVE_INFINITY;
  let ymax = Number.NEGATIVE_INFINITY;
  let zmax = Number.NEGATIVE_INFINITY;
  let xmin = Number.POSITIVE_INFINITY;
  let ymin = Number.POSITIVE_INFINITY;
  let zmin = Number.POSITIVE_INFINITY;
  for (const cube of cubes) {
    if (+cube[0] > xmax) xmax = +cube[0];
    if (+cube[1] > ymax) ymax = +cube[1];
    if (+cube[2] > zmax) zmax = +cube[2];
    if (+cube[0] < xmin) xmin = +cube[0];
    if (+cube[1] < ymin) ymin = +cube[1];
    if (+cube[2] < zmin) zmin = +cube[2];
  }
  return [xmax, ymax, zmax, xmin, ymin, zmin] as const;
}
// 4300
console.log(getSurface(cubes));
// 2490
console.log(getOuterSurface(cubes));
