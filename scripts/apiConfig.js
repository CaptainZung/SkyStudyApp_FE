import { Platform } from 'react-native';

const LOCAL_API_URL = 'http://127.0.0.1:8000/app/Login/';
const NETWORK_API_URL = 'http://192.168.1.148:8000/app/Login/';



export const API_URL = Platform.OS === 'ios' || Platform.OS === 'android' 
    ? NETWORK_API_URL 
    : LOCAL_API_URL;
