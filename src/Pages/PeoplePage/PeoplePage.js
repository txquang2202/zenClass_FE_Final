import React, { useEffect, useState, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Modal from "../../components/Modal/ClassDetailModal";
import { useParams, useNavigate } from "react-router-dom";
import { getClassMembers } from "../../services/classServices";
import ClipboardJS from "clipboard";
import { getAllUsers } from "../../services/userServices";
import { jwtDecode } from "jwt-decode";
import {
  inviteLink,
  deleteStudentFromClass,
  deleteTeacherFromClass,
} from "../../services/classServices";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function PeoplePage() {
  const token = localStorage.getItem("token");
  const { t } = useTranslation();

  const { id } = useParams();
  const Navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [invTeacher, setInvTeacher] = useState([
    {
      avatarSrc: "",
      name: "duy",
      mail: "phu@gmail.com",
    },
    {
      avatarSrc: "",
      name: "an",
      mail: "an@gmail.com",
    },
  ]);
  const [filteredTeachers, setFilteredTeachers] = useState(invTeacher);
  const textRef = useRef(null);
  let data;
  if (token) data = jwtDecode(token);
  const [isClassOwner, setIsClassOwner] = useState(false);
  const [isClassOwner2, setIsClassOwner2] = useState(false);

  useEffect(() => {
    const fetchingList = async () => {
      const respone = await getAllUsers();
      const users = respone.data.users;
      const mappedUser = users.map((users) => ({
        avatarSrc: users.img || "",
        name: users.fullname || "",
        mail: users.email || "",
      }));
      setInvTeacher(mappedUser);
    };
    fetchingList();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams) {
      const msg = urlParams.get("err");
      const verified = urlParams.get("okay");

      if (msg) toast.error(msg);
      if (verified) toast.success(verified);
    }
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await getClassMembers(id, token);

        const teacherData = response.data.teachers.map((teacher) => ({
          id: teacher._id,
          avatarSrc: teacher.img || "",
          name: teacher.fullname,
        }));

        // if (teacherData[0].id === data._id) {
        //   setIsClassOwner(true);
        // }

        if (teacherData[0].id === data._id) {
          setIsClassOwner(true);
        } else {
          for (const teacherID of teacherData) {
            if (teacherID.id === data._id) {
              console.log("cc");
              setIsClassOwner2(true);
            }
          }
        }

        setTeachers(teacherData);

        const studentData = response.data.students.map((student) => ({
          id: student._id,
          avatarSrc: student.img || "",
          name: student.fullname,
        }));
        setStudents(studentData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Navigate("/500");
      }
    };

    fetchStudentData();
  }, [id, token, Navigate]);
  // Modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal1 = () => {
    setIsModalOpen1(true);
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  const handleListItemClick = (item) => {
    setSearchText(`${item.mail}`);
  };

  const handleDeleteStudent = async (personID) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (isConfirmed) {
      try {
        const response = await deleteStudentFromClass(id, personID, token);
        toast.success(response.data.message);
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.id !== personID)
        );
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleDeleteTeacher = async (personID) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this teacher?"
    );
    if (isConfirmed) {
      try {
        const response = await deleteTeacherFromClass(id, personID, token);
        toast.success(response.data.message);
        setTeachers((prevTeachers) =>
          prevTeachers.filter((teacher) => teacher.id !== personID)
        );
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  // SEARCH
  useEffect(() => {
    const filteredTeachers = invTeacher.filter((teacher) => {
      const searchString = searchText.toLowerCase();
      return (
        teacher.name.toLowerCase().includes(searchString) ||
        teacher.mail.toLowerCase().includes(searchString)
      );
    });
    setFilteredTeachers(filteredTeachers);
  }, [invTeacher, searchText]);

  const handleCopyClick = () => {
    const clipboard = new ClipboardJS(".copy-button", {
      text: () => textRef.current.innerText,
    });

    clipboard.on("success", () => {
      clipboard.destroy();
      window.alert("Text copied to clipboard!");
    });

    clipboard.on("error", (e) => {
      clipboard.destroy();
    });
  };
  const handleInviteStudentClick = async () => {
    try {
      const check = 0;
      await inviteLink(id, check, searchText, token);
      toast.success("Invitation sent!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleInviteTeacherClick = async () => {
    try {
      const check = 1;
      await inviteLink(id, check, searchText, token);
      toast.success("Invitation sent!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <section className="container w-full lg:max-w-[calc(100%-20rem)] mx-auto mt-6">
        {/* TEACHER */}
        <section>
          <div className="flex justify-between items-center">
            <h2 className="text-4xl text-[#10375c]">{t("Teacher")}</h2>
            {(isClassOwner || isClassOwner2) && (
              <span className="">
                <PersonAddAltIcon
                  className=" cursor-pointer hover:text-blue-400"
                  onClick={openModal}
                />
              </span>
            )}
          </div>
          <hr className="mb-3 mt-3 border-indigo-200 border-b-[#10375c]" />
          <>
            {teachers.map((item, index) => (
              <section
                key={index}
                className="p-3 flex justify-between items-center gap-4 hover:bg-gray-100 transition-all duration-300 cursor-pointer border-b"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <Avatar alt={item.name} src={item.avatarSrc} />
                  </div>
                  <div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                </div>
                {isClassOwner && index !== 0 && (
                  <span className="">
                    <RemoveCircleOutlineIcon
                      onClick={() => handleDeleteTeacher(item.id)}
                      className="text-gray-300 cursor-pointer hover:text-blue-400"
                    />
                  </span>
                )}
              </section>
            ))}
          </>
        </section>

        {/* STUDENT */}
        <section className="mt-12">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl text-[#10375c]">{t("Students")}</h2>
            {(isClassOwner || isClassOwner2) && (
              <span className="">
                <PersonAddAltIcon
                  className="cursor-pointer hover:text-blue-400"
                  onClick={openModal1}
                />
              </span>
            )}
          </div>
          <hr className="mb-3 mt-3 border-indigo-200 border-b-[#10375c]" />
          <>
            {students.map((item, index) => (
              <section
                key={index}
                className="p-3 flex justify-between items-center gap-4 hover:bg-gray-100 transition-all duration-300 cursor-pointer border-b"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <Avatar alt={item.name} src={item.avatarSrc} />
                  </div>
                  <div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                </div>
                {(isClassOwner || isClassOwner2) && (
                  <span className="">
                    <RemoveCircleOutlineIcon
                      className="text-gray-300 cursor-pointer hover:text-blue-400"
                      onClick={() => handleDeleteStudent(item.id)}
                    />
                  </span>
                )}
              </section>
            ))}
          </>
        </section>
      </section>

      {/* Modal Teacher*/}
      <Modal show={isModalOpen} handleClose={closeModal}>
        <h2 className="text-2xl font-semibold mb-4 text-[#10375c]">
          Invite a teacher
        </h2>
        {/* INVITE LINK */}
        <div className="p-2">
          <label className="block text-sm font-medium text-gray-900">
            Invite Link:
          </label>
          <div className="flex justify-between items-center">
            <p
              ref={textRef}
              className="mt-3 text-gray-400 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[200px]"
            >
              {process.env.REACT_APP_BA_BASE_URL +
                `/api/v1/addTeacherToClass/${id}`}
            </p>
            <button
              onClick={handleCopyClick}
              className="ml-auto text-blue-400 cursor-pointer copy-button"
            >
              Copy
            </button>
          </div>
        </div>
        {/* SEARCH INPUT */}
        <div className="">
          <input
            type="text"
            id="search"
            placeholder="Enter name or email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mt-1 p-2 border-none border-gray-300 rounded-md w-full focus:outline-none"
          />
        </div>
        {/* CONTENT */}
        <div className="mb-4 border-y-2  border-gray-200 max-h-60 overflow-y-auto scroll-smooth h-48">
          <ul className="p-2">
            {filteredTeachers.map((item) => (
              <li
                className="py-2 hover:bg-gray-50 cursor-pointer"
                key={item.name}
                onClick={() => handleListItemClick(item)}
              >
                <div className="flex ">
                  <Avatar alt={item.name} src={item.avatarSrc} />
                  <div className="ml-3">
                    <span className="font-semibold text-base">{item.name}</span>
                    <p className="text-sm text-gray-500">{item.mail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ACTION BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleInviteTeacherClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Invite
          </button>
          <button
            onClick={closeModal}
            className="border border-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Modal Student */}
      <Modal show={isModalOpen1} handleClose={closeModal1}>
        <h2 className="text-2xl font-semibold mb-4 text-[#10375c] ">
          Invite a student
        </h2>
        {/* INVITE LINK */}
        <div className="p-2">
          <label className="block text-sm font-medium text-gray-900">
            Invite Link:
          </label>
          <div className="flex justify-between items-center">
            <p
              ref={textRef}
              className="mt-3 text-gray-400 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[200px]"
            >
              {process.env.REACT_APP_BA_BASE_URL +
                `/api/v1/addStudentsToClass/${id}`}
            </p>
            <button
              onClick={handleCopyClick}
              className="ml-auto text-blue-400 cursor-pointer copy-button"
            >
              Copy
            </button>
          </div>
        </div>
        {/* SEARCH INPUT */}
        <div className="">
          <input
            type="text"
            id="search"
            placeholder="Enter name or email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mt-1 p-2 border-none border-gray-300 rounded-md w-full focus:outline-none"
          />
        </div>
        {/* CONTENT */}
        <div className="mb-4 border-y-2  border-gray-200 max-h-60 overflow-y-auto scroll-smooth h-48">
          <ul className="p-2">
            {filteredTeachers.map((item) => (
              <li
                className="py-2 hover:bg-gray-50 cursor-pointer"
                key={item.name}
                onClick={() => handleListItemClick(item)}
              >
                <div className="flex ">
                  <Avatar alt={item.name} src={item.avatarSrc} />
                  <div className="ml-3">
                    <span className="font-semibold text-base">{item.name}</span>
                    <p className="text-sm text-gray-500">{item.mail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ACTION BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleInviteStudentClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Invite
          </button>
          <button
            onClick={closeModal1}
            className="border border-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}

export default PeoplePage;
