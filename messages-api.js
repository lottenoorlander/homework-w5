const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bodyParserMiddleWare = bodyParser.json();
const port = 3000;

app.use(bodyParserMiddleWare);
app.listen(port);

let limit = 0;
const limitRate = (req, res, next) => {
  if (limit < 5) {
    limit++;
    return next();
  } else {
    res.status(429).send();
  }
};

app.post("/messages", limitRate, (req, res, next) => {
  const message = req.body.text;
  if (!message) {
    res.status(400).send();
  } else {
    console.log(message);
    res.send({
      message: "Message received loud and clear"
    });
  }
});
