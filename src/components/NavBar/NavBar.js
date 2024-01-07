import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Menu, MenuItem } from "@material-ui/core";
import { getUserID } from "../../services/userServices";
import { jwtDecode } from "jwt-decode";
import Noti from "../Noti/Noti";
import LanguageSwitcher from "../SwitchLanguage/SwitchLanguage";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const getUser = () => {
  const data = localStorage.getItem("user");
  if (data !== null) {
    const user = JSON.parse(data);
    if (user !== null) {
      return user;
    }
  }
  return null;
};

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = useState(getUser());
  const { t } = useTranslation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get("token");

        if (token === null) {
          token = localStorage.getItem("token");
        }

        if (token !== null) {
          const session = jwtDecode(token);
          const response = await getUserID(session._id, token);
          const userData = response.data.user;
          if (userData.role === 3) {
            toast.error("You do not have permission to access this!!!");
            navigate("/manageusers");
          }
          localStorage.setItem("user", JSON.stringify(userData));
        }

        const data = localStorage.getItem("user");
        if (data !== null) {
          const user = JSON.parse(data);
          if (user !== null) {
            setUser(user);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/500");
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAnchorEl(null);
    navigate("/");
  };

  return (
    <nav className="bg-[#10375C] pt-3 pb-2 font-sans sticky top-0 z-10">
      <div className="container w-full lg:max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between space-x-4 ">
          <div className="flex items-center">
            <Link
              to="/home"
              className="text-white text-lg font-sans font-semibold flex gap-3 items-center mr-5"
            >
              <img
                src={`${process.env.PUBLIC_URL}/assets/icons/class.ico`}
                alt="ZenClass"
                width="50"
                height="60"
              />
              ZenClass
            </Link>
            <LanguageSwitcher />
          </div>

          <div className="flex items-center justify-between space-x-4">
            {user !== null ? (
              <>
                <Noti />
                <span className="text-white cursor-pointer font-sans font-semibold">
                  {user.username}
                </span>
                <Avatar
                  alt="User Avatar"
                  src={`${user.img}`}
                  onClick={handleMenu}
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  className="cursor-pointer"
                />
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
                  <Link to={`/profile/${user._id}`}>
                    <MenuItem>{t("Profile")}</MenuItem>
                  </Link>
                  <MenuItem onClick={handleLogout}>{t("Logout")}</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-white  font-sans font-semibold"
                >
                  {t("Login")}
                </Link>
                <Link
                  to="/signup"
                  className="text-white bg-[#2E80CE] px-4 py-2 rounded-full  font-sans font-semibold"
                >
                  {t("Sign Up")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
