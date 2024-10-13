import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

const axiosSecure = axios.create({
  baseURL: 'https://learning-info-bd.vercel.app',
});

const useAxiosSecure = () => {
  const { logOut, loading, jwtToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axiosSecure.interceptors.request.use((config) => {      
      if (jwtToken) {
        config.headers.Authorization = `Bearer ${jwtToken}`;
      }
      return config;
    }, [loading, jwtToken]);

    axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          await logOut();
          localStorage.removeItem('access-token');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );
  }, [loading, jwtToken]);

  return [axiosSecure];
};

export default useAxiosSecure;
