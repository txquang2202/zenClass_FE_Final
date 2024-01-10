import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import SendIcon from "@mui/icons-material/Send";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  getAllGradeReviews,
  deleteReviewByID,
} from "../../services/gradeReviewServices";
import {
  getAllUsersReplies,
  addReply,
  deleteReplyByID,
} from "../../services/replyReviewServices";
import {
  addNotification,
  addNotificationTeacher,
} from "../../services/notificationServices";
import { useParams, useNavigate } from "react-router-dom";
import { useClassDetailContext } from "../../context/ClassDetailContext";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";

function GradeReviewPage(props) {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let data;
  if (token) data = jwtDecode(token);

  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState({}); // Use an object instead of an array
  const [loading, setLoading] = useState(false);

  const [newComment, setNewComment] = useState({
    content: "",
    avt: "/path/to/default/avatar.jpg", // replace with actual default avatar path
  });

  const { isClassOwner, isClassOwner2, detailClass } = useClassDetailContext();

  const dataUser = localStorage.getItem("user");
  const user = JSON.parse(dataUser);
  const avtPath = `${user.img}`;
  const myAvtPath = `${user.img}`;
  // API get Review
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getAllGradeReviews(id, token);
        const ReviewData = response.data.gradereviews;
        if (ReviewData) {
          const mappedReview = ReviewData.map((data) => ({
            id: data._id || "",
            // avt: data.avt || "",
            avt: data.avt || "",
            fullname: data.fullname || "",
            userID: data.userID || "",
            date: format(new Date(data.date), "dd MMMM yyyy") || "",
            typeGrade: data.typeGrade || "",
            currentGrade: data.currentGrade || "",
            expectationGrade: data.expectationGrade || "",
            explaination: data.explaination || "",
          }));
          setReviews(mappedReview);
        }
      } catch (error) {
        console.error("Error fetching review:", error);
        toast.error(error.response.message.data);
      }
    };
    fetchUserData();
  }, [navigate, token, id]);

  // delete review
  const handleApproveReview = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to approve this review?"
    );
    if (isConfirmed) {
      try {
        setLoading(true);

        let approve = 1;
        // 1 = approve #1 = reject

        const currentDate = new Date();
        const title = detailClass.title;
        const content = `Your grade review request in class ${title} has been approved!!`;
        const link = "/home/classes/detail/grade-board/" + detailClass.id;
        if (isClassOwner) {
          await addNotification(
            detailClass.id,
            token,
            content,
            avtPath,
            currentDate,
            link,
            data.userID
          );
        }
        await deleteReviewByID(id, approve, token);
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== id)
        );
        toast.success("Complete this review successfully");
      } catch (error) {
        console.error("Error complete review:", error);
        toast.error("Error complete review");
      } finally {
        setLoading(false);
      }
    }
  };
  const handleRejectReview = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to reject this review?"
    );
    if (isConfirmed) {
      try {
        setLoading(true);
        let approve = 0;
        // 1 = approve #1 = reject
        const currentDate = new Date();
        const title = detailClass.title;
        const content = `Your grade review request in class ${title} has been rejected`;
        const link = "/home/classes/detail/grade-board/" + detailClass.id;
        if (isClassOwner) {
          await addNotification(
            detailClass.id,
            token,
            content,
            avtPath,
            currentDate,
            link,
            data.userID
          );
        }
        await deleteReviewByID(id, approve, token);
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== id)
        );
        toast.success("Reject this review successfully");
      } catch (error) {
        console.error("Error complete review:", error);
        toast.error("Error complete review");
      } finally {
        setLoading(false);
      }
    }
  };

  // get comment
  useEffect(() => {
    const fetchCommentsForReview = async (reviewId) => {
      try {
        const response = await getAllUsersReplies(reviewId, token);
        const commentData = response.data.comments;
        if (commentData) {
          const mappedComment = commentData.map((data) => ({
            id: data._id || "",
            username: data.username || "",
            content: data.content || "",
            avt: data.avt || "",
            date: format(new Date(data.date), "dd MMMM yyyy") || "",
          }));
          setComments((prevComments) => ({
            ...prevComments,
            [reviewId]: mappedComment,
          }));

          // Initialize comment input state for the review
          setNewComment((prevNewComment) => ({
            ...prevNewComment,
            [reviewId]: {
              content: "",
              avt: avtPath,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error(error.response.message.data);
      }
    };

    // Fetch comments for each review
    reviews.map((review) => fetchCommentsForReview(review.id));
  }, [navigate, token, id, reviews, user.img]);

  // add comment
  const handleCreateComment = async (e, reviewId) => {
    e.preventDefault();
    try {
      const currentDate = new Date();
      const formattedDate = format(currentDate, "dd MMMM yyyy");
      const title = detailClass.title;
      const content = isClassOwner
        ? `Has add a comment for your grade review in class ${title}`
        : `Has add a comment for a grade review in class ${title}`;
      const link = "/home/classes/detail/grade-review/" + id;
      if (isClassOwner) {
        await addNotification(
          id,
          token,
          content,
          avtPath,
          currentDate,
          link,
          data.userID
        );
      } else {
        await addNotificationTeacher(
          id,
          token,
          content,
          avtPath,
          currentDate,
          link,
          data.userID
        );
      }

      const response = await addReply(
        reviewId,
        token,
        data.fullname,
        newComment[reviewId]?.content,
        avtPath,
        currentDate
      );

      const createdComment = {
        id: response.data.comment._id || "",
        username: data.fullname || "",
        content: response.data.comment.content || "",
        date: formattedDate || "",
        avt: myAvtPath || "",
      };

      setComments((prevComments) => ({
        ...prevComments,
        [reviewId]: [...(prevComments[reviewId] || []), createdComment],
      }));

      setNewComment((prevNewComment) => ({
        ...prevNewComment,
        [reviewId]: {
          content: "",
          avt: myAvtPath,
        },
      }));
      toast.success("Comment created successfully");
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error(error.response.message.data);
    }
  };

  const handleNewCommentChange = (e, reviewId) => {
    const { value } = e.target;
    //console.log(`Review ID: ${reviewId}, Content: ${value}`);

    setNewComment((prevNewComment) => ({
      ...prevNewComment,
      [reviewId]: {
        ...prevNewComment[reviewId],
        content: value,
      },
    }));
  };

  // API delete comment
  const handleDeleteComment = async (reviewId, commentId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (isConfirmed) {
      try {
        await deleteReplyByID(commentId, token);
        setComments((prevComments) => {
          const updatedComments = { ...prevComments };
          updatedComments[reviewId] = updatedComments[reviewId].filter(
            (comment) => comment.id !== commentId
          );
          return updatedComments;
        });
        toast.success("Comment deleted successfully");
      } catch (error) {
        console.error("Error deleting comment:", error);
        toast.error("Error deleting comment");
      }
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <h2 className="mt-10 text-2xl text-[#10375c] font-bold mb-4">
        Grade Review
      </h2>
      {/* SEARCH BAR */}
      <div className="relative mt-2 flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by Full Name or Student ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 pl-10 border border-gray-300 rounded-md w-1/3 text-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
          <SearchIcon />
        </div>
      </div>

      <section className="feature pt-[34px] pb-[16px] ">
        {reviews.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">
            No reviews available
          </div>
        ) : (
          reviews
            .filter(
              (item) =>
                (isClassOwner ||
                  isClassOwner2 ||
                  data.userID === item.userID) &&
                (item.fullname
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                  (item.userID &&
                    item.userID
                      .toString()
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())))
            )
            .map(
              (item, index) =>
                (isClassOwner ||
                  isClassOwner2 ||
                  data.userID === item.userID) && (
                  <div
                    key={index}
                    className="container w-[700px] mx-auto rounded-lg shadow-[0_4px_9px_-4px_#3b71ca] mb-10"
                  >
                    {/* Review */}
                    <div className="flex flex-col justify-start rounded-lg p-6">
                      <div className="flex justify-between">
                        <div className="flex">
                          <Avatar
                            alt={item.fullname}
                            src={item.avt}
                            className="mt-1 h-10 w-10"
                          />
                          <div className="ml-3">
                            <span className="font-semibold">
                              {item.fullname} - {item.userID}
                            </span>
                            <span className="text-[#10375c] font-bold text-sm block">
                              {item.date}
                            </span>
                          </div>
                        </div>
                        {(isClassOwner || isClassOwner2) && (
                          <div>
                            {loading ? (
                              <div className="flex items-center">
                                <div role="status">
                                  <svg
                                    aria-hidden="true"
                                    class="w-6 h-6 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                      fill="currentFill"
                                    />
                                  </svg>
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <CheckCircleOutlineIcon
                                  onClick={() => handleApproveReview(item.id)}
                                  className="text-blue-300 cursor-pointer hover:text-blue-500"
                                />
                                <CancelOutlinedIcon
                                  onClick={() => handleRejectReview(item.id)}
                                  className="text-red-300 cursor-pointer hover:text-red-500"
                                />
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <table className="min-w-full bg-white border border-gray-300">
                          {/* HEADER */}
                          <thead>
                            <tr>
                              <th className="py-2 px-4 border-b">Type grade</th>
                              <th className="py-2 px-4 border-b">
                                Current grade
                              </th>
                              <th className="py-2 px-4 border-b">
                                Expectation grade
                              </th>
                            </tr>
                          </thead>
                          {/* CONTENT */}
                          <tbody>
                            <tr className="text-center">
                              <td className="py-2 px-4 border-b">
                                {item.typeGrade}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {item.currentGrade}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {item.expectationGrade}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-2">
                          <span>Explanation:</span>
                          <p className="whitespace-pre-wrap break-words overflow-wrap-break-word text-base font-normal">
                            {item.explaination}
                          </p>
                        </div>
                      </div>
                    </div>

                    <hr className="text-gray-200 h-1" />

                    {/* Comment */}
                    <div className="flex flex-col space-y-1 pb-5 pl-2 pr-2">
                      <div className="flex rounded-lg p-4">
                        <section className="w-full">
                          <h2 className="text-base text-[#10375c]">Comments</h2>
                          {comments[item.id] &&
                            comments[item.id].map((comment, index) => (
                              <div
                                key={index}
                                className="flex mt-6 justify-between items-center"
                              >
                                <div className="flex">
                                  {/* Console log for debugging */}

                                  <Avatar
                                    alt={comment.username}
                                    src={comment.avt}
                                  />
                                  <div className="ml-3">
                                    <span className="font-semibold">
                                      {comment.username}
                                    </span>
                                    <span className="text-gray-500 text-xs ml-2">
                                      {comment.date}
                                    </span>
                                    <p className="text-base">
                                      {comment.content}
                                    </p>
                                  </div>
                                </div>
                                <span className="">
                                  <RemoveCircleOutlineIcon
                                    onClick={() =>
                                      handleDeleteComment(item.id, comment.id)
                                    }
                                    className="text-gray-300 cursor-pointer hover:text-blue-400"
                                  />
                                </span>
                              </div>
                            ))}

                          <form
                            onSubmit={(e) => handleCreateComment(e, item.id)}
                            className="mt-6 flex justify-between"
                          >
                            <Avatar
                              alt={data.fullname}
                              src={myAvtPath}
                              className="mr-3"
                            />
                            <textarea
                              rows="1"
                              name="content" // Set the name to "content" only
                              value={newComment[item.id]?.content || ""}
                              onChange={(e) =>
                                handleNewCommentChange(e, item.id)
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-full mr-1 focus:outline-none focus:border-gray-500"
                              placeholder="Add a comment..."
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
                      </div>
                    </div>
                  </div>
                )
            )
        )}
      </section>
    </div>
  );
}

export default GradeReviewPage;
