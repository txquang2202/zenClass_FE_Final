import axios from "../setup/axios";

const getAllGradeReviews = (id, token) => {
  return axios.get(`/api/v1/getAllGradeReviews/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteReviewByID = (id, approve, token) => {
  return axios.post(
    `/api/v1/deleteReviewByID/${id}`,
    { approve },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const addGradeReviewByID = (
  id,
  token,
  avt,
  fullname,
  userID,
  date,
  typeGrade,
  currentGrade,
  expectationGrade,
  explaination
) => {
  return axios.post(`/api/v1/addGradeReview/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    avt,
    fullname,
    userID,
    date,
    typeGrade,
    currentGrade,
    expectationGrade,
    explaination,
  });
};

export { getAllGradeReviews, deleteReviewByID, addGradeReviewByID };
