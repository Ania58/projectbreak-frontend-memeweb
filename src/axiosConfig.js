import axios from "axios";

//axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
axios.defaults.headers.common["Cache-Control"] = "no-cache"; 
axios.defaults.headers.common["Pragma"] = "no-cache";

const token = localStorage.getItem("authToken");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axios;
