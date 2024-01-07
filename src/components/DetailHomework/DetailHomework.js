import React, { useState, useEffect } from "react";
import {
  getHomeworkByID,
  editHomeworkByID,
  deleteHomeworkByID,
} from "../../services/homeworkServices";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useClassDetailContext } from "../../context/ClassDetailContext";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import Modal from "../../components/Modal/ClassDetailModal";

function DetailHomework() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const [post, setPost] = useState({});
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  let finalId;
  const parts = location.pathname.split("/");
  finalId = parts[parts.length - 1];

  const { detailClass, isClassOwner, isClassOwner2 } = useClassDetailContext();

  // Get API detailClas
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getHomeworkByID(finalId, token);
        const data = response.data.DetailHomework;
        setPost({
          id: data._id || "",
          title: data.title || "",
          description: data.description || "",
          teacher: data.teacher || "",
          date: format(new Date(data.date), "dd MMMM yyyy") || "",
        });
        setNewPost({
          title: data.title || "",
          description: data.description || "",
        });
      } catch (error) {
        console.error("Error fetching homework:", error);
        navigate("/500");
      }
    };
    fetchUserData();
  }, [finalId, token, navigate]);

  // API edit homework
  const handleEditHomework = async () => {
    try {
      const formSub = {
        title: newPost.title,
        description: newPost.description,
      };
      await editHomeworkByID(finalId, formSub, token);
      toast.success("Class edited successfully:");
      setPost((prevPost) => ({
        ...prevPost,
        title: newPost.title,
        description: newPost.description,
      }));
      closeModal();
    } catch (error) {
      toast.error("Error editing homework:", error);
    }
  };

  const handleNewPostChange = (e) => {
    setNewPost({ ...newPost, [e.target.id]: e.target.value });
  };

  // API delete homework
  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this homework?"
    );
    if (isConfirmed) {
      try {
        await deleteHomeworkByID(finalId, token);

        closeModal();
        toast.success("Class deleted successfully!");
        navigate(`/home/classes/detail/${detailClass.id}`);
      } catch (error) {
        toast.error("Error deleting homework:", error);
      }
    }
  };

  // Modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* POST */}
      <div>
        <section className="flex flex-col">
          <div className="flex justify-between">
            <h2 className="text-4xl text-[#10375c] font-medium">
              {post.title}
            </h2>

            <span className="text-end">
              {(isClassOwner || isClassOwner2) && (
                <DriveFileRenameOutlineIcon
                  className="text-[#10375c] cursor-pointer hover:text-blue-400"
                  onClick={openModal}
                />
              )}
            </span>
          </div>
          <div className="mt-1 mb-2">
            <span className="text-gray-500">{post.teacher}</span>
            <span className="text-gray-400 text-sm"> - {post.date}</span>
          </div>
        </section>
        <hr className="mb-3 mt-3 border-gray-200 border-b-gray-100" />
        <div>
          <pre className="whitespace-pre-wrap break-words overflow-wrap-break-word text-base font-normal ">
            {post.description}
          </pre>
        </div>
      </div>

      {/* Modal edit*/}
      <Modal show={isModalOpen} handleClose={closeModal}>
        <h2 className="text-2xl font-semibold mb-4 text-[#10375c]">
          Edit Homework
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={newPost.title}
              onChange={handleNewPostChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Description:
            </label>
            <textarea
              type="text"
              id="description" // Thay đổi id thành "description"
              placeholder="Write your post here..."
              value={newPost.description}
              onChange={handleNewPostChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none"
            />
          </div>
        </form>
        <button onClick={() => handleDelete()} className="text-red-400">
          Delete homework
        </button>
        <div className="flex justify-end">
          <button
            onClick={handleEditHomework}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Save
          </button>
          <button
            onClick={closeModal}
            className="border border-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}

export default DetailHomework;
