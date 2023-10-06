import axios from "axios";
import react from "react";


const Client = axios.create ({

    baseURL: process.env.VITE_API_URL,
    
    })

    export const setAuthorizationHeader = token =>

    (Client.defaults.headers.common ['Authorization'] = 'Bearer ${token}');

    export const removeAuthorizationHeader = () => {

        delete Client.defaults.headers.common ['Authorization'];
        
    };

    Client.interceptors.response.use (response => response.data);

    export default Client