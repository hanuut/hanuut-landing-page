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