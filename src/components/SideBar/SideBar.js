import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Modal from "react-modal";
import { useClassContext } from "../../context/ClassContext";
import { useCourseContext } from "../../context/CourseContext";
import { createClass, joinByCode } from "../../services/classServices";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Menu, MenuItem } from "@material-ui/core";
import { useTranslation } from "react-i18next";

function SideBar() {
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeLink, setActiveLink] = useState("main");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newClassInfo, setNewClassInfo] = useState({
    title: "",
    teacher: "",
    className: "",
  });
  const token = localStorage.getItem("token");
  const [joinModalIsOpen, setJoinModalIsOpen] = useState(false);
  const [joinClassCode, setJoinClassCode] = useState("");
  let data;
  if (token) data = jwtDecode(token);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const { addClass } = useClassContext();
  const { addCourse } = useCourseContext();
  const { t } = useTranslation();

  const openModal = () => {
    handleClose();
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleCreateClass = async () => {
    try {
      const response = await createClass(
        newClassInfo.title,
        data.userID,
        newClassInfo.className,
        token
      );
      addClass(response.data.class);
      closeModal();
      toast.success("Add successfully!");
      setNewClassInfo({ title: "", teacher: "", className: "" });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openJoinModal = () => {
    handleClose();
    setJoinModalIsOpen(true);
  };

  const closeJoinModal = () => {
    setJoinModalIsOpen(false);
    setJoinClassCode("");
  };

  const handleJoinClass = async () => {
    try {
      const response = await joinByCode(joinClassCode, data._id, token);
      //  console.log(response.data.toReturn);
      addCourse(response.data.toReturn);

      closeJoinModal();
      toast.success("Joined the class successfully!");
      setJoinClassCode("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="w-1/5 md:w-1/6 lg:w-1/12 p-4 rounded-lg border border-solid border-gray-200 pb-72 ">
      <ul className="space-y-8 text-center">
        <li>
          <button
            onClick={handleMenu}
            className="btn bg-[#2E80CE] text-white  px-3 py-1 lg:px-4 lg:py-1 rounded-full text-2xl cursor-pointer hover:bg-blue-400 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          >
            +
          </button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
            }}
            className="mt-12"
          >
            <MenuItem onClick={openModal}>{t("Create Class")}</MenuItem>
            <MenuItem onClick={openJoinModal}>{t("Join Class")}</MenuItem>
          </Menu>
        </li>
        <li>
          <Link
            to={`/home`}
            className={`flex flex-col items-center text-gray-600  text-xs font-semibold font-sans`}
            style={{
              color: activeLink === "main" ? "#2E80CE" : "",
            }}
            onClick={() => handleLinkClick("main")}
          >
            <span className="w-8 h-8 ">
              <HomeIcon className="w-full h-full " />
            </span>
            <span className="mt-1">{t("Main Page")}</span>
          </Link>
        </li>
        <li>
          <Link
            to={`/home/classes/a`}
            className={`flex flex-col items-center text-gray-600  text-xs font-semibold font-sans`}
            style={{
              color: activeLink === "classes" ? "#2E80CE" : "",
            }}
            onClick={() => handleLinkClick("classes")}
          >
            <span className="w-8 h-8">
              <SchoolIcon className="w-full h-full" />
            </span>
            <span className="mt-1">{t("Classes")}</span>
          </Link>
        </li>
        <li>
          <Link
            to={`/home/courses/b`}
            className={`flex flex-col items-center text-gray-600  text-xs font-semibold font-sans`}
            style={{
              color: activeLink === "courses" ? "#2E80CE" : "",
            }}
            onClick={() => handleLinkClick("courses")}
          >
            <span className="w-8 h-8">
              <AutoStoriesIcon className="w-full h-full" />
            </span>
            <span className="mt-1">{t("Courses")}</span>
          </Link>
        </li>
      </ul>

      {/* Modal Create Class*/}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create Class Modal"
        className="h-36 w-[400px] absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
      >
        <div className="bg-white p-8 rounded-md border-solid border-2 border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">
            {t("Create New Class")}
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              {t("Title")}:
            </label>
            <input
              type="text"
              value={newClassInfo.title}
              onChange={(e) =>
                setNewClassInfo({ ...newClassInfo, title: e.target.value })
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600">
              {t("Class Name")}:
            </label>
            <input
              type="text"
              value={newClassInfo.className}
              onChange={(e) =>
                setNewClassInfo({
                  ...newClassInfo,
                  className: e.target.value,
                })
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleCreateClass}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              {t("Create Class")}
            </button>
            <button
              onClick={closeModal}
              className="border border-gray-300 px-4 py-2 rounded-md"
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      </Modal>
      {/* End Modal */}

      {/* Join Class Modal */}
      <Modal
        isOpen={joinModalIsOpen}
        onRequestClose={closeJoinModal}
        contentLabel="Join Class Modal"
        className="h-36 w-[400px] absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
      >
        <div className="bg-white p-8 rounded-md border-solid border-2 border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">{t("Join a Class")}</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              {t("Class Code")}:
            </label>
            <input
              type="text"
              value={joinClassCode}
              onChange={(e) => setJoinClassCode(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleJoinClass}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              {t("Join Class")}
            </button>
            <button
              onClick={closeJoinModal}
              className="border border-gray-300 px-4 py-2 rounded-md"
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      </Modal>
      {/* End Join Class Modal */}
    </div>
  );
}

export default SideBar;
