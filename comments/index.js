const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

// comments stored in an object
// 1. look at Id of the post
// 2. will return back an array of all the comments associated with that post
const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {

    // instead of undefined, return empty array instead
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
    // generate random Id, will be converted to a hexadecimal string
    const commentId = randomBytes(4).toString('hex');

    // pull out the content property of the body
    const { content } = req.body;

    // will provide the post id that was provided inside the url
    // will give undefined if we never had a comment created that is associated with this post before, if undefined will return an empty array instead
    const comments = commentsByPostId[req.params.id] || [];

    // will push the created comment into comments array ^
    // will push id: commentId and content that user provided
    comments.push({ id: commentId, content });

    // assign comments array back to the post commentByPostId object
    commentsByPostId[req.params.id] = comments;

    res.status(201).send(comments);
});

app.listen(4001, () => {
    console.log('Listening to Port 4001')
});