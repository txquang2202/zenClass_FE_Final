import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useParams } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const { id } = useParams();
  const [activeLink, setActiveLink] = useState("profile");
  const token = localStorage.getItem("token");
  const userData = jwtDecode(token);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const Navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Navigate("/");
  };

  return (
    <div className="bg-[#10375C] w-[200px] h-screen min-h-full">
      <ul className="py-4 font-bold">
        <li>
          {userData.role === 0 ? (
            <Link
              to={`/home`}
              className="block py-6 px-8 text-white text-lg"
              style={{
                color: activeLink === "main" ? "#2E80CE" : "white",
              }}
              onClick={() => handleLinkClick("main")}
            >
              <span className="mr-3">
                <HomeIcon className="text-white" />
              </span>
              Home
            </Link>
          ) : (
            <Link
              to={`/manageusers`}
              className="block py-6 px-8 text-white text-lg"
              style={{
                color: activeLink === "main" ? "#2E80CE" : "white",
              }}
              onClick={() => handleLinkClick("main")}
            >
              <span className="mr-3">
                <HomeIcon className="text-white" />
              </span>
              Home
            </Link>
          )}
        </li>
        <li>
          <Link
            to={`/profile/${id}`}
            className="block py-6 px-8 text-white text-lg"
            style={{
              color: activeLink === "profile" ? "#2E80CE" : "white",
            }}
            onClick={() => handleLinkClick("profile")}
          >
            <span className="mr-3">
              <AccountCircleIcon
                className="text-white"
                style={{
                  color: activeLink === "profile" ? "#2E80CE" : "white",
                }}
              />
            </span>
            Profile
          </Link>
        </li>

        <li>
          <Link
            to={`/profile/reset-password/${id}`}
            className="block py-6 px-8 text-white text-lg"
            style={{
              color: activeLink === "courses" ? "#2E80CE" : "white",
            }}
            onClick={() => handleLinkClick("courses")}
          >
            <span className="mr-3">
              <LockResetIcon
                className="text-white"
                style={{
                  color: activeLink === "courses" ? "#2E80CE" : "white",
                }}
              />
            </span>
            Password
          </Link>
        </li>

        <li>
          <span
            // to={`/home/courses/${id}`}
            className="block py-6 px-8 cursor-pointer text-white text-lg"
            style={{
              color:
                activeLink !== "main" &&
                activeLink !== "profile" &&
                activeLink !== "courses"
                  ? "#2E80CE"
                  : "white",
            }}
            onClick={handleLogout}
          >
            <span className="mr-3">
              <ExitToAppIcon className="text-white" />
            </span>
            Logout
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
