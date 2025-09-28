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
 * Fetches a single blog post by its URL-friendly slug.
 * This will be used for the detailed blog post page.
 * @param {string} slug - The unique slug of the blog post.
 * @returns {Promise<Object>} A promise that resolves to a single blog post object.
 */
export const fetchBlogPostBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Slug is required to fetch a blog post.");
  }

  // --- THIS IS THE NEW DEBUGGING LOGIC ---
  const requestUrl = `${prodUrl}/feedback/slug/${slug}`;
  console.log(`Attempting to fetch post from URL: ${requestUrl}`);

  try {
    const response = await axios.get(requestUrl, { headers });

    // Log the successful response to see the data structure
    console.log("Successfully fetched post data:", response.data);

    return response.data;
  } catch (error) {
    // Log the entire error object to see the status code and details
    console.error(`Error fetching blog post with slug "${slug}":`, error);

    throw (
      error.response?.data || {
        message: `An unknown error occurred while fetching the post.`,
      }
    );
  }
};
