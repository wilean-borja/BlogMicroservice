import React from "react";

const CommentList = ({ comments }) => {
  // no longer needed since data is fetch via the query service
  /* const [comments, setComments] = useState([]);

  // fetchData is called only one time when the component is first displayed on the screen
  useEffect(() => {
    const fetchData = async () => {
      // comments microservice is hosted at port 4001
      const res = await axios.get(
        `http://localhost:4001/posts/${postId}/comments`
      );

      setComments(res.data);
    };
    fetchData();
  }); */

  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
