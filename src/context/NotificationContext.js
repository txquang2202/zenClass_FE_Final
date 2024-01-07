import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllNotifications } from "../services/notificationServices";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";

const NotificationContext = createContext();

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [menuItemsData, setMenuItemsData] = useState([
    // {
    //   id: 1,
    //   name: "Duy",
    //   avatarSrc: "/static/images/avatar/1.jpg",
    //   content: "Reprehenderit quia neque error Ipsa laudantium molestias",
    //   timestamp: "1 month ago",
    // },
    // {
    //   id: 2,
    //   name: "Duy",
    //   avatarSrc: "/static/images/avatar/1.jpg",
    //   content: "Reprehenderit quia neque error Ipsa laudantium molestias",
    //   timestamp: "1 month ago",
    // },
    // {
    //   id: 3,
    //   name: "Nhan",
    //   avatarSrc: "/static/images/avatar/1.jpg",
    //   content: "Reprehenderit quia neque error Ipsa laudantium molestias",
    //   timestamp: "1 month ago",
    // },
    // {
    //   id: 4,
    //   name: "Quang",
    //   avatarSrc: "/static/images/avatar/1.jpg",
    //   content: "Reprehenderit quia neque error Ipsa laudantium molestias",
    //   timestamp: "1 month ago",
    // },
    // {
    //   id: 5,
    //   name: "Y",
    //   avatarSrc: "/static/images/avatar/1.jpg",
    //   content: "Reprehenderit quia neque error Ipsa laudantium molestias",
    //   timestamp: "1 month ago",
    // },
    // {
    //   id: 6,
    //   name: "Duyyyyyyyyy",
    //   avatarSrc: "/static/images/avatar/1.jpg",
    //   content: "Reprehenderit quia neque error Ipsa laudantium molestias",
    //   timestamp: "1 month ago",
    // },
  ]);
  // API getNotification
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let data;
        let token;
        token = localStorage.getItem("token");
        if (token) data = jwtDecode(token);
        //console.log(data._id);
        const response = await getAllNotifications(data._id, token);
        const notiData = response.data.notifications;
        if (notiData) {
          const mappedNoti = notiData.map((data) => ({
            id: data._id || "",
            fullname: data.fullname || "",
            content: data.content || "",
            avt: data.avt + "",
            date: format(new Date(data.date), "dd MMMM yyyy") || "",
            link: data.link || "",
          }));
          setMenuItemsData(mappedNoti);
        }
      } catch (error) {
        console.error("Error fetching comment:", error);
        // navigate("/500");
      }
    };
    fetchUserData();
  }, []);

  const updateMenuItemsData = (newData) => {
    setMenuItemsData(newData);
  };

  return (
    <NotificationContext.Provider
      value={{ menuItemsData, updateMenuItemsData, setMenuItemsData }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
