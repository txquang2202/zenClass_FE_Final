import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PersonIcon from "@mui/icons-material/Person";

function SideBar() {
  const { id } = useParams();
  const [activeLink, setActiveLink] = useState("main");

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="w-1/5 md:w-1/6 lg:w-1/12 p-4 rounded-lg border border-solid border-gray-200 pb-96">
      <ul className="space-y-8 text-center ">
        <li>
          <Link
            to={`/manageusers`}
            className={`flex flex-col items-center text-gray-700  text-xs ${
              activeLink === "main" ? "text-blue-300" : ""
            }`}
            onClick={() => handleLinkClick("manageusers")}
          >
            <span className="w-8 h-8">
              <PersonIcon className="w-full h-full" />
            </span>
            <span className="mt-1">Users</span>
          </Link>
        </li>
        <li>
          <Link
            to={`/manageclass`}
            className={`flex flex-col items-center text-gray-700  text-xs ${
              activeLink === "classes" ? "text-blue-300" : ""
            }`}
            onClick={() => handleLinkClick("classes")}
          >
            <span className="w-8 h-8">
              <SchoolIcon className="w-full h-full" />
            </span>
            <span className="mt-1">Classes</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
