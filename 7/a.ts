const input = await Deno.readTextFile("input.txt");
const lines = input.split(/\r?\n/);

const structure: string[][][] = [];
let level = 0;

for (const line of lines) {
  if (line[0] == "$") {
    if (line.includes("cd /")) level = 0;
    else if (line.includes("cd ..")) level--;
    else if (line.includes("cd")) {
      structure[level].push([]);
      level++;
    }
  }
  if (line.slice(0, 3) == "dir") structure.push([line, []]);

  if (!isNaN(parseInt(line[0], 10))) console.log("File");
}
console.log(structure);
