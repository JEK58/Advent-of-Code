const input = await Deno.readTextFile("input.txt");
const numbers = input.split(/\r?\n/g);

function toDecimal(num: string) {
  const SNAFU = ["=", "-", "0", "1", "2"];
  let dec = 0;
  const reversed = num.split("").reverse().join("");

  for (let i = 0; i <= num.length - 1; i++) {
    const charValue = SNAFU.indexOf(reversed[i]) - 2;
    dec += charValue * Math.pow(5, i);
  }
  return dec;
}

function toSNAFU(num: number) {
  const convert = (num: number) => {
    const SNAFU = ["0", "1", "2", "=", "-"];
    const char = SNAFU[num % 5];
    let res = char;
    let quotient = Math.floor(num / 5);

    if (quotient == 0) return res;
    if (char == "=" || char == "-") quotient += 1;
    res += convert(quotient);
    return res;
  };

  return convert(num)?.split("").reverse().join("");
}

function solve(numbers: string[]) {
  let sum = 0;
  numbers.forEach((n) => (sum += toDecimal(n)));
  return toSNAFU(sum);
}
// 2-=12=2-2-2-=0012==2
console.log(solve(numbers));
