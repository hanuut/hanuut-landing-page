// services/shopService.js
import axios from "axios";

const prodUrl = process.env.REACT_APP_API_PROD_URL;
const token = process.env.REACT_APP_BEARER_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: token,
};
export const getDishesByShopAndCategory = async (shopId, categoryId) => {
  try {
    const response = await axios.get(
      `${prodUrl}/dish/findByShopAndCategory/${shopId}/${categoryId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch category dishes");
  }
};
