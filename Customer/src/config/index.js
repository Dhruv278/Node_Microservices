const dotEnv = require("dotenv");
const path =require("path");

if (process.env.NODE_ENV !== "prod") {

  const configFile = path.resolve(__dirname,"./../../.env.dev");
  dotEnv.config({ path: configFile });
  // console.log(path.resolve(__dirname,"./../.env"))
  console.log( process.env.MONGODB_URI)
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  MESSAGE_BROKER_URL:process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME:"ONLINE_SHOPPING",
  SHOPPING_BINDING_KEY:"SHOPPING_SERVICE",
  CUSTOMER_BINDING_KEY:"CUSTOMER_SERVICE",
  QUEUE_NAME:"CUSTOMER_QUEUE",
};
