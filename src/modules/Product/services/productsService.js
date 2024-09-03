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
    console.log(shopId, categoryId);

    // Fetch data from both endpoints concurrently
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

    // Combine the results from both responses into an array
    const combinedData = [
      ...productShopResponse.data,
      ...globalProductResponse.data,
    ];

    return combinedData;
  } catch (error) {
    throw new Error("Failed to fetch category products");
  }
};
