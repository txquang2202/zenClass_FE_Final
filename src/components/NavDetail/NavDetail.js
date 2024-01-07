import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { getClassByID } from "../../services/classServices";
import { jwtDecode } from "jwt-decode";
import { useClassDetailContext } from "../../context/ClassDetailContext";
import { Menu, MenuItem } from "@material-ui/core";
import { useTranslation } from "react-i18next";

function NavDetail(props) {
  const [activeLink, setActiveLink] = useState("general");
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();

  let dataUser;
  if (token) dataUser = jwtDecode(token);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { detailClass } = useClassDetailContext();

  function extractFinalId(input) {
    if (input.includes("/homework")) {
      // Trích xuất ID nếu có phần "/homework" trong input
      var match = input.match(/\/([^\/]+)\/homework/);
      return match ? match[1] : null;
    } else {
      // Trích xuất ID từ cuối đường dẫn nếu không có phần "/homework"
      const parts = input.split("/");
      return parts[parts.length - 1];
    }
  }

  var urlString = window.location.href;
  var id1 = extractFinalId(urlString);

  return (
    <div>
      <nav>
        {/* <div className=" mx-auto flex flex-col md:flex-row justify-between items-center"> */}
        {/* Các liên kết điều hướng */}
        <ul className="flex border-b">
          <li className="-mb-px mr-16 ml-10">
            <Link
              to={`/home/classes/detail/${id1}`}
              className={`${
                activeLink === "general"
                  ? "bg-white inline-block border-l border-t border-r rounded-t py-1 px-4 text-[#2E80CE] font-medium"
                  : "py-1 px-4"
              }`}
              onClick={() => handleLinkClick("general")}
            >
              {t("General")}
            </Link>
          </li>
          <li class="-mb-px mr-16">
            <Link
              to={`/home/classes/detail/people/${id1}`}
              className={` ${
                activeLink === "people"
                  ? "bg-white inline-block border-l border-t border-r rounded-t py-1 px-4 text-[#2E80CE] font-medium "
                  : "py-1 px-4"
              }`}
              onClick={() => handleLinkClick("people")}
            >
              {t("People")}
            </Link>
          </li>

          <li class="-mb-px mr-16">
            <Link
              className={` ${
                activeLink === "grade"
                  ? "bg-white inline-block border-l border-t border-r rounded-t py-1 px-4 text-[#2E80CE] font-medium "
                  : ""
              }`}
              onClick={() => handleLinkClick("grade")}
            >
              <div onClick={handleMenu}>{t("Grade")}</div>
            </Link>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
              }}
              className="mt-12"
            >
              <MenuItem onClick={handleClose}>
                <Link
                  to={`/home/classes/detail/grade-board/${id1}`}
                  className={` ${
                    activeLink === "grade-board" ? "text-[#2E80CE] " : "p-1"
                  }`}
                >
                  {t("Grade Board")}
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link
                  to={`/home/classes/detail/grade-structure/${id1}`}
                  className={` ${
                    activeLink === "grade-structure"
                      ? "text-[#2E80CE] border-b-2 border-[#2E80CE] pb-2"
                      : "p-1"
                  }`}
                >
                  {t("Grade Structure")}
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link
                  to={`/home/classes/detail/grade-review/${id1}`}
                  className={` ${
                    activeLink === "grade-review"
                      ? "text-[#2E80CE] border-b-2 border-[#2E80CE] pb-2"
                      : "p-1"
                  }`}
                >
                  {t("Grade Review")}
                </Link>
              </MenuItem>
            </Menu>
          </li>
          <li class="-mb-px mr-16">
            <Link
              to={`/home/classes/detail/chat/${id1}`}
              className={` ${
                activeLink === "chat"
                  ? "bg-white inline-block border-l border-t border-r rounded-t py-1 px-4 text-[#2E80CE] font-medium "
                  : "py-1 px-4"
              }`}
              onClick={() => handleLinkClick("chat")}
            >
              {t("Chat")}
            </Link>
          </li>
        </ul>
        {/* </div> */}
      </nav>
    </div>
  );
}

export default NavDetail;
