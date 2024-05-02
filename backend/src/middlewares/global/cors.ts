import cors from "cors";

const corsOptions = () => {
  return cors({
    methods: ["GET", "PUT", "PATCH", "DELETE"], //Allowed methods
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
      "X-XSRF-TOKEN",
    ], // Allowed headers

    async origin(origin, callback) {
      if (!origin) return callback(null, true); // allow requests with no origin (like mobile apps or curl requests)
      const whitelist = process.env.CORS_ORIGIN_URL?.split(",") || [];

      if (whitelist.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  });
};

export { corsOptions };
