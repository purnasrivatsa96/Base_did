import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "http://localhost:3000/";
const getPublicContent = () => {
  // return axios.get(API_URL + "all");
  const res = axios.get(API_URL);
  console.log(res);
  return res;
};
const getUserBoard = () => {
  // return axios.get(API_URL + "user", { headers: authHeader() });
  return axios.get(API_URL, { headers: authHeader() });
};
const getModeratorBoard = () => {
  // return axios.get(API_URL + "mod", { headers: authHeader() });
  return axios.get(API_URL , { headers: authHeader() });
};
const getAdminBoard = () => {
  // return axios.get(API_URL + "admin", { headers: authHeader() });
  return axios.get(API_URL , { headers: authHeader() });
};
export default {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};
