import axios from "axios";

const prodUrl = process.env.REACT_APP_API_PROD_URL;
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Fetches a single Ad (GlobalProduct) by its ID.
 * Corresponds to NestJS: @Get('ads/:id') in MarketController
 */
export const getAdById = (adId) => {
  return axios.get(`${prodUrl}/market/ads/${adId}`, { headers });
};