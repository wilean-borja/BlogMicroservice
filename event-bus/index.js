const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.post("/events", (req, res) => {
  events = req.body;

  axios.post("http://localhost:4000/events", events);
  axios.post("http://localhost:4001/events", events);
  axios.post("http://localhost:4002/events", events);

  res.send({ status: "OK " });
});

app.listen(4005, () => {
  console.log("Listening on Port 4005");
});
