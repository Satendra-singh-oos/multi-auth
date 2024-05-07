import express, { Request, Response } from "express";
import requestIp from "request-ip";
import cookieParser from "cookie-parser";
import compression from "compression";
import hpp from "hpp";
import { corsOptions } from "./middlewares/global/cors";
import { helemtOptions } from "./middlewares/global/helemt";
import rateLimit from "express-rate-limit";

const app = express();

app.use(corsOptions()); // CORS Configuration
app.use(helemtOptions()); // Security headers
app.use(compression()); // Compress responses
app.use(requestIp.mw()); //extracting client IP addresses

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: Request, res: Response) => {
    const clientIp = req.clientIp;
    if (clientIp) {
      return clientIp; // Return the client IP address
    } else {
      throw new Error("Failed to determine client IP address");
    }
  },
  handler: (_, __, ___, options) => {
    throw new Error(
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(cookieParser()); // Parse cookies
app.use(hpp()); // Protect against HTTP Parameter Pollutio
app.use(express.json({ limit: "20kb" })); // Parse JSON data
app.use(express.urlencoded({ extended: false, limit: "20kb" })); // Parse URL-encoded data

// route import

import healthCheckRoute from "./routes/healthcheck.route";
import userRoute from "./routes/user.route";
import { API_VERSION } from "./constant";

app.use(`/api/${API_VERSION}/healthcheck`, healthCheckRoute);
app.use(`/api/${API_VERSION}/users`, userRoute);

export { app };
