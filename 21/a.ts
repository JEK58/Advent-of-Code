const input = await Deno.readTextFile("input.txt");

function getMonkey(name: string) {
  const yellingMonkeys = new Map();

  input
    .split(/\r?\n/g)
    .filter((c) => c.length < 10)
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
// 223971851179174
console.log(getMonkey("root"));
