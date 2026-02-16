import axios from "axios";

const prodUrl = process.env.REACT_APP_API_PROD_URL;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Calls the unified Delivery Calculator endpoint.
 * @param {object} payload - { shopId, cartTotal, userLat?, userLng?, wilayaCode? }
 */
// FIX: Ensure this is a named export, not a default one.
export const calculateDeliveryFees = async (payload) => {
  try {
    const response = await axios.post(
      `${prodUrl}/delivery/calculate`, 
      payload, 
      { headers }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data; 
    }
    throw new Error("Network error while calculating delivery.");
  }
};