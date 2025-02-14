const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "db_container",
  user: "root",
  password: "root",
  port: 3306,
  database: "db_users",
});
if (!connection) {
  console.log("Connection to database failed");
} else console.log("Connection to database established");

module.exports = connection;
