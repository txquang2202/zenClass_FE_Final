import React, { createContext, useState, useContext, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
import { getClassByID, checkInClass } from "../services/classServices";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const ClassDetailContext = createContext();

export const useClassDetailContext = () => useContext(ClassDetailContext);

const checkInClassFunc = async (id, userID, navigate) => {
  try {
    await checkInClass(id, userID);
  } catch (error) {
    toast.error(error.response.data.message);
    navigate("/home", { replace: true });
  }
};

export const ClassDetailProvider = ({ children }) => {
  const { id1 } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [detailClass, setDetailClass] = useState({});
  const location = useLocation();
  let dataUser;
  if (token) dataUser = jwtDecode(token);
  const [isClassOwner, setIsClassOwner] = useState(false);
  const [isClassOwner2, setIsClassOwner2] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let finalId1;
        if (location.pathname.includes("homework")) {
          // Nếu đường dẫn chứa "homework", lấy id1 đầu tiên
          finalId1 = id1;
        } else {
          // Ngược lại, lấy id1 cuối cùng
          const parts = location.pathname.split("/");
          finalId1 = parts[parts.length - 1];
        }
        checkInClassFunc(finalId1, dataUser._id, navigate);

        const response = await getClassByID(finalId1, token);
        const data = response.data.classInfo;

        setDetailClass({
          id: data._id || "",
          title: data.title || "",
          teacher: data.teachers[0].fullname || data.teachers[0].username || "",
          className: data.className || "",
        });
        if (data.teachers[0]._id === dataUser._id) {
          setIsClassOwner(true);
        } else {
          for (const teacherID of data.teachers) {
            if (teacherID._id === dataUser._id) {
              setIsClassOwner2(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        navigate("/500");
      }
    };

    fetchUserData();
  }, [navigate, token, id1, location.pathname]);

  return (
    <ClassDetailContext.Provider
      value={{ detailClass, isClassOwner, isClassOwner2 }}
    >
      {children}
    </ClassDetailContext.Provider>
  );
};
