import axios from "../setup/axios";

const getCourseByUser = (id, token) => {
  return axios.get(`/api/v1/getCourseByUser/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getCourseByUser };
