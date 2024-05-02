import express from "express";
import requestIp from "request-ip";
import cookieParser from "cookie-parser";
import compression from "compression";
import hpp from "hpp";
import { corsOptions } from "./middlewares/global/cors";
import { helemtOptions } from "./middlewares/global/helemt";
import { rateLimiter } from "./middlewares/global/ratelimit";

const app = express();

app.use(corsOptions()); // CORS Configuration
app.use(helemtOptions()); // Security headers
app.use(compression()); // Compress responses
app.use(requestIp.mw()); //extracting client IP addresses

app.use(rateLimiter); // Rate limiting

app.use(cookieParser()); // Parse cookies
app.use(hpp()); // Protect against HTTP Parameter Pollutio
app.use(express.json({ limit: "20kb" })); // Parse JSON data
app.use(express.urlencoded({ extended: false, limit: "20kb" })); // Parse URL-encoded data

export { app };
