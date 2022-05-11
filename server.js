const express = require("express");

//Without downgrading to legacy, https://github.com/sidorares/node-mysql2#readme
const mysql = require("mysql2");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("App is listening on port " + listener.address().port);
});

app.get("/reviews", (req, res) => {
  db.query("SELECT * FROM reviews", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/reviews", (req, res) => {
  const insertQuery = "INSERT INTO reviews SET ?";
  db.query(insertQuery, req.body, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Review Added to Database");
    }
  });
});

app.put("/reviews", (req, res) => {
  const updateQuery =
    "UPDATE reviews SET location = ?, costOfTravel = ? , image = ?, transportation = ?, wouldRecommend = ? WHERE idReviews = ?";
  db.query(
    updateQuery,
    [
      req.body.location,
      req.body.costOfTravel,
      req.body.image,
      req.body.transportation,
      req.body.wouldRecommend,
      req.body.idReviews,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//req.params.id is referencing the id in the url of http://localhost:3000/reviews/2
app.delete("/reviews/:id", (req, res) => {
  db.query(
    "DELETE FROM reviews WHERE idReviews = ?",
    req.params.id,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
