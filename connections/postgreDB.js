const { Client } = require("pg");

const dbClient = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

dbClient.connect().then(() => {
  console.log("Database is connected");
});

module.exports = dbClient;
