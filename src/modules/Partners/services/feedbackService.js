import axios from "axios";

const prodUrl = process.env.REACT_APP_API_PROD_URL;

// No Authorization header needed for this specific public endpoint
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Sends a Pre-Onboarding Request to the new Public API endpoint.
 */
export const sendJoinRequest = (formData) => {
  const payload = {
    // We don't need to specify 'type' here strictly because the backend forces it,
    // but we send the data structure expected by the schema.
    
    title: `Join Request: ${formData.shopName || "Unknown Shop"}`,
    
    userName: `${formData.firstName} ${formData.lastName}`,
    userPhone: formData.phone,
    
    // Store full form data object as string
    content: JSON.stringify(formData), 
    
    // Optional metadata
    userType: "guest_partner",
    userId: `guest_${Date.now()}`, 
  };

  // TARGET THE NEW PUBLIC ENDPOINT
  return axios.post(`${prodUrl}/feedback/join-request`, payload, { headers });
};