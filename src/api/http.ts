import axios  from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8081',
    timeout: 10000,
    headers:{
        'Content-Type' : 'application/json'
    }
});

http.interceptors.response.use(
    response => response,
    error => {
        //Global error handling
        if(error.response?.status === 401){
            // Optional: handle unauthorized
        }
        return Promise.reject(error);
    }
);

export default http;