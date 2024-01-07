import axios from "../setup/axios";

const getAllHomework = (id, token) => {
  return axios.get(`/api/v1/getAllHomework/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getHomeworkByID = (id, token) => {
  return axios.get(`/api/v1/getHomeworkByID/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createHomeworkByID = (id, token, title, userID, description, date) => {
  return axios.post(`/api/v1/createHomework/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    title,
    userID,
    description,
    date,
  });
};

const editHomeworkByID = (id, updatedHomework, token) => {
  return axios.put(`/api/v1/editHomework/${id}`, updatedHomework, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteHomeworkByID = (id, token) => {
  return axios.delete(`/api/v1/deleteHomework/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export {
  getAllHomework,
  createHomeworkByID,
  editHomeworkByID,
  deleteHomeworkByID,
  getHomeworkByID,
};
