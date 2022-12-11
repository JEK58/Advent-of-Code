// 67830
// 15305381442
const input = await Deno.readTextFile("input.txt");
const lines = input.split(/\r?\n/);

const monkeys = [];
const length = 7;
const rounds = 10000;

const monkey = {
  items: [0],
  operation: "",
  test: 1,
  true: 0,
  false: 0,
  inspected: 0,
};

for (let i = 0; i < lines.length; i++) {
  const subset = i % length;
  const line = lines[i];
  if (subset == 1) {
    monkey.items = line
      .replace(/[a-zA-Z:\s]+/g, "")
      .split(",")
      .map((el) => +el);
  }
  if (subset == 2) monkey.operation = line.slice(19);
  if (subset == 3) monkey.test = +line.replace(/[a-zA-Z:\s]+/g, "");
  if (subset == 4) monkey.true = +line.replace(/[a-zA-Z:\s]+/g, "");
  if (subset == 5) monkey.false = +line.replace(/[a-zA-Z:\s]+/g, "");
  if (subset == 6 || i == lines.length - 1) monkeys.push({ ...monkey });
}

let mod = 1;
for (const monkey of monkeys) mod *= monkey.test;

for (let round = 0; round < rounds; round++) {
  for (const monkey of monkeys) {
    const items = monkey.items.length;
    for (let i = 0; i < items; i++) {
      monkey.inspected++;
      let old = monkey.items.shift();
      // Remove for part 1
      if (old) old %= mod;
      let level = eval(monkey.operation);
      // Remove for part 2
      // level = Math.floor(level / 3);
      level % monkey.test == 0
        ? monkeys[monkey.true].items.push(level)
        : monkeys[monkey.false].items.push(level);
    }
  }
}

monkeys.sort((a, b) => b.inspected - a.inspected);
console.log(monkeys[0].inspected * monkeys[1].inspected);
