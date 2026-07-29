require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function initDB() {
  let conn;

  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD ?? "",
      port: Number(process.env.DB_PORT) || 3306,
      multipleStatements: true,
    });

    console.log("✅ Connected to MySQL Server");

    const schema = fs.readFileSync(
      path.join(__dirname, "../database/schema.sql"),
      "utf8"
    );

    await conn.query(schema);

    console.log("✅ Database initialized successfully!");
  } catch (err) {
    console.error("❌ MySQL connection failed:");
    console.error(err.code);
    console.error(err.message);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

initDB();