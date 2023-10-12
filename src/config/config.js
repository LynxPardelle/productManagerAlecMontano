import dotenv from "dotenv";
import { options } from "./process.js";
console.log("Options", options);
const environment = !!options.dev ? "development" : "production";
dotenv.config(
  environment === "development"
    ? { path: ".env.development" }
    : { path: ".env.production" }
);

export default {
  gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  gitHubClientId: process.env.GITHUB_CLIENT_ID,
  mongoUrl: process.env.MONGO_URL || "",
  port: process.env.PORT || 8080,
};
