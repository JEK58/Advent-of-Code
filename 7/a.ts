// This is a mess 🤪🤪🤪

const input = await Deno.readTextFile("input.txt");
const lines = input.split(/\r?\n/);

const spaceNeeded = 30000000;
const totalSpace = 70000000;
let ans1 = 0;

interface Directory {
  name: string | undefined;
  dirs: Directory[];
  files: string[];
  size: number;
}

const fileTree = genFileTree();
addDirSize(fileTree);
calcSize(fileTree);
console.log(ans1);

const freeSpace = totalSpace - fileTree.size;
const spaceToClear = spaceNeeded - freeSpace;
let ans2 = fileTree.size;
findDirToDelete(fileTree);

console.log(ans2);

function genFileTree(name?: string) {
  const dir: Directory = { name: name, dirs: [], files: [], size: 0 };
  while (lines.length) {
    const line = lines.shift();
    if (!line) break;
    if (line[0] == "$") {
      if (line.includes("cd /")) dir.name = "root";
      else if (line.includes("cd ..")) return dir;
      else if (line.includes("cd ")) {
        dir.dirs.push(genFileTree(line.slice(5)));
      }
    }
    if (!isNaN(parseInt(line[0], 10))) dir.files.push(line);
  }
  return dir;
}

function addDirSize(tree: Directory) {
  let size = 0;
  if (tree.dirs.length) {
    for (const dir of tree.dirs) size += addDirSize(dir);
  }
  if (tree.files.length) {
    for (const file of tree.files) size += +file.replace(/\D/g, "");
  }

  return (tree.size += size);
}

function calcSize(tree: Directory) {
  let size = 0;
  if (tree.dirs.length) {
    for (const dir of tree.dirs) {
      size += calcSize(dir);
    }
  }
  if (tree.size <= 100000) ans1 += tree.size;
  return size;
}

function findDirToDelete(tree: Directory) {
  if (tree.size > spaceToClear && tree.size < ans2) ans2 = tree.size;

  for (const dir of tree.dirs) findDirToDelete(dir);

  return;
}
