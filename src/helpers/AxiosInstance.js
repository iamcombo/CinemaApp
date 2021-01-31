import axios from 'axios';
import env from '../config/env';

let headers={};

const axiosInstance = axios.create({
  baseURL: env.REACT_APP_API,
  headers
});

axiosInstance.interceptors.request.use((config) => {
  const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZTJiOGZjZTg5ODliMzlmY2U2NGEwZmQ4NTlmNTNkOCIsInN1YiI6IjVlOTk2MjJkZDE0NDQzMDAxOTUyNzFjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Xzho6lktWFTUo9di-EzmjkvwgVvMTco_QeqvLqbHupI';
  if(token) {
    config.headers.Authorization = token
  }
  return config;
}, (error) => {
  return Promise.reject(error);
})

export default axiosInstance;