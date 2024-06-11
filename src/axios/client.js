import axios from "axios";
import getToken from "../utils/getToken";
const JSS_BASE_URL = import.meta.env.VITE_JSS_API_URL;

const axiosClient = axios.create({
  baseURL: JSS_BASE_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken(); // Get the latest token
    if (token) {
      // console.log("token: "+  token)
      config.headers["Authorization"] = `Bearer ${token}`; // Attach the token to the request if it exists
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    // console.log(response)
    return response;
  },
  (error) => {
    // Handle HTTP 401 (Unauthorized) error
    if (error.response && error.response.status === 401) {

      localStorage.clear()
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
