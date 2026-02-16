// src/modules/Partners/services/orderServices.js
import axios from 'axios';

const prodUrl = process.env.REACT_APP_API_PROD_URL;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Submits a new "Digital - Menu" (guest) order to the API.
 * @param {object} orderData - The complete order payload.
 * @returns {Promise} Axios promise object.
 */
export const createPosOrder = (orderData) => {
  return axios.post(`${prodUrl}/order/pos`, orderData, { headers });
};

/**
 * Submits a new Global E-commerce order to the API.
 * @param {object} orderData - The complete order payload for a global order.
 * @returns {Promise} Axios promise object.
 */
export const createGlobalOrder = (orderData) => {
  // We will post to the '/order/global' endpoint we planned
  return axios.post(`${prodUrl}/order/global`, orderData, { headers });
};

export const trackOrder = async (phone, orderId) => {
  // We assume the backend has this endpoint, or we map to findByOrderId and verify phone client-side
  // For security, a dedicated endpoint is better: GET /order/track/:phone/:orderId
  try {
    const response = await axios.get(`${prodUrl}/order/track/${phone}/${orderId}`, { headers });
    return response.data;
  } catch (error) {
    // If dedicated endpoint doesn't exist yet, fallback to findByOrderId logic (Optional safety net)
    if (error.response?.status === 404) {
       throw new Error("Order not found or phone number does not match.");
    }
    throw error;
  }
};