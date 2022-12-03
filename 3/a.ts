const input = await Deno.readTextFile("input.txt");
const rucksacks = input.split(/\r?\n/);

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

let sum = 0;
let badgeSum = 0;
let groupItems: string[] = [];

for (let i = 0; i < rucksacks.length; i++) {
  const groupMember = (i % 3) + 1;
  const rucksack = rucksacks[i];
  const a = rucksack.slice(0, rucksack.length / 2);
  const b = rucksack.slice(rucksack.length / 2);
  const commonItems: string[] = [];
  for (const item of a) {
    const isNewItem = commonItems.indexOf(item) === -1;
    if (b.includes(item) && isNewItem) commonItems.push(item);
  }
  commonItems.forEach((item) => {
    sum += alphabet.indexOf(item) + 1;
  });

  if (groupMember === 1) groupItems = rucksack.split("");
  else {
    groupItems = groupItems.filter((item) => {
      return rucksack.indexOf(item) != -1;
    });
  }
  if (groupMember === 3) badgeSum += alphabet.indexOf(groupItems[0]) + 1;
}
console.log(sum);
console.log(badgeSum);
