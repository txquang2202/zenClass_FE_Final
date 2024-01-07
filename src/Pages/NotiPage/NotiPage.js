import React from "react";
import { Avatar } from "@material-ui/core";
import { useNotificationContext } from "../../context/NotificationContext";
import {
  deleteNotiByID,
  deleteAllNoti,
} from "../../services/notificationServices";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NotiPage(props) {
  const { menuItemsData, setMenuItemsData } = useNotificationContext();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDeleteAllNoti = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all notifications?"
    );
    if (isConfirmed) {
      try {
        let data;
        if (token) {
          data = jwtDecode(token);
        }

        await deleteAllNoti(data.userID, token);

        setMenuItemsData([]);

        toast.success("Notifications deleted successfully");
      } catch (error) {
        console.error("Error deleting notifications:", error);
        toast.error("Error deleting notifications");
      }
    }
  };
  const handleDeleteNoti = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );
    if (isConfirmed) {
      try {
        await deleteNotiByID(id, token);
        setMenuItemsData((prevNotifications) =>
          prevNotifications.filter((noti) => noti.id !== id)
        );
        toast.success("Notification deleted successfully");
      } catch (error) {
        console.error("Error deleting notification:", error);
        toast.error("Error deleting notification");
      }
    }
  };

  const handleNavigate = (link) => {
    const path = link;
    navigate(path);
  };

  return (
    <>
      <section className="feature pt-[34px] pb-[170px]">
        <div className="container lg:max-w-[calc(100%-50rem)] mx-auto rounded-lg p-6 shadow-[0_4px_9px_-4px_#3b71ca]  ">
          <div className="flex justify-start">
            <h2 className="section-heading font-semibold text-3xl leading-[1.2] tracking-tight text-[#10375c]">
              {t("Notifications")}
            </h2>
          </div>
          <hr className="text-gray-200 h-1 mt-6" />
          <div className="flex flex-col mt-[20px] space-y-1">
            {menuItemsData.length > 0 ? (
              menuItemsData.map((item) => (
                <div
                  key={item.id}
                  className="flex rounded-lg justify-between items-center gap-6 p-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleNavigate(item.link)}
                >
                  <div className="flex">
                    <Avatar
                      alt={item.fullname}
                      src={item.avt}
                      className=" mt-1 h-12 w-12"
                    />
                    <div className="ml-3">
                      <span className="font-semibold">{item.fullname} </span>
                      <p
                        className="text-base inline"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {item.content}
                      </p>
                      <span className="text-[#10375c] font-bold text-sm block mt-2">
                        {item.date}
                      </span>
                    </div>
                  </div>
                  <span className="">
                    <RemoveCircleOutlineIcon
                      onClick={() => handleDeleteNoti(item.id)}
                      className="text-gray-300 cursor-pointer hover:text-blue-400"
                    />
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mb-2">
                {t("No notifications")}...
              </div>
            )}
          </div>
          <div className="mt-3">
            <button className="text-red-500 " onClick={handleDeleteAllNoti}>
              {t("Delete all")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotiPage;
