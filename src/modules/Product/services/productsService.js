// services/shopService.js
import axios from "axios";

const prodUrl = process.env.REACT_APP_API_PROD_URL;
const token = process.env.REACT_APP_BEARER_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: token,
};

export const getProductByShopAndCategory = async (shopId, categoryId) => {
  try {
    const [productShopResponse, globalProductResponse] = await Promise.all([
      axios.get(
        `${prodUrl}/product-shop/findAvailableByShopAndCategory/${shopId}/${categoryId}`,
        { headers }
      ),
      axios.get(
        `${prodUrl}/global-product/findAvailableByShopAndCategory/${shopId}/${categoryId}`,
        { headers }
      ),
    ]);

    const combinedData = [
      ...productShopResponse.data,
      ...globalProductResponse.data,
    ];
    console.log(combinedData);
    return combinedData;
  } catch (error) {
    throw new Error("Failed to fetch category products");
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(
      `${prodUrl}/global-product/findById/${productId}`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch product");
  }
};
