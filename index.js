import express from "express";
import path from "path";
import { connection as db } from "./config/index.js";
import { reverse } from "dns";

const app = express();
const port = +process.env.port || 4000;
const router = express.Router();

app.use(
  router,
  express.static("./static"),
  express.json(),
  express.urlencoded({
    extended: true,
  })
);
router.get("^/$|chally", (req, res) => {
  res.status(200).sendFile(path.resolve("./static/html/index.html"));
});
router.get("/users", (req, res) => {
  try {
    const strQry = `
            select userID, username, usersurname, userAge, userEmail from Users; 
        `;
    db.query(strQry, (err, results) => {
      if (err)
        throw new Error(
          "We have run into issues while fetching the users data."
        );
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});
router.get("/user/:userID", (req, res) => {
  try {
    const strQry = `
            select userID, username, usersurname, userAge, userEmail from Users where userID = ${req.params.userID}
        `;
    db.query(strQry, (err, result) => {
      if (err) throw new Error("We ran into issues while fetching user data.");
      res.json({
        status: res.statusCode,
        result
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});
app.listen(port, () => {
  console.log(`Ayo, We live on Port ${port}`);
});
