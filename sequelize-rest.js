const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bodyParserMiddleWare = bodyParser.json();
const Sequelize = require("sequelize");
const port = 4000;
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:secret@localhost:5432/postgres";
const db = new Sequelize(databaseUrl);

app.use(bodyParserMiddleWare);
app.listen(port);

const Movie = db.define("movie", {
  title: Sequelize.STRING,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.STRING
});

db.sync()
  .then(() =>
    Movie.findOrCreate({
      where: {
        title: "episode IV",
        yearOfRelease: 1977,
        synopsis:
          "The Imperial Forces, under orders from cruel Darth Vader, hold Princess Leia hostage in their efforts to quell the rebellion against the Galactic Empire."
      }
    })
  )
  .then(([movie, created]) => {
    console.log(
      movie.get({
        plain: true
      })
    );
  })
  .then(() =>
    Movie.findOrCreate({
      where: {
        title: "episode V",
        yearOfRelease: 1980,
        synopsis:
          "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda."
      }
    })
  )
  .then(([movie, created]) => {
    console.log(
      movie.get({
        plain: true
      })
    );
  })
  .then(() =>
    Movie.findOrCreate({
      where: {
        title: "episode VI",
        yearOfRelease: 1983,
        synopsis:
          "After a daring mission to rescue Han Solo from Jabba the Hutt, the Rebels dispatch to Endor to destroy the second Death Star."
      }
    })
  )
  .then(([movie, created]) => {
    console.log(
      movie.get({
        plain: true
      })
    );
  })
  .catch(console.error);

//post movie!
app.post("/movies", (req, res, next) =>
  Movie.create(req.body)
    .then(movie => res.send(movie))
    .catch(error => next(error))
);

//get all movies!
app.get("/movies", (req, res, next) => {
  const limit = req.query.limit || 25;
  const offset = req.query.offset || 0;

  return Movie.findAndCountAll({ limit, offset })
    .then(result => res.send({ movies: result.rows, total: result.count }))
    .catch(error => next(error));
});

// read a single movie resource!
app.get("/movie/:id", (req, res, next) =>
  Movie.findByPk(req.params.id).then(movieid =>
    res.send(movieid).catch(error => next(error))
  )
);

// update a single movie resource
app.put("/movie/:id", (req, res, next) =>
  Movie.findByPk(req.params.id)
    .then(movie => movie.update(req.body))
    .then(movie => res.send(movie))
    .catch(error => next(error))
);

// delete a single movie resource!
app.delete("/movie/:id", (req, res, next) =>
  Movie.destroy({ where: { id: req.params.id } })
    .then(number => res.send({ number }))
    .catch(error => next(error))
);
