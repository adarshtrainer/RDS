const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// RDS Connection
const db = mysql.createConnection({
  // mysql://admin:**********@database-1.xyz.ap-south-1.rds.amazonaws.com:4021/db
  // NOTE FOR APP TESTING: CHNAGE DB CONNECTION URL AS BELOW
  host: "database-1.xyz.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "password",
  // Initial DB name
  database: "db",
  port: 4021,
});

// Connect
db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Error:", err);
    return;
  }
  console.log("✅ Connected to AWS RDS MySQL");
});

// Show data + form
app.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    res.render("index", { users: results });
  });
});

// Insert data
app.post("/add", (req, res) => {
  const { name, email } = req.body;

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Start server
app.listen(3000, () => {
  console.log("🚀 App running at http://localhost:3000");
});

