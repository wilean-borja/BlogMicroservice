const express = require('express');
// const bodyParser = require('body-parser'); deprecated
const { randomBytes } = require('crypto'); // will generate random id for each post

const app = express();
// app.use(bodyParser.json()); deprecated
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// this object will store every post we will create
const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex');

    // access title property from the body
    const { title } = req.body;

    // add id to the post object
    posts[id] = {
        id, title
    };

    // send back a response to let user know that a new post has been created
    res.status(201).send(posts[id]);

});

app.listen(4000, () => {
    console.log('Listening on Port 4000');
});