import axios from "../setup/axios";

const getAllUsersReplies = (id, token) => {
  return axios.get(`/api/v1/getAllUsersReplies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const addReply = (id, token, username, content, avt, date) => {
  return axios.post(`/api/v1/addReply/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    username,
    content,
    avt,
    date,
  });
};

const deleteReplyByID = (id, token) => {
  return axios.delete(`/api/v1/deleteReply/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getAllUsersReplies, addReply, deleteReplyByID };
