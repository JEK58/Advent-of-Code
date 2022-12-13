const input = await Deno.readTextFile("input.txt");
const lines = input.replaceAll(/\r?\n/g, ",").replaceAll(",,", ",");
const json = JSON.parse("[" + lines + "]");

type Packet = Packet[] | number;

let ans1 = 0;

for (let i = 0; i < json.length; i += 2) {
  const l = json[i];
  const r = json[i + 1];
  const pair = (i + 2) / 2;
  if (compare(l, r)) ans1 += pair;
}

function compare(l: Packet, r: Packet): boolean | null {
  if (typeof l === "number" && typeof r === "number") {
    if (l < r) return true;
    if (l > r) return false;
    return null;
  }
  if (Array.isArray(l) && Array.isArray(r)) {
    const min = Math.min(l.length, r.length);
    for (let i = 0; i < min; i++) {
      const res = compare(l[i], r[i]);
      if (res != null) return res;
    }
    return compare(l.length, r.length);
  }
  typeof l === "number" ? (l = [l]) : (r = [r]);
  return compare(l, r);
}
const dividers: Packet[] = [[[2]], [[6]]];
const signals: Packet[] = [...json, ...dividers];

const ordered = signals.sort((l, r) => {
  // TODO: Deeply understand this 🤯
  // console.log(l, r);
  // console.log(compare(r, l), compare(l, r));
  const resL = compare(r, l);
  const resR = compare(l, r);
  if (resL == null || resR == null) return 0;
  return +resL - +resR;
});

let ans2 = 1;
for (let i = 0; i < ordered.length; i++) {
  if (dividers.includes(ordered[i])) ans2 *= i + 1;
}

console.log(ans1);
console.log(ans2);

// 5675
// 20383
