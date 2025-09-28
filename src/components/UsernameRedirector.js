import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UsernameRedirector = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the username parameter exists and starts with '@'
    if (username && username.startsWith('@')) {
      // Extract the actual username (without the '@')
      const actualUsername = username.substring(1);
      // Redirect to the canonical /shop/username route
      navigate(`/shop/${actualUsername}`, { replace: true });
    } else {
      // If it's not a valid @username, redirect to the 404 page
      navigate('/404', { replace: true });
    }
  }, [username, navigate]);

  // This component renders nothing, it only performs a redirect.
  return null;
};

export default UsernameRedirector;