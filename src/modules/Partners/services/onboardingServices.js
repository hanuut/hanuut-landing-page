import axios from "axios";
import { trackEvent } from "../../../utils/analytics";

const API_URL = process.env.REACT_APP_API_PROD_URL;

/**
 * Helper to securely persist tokens for session continuity.
 */
const persistTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

/**
 * STEP 1: Authenticate Shop Owner (Register with Fallback to Login)
 * @param {Object} userData - { firstName, lastName, phone, email, password }
 */
export const authenticateShopOwner = async (userData) => {
  const payload = {
    firstName: userData.firstName,
    familyName: userData.lastName, // Map to Flutter/Backend model 'familyName'
    phoneNumber: userData.phone,
    email: userData.email,         // Email is required for LocalShopOwnerStrategy
    password: userData.password,
  };

  try {
    // Attempt Registration
    const res = await axios.post(`${API_URL}/auth/register/shopOwner`, payload);
    persistTokens(res.data.accessToken, res.data.refreshToken);
    trackEvent("Merchant_Registered", { email: payload.email });
    return res.data;
  } catch (error) {
    // FALLBACK: If user already exists (409 Conflict, 400 Bad Request, or 401)
    const status = error.response?.status;
    if (status === 409 || status === 400 || status === 401) {
      try {
        trackEvent("Merchant_Registration_Fallback_Triggered", { email: payload.email });
        // Attempt Login. Note: LocalShopOwnerStrategy uses 'email' as usernameField.
        const loginRes = await axios.post(`${API_URL}/auth/login/shopOwner`, {
          email: payload.email,
          password: payload.password,
        });
        persistTokens(loginRes.data.accessToken, loginRes.data.refreshToken);
        trackEvent("Merchant_Logged_In", { email: payload.email });
        return loginRes.data;
      } catch (loginError) {
        throw new Error("User exists but invalid password provided. Please check your credentials.");
      }
    }
    throw new Error(error.response?.data?.message || "Failed to authenticate account.");
  }
};

/**
 * STEP 2: Upload Shop Logo
 * @param {File} imageFile - The logo file
 * @param {string} token - The access token
 */
export const uploadShopLogo = async (imageFile, token) => {
  if (!imageFile) return null;
  
  const formData = new FormData();
  formData.append("image", imageFile); // Matches @UseInterceptors(FileInterceptor('image'))

  try {
    const res = await axios.post(`${API_URL}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.id; // Returns imageId
  } catch (error) {
    console.error("Image upload failed, proceeding without logo:", error);
    return null; // Non-blocking failure
  }
};

/**
 * STEP 3: Create Address Entity
 * @param {Object} locationData - { wilaya, commune, district, lat, lng }
 * @param {string} token - The access token
 */
export const createAddress = async (locationData, token) => {
  const payload = {
    wilaya: locationData.wilaya,
    commune: locationData.commune,
    neighborhood: locationData.district, // Mapped from web 'district'
    type: "shop",                        // Strict enum mapping
    latitude: locationData.lat || null,  // Extensible for future GPS coordinates
    longitude: locationData.lng || null, // Extensible for future GPS coordinates
  };

  const res = await axios.post(`${API_URL}/address`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.id; // Returns addressId
};

/**
 * STEP 4: Create the Shop Entity
 * @param {Object} shopData - The compiled shop payload
 * @param {string} token - The access token
 */
export const createShop = async (shopData, token) => {
  const payload = {
    name: shopData.name,
    description: shopData.description,
    domainId: shopData.domainId,         // Relational ID for DB
    domainKeyword: shopData.domainKeyword, // Human-readable keyword (e.g., 'food')
    ownerId: shopData.ownerId,
    addressId: shopData.addressId,
    imageId: shopData.imageId || null,
    isOpen: false,
    isValidated: false,
    canSellOnline: false,
    classes: [],
    categories: [],
    families: [],
  };

  const res = await axios.post(`${API_URL}/shop`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  trackEvent("Shop_Created_Successfully", { 
    shopId: res.data.id, 
    domainId: shopData.domainId,
    keyword: shopData.domainKeyword 
  });
  return res.data;
};