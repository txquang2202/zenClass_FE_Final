import React, { useEffect, useState } from "react";

import LandingPage from "../Pages/LandingPage/LandingPage";
import SignUpPage from "../components/SignUp/SignUp";
import SignInPage from "../components/SignIn/SignIn";
import HomePage from "../Pages/HomePage/HomePage";
import NotFoundPage from "../Pages/NotFoundPage/NotFoundPage";
import ResponsiveDrawer from "../Pages/ProfilePage/ProfilePage";
import HomeLayout from "../layouts/HomeLayout/HomeLayout";
import DetailLayout from "../layouts/DetailLayout/DetailLayout";
import ClassPage from "../Pages/ClassPage/ClassPage";
import CoursePage from "../Pages/CoursePage/CoursePage";
import DetailPage from "../Pages/DetailPage/DetailPage";
import PeoplePage from "../Pages/PeoplePage/PeoplePage";
import HomeWorkPage from "../Pages/HomeWorkPage/HomeWorkPage";
import ServerErrorPage from "../Pages/ServerErrorPage/ServerErrorPage";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
import GradeStructurePage from "../Pages/GradeStructurePage/GradeStructurePage";
import GradeBoardPage from "../Pages/GradeBoardPage/GradeBoardPage";
import SendMailSuccessPage from "../Pages/SendMailSuccessPage/SendMailSuccessPage";
import ResetPassword from "../components/ResetPassword/ResetPassword";
import UserLayout from "../layouts/UserLayout/UserLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import ManageClass from "../Pages/ManageClass/ManageClass";
import ManageCourse from "../Pages/ManageCourse/ManageCourse";
import NotiPage from "../Pages/NotiPage/NotiPage";
import ManageUser from "../Pages/ManageUser/ManageUser";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import BlockPage from "../Pages/BlockPage/BlockPage";
import NotiLayout from "../layouts/NotiLayout/NotiLayout";
import GradeReviewPage from "../Pages/GradeReviewPage/GradeReviewPage";

import { getUserID } from "../services/userServices";
import { jwtDecode } from "jwt-decode";

const CreateRouter = () => {
  const user = "Normal";

  /*useEffect(() => {
    setUser("Normal");
    
  }, []);*/

  /*useEffect(() => {
    const fetchUserData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
          localStorage.setItem("token", token);
        }

        const data = localStorage.getItem("token");
        const session = jwtDecode(data);

        const response = await getUserID(session._id, data);
        const userData = response.data.user;
        setUser(userData.status);
        console.log(token,"token in creact router");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserData();
  }, []);*/
  const routes = [
    {
      path: "/signin",
      page: SignInPage,
      layout: null,
      isProtected: false,
    },
    {
      path: "/signup",
      page: SignUpPage,
      layout: null,
      isProtected: false,
    },
    {
      path: "/forgot-password",
      page: ForgotPassword,
      layout: null,
      isProtected: false,
    },
    {
      path: "/send-mail-success",
      page: SendMailSuccessPage,
      layout: null,
      isProtected: false,
    },
    {
      path: "/reset-password/:id",
      page: ResetPassword,
      layout: null,
      isProtected: false,
    },
    {
      path: "/profile/reset-password/:id",
      page: ResetPassword,
      layout: UserLayout,
      isProtected: false,
    },

    {
      path: "/home/:id",
      page: user && user === "Blocked" ? BlockPage : HomePage ,
      layout: HomeLayout,
      isProtected: true,
    },
    {
      path: "/home/classes/:id",
      page: user === "Blocked" ? BlockPage : ClassPage,
      layout: HomeLayout,
      isProtected: true,
    },
    {
      path: "/home/courses/:id",
      page: user === "Blocked" ? BlockPage : CoursePage ,
      layout: HomeLayout,
      isProtected: true,
    },
    {
      path: "/home/notifications/:id",
      page: user === "Blocked" ? BlockPage : NotiPage ,
      layout: NotiLayout,
      isProtected: true,
    },
    {
      path: "/home/classes/detail/:id",
      page: user === "Blocked" ? BlockPage : DetailPage ,
      layout: DetailLayout,
      isProtected: true,
    },
    {
      path: "/home/classes/detail/people/:id",
      page: user === "Blocked" ? BlockPage : PeoplePage ,
      layout: DetailLayout,
      isProtected: true,
    },
    {
      path: "/home/classes/detail/grade-structure/:id",
      page: user === "Blocked" ? BlockPage : GradeStructurePage,
      layout: DetailLayout,
      isProtected: true,
    },
    {
      path: "/home/classes/detail/grade-board/:id",
      page: user === "Blocked" ? BlockPage : GradeBoardPage,
      layout: DetailLayout,
      isProtected: true,
    },
    {
      path: "/home/classes/detail/grade-review/:id",
      page: user === "Normal" ? GradeReviewPage : BlockPage,
      layout: DetailLayout,
      isProtected: true,
    },
    {
      path: "/home/classes/detail/:id1/homework/:id2",
      page: user === "Blocked" ? BlockPage : HomeWorkPage ,
      layout: DetailLayout,
      isProtected: true,
    },
    {
      path: "/home/",
      page: user === "Blocked" ? BlockPage : HomePage ,
      layout: HomeLayout,
      isProtected: true,
    },
    {
      path: "/profile/:id",
      page: user === "Blocked" ? BlockPage : ResponsiveDrawer ,
      layout: UserLayout,
      isProtected: true,
    },
    {
      path: "/manageusers",
      page: ManageUser,
      layout: AdminLayout,
      isProtected: true,
      roleRequired: 3,
    },
    {
      path: "/manageclass",
      page: ManageClass,
      layout: AdminLayout,
      isProtected: true,
      roleRequired: 3,
    },
    {
      path: "/managecourse",
      page: ManageCourse,
      layout: AdminLayout,
      isProtected: true,
      roleRequired: 3,
    },
    {
      path: "/",
      page: LandingPage,
      isProtected: false,
    },
    {
      path: "*",
      page: NotFoundPage,
      layout: null,
      isProtected: false,
    },
    {
      path: "500",
      page: ServerErrorPage,
      layout: null,
      isProtected: false,
    },
  ];
  return routes;
};
export default CreateRouter;
