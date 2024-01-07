import axios from "../setup/axios";

const getAllNotifications = (id, token) => {
  return axios.get(`/api/v1/getAllNotifications/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const addNotification = (id, token, content, avt, date, link, userID) => {
  return axios.post(`/api/v1/addNotification/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    content,
    avt,
    date,
    link,
    userID,
  });
};
const addNotificationTeacher = (
  id,
  token,
  content,
  avt,
  date,
  link,
  userID
) => {
  return axios.post(`/api/v1/addNotificationTeacher/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    content,
    avt,
    date,
    link,
    userID,
  });
};

const deleteNotiByID = (id, token) => {
  return axios.delete(`/api/v1/deleteNotiByID/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const deleteAllNoti = (id, token) => {
  return axios.delete(`/api/v1/deleteAllNoti/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export {
  getAllNotifications,
  addNotification,
  deleteNotiByID,
  deleteAllNoti,
  addNotificationTeacher,
};
