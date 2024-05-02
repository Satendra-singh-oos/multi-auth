import helmet from "helmet";

const helemtOptions = () => {
  return helmet({
    // contentSecurityPolicy: {
    //   directives: {
    //     "default-src": ["'self'"],
    //     "base-uri": ["'self'"],
    //     "font-src": ["'self'"],
    //     "form-action": ["'self'"],
    //     "frame-ancestors": ["'self'"],
    //     "object-src": ["'none'"],
    //     "script-src": [
    //       "'self'",
    //       "https://app.getbeamer.com",
    //       "https://widget.frill.co",
    //       "https://connect.facebook.net",
    //     ],
    //   },
    // },

    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    dnsPrefetchControl: true,
    frameguard: {
      action: "sameorigin",
    },
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: true,
    xssFilter: true,
  });
};

export { helemtOptions };
