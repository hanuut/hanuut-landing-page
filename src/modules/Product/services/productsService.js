import axios from "axios";

const prodUrl = process.env.REACT_APP_API_PROD_URL;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
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
    return combinedData;
  } catch (error) {
    throw new Error("Failed to fetch category products");
  }
};

export const getAvailableProductsByShopPaginated = async ({ 
  shopId, 
  page = 1, 
  limit = 12, 
  categoryId = '', 
  search = '',
  printOnDemand = false // <--- NEW PARAMETER
}) => {
    try {
        const params = new URLSearchParams({
            page,
            limit,
        });
        
        if (categoryId) params.append('categoryId', categoryId);
        if (search) params.append('search', search);
        if (printOnDemand) params.append('printOnDemand', 'true'); // <--- ENFORCED APPPEND

        const response = await axios.get(
            `${prodUrl}/global-product/findAvailableByShopPaginated/${shopId}?${params.toString()}`,
            { headers }
        );
        return response.data; 
    } catch (error) {
        console.error("Failed to fetch paginated products:", error);
        throw error.response?.data || { message: 'An unknown error occurred.' };
    }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(
      `${prodUrl}/global-product/findById/${productId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch product");
  }
};

export const getFeaturedProductsByShop = async (shopId) => {
  try {
    const response = await axios.get(
      `${prodUrl}/global-product/findFeaturedByShop/${shopId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    throw error.response?.data || { message: 'An unknown error occurred.' };
  }
};

export const getAvailableProductsByShop = async (shopId) => {
    try {
        const response = await axios.get(
            `${prodUrl}/global-product/findAvailableByShop/${shopId}`,
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch available products:", error);
        throw error.response?.data || { message: 'An unknown error occurred.' };
    }
};