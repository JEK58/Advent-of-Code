const input = await Deno.readTextFile("input.txt");
const sections = input.split(/\r?\n/);

let overlaps = 0;
let partialOverlaps = 0;
for (const section of sections) {
  const pair = section.split(",");
  const a = pair[0].split("-");
  const b = pair[1].split("-");
  const [as, ae, bs, be] = [+a[0], +a[1], +b[0], +b[1]];

  if ((as <= bs && ae >= be) || (as >= bs && ae <= be)) overlaps++;
  if (ae >= bs && be >= as) partialOverlaps++;
}
console.log(overlaps);
console.log(partialOverlaps);
