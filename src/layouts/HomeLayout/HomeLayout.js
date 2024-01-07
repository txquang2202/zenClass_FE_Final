import React from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import SideBar from "../../components/SideBar/SideBar";
import { ClassProvider } from "../../context/ClassContext";
import { CourseProvider } from "../../context/CourseContext";
// import { ClassDetailProvider } from "../../context/ClassDetailContext";
import IsBlocked from "../../components/IsBlocked/IsBlocked";

function Default({ children }) {
  return (
    <div>
      <NavBar />
      <ClassProvider>
        <CourseProvider>
          <div className="mt-10 container w-full lg:max-w-[calc(100%-7rem)] mx-auto max-w-4xl pb-10 flex min-h-96">
            <SideBar />
            <div className="w-11/12 pl-6 flex-1">
              <IsBlocked>{children}</IsBlocked>
            </div>
          </div>
        </CourseProvider>
      </ClassProvider>
      <Footer />
    </div>
  );
}

export default Default;
