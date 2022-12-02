const input = await Deno.readTextFile("input.txt");
const rounds = input.split(/\r?\n/);

let scoreA = 0;

for (const round of rounds) {
  const op = "ABC".indexOf(round[0]);
  const me = "XYZ".indexOf(round[2]);
  scoreA += me + 1;

  if ((op < me && !(op == 0 && me == 2)) || (op == 2 && me == 0)) scoreA += 6;
  if (op === me) scoreA += 3;
}

let scoreB = 0;

for (const round of rounds) {
  const goal = round[2];
  const op = "ABC".indexOf(round[0]);

  if (goal == "X") {
    if (op == 0) scoreB += 3;
    else scoreB += op;
  } else if (goal == "Y") scoreB += op + 1 + 3;
  else if (goal == "Z") {
    scoreB += ((op + 1) % 3) + 1 + 6;
  }
}

console.log(scoreA);
console.log(scoreB);
// 11767
// 13886
