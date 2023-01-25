const express = require("express");

const app = express();

const path = require("path");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const dbPath = path.join(__dirname, "user.db");

let db = null;

const connect = async () => {
  try {
    // db = await open({
    //   filename: dbPath,
    //   driver: sqlite3.Database,
    //   mode: sqlite3.OPEN_READWRITE,

    db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Connected to the USER_DB database");
      }
    });
    app.listen(3030, () => {
      console.log("server at 3030");
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
connect();

app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

app.use(express.static(path.join(__dirname, "./client/build")));

// app.get("*", async (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

app.post("/api/create", async (req, res) => {
  const createQuery = `
        CREATE TABLE user (id INT NOT NULL PRIMARY KEY, name VARCHAR(200))
    `;
  const createResponse = await db.run(createQuery, (err) => {
    if (err) {
      return res.send({ failed: "Table Already Exist" });
    }
    res.send({ failed: "Table Created Successfully" });
  });
});

app.post("/api/add", async (req, res) => {
  const { id, name } = req.body;
  const addQuery = `
          INSERT INTO user (id, name)
          VALUES (${id}, '${name}')
      `;
  const addResponse = await db.run(addQuery, (e) => {
    if (e) {
      return res.send({ failed: e });
    }
    res.send({ success: `user ${name} added Successfully` });
  });
});

app.get("/api/get", async (req, res) => {
  const getQuery = `
            SELECT * FROM user
        `;
  const getResponse = await db.all(getQuery, (error, rows) => {
    if (error) {
      return res.send(error);
    }
    res.send(rows);
  });
});
