import mysql from "mysql2/promise";
import dotenv from "dotenv";
import e from "express";
dotenv.config();
let db;
try {
  db =await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.PASSWORD,
  });
  console.log(`Data Base Connection Has Been Created`);
} catch (error) {
  console.log(`DataBase Connection Failed`);
}
(async function database() {
  try {
    await db.execute("CREATE DATABASE IF NOT EXISTS Data");
    await db.query(`use Data`);
    await db.execute(`
    CREATE TABLE IF NOT EXISTS User_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(20),
        email VARCHAR(50) UNIQUE,
        password VARCHAR(255)
    )
`);
  } catch (err) {
    console.log(err);
  }
})();
export default db;