import http from './httpService';
import { apiUrl } from "../config.json";

// Get specialoffers
export const getspecialOffer = () => {
  const apiEndPoint = `${apiUrl}/specialOffer`;
  return http.get(apiEndPoint)
}




