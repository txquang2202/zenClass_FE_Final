import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import SendIcon from "@mui/icons-material/Send";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  getAllUsersComments,
  addComment,
  deleteHomeworkByID,
} from "../../services/commentServices";
import { toast } from "react-toastify";

const ListComment = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    content: "",
    avt: "/path/to/default/avatar.jpg", // replace with actual default avatar path
  });

  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  let finalId;
  const parts = location.pathname.split("/");
  finalId = parts[parts.length - 1];

  let data;
  if (token) data = jwtDecode(token);

  const dataUser = localStorage.getItem("user");
  const user = JSON.parse(dataUser);
  const avtPath = `${user.img}`;
  const myAvtPath = `${user.img}`;

  // API getComment
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getAllUsersComments(finalId, token);
        const commentData = response.data.comments;
        if (commentData) {
          const mappedComment = commentData.map((data) => ({
            id: data._id || "",
            username: data.username || "",
            content: data.content || "",
            avt: data.avt || "",
            date: format(new Date(data.date), "dd MMMM yyyy") || "",
          }));
          setComments(mappedComment);
        }
      } catch (error) {
        console.error("Error fetching comment:", error);
        navigate("/500");
      }
    };
    fetchUserData();
  }, [navigate, token, finalId]);

  // API add comment
  const handleCreateComment = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date();
      const formattedDate = format(currentDate, "dd MMMM yyyy");
      const response = await addComment(
        finalId,
        token,
        data.userID,
        newComment.content,
        avtPath, // Use avtPath instead of user.img
        currentDate
      );

      setComments((prevComments) => [
        ...prevComments,
        {
          id: response.data.comment._id || "",
          username: data.fullname || "",
          content: response.data.comment.content || "",
          date: formattedDate || "",
          avt: myAvtPath || "",
        },
      ]);

      setNewComment({
        content: "",
        avt: myAvtPath, // Use avtPath instead of user.img
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      navigate("/500");
    }
  };

  const handleNewCommentChange = (e) => {
    setNewComment({
      ...newComment,
      [e.target.id]: e.target.value,
    });
  };

  // API delete comment
  const handleDeleteComment = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (isConfirmed) {
      try {
        await deleteHomeworkByID(id, token);
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== id)
        );
        toast.success("Comment deleted successfully");
      } catch (error) {
        console.error("Error deleting comment:", error);
        toast.error("Error deleting comment");
      }
    }
  };

  return (
    <>
      <section className="">
        <hr className="mb-3 mt-3 border-gray-200 border-b-gray-100" />
        <h2 className="text-base text-[#10375c]">Comments</h2>

        {comments.map((comment, index) => (
          <div key={index} className="flex mt-6 justify-between items-center">
            <div className="flex">
              <Avatar alt={comment.username} src={comment.avt} />
              <div className="ml-3">
                <span className="font-semibold">{comment.username}</span>
                <span className="text-gray-500 text-xs ml-2">
                  {comment.date}
                </span>
                <p className="text-base">{comment.content}</p>
              </div>
            </div>
            <span className="">
              <RemoveCircleOutlineIcon
                onClick={() => handleDeleteComment(comment.id)}
                className="text-gray-300 cursor-pointer hover:text-blue-400"
              />
            </span>
          </div>
        ))}

        <form onSubmit={handleCreateComment} className="mt-6 flex">
          <Avatar alt={data.fullname} src={myAvtPath} className="mr-3" />
          <textarea
            rows="1"
            id="content" // added an id for targeting in handleNewCommentChange
            className="flex-1 p-2 border border-gray-300 rounded-full mr-1 focus:outline-none focus:border-gray-500"
            placeholder="Add a comment..."
            value={newComment.content}
            onChange={handleNewCommentChange}
            style={{ textIndent: "10px" }}
          />
          <button
            type="submit"
            className="text-[#2E80CE] px-2 py-1 rounded hover:bg-gray-100"
          >
            <SendIcon />
          </button>
        </form>
      </section>
    </>
  );
};

export default ListComment;
