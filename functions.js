const fs = require("fs");

function recursiveFileParse(path) {
  let currPath = __dirname.replace(/\\/g, "/") + path;
  fileReturn = [];
  let files = fs.readdirSync(currPath);
  for (let file of files) {
    if (fs.lstatSync(`${currPath}/${file}`).isDirectory()) {
      fileReturn = fileReturn.concat(recursiveFileParse(`${path}/${file}`));
    } else {
      try {
        delete require.cache[require.resolve(`${currPath}/${file}`)];
        fileReturn.push({
          path: `${path}/${file}`,
          content:
            require(`${currPath}/${file}`) ||
            fs.readFileSync(`${currPath}/${file}`, "utf-8"),
        });
      } catch (err) {
        console.error(err);
      }
    }
  }
  return fileReturn;
}

module.exports = { recursiveFileParse };
