import React, { useEffect, useState } from "react";
//import { useParams, useNavigate } from "react-router-dom";
import ClassPage from "../ClassPage/ClassPage";
import CoursePage from "../CoursePage/CoursePage";
// import { getUserID } from "../../services/userServices";
const getToken = () => {
  const urlParams = new URLSearchParams(window.location.search);
  let token1 = urlParams.get("token");
  return token1;
};
function HomePage() {
  // const { id } = useParams();
  const [myClasses, setMyClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);
  return (
    <>
      <div>{myClasses && <ClassPage myClasses={myClasses} />}</div>
      <div className="mt-7 relative">
        {courses && <CoursePage courses={courses} />}
      </div>
    </>
  );
}

export default HomePage;
