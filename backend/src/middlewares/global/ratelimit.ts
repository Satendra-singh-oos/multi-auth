import rateLimit, { RateLimitExceededEventHandler } from "express-rate-limit";
import { app } from "../../app";
import requestIp from "request-ip";

app.use(requestIp.mw());

const rateLimiter = (): RateLimitExceededEventHandler => {
  return rateLimit({
    windowMs: 5 * 60 * 1000, //5 minutes
    max: 300, //limit each IP to 400 requests per windowsMS
    keyGenerator: (req, res) => {
      return req.clientIp || "unknown ip"; // IP address from requestIp.mw(), as opposed to req.ip
    },
    message: "There are too many requests. You are only allowed ",
    // handler: (_, __, ___, options) => {
    //   throw new Error(
    //     options.statusCode || 500,
    //     `There are too many requests. You are only allowed ${
    //       options.max
    //     } requests per ${options.windowMs / 60000} minutes`
    //   );
    // },
  });
};

export { rateLimiter };
