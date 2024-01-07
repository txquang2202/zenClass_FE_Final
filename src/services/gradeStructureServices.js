import axios from "../setup/axios";

const getAllGradeStructs = (id, token) => {
  return axios.get(`/api/v1/getAllGradeStructs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const addGradeStruct = (id, token, topic, ratio) => {
  return axios.post(`/api/v1/addGradeStruct/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    topic,
    ratio,
  });
};

const deleteGradeStruct = (id, token) => {
  return axios.delete(`/api/v1/deleteGradeStruct/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const editGradeStruct = (id, token, updatedStruct) => {
  return axios.put(`/api/v1/editGradeStruct/${id}`, updatedStruct, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export {
  getAllGradeStructs,
  addGradeStruct,
  deleteGradeStruct,
  editGradeStruct,
};
