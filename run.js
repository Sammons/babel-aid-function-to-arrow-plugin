var cp = require("child_process");
var path = require("path");
var fs = require("fs");

console.log(process.argv[0]);
const badUsage = () => {
  console.log('usage "node run <in_directory> <out_directory>"');
  process.exit(2);
};

if (!process.argv[2] || !process.argv[3]) {
  badUsage();
}
let inDir = path.resolve(process.argv[2]);
if (!fs.existsSync(inDir)) {
  console.log("could not find", inDir);
}
let outDir = path.resolve(process.argv[3]);
if (!fs.existsSync(outDir)) {
  console.log("could not find", outDir);
}
console.log("running with", "in:", inDir, "out:", outDir);
cp.execSync(
  `babel ${inDir} -d ${outDir} --plugins ${path.join(
    path.resolve(__dirname),
    "./plug.js"
  )}`,
  { stdio: "inherit" }
);
