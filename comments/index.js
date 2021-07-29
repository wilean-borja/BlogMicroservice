const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

// comments stored in an object
// 1. look at Id of the post
// 2. will return back an array of all the comments associated with that post
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  // instead of undefined, return empty array instead
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  // generate random Id, will be converted to a hexadecimal string
  const commentId = randomBytes(4).toString("hex");

  // pull out the content property of the body
  const { content } = req.body;

  // will provide the post id that was provided inside the url
  // will give undefined if we never had a comment created that is associated with this post before, if undefined will return an empty array instead
  const comments = commentsByPostId[req.params.id] || [];

  // will push the created comment into comments array ^
  // will push id: commentId and content that user provided
  // added status property when moderation service was implemented
  comments.push({ id: commentId, content, status: "Pending" });

  // assign comments array back to the post commentByPostId object
  commentsByPostId[req.params.id] = comments;

  // emit event to event bus
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "Pending",
    },
  });

  res.status(201).send(comments);
});

// endpoint to receive events from the event bus
app.post("/events", async (req, res) => {
  console.log("Event Received:", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    // pull out the comment we already have inside the CommentByPostId so we need to find the appropriate comment stored inside of here and update its status property
    const { id, postId, status, content } = data;

    const comments = commentsByPostId[postId];

    // find the comment you want to update
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    // update status
    comment.status = status;

    /* CommentUpdated schema:
        id: string,
        content: string,
        postId: string,
        status: 'Approved' | 'Rejected'
     */

    // emit the event to the event bus
    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("Listening to Port 4001");
});
