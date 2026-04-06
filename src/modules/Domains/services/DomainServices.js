import axios from "axios";

const prodUrl = process.env.REACT_APP_API_PROD_URL;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Fetches ALL domains from the API.
 * This is the primary function for loading domain options.
 */
export const getAllDomains = async () => {
  const url = `${prodUrl}/domain`;
  console.log("Fetching all domains from:", url); // Debugging line
  return axios.get(url, { headers });
};

// We keep getDomain for any other part of the app that might need a single domain
export const getDomain = (domainId) => {
  return axios.get(`${prodUrl}/domain/${domainId}`, { headers });
};
