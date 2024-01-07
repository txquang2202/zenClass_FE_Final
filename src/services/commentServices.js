import axios from "../setup/axios";

const getAllUsersComments = (id, token) => {
  return axios.get(`/api/v1/getComments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const addComment = (id, token, userID, content, avt, date) => {
  return axios.post(`/api/v1/addComments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    userID,
    content,
    avt,
    date,
  });
};

const deleteHomeworkByID = (id, token) => {
  return axios.delete(`/api/v1/deleteComment/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getAllUsersComments, addComment, deleteHomeworkByID };
