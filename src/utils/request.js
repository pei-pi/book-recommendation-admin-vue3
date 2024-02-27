import axios from "axios";
import store from '@/store'
import {getToken} from '@/utils/auth'
import { ElMessage } from 'element-plus';


const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers["X-Token"] = getToken();
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 20000) {
      ElMessage({
        showClose: true,
        message: res.message || "Error",
        type: "error",
      });
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error);
    ElMessage({
      showClose: true,
      message: error.message,
      type: "error",
    });
    return Promise.reject(error)
  }
);

export default service
