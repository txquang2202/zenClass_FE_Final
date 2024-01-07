import axios from "../setup/axios";

const getAllGradeClass = (id, token) => {
  return axios.get(`/api/v1/getAllGradeClass/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const addGradeToClass = async (id, grades, token) => {
  return axios.post(
    `/api/v1/addGradeToClass/${id}`,
    { grades },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const editClassGrade = (id, token, updatedGrade) => {
  return axios.put(`/api/v1/editClassGrade/${id}`, updatedGrade, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteGradeClass = (id, token) => {
  return axios.get(`/api/v1/deleteGradeClass/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteAllGrade = (id, token) => {
  return axios.delete(`/api/v1/deleteAllGrade/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const editStatusGrade = (id, token, gradeOfClass) => {
  return axios.put(`/api/v1/editStatusGrade/${id}`, gradeOfClass, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export {
  getAllGradeClass,
  deleteGradeClass,
  editClassGrade,
  addGradeToClass,
  deleteAllGrade,
  editStatusGrade,
};
