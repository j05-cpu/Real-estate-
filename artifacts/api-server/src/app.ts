import express, { type Express, Request, Response } from "express";
import cors from "cors";
import * as _pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

// pino-http v10 ships an `export =` CJS module; under ESM + "moduleResolution: bundler"
// the namespace import gives us the callable as `.default` or as the namespace itself.
// This cast is the safe way to call it without Vercel's stricter tsc failing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pinoHttp: (opts: any) => any =
  (typeof (_pinoHttp as any).default === "function")
    ? (_pinoHttp as any).default
    : (_pinoHttp as any);

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: Request) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: Response) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
