import { Command } from "commander";

const program = new Command();

program
  .option("-p, --port <port>", "server port", 8080)
  .option("-pr, --prod", "production mode", false)
  .option("-c, --config <configFilePath>", "config file path")
  .parse(process.argv);
console.info("Arguments", program.args);

process.on("exit", (code) => {
  console.error(`About to exit with code: ${code}`);
});
process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});
/* process.on("SIGINT", () => {
  console.info("Received SIGINT. Press Control-D to exit.");
});
process.on("SIGTERM", () => {
  console.info("Received SIGTERM. Press Control-D to exit.");
});
process.on("SIGUSR2", () => {
  console.info("Received SIGUSR2. Press Control-D to exit.");
});
*/

export const options = program.opts();
