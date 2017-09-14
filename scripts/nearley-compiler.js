const chokidar = require('chokidar');
const util = require("util");
const chalk = require("chalk");
const exec = util.promisify(require("child_process").exec);

function formatMs(ms) {
  let milliseconds = ms % 1000;
  let seconds = Math.floor(ms / 1000);

  return `${seconds}.${milliseconds}s`;
}

chokidar.watch('src/**/grammar.ne').on("all", (e, path) => {
  const start = Date.now();
  console.log("Starting to compile parser...");
  console.log(`yarn nearleyc -- ${path} -o ${path.replace(/\.ne/, ".js")}`);
  exec(`yarn nearleyc -- ${path} -o ${path.replace(/\.ne/, ".js")}`)
    .then(({ stdout, stderr }) => {
      // Delta in ms
      const delta = Date.now() - start;
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.log(stderr);
        console.log(chalk.red("Error in " + formatMs(delta)))
        return;
      }
      console.log(chalk.green("Compiled in " + formatMs(delta)));
    })
    .catch(err => {
      const delta = Date.now() - start;
      console.log(err);
      console.log(chalk.red("Error in " + formatMs(delta)))
    })
});
