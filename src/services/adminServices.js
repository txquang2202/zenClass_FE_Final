import axios from "../setup/axios";

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
const updateUser = (id, data) => {
  return axios.put(`/api/v1/editprofile/${id}`, data);
};
const getUserID = (userIds) => {
  return axios.post(`/api/v1/getuserbyid`, { userIds });
};
const getAllUsers = () => {
  return axios.get("/api/v1/getallusers");
};
const postComment = (data) => {
  return axios.post(`/api/v1/addComments`, data);
};
const getComments = () => {
  return axios.get("/api/v1/getComments");
};
const resetPassword = (data) => {
  return axios.post("/api/v1/resetPassword", data);
};
const updatePassword = (id, data) => {
  return axios.post(`/api/v1/updatePassword/${id}`, data);
};
const googleAuth = () => {
  return axios.get("/api/v1/auth/google");
};
const deleteUserbyID = (id) => {
  return axios.post(`api/v1/deleteUser/${id}`);
};
const deleteListUserbyID = (listIdDelete) => {
  return axios.post("api/v1/deleteListUser", listIdDelete);
};

const changestatusbyListuser = (userIds) => {
  return axios.post(`api/v1/changeStatusListUser`, userIds);
};

const changeinforwithfile = (datalist) => {
  return axios.post(`api/v1/changeinforuser`, datalist);
};
const Createwithfile = (datalist) => {
  return axios.post(`api/v1/registerwithfile`, datalist);
};
const blockUserbyID = (id) => {
  return axios.post(`api/v1/blockUserbyID/${id}`);
};

export {
  Createwithfile,
  loginUser,
  registerUser,
  updateUser,
  getUserID,
  getAllUsers,
  postComment,
  getComments,
  resetPassword,
  updatePassword,
  googleAuth,
  deleteUserbyID,
  deleteListUserbyID,
  blockUserbyID,
  changestatusbyListuser,
  changeinforwithfile,
};
