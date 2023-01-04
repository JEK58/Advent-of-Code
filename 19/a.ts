const input = await Deno.readTextFile("input.txt");
const blueprints = input
  .split(/\r?\n/g)
  .map((c) => c.match(/\d+/g)!.map(Number))
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

function solve1(blueprints: Blueprint[], time: number) {
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
function solve2(blueprints: Blueprint[], time: number) {
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
    .slice(0, 3)
    .map((bp) => dfs(bp, inventory, time))
    .reduce((a, b) => a * b);
}

function maxCosts(bp: Blueprint) {
  const ore = Math.max(bp.clayCost, bp.oreCost, bp.geodeOreCost, bp.obsOreCost);
  const clay = Math.max(bp.obsClayCost);
  const obs = Math.max(bp.geodeObsCost);
  return { ore, clay, obs };
}
interface BuildOptions {
  ore: boolean;
  clay: boolean;
  obs: boolean;
  geo: boolean;
}

function dfs(
  bp: Blueprint,
  inv: Inventory,
  time: number,
  round = 0,
  best = 0,
  options?: BuildOptions
) {
  // If a possible branch does not give more geodes (in a best case scenario)
  // then the current best, iT's not worth continuing
  let maxPossibleGeods = inv.geo;
  for (let i = 1; i <= time - round; i++) maxPossibleGeods += i + inv.geoRobot;
  if (maxPossibleGeods < best) return 0;

  round++;

  function harvestGoods(inventory: Inventory) {
    const inv = { ...inventory };
    inv.ore += 1 * inventory.oRobot;
    inv.clay += 1 * inventory.cRobot;
    inv.obs += 1 * inventory.obsRobot;
    inv.geo += 1 * inventory.geoRobot;
    return inv;
  }

  if (round == time) return harvestGoods(inv).geo;

  // Check if it is possible to build a robot,but do not
  // build more robots for a good than any robot costs to build

  function buildOreRobot(inv: Inventory) {
    return inv.ore >= bp.oreCost && inv.oRobot < maxCosts(bp).ore;
  }
  function buildClayRobot(inv: Inventory) {
    return inv.ore >= bp.clayCost && inv.cRobot < maxCosts(bp).clay;
  }
  function buildObsidianRobot(inv: Inventory) {
    return (
      inv.ore >= bp.obsOreCost &&
      inv.clay >= bp.obsClayCost &&
      inv.obsRobot < maxCosts(bp).obs
    );
  }
  function fundsForGeode(inv: Inventory) {
    return inv.ore >= bp.geodeOreCost && inv.obs >= bp.geodeObsCost;
  }
  function possibleBuilds(inv: Inventory) {
    return {
      ore: buildOreRobot(inv),
      clay: buildClayRobot(inv),
      obs: buildObsidianRobot(inv),
      geo: fundsForGeode(inv),
    };
  }

  const stock = harvestGoods(inv);

  // Do not build anything and do not build a robot if we could have built it this round
  const res = dfs(bp, stock, time, round, best, possibleBuilds(inv));
  if (res > best) best = res;

  // Do not build robots in the penultimate round
  const penultimate = round == time - 1;

  // Build Ore Robot
  if (buildOreRobot(inv) && !options?.ore && !penultimate) {
    const option = { ...inv };
    option.ore -= bp.oreCost;
    const stock = harvestGoods(option);
    stock.oRobot++;
    const res = dfs(bp, stock, time, round, best);
    if (res > best) best = res;
  }
  // Build Clay Robot
  if (buildClayRobot(inv) && !options?.clay && !penultimate) {
    const option = { ...inv };
    option.ore -= bp.clayCost;
    const stock = harvestGoods(option);
    stock.cRobot++;
    const res = dfs(bp, stock, time, round, best);
    if (res > best) best = res;
  }
  // Build Obsidian Robot
  if (buildObsidianRobot(inv) && !options?.obs && !penultimate) {
    const option = { ...inv };
    option.ore -= bp.obsOreCost;
    option.clay -= bp.obsClayCost;
    const stock = harvestGoods(option);
    stock.obsRobot++;
    const res = dfs(bp, stock, time, round, best);
    if (res > best) best = res;
  }
  // Build Geode Robot
  if (fundsForGeode(inv) && !options?.geo) {
    const option = { ...inv };
    option.ore -= bp.geodeOreCost;
    option.obs -= bp.geodeObsCost;
    const stock = harvestGoods(option);
    stock.geoRobot++;
    const res = dfs(bp, stock, time, round, best);
    if (res > best) best = res;
  }

  return best;
}

// Start
const start = performance.now();

// 1719
console.log(solve1(blueprints, 24));
//  19530
console.log(solve2(blueprints, 32));

// 3.282 ms

// End
const end = performance.now();
console.log((end - start) / 1000, "ms");
