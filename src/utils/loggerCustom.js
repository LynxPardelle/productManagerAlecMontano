import winston from "winston";
import { options } from "../config/process.js";
const environment = !options.prod ? "development" : "production";

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "magenta",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

const loggerDev = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

const loggerProd = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = environment === "development" ? loggerDev : loggerProd;
  req.logger.info(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
  );

  next();
};
