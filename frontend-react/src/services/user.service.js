import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "https://localhost:3000/";
const getPublicContent = () => {
  // return axios.get(API_URL + "all");
  return axios.get(API_URL);
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
