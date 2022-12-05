const input = await Deno.readTextFile("input.txt");
const lines = input.split(/\r?\n/);

const crateLevels = [];
let amount = 0;
const actions = [];
let stacks: string[] = [];

// Parse input
for (const line of lines) {
  if (line.includes("[")) crateLevels.push(line);
  else if (line[0] === " ") amount = line.replaceAll(" ", "").length;
  else if (line[0] === "m") {
    actions.push(
      line
        .replace("move ", "")
        .replace(" from ", ",")
        .replace(" to ", ",")
        .split(/[,]/)
    );
  }
}

// Sort crates in stacks
for (let i = 0; i < amount; i++) {
  for (let k = crateLevels.length - 1; k >= 0; k--) {
    const crate = crateLevels[k][1 + i * 4];
    stacks[i] += crate.trim();
  }
}

const preservedStacks = [...stacks];

// Move crates around
for (const action of actions) {
  for (let i = 0; i < +action[0]; i++) {
    const [from, to] = [+action[1] - 1, +action[2] - 1];
    stacks[to] += stacks[from][stacks[from].length - 1];
    stacks[from] = stacks[from].slice(0, -1);
  }
}
const logAnswer = () =>
  console.log(stacks.map((el) => el[el.length - 1]).join(""));

logAnswer();

// Move crates around for part two
stacks = preservedStacks;
for (const action of actions) {
  const [from, to, sum] = [+action[1] - 1, +action[2] - 1, +action[0]];
  stacks[to] += stacks[from].slice(-sum);
  stacks[from] = stacks[from].slice(0, stacks[from].length - sum);
}

logAnswer();
