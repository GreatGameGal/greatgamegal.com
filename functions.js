const fs = require("fs");

function recursiveFileParse(path) {
  let currPath = __dirname.replace(/\\/g, "/") + path;
  fileReturn = [];
  let files = fs.readdirSync(currPath);
  for (let file of files) {
    if (fs.lstatSync(`${currPath}/${file}`).isDirectory()) {
      fileReturn = fileReturn.concat(recursiveFileParse(`${path}/${file}`));
    } else {
      fileReturn.push({
        path: `${path}/${file}`,
        content:
          require(`${currPath}/${file}`) ||
          fs.readFileSync(`${currPath}/${file}`, "utf-8"),
      });
    }
  }
  return fileReturn;
}

module.exports = { recursiveFileParse };
