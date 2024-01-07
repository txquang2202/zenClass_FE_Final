import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_BA_BASE_URL,
});
instance.defaults.withCredentials = true;
// // Alter defaults after instance has been created
// instance.defaults.headers.common["Authorization"] = AUTH_TOKEN;
const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);

    // Kiểm tra hết hạn token
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return token;
  }
  return null;
};

instance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        console.log("Token is invalid or expired. Redirecting to login page.");
        window.location.href = "/signin";
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Tạo một hàm xử lý lỗi để sử dụng cho cả yêu cầu và phản hồi
const handleRequestError = (error) => {
  // Xử lý lỗi ở đây, có thể log lỗi hoặc thực hiện các hành động khác cần thiết
  console.error("Request error:", error);
  return Promise.reject(error);
};

const handleResponseError = (error) => {
  if (error.response.status === 600) {
    window.location.href =
      process.env.REACT_APP_BASE_URL +
      "/signin?message=Token expired please login again !!!";
  } else if (error.response.status === 405) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href =
      process.env.REACT_APP_BASE_URL +
      "/signin?message=Your account has been changed or deleted !!!";
  }
  //  console.error("Response error:", error);
  return Promise.reject(error);
};

// Interceptor cho yêu cầu
// instance.interceptors.request.use(function (config) {
//   // Ví dụ: Thêm token vào header
//   // config.headers.Authorization = `Bearer ${yourAccessToken}`;
//   // return config;
// }, handleRequestError);

// Interceptor cho phản hồi
instance.interceptors.response.use(function (response) {
  // Thực hiện các thao tác với dữ liệu phản hồi, nếu cần thiết
  // Ví dụ: Log dữ liệu phản hồi
  return response;
}, handleResponseError);

export default instance;
