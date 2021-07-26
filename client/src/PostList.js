import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = () => {
  // object because we want to represent what the final state is going to be
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    // response from calling await
    // anytime we make a request to axios we get back a response object
    // port 4002 is where query service is running
    const res = await axios.get("http://localhost:4002/posts");

    // actual data is nested in the 'data' property of the response object
    // we are gonna use this to update post setPosts state
    setPosts(res.data);
  };

  // useEffect can be used to run some code at very specific point in time in the lifecycle of a component
  // we will run fetchPosts only when our component is first displayed on the screen
  // the second argument, the array, tell react to only run this one time
  useEffect(() => {
    fetchPosts();
  }, []);

  // array of actual posts objects
  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};

export default PostList;
