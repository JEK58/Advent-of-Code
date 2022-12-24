const input = await Deno.readTextFile("input.txt");
const blueprints = input
  .split(/\r?\n/g)
  .map((c) => c.match(/\d+/g).map(Number));

function getBestBlueprint(blueprints: number[][], time: number) {
  const possibleGeodes: number[] = [];
  for (const blueprint of blueprints) {
    const [
      id,
      oreCost,
      clayCost,
      obsOreCost,
      obsClayCost,
      geodeOreCost,
      geodeObsCost,
    ] = blueprint;
  }

  let oreRobots = 1;
  let clayRobots = 0;

  let ore = 0;
  let clay = 0;
  for (let i = 1; i <= time; i++) {
    let newClayRobots = 0;
    console.log("== Minute", i, "==");
    if (ore > 1) {
      console.log("Building clay robot");

      newClayRobots++;
      ore -= 2;
    }
    ore += oreRobots;
    clay += clayRobots;
    clayRobots += newClayRobots;
    console.log("Ore", ore, "Clay", clay);
  }
  return 1;
}

console.log(getBestBlueprint(blueprints, 10));
