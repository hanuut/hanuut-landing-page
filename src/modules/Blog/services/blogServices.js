import axios from "axios";

// Using the production URL from environment variables for consistency.
const prodUrl = process.env.REACT_APP_API_PROD_URL;

// Replicating the header structure from your existing services.
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Fetches all documents marked as 'BLOG_POST'.
 * This will be used for the main blog listing page.
 * @returns {Promise<Object[]>} A promise that resolves to an array of blog posts.
 */
export const fetchAllBlogPosts = async () => {
  try {
    // Calling the specific endpoint for blog posts.
    const response = await axios.get(`${prodUrl}/feedback/posts/blog`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all blog posts:", error);
    // Propagate a consistent error shape for the Redux thunk to handle.
    throw (
      error.response?.data || {
        message: "An unknown error occurred while fetching blog posts.",
      }
    );
  }
};

/**
 * Fetches all blog posts for a specific language.
 * This is the new primary function for the blog list page.
 * @param {string} language - The language code (e.g., 'en', 'ar', 'fr').
 * @returns {Promise<Object[]>} A promise that resolves to an array of blog posts.
 */
export const fetchAllBlogPostsByLanguage = async (language) => {
  if (!language) {
    throw new Error('Language is required to fetch blog posts.');
  }
  try {
    // --- THIS IS THE FIX: Using your new endpoint ---
    const response = await axios.get(`${prodUrl}/feedback/posts/blogByLanguage/${language}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog posts for language "${language}":`, error);
    throw error.response?.data || { message: 'An unknown error occurred while fetching blog posts.' };
  }
};

/**
 * Fetches all blog posts for a specific source type and language.
 * @param {string} sourceType - The source type to filter by.
 * @param {string} language - The language code.
 * @returns {Promise<Object[]>} A promise that resolves to an array of blog posts.
 */
export const fetchBlogPostsBySourceAndLanguage = async (sourceType, language) => {
    if (!sourceType || !language) {
        throw new Error('Source type and language are required.');
    }
    try {
        const response = await axios.get(`${prodUrl}/feedback/posts/blog/${sourceType}/${language}`, { headers });
        return response.data;
    } catch (error) {
        console.error(`Error fetching posts for source "${sourceType}" and language "${language}":`, error);
        throw error.response?.data || { message: 'An unknown error occurred while fetching posts.' };
    }
};

/**
 * Fetches a single blog post by its URL-friendly slug.
 * This will be used for the detailed blog post page.
 * @param {string} slug - The unique slug of the blog post.
 * @returns {Promise<Object>} A promise that resolves to a single blog post object.
 */
export const fetchBlogPostBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Slug is required to fetch a blog post.");
  }

  const requestUrl = `${prodUrl}/feedback/slug/${slug}`;

  try {
    const response = await axios.get(requestUrl, { headers });

    return response.data;
  } catch (error) {
    console.error(`Error fetching blog post with slug "${slug}":`, error);

    throw (
      error.response?.data || {
        message: `An unknown error occurred while fetching the post.`,
      }
    );
  }
};
