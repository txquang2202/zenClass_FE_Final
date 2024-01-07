import React, { Children, useState } from "react";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Avatar, Menu, MenuItem } from "@material-ui/core";
import { useNotificationContext } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next";

function Noti(props) {
  const { menuItemsData } = useNotificationContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [click, setClick] = useState();
  const [hideBadge, setHideBadge] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    setAnchorEl(null); // Close the menu when the icon is clicked
    setHideBadge(true); // Hide the badge when the icon is clicked
  };
  const handleNavigate = (link) => {
    const path = link;
    navigate(path);
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="show 17 new notifications"
        color="inherit"
        onClick={handleMenu}
      >
        {!hideBadge ? (
          <Badge badgeContent={menuItemsData.length} color="error">
            <NotificationsIcon className="text-white" onClick={handleClick} />
          </Badge>
        ) : (
          <NotificationsIcon className="text-white" onClick={handleClick} />
        )}
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            maxHeight: "400px", // Set your desired max height here
            overflowY: "auto",
          },
        }}
      >
        <div className="w-[350px]">
          <header className="px-4 sticky top-0 bg-white z-10 pt-3 pb-3">
            <h3 className="text-base font-semibold text-[#10375c] ">
              {t("Notifications")}
            </h3>
          </header>
          <hr className="text-gray-200 h-1" />
          <div className="mt-2 px-2 space-y-4">
            {menuItemsData.length > 0 ? (
              menuItemsData.map((item) => (
                <MenuItem
                  key={item.id}
                  onClick={() => handleNavigate(item.link)}
                >
                  <div className="flex rounded-lg">
                    <Avatar
                      alt={item.fullname}
                      src={item.avt}
                      className="ml-[-10px] mt-2 h-12 w-12"
                    />
                    <div className="ml-3">
                      <span className="font-semibold">{item.fullname} </span>
                      <p
                        className="text-base inline overflow-hidden line-clamp-2"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          whiteSpace: "normal",
                        }}
                      >
                        {item.content}
                      </p>
                      <span className="text-[#10375c] font-bold text-sm block mt-2">
                        {item.date}
                      </span>
                    </div>
                  </div>
                </MenuItem>
              ))
            ) : (
              <div className="text-center text-gray-500 mb-2">
                {t("No notifications")}...
              </div>
            )}
          </div>
          <footer className=" py-2 mt-auto bg-white text-center sticky bottom-0 text-base">
            <Link
              to={`/home/notifications/${id}`}
              className="text-[#10375c] font-medium hover:underline"
              onClick={() => handleClose()}
            >
              {t("See all")}
            </Link>
          </footer>
        </div>
      </Menu>
    </>
  );
}

export default Noti;
