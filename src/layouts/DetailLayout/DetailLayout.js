import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import SideBar from "../../components/SideBar/SideBar";
import NavDetail from "../../components/NavDetail/NavDetail";
import { ClassProvider } from "../../context/ClassContext";
import { GradeProvider } from "../../context/GradeContext";
import { CourseProvider } from "../../context/CourseContext";
import { ClassDetailProvider } from "../../context/ClassDetailContext";
import IsBlocked from "../../components/IsBlocked/IsBlocked";
import { getclassinfo } from "../../services/classServices";
import Blockclass from "../../Pages/BlockPage/Blockclass";

function Default({ children }) {
  const [status, setStatus] = useState("");
  const pathName = window.location.pathname;

  const pathParts = pathName.split("/");
  const lastPart = pathParts[pathParts.length - 1];
  const classID = [lastPart];
  const fetchUserData = async () => {
    try {
      
      const response = await getclassinfo(classID);
      const Data = response.data.classinfo;
      setStatus(Data[0].status)
      
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div>
      <NavBar />
      <ClassProvider>
        <ClassDetailProvider>
          <CourseProvider>
            <GradeProvider>
              <div className="mt-10 container w-full lg:max-w-[calc(100%-7rem)] mx-auto max-w-4xl pb-10 flex min-h-96">
                <SideBar />
                <div className="w-11/12 pl-6 flex-1">
                  <NavDetail />
                  <section className="container w-full lg:max-w-[calc(100%-10rem)] mx-auto mt-6">
                  {status === "Inactive" ? (
                      <Blockclass />
                    ) : (
                      <IsBlocked>{children}</IsBlocked>
                    )}
                  </section>
                </div>
              </div>
            </GradeProvider>
          </CourseProvider>
        </ClassDetailProvider>
      </ClassProvider>
      <Footer />
    </div>
  );
}

export default Default;
