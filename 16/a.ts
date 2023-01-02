// WIP

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
    steps: number;
    rate: number;
  }[];
}

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

function solve(valves: ValveWithPaths[]) {
  const time = 30;

  let releasedPressure = 0;
  let pressurePerMinute = 0;
  const openValves = new Set<string>();
  let currentValve = valves.filter((v) => v.name == "AA")[0];
  let nextMove = 0;
  let nextValve = null;

  for (let i = 0; i < time + 1; i++) {
    console.log("*** Minute", i);
    const myArray = Array.from(openValves);
    myArray.sort();
    console.log(
      "Valves open",
      myArray,
      "Pressure",
      pressurePerMinute,
      "Current",
      currentValve.name
    );

    releasedPressure += pressurePerMinute;

    if (nextValve && nextMove <= 0 && i < 30) {
      console.log("Open valve", nextValve.name);
      openValves.add(nextValve.name);
      pressurePerMinute += nextValve.rate;
      const name = nextValve.name;
      currentValve = valves.filter((v) => v.name == name)[0];
      // console.log("Curr", currentValve);

      nextValve = null;
    } else nextMove--;

    if (!nextValve) {
      const _options = valves
        // .filter((v) => !openValves.has(v.name))
        .filter((v) => v.name == currentValve.name)[0];

      // console.log("_", _options);

      const options = _options.paths?.filter((v) => !openValves.has(v.name));

      if (!options.length) continue;
      options
        .sort((a, b) => b.steps - a.steps)
        .sort((a, b) => {
          const d = Math.abs(b.steps - a.steps);
          if (a.rate + d * a.rate == b.rate) return 0;
          const foo = a.rate + d * a.rate < b.rate;
          return foo ? 1 : -1;
        });
      // console.log("**", options);
      nextValve = { ...options[0] };
      console.log("Next", nextValve.name);

      nextMove = nextValve.steps;
    }
    console.log("Nextmove", nextMove, "Nextvalve", nextValve);
  }

  return releasedPressure;
}

function mapPaths(valves: Valve[]): ValveWithPaths[] {
  const map = [];
  for (const valve of valves) {
    const paths = [];
    const current = findValve(valve.name);

    for (const dest of valves) {
      if (dest.name == current.name || dest.rate == 0) continue;
      paths.push({
        name: dest.name,
        steps: bfs(current, dest.name),
        rate: dest.rate,
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

const start = performance.now();

const valvesWithPaths = mapPaths(valves);

// 1857
console.log(solve(valvesWithPaths));

const end = performance.now();

console.log((end - start) / 1000, "ms");

console.log(valvesWithPaths);
