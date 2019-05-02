import http from './httpService';
import { apiUrl } from "../config.json";

// Get location
export const getLocation = () => {
  const apiEndPoint = `${apiUrl}/configuration?configName=pincode`;
  return http.get(apiEndPoint)
}




