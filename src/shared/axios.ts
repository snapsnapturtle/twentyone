import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://twentyone-backend.herokuapp.com'
});
