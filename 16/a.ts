// Works, but super slow

const input = await Deno.readTextFile("input.txt");
const rawValves = input.split(/\r?\n/g).map((v) =>
  v
    .replaceAll("Valve ", "")
    .replaceAll(" has flow rate=", ";")
    .replaceAll(/\btunnels?\b leads? to valves? /g, "")
    .replaceAll(" ", "")
    .split(";")
    .map((v, i) => (i == 2 ? v.trim().split(",") : v))
);

interface Valve {
  name: string;
  rate: number;
  destinations: string[];
}
interface ValveWithPaths {
  name: string;
  rate: number;
  paths: {
    name: string;
    time: number;
  }[];
}
type Combination = [string[], number];

const valves = rawValves.map((el) => {
  return {
    name: el[0] as string,
    rate: +el[1],
    destinations: Array.isArray(el[2]) ? el[2] : [el[2]],
  };
});

function findValve(name: string): Valve {
  return [...valves.filter((v) => v.name == name)][0];
}

function calcPressure(
  pos: string,
  time: number,
  valves: ValveWithPaths[],
  filter?: string[],
  open = "",
  pressure = 0
) {
  const valve = valves.filter((v) => v.name == pos)[0];

  open += valve.name + ",";
  const currentPressure = pressure + valve.rate * time;
  let maxPressure = currentPressure;

  for (const dest of valve.paths) {
    if (
      open.includes(dest.name) ||
      time < dest.time ||
      (filter && !filter.includes(dest.name))
    )
      continue;

    const newPressure = calcPressure(
      dest.name,
      time - dest.time,
      valves,
      filter,
      open,
      currentPressure
    );

    if (newPressure > maxPressure) maxPressure = newPressure;
  }

  return maxPressure;
}

const getCombinations = (arr: string[]) =>
  [...Array(2 ** arr.length - 1).keys()].map((n) =>
    ((n + 1) >>> 0)
      .toString(2)
      .split("")
      .reverse()
      .map((n, i) => (+n ? arr[i] : ""))
      .filter(Boolean)
  );

function mapPaths(valves: Valve[]): ValveWithPaths[] {
  const map = [];
  for (const valve of valves) {
    if (valve.rate == 0 && valve.name != "AA") continue;
    const paths = [];

    for (const dest of valves) {
      if (dest.name == valve.name || dest.rate == 0) continue;
      paths.push({
        name: dest.name,
        time: bfs(valve, dest.name) + 1,
      });
    }
    map.push({ name: valve.name, rate: valve.rate, paths });
  }
  return map;
}

function bfs(valve: Valve, target: string) {
  const q: [Valve, number][] = [[valve, 0]];
  const visited = new Set(valve.name);
  while (q.length) {
    const item = q.shift();
    if (!item) break;
    if (item[0].name == target) return item[1];

    for (const dest of item[0].destinations) {
      if (!visited.has(dest)) {
        visited.add(dest);
        q.push([findValve(dest), item[1] + 1]);
      }
    }
  }
  throw new Error("This should not happen…");
}

function solve(valves: ValveWithPaths[]) {
  const time = 30;
  const start = "AA";
  return calcPressure(start, time, valves);
}

function solve2(valves: ValveWithPaths[]) {
  const time = 26;
  const start = "AA";

  const valveNames = valves.filter((v) => v.rate > 0).map((v) => v.name);
  const combinations: Combination[] = getCombinations(valveNames)
    // This may not be optimal in every situation but gives a little speed…
    .filter((f) => f.length > 2 && f.length <= valves.length / 2)
    .map((filter) => {
      return [filter, calcPressure(start, time, valves, filter)];
    });
  const sums: number[] = [];
  for (const path of combinations) {
    const valid = combinations
      .filter((f) => !f[0].some((r) => path[0].includes(r)))
      .map((v) => v[1]);
    sums.push(Math.max.apply(0, valid) + path[1]);
  }
  return Math.max.apply(0, sums);
}

const start = performance.now();
// Start

const valvesWithPaths = mapPaths(valves);

// 1857
console.log(solve(valvesWithPaths));
// 2536
console.log(solve2(valvesWithPaths));

// End
const end = performance.now();
console.log((end - start) / 1000, "ms");
