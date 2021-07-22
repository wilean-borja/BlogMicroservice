const express = require("express");
// const bodyParser = require('body-parser'); deprecated
const { randomBytes } = require("crypto"); // will generate random id for each post
const cors = require("cors");
const axios = require("axios");

const app = express();
// app.use(bodyParser.json()); deprecated
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

// this object will store every post we will create
const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");

  // access title property from the body
  const { title } = req.body;

  // add id to the post object
  posts[id] = {
    id,
    title,
  };

  // emit event to signal that a new post has been created for the event bus
  // properties will be 'type' and data property (object containing 'id' and 'title')
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  // send back a response to let user know that a new post has been created
  res.status(201).send(posts[id]);
});

// endpoint to receive events from the event bus
app.post("/events", (req, res) => {
  console.log("Event Received:", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("Listening on Port 4000");
});
