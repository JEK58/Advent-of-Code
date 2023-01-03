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
interface Inventory {
  ore: number;
  clay: number;
  obs: number;
  geo: number;
  oRobot: number;
  cRobot: number;
  obsRobot: number;
  geoRobot: number;
}

function getBestBlueprint(blueprints: Blueprint[], time: number) {
  const inventory = {
    ore: 0,
    clay: 0,
    obs: 0,
    geo: 0,
    oRobot: 1,
    cRobot: 0,
    obsRobot: 0,
    geoRobot: 0,
  };
  return blueprints
    .map((bp) => dfs(bp, inventory, time) * bp.id)
    .reduce((a, b) => a + b);
}

function maxCosts(bp: Blueprint) {
  const ore = Math.max(bp.clayCost, bp.oreCost, bp.geodeOreCost, bp.obsOreCost);
  const clay = Math.max(bp.obsClayCost);
  const obs = Math.max(bp.geodeObsCost);
  return { ore, clay, obs };
}
function dfs(bp: Blueprint, inv: Inventory, time: number, round = 0, best = 0) {
  let maxPossibleGeods = inv.geo;
  // console.log("Current max", maxPossibleGeods);
  for (let i = 1; i <= time - round; i++) {
    maxPossibleGeods += i;
    maxPossibleGeods += inv.geoRobot;
  }
  // console.log("Max: ", maxPossibleGeods);
  // console.log("Time left", time - round, "Round", round);

  if (maxPossibleGeods < best) {
    // console.log("Foo");
    return 0;
  }

  const maxRobots = maxCosts(bp);
  round++;

  function collectGoods(inventory: Inventory) {
    const inv = { ...inventory };
    inv.ore += 1 * inventory.oRobot;
    inv.clay += 1 * inventory.cRobot;
    inv.obs += 1 * inventory.obsRobot;
    inv.geo += 1 * inventory.geoRobot;
    return inv;
  }
  if (round == time) return collectGoods(inv).geo;

  if (true) {
    const upd = collectGoods(inv);
    const res = dfs(bp, upd, time, round, best);
    if (res > best) best = res;
  }
  // Ore Robot
  if (inv.ore >= bp.oreCost && inv.oRobot <= maxRobots.ore) {
    const option = { ...inv };
    option.ore -= bp.oreCost;
    const upd = collectGoods(option);
    upd.oRobot++;
    const res = dfs(bp, upd, time, round, best);
    if (res > best) best = res;
  }
  // Clay Robot
  if (inv.ore >= bp.clayCost && inv.cRobot <= maxRobots.clay) {
    const option = { ...inv };
    option.ore -= bp.clayCost;
    const upd = collectGoods(option);
    upd.cRobot++;
    const res = dfs(bp, upd, time, round, best);
    if (res > best) best = res;
  }
  // Obsidian Robot
  if (
    inv.ore >= bp.obsOreCost &&
    inv.clay >= bp.obsClayCost &&
    inv.obsRobot <= maxRobots.obs
  ) {
    const option = { ...inv };
    option.ore -= bp.obsOreCost;
    option.clay -= bp.obsClayCost;
    const upd = collectGoods(option);
    upd.obsRobot++;
    const res = dfs(bp, upd, time, round, best);
    if (res > best) best = res;
  }
  // Geode Robot
  if (inv.ore >= bp.geodeOreCost && inv.obs >= bp.geodeObsCost) {
    const option = { ...inv };
    option.ore -= bp.geodeOreCost;
    option.obs -= bp.geodeObsCost;
    const upd = collectGoods(option);
    upd.geoRobot++;
    const res = dfs(bp, upd, time, round, best);
    if (res > best) best = res;
  }
  return best;
}

// Start
const start = performance.now();

console.log(getBestBlueprint(blueprints, 24));

// End
const end = performance.now();
console.log((end - start) / 1000, "ms");

// 1719
// 5291.848 ms
