import axios from "axios";
const prodUrl = process.env.REACT_APP_API_PROD_URL;
const token = process.env.REACT_APP_BEARER_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: token,
};

export const postSubscribeRequest = async (data) => {

  try {
    const response = await axios.post(
      prodUrl + "/partnerSubscribeRequest",
      data,
      {
        headers: headers,
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending request:", error);
  }
};

export const checkPhoneNumberAvailability = async (phoneNumber) => {

  try {
    const response = await axios.get(
      prodUrl + `/partnerSubscribeRequest/isPhoneUsed/${phoneNumber}`,
      {
        headers: headers,
      }
    ); 

    return response.data;
  } catch (error) {
    // Handle error if the request fails
    console.error("Error checking phone number availability:", error);
    throw error;
  }
};


export const getSubscribeRequest = async (phoneNumber) => {
  try {
    const response = await axios.get(
      prodUrl + `/partnerSubscribeRequest/findByPhone/${phoneNumber}`,
      {
        headers: headers,
      }
    ); 
    return response.data;
  } catch (error) {
    // Handle error if the request fails
    console.error("Error checking phone number availability:", error);
    throw error;
  }
};
