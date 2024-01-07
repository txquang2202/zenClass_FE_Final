import React, { createContext, useState, useContext, useEffect } from "react";
import { getCourseByUser } from "../services/courseServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const CourseContext = createContext();

export const useCourseContext = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const navigate = useNavigate();
  // const token = localStorage.getItem("token");
  // let data;
  // if (token) data = jwtDecode(token);
  const [courses, setCourses] = useState([]);
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
        const response = await getCourseByUser(data._id, token);
        const courseData = response.data.courseInfo;
        if (courseData) {
          const mappedcourse = courseData.map((data) => ({
            id: data._id || "",
            title: data.title || "",
            author: data.teachers[0].fullname || "",
            class: data.className || "",
          }));
          setCourses(mappedcourse);
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.response.data.message);
        navigate("/500");
      }
    };

    fetchUserData();
  }, []);

  const addCourse = (newCourse) => {
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  return (
    <CourseContext.Provider value={{ courses, loading, addCourse }}>
      {children}
    </CourseContext.Provider>
  );
};
