import React, { createContext, useState, useContext, useEffect } from "react";
import { getAllClasses } from "../services/classServices";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// import { changeLanguage } from "i18next";

const ClassContext = createContext();

export const useClassContext = () => useContext(ClassContext);

export const ClassProvider = ({ children }) => {
  const navigate = useNavigate();
  // const token = localStorage.getItem("token");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let data;
        let token;
        token = localStorage.getItem("token");
        if (token) data = jwtDecode(token);
        else {
          navigate("/signin", { replace: true });
          return;
        }
        //console.log(data);
        const response = await getAllClasses(data._id, token);
        const classesData = response.data.classInfo;
        if (classesData) {
          const mappedClasses = classesData.map((data) => ({
            id: data._id || "",
            title: data.title || "",
            teacher:
              data.teachers[0].fullname || data.teachers[0].username || "",
            className: data.className || "",
            status: data.status || "",
          }));
          setClasses(mappedClasses);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        navigate("/500");
      }
    };

    fetchUserData();
  }, []);

  const addClass = (newClass) => {
    setClasses((prevClasses) => [...prevClasses, newClass]);
  };

  return (
    <ClassContext.Provider value={{ classes, loading, addClass }}>
      {children}
    </ClassContext.Provider>
  );
};
