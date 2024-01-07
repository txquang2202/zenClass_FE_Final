import axios from "../setup/axios";

//unprotect
const loginUser = (username, password) => {
  return axios.post("/api/v1/login", {
    username: username,
    password: password,
  });
};
const registerUser = (username, email, password) => {
  return axios.post("/api/v1/register", {
    username,
    email,
    password,
  });
};
const getComments = () => {
  return axios.get("/api/v1/getComments");
};
const resetPassword = (data) => {
  return axios.post("/api/v1/resetPassword", data);
};
const updatePassword = (id, data, token) => {
  return axios.post(`/api/v1/updatePassword/${id}`, data);
};
//protected
const updateUser = (id, data, token) => {
  return axios.put(`/api/v1/editprofile/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const getUserID = (id, token) => {
  return axios.get(`/api/v1/getprofile/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const getAllUsers = (token) => {
  return axios.get("/api/v1/getallusers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const postComment = (data) => {
  return axios.post(`/api/v1/addComments`, data);
};

export {
  loginUser,
  registerUser,
  updateUser,
  getUserID,
  getAllUsers,
  postComment,
  getComments,
  resetPassword,
  updatePassword,
};
