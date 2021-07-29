const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
  CommentModerated schema:
    id: string
    content: string,
    postId: string,
    status: Approved' | 'Rejected'

    Note: emitted when the moderation service moderates a comment
*/

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("dumb") ? "Rejected" : "Approved";

    await axios.post("http://localhost:4005/events", {
      // these properties are emitted from the comment service 'CommentCreated'
      // tips: always keep track of these properties in a documentation
      type: "CommentModerated",
      postId: data.postId,
      status,
      content: data.content,
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Listening to Port 4003");
});
