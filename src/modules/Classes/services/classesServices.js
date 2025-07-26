// services/shopService.js
import axios from "axios";

const prodUrl = process.env.REACT_APP_API_PROD_URL;
const token = process.env.REACT_APP_BEARER_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const getshopClass = (id) => {
  return axios.get(`${prodUrl}/productClass/${id}`, { headers });
};
