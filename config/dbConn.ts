import { Sequelize } from "sequelize";
import { env } from "../.env";
import mariadb from "mariadb";

const dbConn = new Sequelize(env.dbName, env.sqlUser, env.sqlPass, {
  host: env.sqlServer,
  port: env.sqlPort,
  dialect: "mariadb",
  dialectModule: mariadb,
  dialectOptions: {
    driver: mariadb,
    connectTimeout: 30000,
  },
});

export { dbConn };
