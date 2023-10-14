/* eslint-disable node/no-process-env */

export default {
  nodeEnv: process.env.NODE_ENV ?? "",
  port: process.env.PORT ?? 0,
  folder: "uploadedFile",
  // folder: process.env.FOLDER ?? "uploadedFile",
  cookieProps: {
    key: "ExpressTs",
    secret: process.env.COOKIE_SECRET ?? "",
    options: {
      httpOnly: true,
      signed: true,
      path: process.env.COOKIE_PATH ?? "",
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: process.env.COOKIE_DOMAIN ?? "",
      secure: process.env.SECURE_COOKIE === "true",
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "",
    exp: process.env.JWT_TOKEN_EXP ?? "60 minutes",
    refExp: process.env.REFRESH_TOKEN_EXP ?? "30 days",
  },
  aws: {
    secret: process.env.AWS_SECRECT_ACCESS_KEY ?? "",
    access: process.env.AWS_ACCESS_KEY ?? "",
    region: process.env.AWS_REGION ?? "us-east-1",
    bucket: process.env.BUCKET_NAME ?? "bucket_name",
  },
  mongoDB: {
   
    url: "mongodb+srv://jfsdev:123jfsdev@triosoft.m7wrzzs.mongodb.net/V1",
    //url:"mongodb+srv://radoan:radoan151@cluster0.ik1jr.mongodb.net/nearestLaundry?retryWrites=true&w=majority",
    // process.env.MONGO_CONN_URL ?? "mongodb://localhost:27017/nearestLaundry",
  },
  mailer: {
    from: process.env.MAIL_FROM ?? "noreply@nearestlaundry.com",
    mailtrap: {
      host: process.env.MAIL_HOST ?? "smtp.gmail.com",
      port: process.env.MAIL_PORT ?? 465,
      auth: {
        user: process.env.MAIL_USER ?? "noreply@nearestlaundry.com",
        pass: process.env.MAIL_PASS ?? "cyvyczlgrkwaxywd",
      },
    },
  },
  payment: {
    // stripeSecret:
    //   "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",
    // stripePublic:
    //   "pk_live_51J8pnpIIQpgUe9ST295BJrzJWMVTnjLqAeMrY4kVq45sZkDLRTca7COHz18dYMgQPRODcoKMwcOoKzmStFOBsvly00WMX4mX5l",
    stripeSecret:
      "sk_test_51J8pnpIIQpgUe9STFIs1TBoR3q4fAJvAR1JFAna3Rj7DNiyUzmjTtLs4g9QNtWRBGQzVc9ByjXADgpJX7DepQxAF00LwAzLR4R",
    stripePublic:
      "pk_test_51J8pnpIIQpgUe9STM1wwTy1Q820667WwC6xgz9n22r0Z1kjkMPvMTjTKwRCz7VEcNhbGbkhYCFUkzg1QDYvIzTOP00n3AWwWf5",
  },
  redis: process.env.REDIS_URL ?? "redis://localhost:6379",
  redisTime: 3600 * 1000,
  defaultPaymentAmount: 20,
  defaultReferralAmount: 5,
  defaultFreelanceShare: 5,
  defaultFreelancerMaxGetPerOrder: 50,
} as const;
