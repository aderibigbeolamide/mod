import path from "path";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { DataSource } from "typeorm";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });


console.log("Environment is ", process.env.NODE_ENV);
export const connectionOptions: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  host: process.env.HOST || process.env.PGHOST,
  port: Number(process.env.DB_PORT || process.env.PGPORT || 5432),
  username: process.env.USER || process.env.PGUSER,
  password: process.env.PASSWORD || process.env.PGPASSWORD,
  database: process.env.DATABASE || process.env.PGDATABASE,
  synchronize: process.env.DB_SYNCRHONIZE == "false" ? false : process.env.NODE_ENV == "local",
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  // ssl:
  //   process.env.NODE_ENV != "local"
  //     ? {
  //         ca: readFileSync(path.resolve(__dirname, process.env.SSL_CERT)),
  //       }
  //     : null,
  // extra: {
  //   max: "100",
  //   min: "50",
  // },
  entities: [path.join(__dirname, "../**/*.entity{.ts,.js}")],
  migrations: [path.join(__dirname, "../**/*.migration{.ts,.js}")],
  subscribers: [path.join(__dirname, "../**/*.subscriber{.ts,.js}")],
};

export const dataSource = new DataSource(connectionOptions);
console.log("env", process.env.NODE_ENV);
