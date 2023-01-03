const input = await Deno.readTextFile("input.txt");
const blueprints = input
  .split(/\r?\n/g)
  .map((c) => c.match(/\d+/g).map(Number))
  .map((b) => {
    return {
      id: b[0],
      oreCost: b[1],
      clayCost: b[2],
      obsOreCost: b[3],
      obsClayCost: b[4],
      geodeOreCost: b[5],
      geodeObsCost: b[6],
    };
  });
interface Blueprint {
  id: number;
  oreCost: number;
  clayCost: number;
  obsOreCost: number;
  obsClayCost: number;
  geodeOreCost: number;
  geodeObsCost: number;
}
function getBestBlueprint(blueprints: Blueprint[], time: number) {
  const possibleGeodes: number[] = [];
  const res = dfs(blueprints[0], time);
  return res;
}

function dfs(
  bp: Blueprint,
  time: number,
  ore = 0,
  clay = 0,
  obs = 0,
  geo = 0,
  oRobot = 1,
  cRobot = 0,
  obsRobot = 0,
  geoRobot = 0
) {
  console.log("Time: ", time);

  const _ore = ore + 1 * oRobot;
  const _clay = clay + 1 * cRobot;
  const _obs = obs + 1 * obsRobot;
  const _geo = geo + 1 * geoRobot;

  let best = 0;
  if (time == 0) return _geo;
  if (ore >= bp.oreCost) {
    const res = dfs(
      bp,
      time - 1,
      _ore,
      _clay,
      _obs,
      _geo,
      oRobot,
      cRobot,
      obsRobot,
      geoRobot
    );
    if (res > best) best = res;
  }
  return 0;
}

// Start
const start = performance.now();

console.log(getBestBlueprint(blueprints, 10));

// End
const end = performance.now();
console.log((end - start) / 1000, "ms");
