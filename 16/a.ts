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

const valves = rawValves.map((el) => {
  return {
    name: el[0] as string,
    rate: +el[1],
    destinations: Array.isArray(el[2]) ? el[2] : [el[2]],
  };
});

type Node = [Valve, number];

function bfs(start: Valve, target: string) {
  const q: Node[] = [[start, 0]];
  const visited = new Set(start.name);
  let res = Number.POSITIVE_INFINITY;
  while (q.length) {
    const item = q.shift();
    if (!item) break;
    const [valve, steps] = item;
    if (valve.name === target) {
      res = steps;
      break;
    }
    for (const pos of valve.destinations) {
      visited.add(pos);
      q.push([findValve(pos), steps + 1]);
    }
  }
  return res;
}

function findValve(name: string): Valve {
  return valves[valves.findIndex((v) => v.name == name)];
}

function inspect() {
  const time = 30;

  let releasedPressue = 0;
  let pressurePerminute = 0;
  const openValves = new Set<string>();
  let currentValve = findValve("AA");
  let nextMove = 0;
  let nextValve = null;
  let foo = 0;

  for (let i = 1; i < time + 1; i++) {
    console.log("Minute", i);
    console.log("Valves open", openValves, "Pressure", pressurePerminute);
    releasedPressue += pressurePerminute;

    if (!nextValve) {
      const options = orderedValves
        .filter((v) => !openValves.has(v.name))
        .map((v) => {
          return {
            name: v.name,
            dist: bfs(currentValve, v.name),
            rate: v.rate,
          };
        });
      if (!options.length) continue;
      options
        .sort((a, b) => b.dist - a.dist)
        .sort((a, b) => {
          const d = Math.abs(b.dist - a.dist);
          if (a.rate + d * a.rate == b.rate) return 0;
          const foo = a.rate + d * a.rate < b.rate;
          return foo ? 1 : -1;
        });
      console.log(options);

      nextValve = { ...options[0] };
      nextMove = nextValve.dist;
    }

    if (nextValve && nextMove <= 0 && i < 30) {
      console.log("Open valve", nextValve.name);
      openValves.add(nextValve.name);
      pressurePerminute += nextValve.rate;
      currentValve = findValve(nextValve.name);
      const bar = nextValve.rate * (time - i);
      foo += bar;
      console.log(bar, foo);

      nextValve = null;
    }
    nextMove--;
  }

  console.log(releasedPressue);
}

function filterEmptyValves([...valves]: Valve[]) {
  return valves.filter((v) => v.rate > 0);
}

// const routes = mapPaths();n
const orderedValves = filterEmptyValves(valves);
const start = performance.now();
inspect();
const end = performance.now();

console.log((end - start) / 1000);

// 1857
