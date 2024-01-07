import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getClassByID,
  deleteClassbyID,
  editClass,
} from "../../services/classServices";
import { jwtDecode } from "jwt-decode";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import Modal from "../../components/Modal/ClassDetailModal";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function HeroMedia() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [detailClass, setDetailClass] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    teacher: "",
    className: "",
  });

  let dataUser;
  if (token) dataUser = jwtDecode(token);
  const [isClassOwner, setIsClassOwner] = useState(false);
  const { t } = useTranslation();

  // Modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // APIgetClass
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getClassByID(id, token);
        const data = response.data.classInfo;
        setDetailClass({
          id: data._id || "",
          title: data.title || "",
          teacher: data.teachers[0].fullname || data.teachers[0].username || "",
          className: data.className || "",
        });

        if (data.teachers[0]._id === dataUser._id) {
          setIsClassOwner(true);
        }

        setFormData({
          title: data.title || "",
          teacher: dataUser.username,
          className: data.className || "",
        });
      } catch (error) {
        console.error("Error fetching classes:", error);
        navigate("/500");
      }
    };

    fetchUserData();
  }, [navigate, token, id]);

  // API deleteClass
  const handleDeleteClass = async (classId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this class?"
    );
    if (isConfirmed) {
      try {
        await deleteClassbyID(classId, token);

        closeModal();
        toast.success("Class deleted successfully!");
        navigate("/home");
      } catch (error) {
        toast.error("Error deleting class:", error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // API editClass
  const handleEditClass = async () => {
    try {
      const formSub = {
        title: formData.title,
        className: formData.className,
      };
      await editClass(id, formSub, token);
      // Handle success, e.g., show a success message
      toast.success("Class edited successfully:");

      setDetailClass((prevDetailClass) => ({
        ...prevDetailClass,
        title: formData.title,
        className: formData.className,
      }));

      closeModal(); // Close the modal after editing
    } catch (error) {
      toast.error("Error editing class:", error);
    }
  };

  return (
    <>
      <section className="">
        <div
          className="h-60 w-full rounded-lg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          }}
        >
          <div className="flex flex-col p-4">
            <span className="text-end mb-20 ">
              {isClassOwner ? (
                <DriveFileRenameOutlineIcon
                  className="text-white cursor-pointer hover:text-blue-400"
                  onClick={openModal}
                />
              ) : (
                <div className="p-3"></div>
              )}
            </span>
            <h1 className="text-6xl text-white mb-2">{detailClass.title}</h1>
            <div className="flex justify-between">
              <span className="text-2xl text-white">
                {detailClass.className}
              </span>
              <span className="text-2xl text-white">{detailClass.teacher}</span>
            </div>
          </div>
        </div>
      </section>
      {/* Modal Edit */}
      <Modal show={isModalOpen} handleClose={closeModal}>
        <h2 className="text-2xl font-semibold mb-4">{t("Edit Class")}</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              {t("Title")}:
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600">
              {t("Class Name")}:
            </label>
            <input
              type="text"
              id="className"
              value={formData.className}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </form>

        <button onClick={() => handleDeleteClass(id)} className="text-red-400">
          {t("Delete class")}
        </button>

        <div className="flex justify-end">
          <button
            onClick={handleEditClass}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            {t("Save")}
          </button>
          <button
            onClick={closeModal}
            className="border border-gray-300 px-4 py-2 rounded-md"
          >
            {t("Cancel")}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default HeroMedia;
