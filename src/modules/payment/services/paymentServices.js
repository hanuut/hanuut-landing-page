import axios from "axios";

const prodUrl = process.env.REACT_APP_API_PROD_URL;
const token = process.env.REACT_APP_BEARER_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: token,
};

export const registerOrder = (data) => {
  console.log(data)
  return axios.get(
    `${prodUrl}/payment/registerOrder/${data.orderId}/${data.amount}`,
    { headers }
  );
};

export const confirmOrder = (orderId) => {
  return axios.get(`${prodUrl}/payment/confirmOrder/${orderId}`, { headers });
};
