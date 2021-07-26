import React, { useState } from "react";
import axios from "axios";

const PostCreate = () => {
  const [title, setTitle] = useState("");

  const onSubmit = async (event) => {
    // prevent browser to submit the form itself, default behaviour
    event.preventDefault();

    // request to post service which runs on port 4000
    await axios.post("http://localhost:4000/posts", {
      // we designed the body of the post to have a title property
      title,
    });

    // reset title back to empty string after onSubmit
    setTitle("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-success">Submit</button>
      </form>
    </div>
  );
};

export default PostCreate;
