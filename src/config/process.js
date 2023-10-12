import { Command } from "commander";

const program = new Command();

program
  .option("-p, --port <port>", "server port", 8080)
  .option("-d, --dev", "development mode", true)
  .option("-c, --config <configFilePath>", "config file path")
  .parse(process.argv);
console.log("Arguments", program.args);

process.on("exit", (code) => {
  console.log(`About to exit with code: ${code}`);
});
process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});
process.on("SIGINT", () => {
  console.log("Received SIGINT. Press Control-D to exit.");
});
process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Press Control-D to exit.");
});
process.on("SIGUSR2", () => {
  console.log("Received SIGUSR2. Press Control-D to exit.");
});

export const options = program.opts();
