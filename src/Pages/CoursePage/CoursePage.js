// CoursePage.js
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { getCourseByUser } from "../../services/courseServices";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { useCourseContext } from "../../context/CourseContext";
function CoursePage() {
  const { id } = useParams();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let data;
  if (token) data = jwtDecode(token);
  const { courses, loading } = useCourseContext();
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await getCourseByUser(data._id, token);
  //       const courseData = response.data.courseInfo;
  //       if (courseData) {
  //         const mappedcourse = courseData.map((data) => ({
  //           id: data._id || "",
  //           title: data.title || "",
  //           author: data.teachers[0].fullname || "",
  //           class: data.className || "",
  //         }));
  //         setCourses(mappedcourse);
  //       }
  //     } catch (error) {
  //       toast.error(error.response.data.message);
  //       navigate("/500");
  //     }
  //   };

  //   fetchUserData();
  // }, [navigate, token]);

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-[#10375c]">
          {t("My Courses")}
        </h1>
        {loading ? (
          <p>{t("Loading")}...</p>
        ) : (
          <>
            {courses.length === 0 ? (
              <p className="text-gray-400 mb-10">{t("No course available")}</p>
            ) : (
              <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 2, sm: 3, md: 4 }}
              >
                {courses.map((course, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <section className="work-item bg-white border-[10px] border-[#EAF6FF] rounded-md  hover:translate-y-[-10px] hover:border-blue-300 cursor-pointer shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] ">
                      <Link to={`/home/classes/detail/${course.id}`}>
                        <div className="p-5">
                          <h2 className="font-semibold text-2xl leading-[1.38] text-[#10375c]  mb-3">
                            {course.title}
                          </h2>
                          <hr className="border-t border-gray-200 dark:border-[#575F66] mb-3" />
                          <p className="text-[#575F66] font-sora text-base font-light leading-[28px]">
                            {t("Teacher")}:
                            <span className="text-[#2E80CE]">
                              {" "}
                              {course.author}
                            </span>
                          </p>
                          <p className="text-[#575F66] font-sora text-base font-light leading-[28px]">
                            {t("Class")}:
                            <span className="text-[#2E80CE]">
                              {" "}
                              {course.class}
                            </span>
                          </p>
                        </div>
                      </Link>
                    </section>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default CoursePage;
