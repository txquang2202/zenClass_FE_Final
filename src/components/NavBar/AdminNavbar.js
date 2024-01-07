import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Menu, MenuItem } from "@material-ui/core";
import { getUserID } from "../../services/userServices";
import { jwtDecode } from "jwt-decode";
import Noti from "../Noti/Noti";
import { toast } from "react-toastify";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = useState(false);
  const [name, setName] = useState("");
  const [avt, setAvt] = useState("");
  const [id, setId] = useState("");
  const Navigate = useNavigate();

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
        const token = urlParams.get("token");

        if (token) {
          localStorage.setItem("token", token);
        }

        const check = localStorage.getItem("token");
        if (!check) {
          setUser(false);
          return;
        }
        const data = localStorage.getItem("token");
        const session = jwtDecode(data);

        setId(session._id);
        const response = await getUserID(session._id, data);
        const userData = response.data.user;
        if (userData.role === 0) {
          toast.error("You do not have permission to access this!!!");
          navigate("/home");
        }
        if (userData) {
          setUser(true);
        }

        if (userData.img) {
          setAvt(userData.img);
        } else {
          setAvt(null);
        }

        if (userData.username) {
          setName(userData.username);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/500");
      }
    };

    fetchUserData();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(false);
    setAnchorEl(null);
    Navigate("/");
  };
  return (
    <nav className="bg-[#10375C] pt-3 pb-2 font-sans sticky top-0 z-10 ">
      <div className="container w-full lg:max-w-[calc(100%-15rem)] mx-auto">
        <div className="flex items-center justify-between">
          <Link
            to={`/manageusers`}
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
          <div className="flex items-center space-x-4 gap-12"></div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white cursor-pointer">{name}</span>
                <Avatar
                  alt="User Avatar"
                  src={`${avt}`}
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
                  <Link to={`/profile/${id}`}>
                    <MenuItem>Profile</MenuItem>
                  </Link>

                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-white">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white bg-[#2E80CE] px-4 py-2 rounded-full"
                >
                  Sign Up
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
