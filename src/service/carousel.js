import http from './httpService';
import { apiUrl } from "../config.json";

// Get location
export const getcarousel = () => {
  const apiEndPoint = `${apiUrl}/banners`;
  return http.get(apiEndPoint)
}




