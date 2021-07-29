const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

const posts = {};

/* posts will be an object having some keys and for every key we are gonna have the id of the post identical to the id,
title of the post, and array of comments associated with this,
comment will have and id and content,
/ example: 

"y123k67": {
    id: "y123k67"
    title: "post title",
    comments: [
        { id: "g123y78", content: "comment" }
    ]
}

*/

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  // every event we create has a type and data property, pull that out from req.body
  const { type, data } = req.body;

  if (type === "PostCreated") {
    // take id and title out of data, since PostCreated is always going to have those 2 properties
    const { id, title } = data;

    // insert that information into our post object; default comments to array so we dont have to worry about its creation later
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    // take id, content and postId out of data
    // status property was added when moderation service was created
    const { id, content, postId, status } = data;

    // find the appropriate post inside the post object
    const post = posts[postId];

    // push new comment with a given id and some content
    post.comments.push({ id, content, status });
  }

  console.log(posts);

  res.send({});
});

app.listen(4002, () => {
  console.log("Listening to Port 4002");
});
