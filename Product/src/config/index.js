const dotEnv = require("dotenv");
const path=require("path");

if (process.env.NODE_ENV !== "prod") {
  const configFile = path.resolve(__dirname,"./../../.env.dev");
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
};
