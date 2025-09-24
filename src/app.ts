import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

import swaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";
import express from "express";
import { Routes } from "./api/v1/interfaces/routes.interface.js";
import { errorMiddleware } from "./api/v1/middlewares/index.js";
import { logger, stream } from "./config/logger.js";
import { dataSource } from "./config/database.config.js";
import { AppName, v1Base } from "./config/constants.js";
import { Swagger } from "./swagger.js";
import { serializerMiddleware } from "./api/v1/middlewares/serializerMiddleware.js";
dotenv.config()

class App {
  public app: express.Application;
  public port: string | number;
  public env: "development" | "test" | "production";

  constructor(routes: Routes[]) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    process.env["NODE_CONFIG_DIR"] = __dirname + "/configs";

    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = (process.env.NODE_ENV as typeof this.env) || "development";

    this.env !== "test" && this.connectToDatabase();
    this.initializeMiddlewares();
    this.app.use(serializerMiddleware);
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    const port = Number(this.port);
    this.app.listen(port, 'localhost', () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on localhost:${port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    try {
      //postresql db connection
      const connection = await dataSource.initialize();

      await connection.runMigrations();
    } catch (err) {
      console.log(err.message);
    }
  }

  private initializeMiddlewares() {
    // For Replit environment, allow all origins during development
    const corsOptions: cors.CorsOptions = {
      origin: true, // Allow all origins for development in Replit
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Apikey"],
      credentials: true,
      optionsSuccessStatus: 200,
    };
    this.app.use(cors(corsOptions));
    // this.app.use(
    //   cors({
    //     origin: '*',
    //     credentials: process.env.CORS_CREDENTIAL,
    //   })
    // );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use(`${v1Base}${route.path}`, route.router);
    });
  }

  private initializeSwagger() {
    // todo: swagger documentation
    this.app.use(
      "/api-docs",
      swaggerUI.serve,
      swaggerUI.setup(
        swaggerJsdoc({
          definition: {
            openapi: "3.1.0",
            info: {
              title: AppName,
              version: "1.0.0",
              description: AppName + " endpoints",
            },
            servers: [
              {
                url: process.env.API_HOST + ":" + process.env.API_PORT + "/",
              },
            ],
            components: {
              securitySchemes: {
                [Swagger.authKey]: {
                  type: "apiKey",
                  name: "Apikey",
                  in: "header",
                },
              },
            },
            paths: Swagger.pathGen(),
          },
          apis: [],
        }),
        { explorer: false, customSiteTitle: AppName + ` Swagger` }
      )
    );
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}


export default App;