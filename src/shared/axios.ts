import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_GATEWAY_URL
});
