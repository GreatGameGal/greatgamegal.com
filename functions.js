const fs = require("fs");

function recursiveFileParse (path) {
  const currPath = __dirname.replace(/\\/g, "/") + path;
  const fileReturn = [];
  for (const file of fs.readdirSync(currPath)) {
    if (fs.lstatSync(`${currPath}/${file}`).isDirectory()) {
      for (const returnedFile of recursiveFileParse(`${path}/${file}`))
        fileReturn.push(returnedFile);

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
