import dotenv from "dotenv";
import { options } from "./process.js";
console.info("Options", options);
const environment = !options.prod ? "development" : "production";
dotenv.config(
  environment === "development"
    ? { path: ".env.development" }
    : { path: ".env.production" }
);
let port = process.env.PORT || 8080;
export default {
  gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  gitHubClientId: process.env.GITHUB_CLIENT_ID,
  mongoUrl: process.env.MONGO_URL || "",
  port: port,
  persistence: process.env.PERSISTENCE || "MONGO",
  email: process.env.EMAIL_USER,
  emailMask: process.env.EMAIL_MASK,
  emailPass: process.env.EMAIL_PASS,
  secret: process.env.SECRET_KEY,
  origin: process.env.ORIGIN.includes("localhost")
    ? process.env.ORIGIN + port
    : process.env.ORIGIN,
};
