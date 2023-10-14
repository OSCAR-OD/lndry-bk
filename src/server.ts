import DeleteController from "@controller/DeleteController";
import envVars from "@shared/env-vars";
import { CustomError } from "@shared/errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import helmet from "helmet";
import StatusCodes from "http-status-codes";
import logger from "jet-logger";
import mongoose from "mongoose";
import morgan from "morgan";
import corn from "node-cron";
import path from "path";
import BaseRouter from "./routes/api";

// **** Init express **** //

const app = express();

// **** Set basic express settings **** //

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(envVars.cookieProps.secret));
app.use(cors());
// app.use(compression());
// Show routes called in console during development
if (envVars.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Security
if (envVars.nodeEnv === "production") {
  app.use(helmet({
      crossOriginResourcePolicy: false,
  }));
}
//Connect mongodb
// DB Connection here
mongoose
  .connect(envVars.mongoDB.url)
  .then(() => console.log("Database connected"))
  .catch((error) => {
    if (error) console.log("Failed to connect DB", error);
  });

// **** Add API routes **** //

// Add APIs
app.use("/", BaseRouter);
app.use("/api/v1", BaseRouter);

// Error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(
  (err: Error | CustomError, req: Request, res: Response, _: NextFunction) => {
    logger.err(err, true);
    const status =
      err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST;
    return res.status(status).json({
      error: err.message,
    });
  }
);

// Set static directory (files).
const staticDir = path.join(__dirname, envVars.folder);
// const staticDir2 = path.join(__dirname, "uploads");
app.use(express.static(staticDir));
// app.use(express.static(staticDir2));

//Run cron job to delete after a certain inactivity every sunday at 00:00
corn.schedule("0 0 0 * * 0", async () => {
  await DeleteController.deleteScheduler();
});

// **** Export default **** //

export default app;
