import React, { useEffect } from 'react';

const OAuthCallback = ({ location }) => {
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      // Store the authorization token in local storage
      localStorage.setItem('token', token);
    }

    console.log('Successful login');
  }, [location]);

  return <div>Loading...</div>;
};

export default OAuthCallback;
