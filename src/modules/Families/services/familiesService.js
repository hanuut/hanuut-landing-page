// services/shopService.js
import axios from "axios";

const prodUrl = process.env.REACT_APP_API_PROD_URL;
const token = process.env.REACT_APP_BEARER_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: token,
};

export const getFamiliesByClassId = async (classId) => {
  try {
    const response = await axios.get(
      `${prodUrl}/family/findByClass/${classId}`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch families by class");
  }
};

export const getFamily = (id) => {
  return axios.get(`${prodUrl}/family/${id}`, { headers });
};
