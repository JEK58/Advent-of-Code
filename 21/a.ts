const input = await Deno.readTextFile("input.txt");

function getMonkey(name: string) {
  const yellingMonkeys = new Map();

  input
    .split(/\r?\n/g)
    .filter((c) => c.length < 11)
    .map((c) => c.split(": "))
    .map((m) => yellingMonkeys.set(m[0], +m[1]));

  const waitingMonkeys = input
    .split(/\r?\n/g)
    .filter((c) => c.length > 8)
    .map((c) => c.replace(":", "").split(" "));

  while (!yellingMonkeys.get(name)) {
    const monkey = waitingMonkeys.shift();
    if (!monkey) break;

    const [name, left, op, right] = monkey;
    const a = yellingMonkeys.get(left);
    const b = yellingMonkeys.get(right);

    if (a && b) {
      const operation = a + op + b;
      const res = eval(operation);
      yellingMonkeys.set(name, res);
    } else {
      waitingMonkeys.push(monkey);
    }
  }
  return yellingMonkeys.get(name);
}

function getHuman() {
  const yellingMonkeys = new Map();
  const root = input
    .split(/\r?\n/g)
    .filter((c) => c.includes("root"))
    .map((c) => c.split(" "))
    .flat();

  let left = root[1];
  let right = root[3];

  input
    .split(/\r?\n/g)
    .filter((c) => !c.includes("humn"))
    .filter((c) => c.length < 11)
    .map((c) => c.split(": "))
    .map((m) => yellingMonkeys.set(m[0], +m[1]));

  const waitingMonkeys = input
    .split(/\r?\n/g)
    .filter((c) => !c.includes("root"))
    .filter((c) => c.length > 11)
    .map((c) => c.split(": "));

  let diff = "";
  while (left != diff) {
    diff = left;
    for (const monkey of waitingMonkeys) {
      left = left.replaceAll(monkey[0], `(${monkey[1]})`);
    }
  }

  diff = "";
  while (right != diff) {
    diff = right;
    for (const monkey of waitingMonkeys) {
      right = right.replaceAll(monkey[0], `(${monkey[1]})`);
    }
  }

  for (const monkey of yellingMonkeys) {
    left = left.replaceAll(monkey[0], monkey[1]);
    right = right.replaceAll(monkey[0], monkey[1]);
  }

  const goal = eval(left.includes("humn") ? right : left);

  let lo = 0;
  let hi = 1e20;
  let humn; // mid
  while (hi > lo) {
    humn = Math.floor((hi + lo) / 2);
    const res = goal - eval(left.includes("humn") ? left : right);
    if (res == 0) return humn;
    // TODO: The "< or >" needs to be switched manuallay depending on the input
    else if (res < 0) lo = humn;
    else hi = humn;
  }
}
// 223971851179174
console.log(getMonkey("root"));

// 3379022190351
console.log(getHuman());
