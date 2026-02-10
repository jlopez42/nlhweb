import axios from 'axios';

const authInterceptor = (token: string) => {
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Handle token expiration or unauthorized access
        console.error('Token expired or unauthorized access', error);
      }
      return Promise.reject(error);
    }
  );
};

export default authInterceptor;