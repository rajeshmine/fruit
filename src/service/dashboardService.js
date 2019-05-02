import http from './httpService';
import { apiUrl } from "../config.json";

export const getCategoryList = () => {
    const apiEndPoint = `${apiUrl}/listCategories`;
    return http.get(apiEndPoint);
}

export const getCategorybyId = (params) => {    
    const apiEndPoint = `${apiUrl}/listCategories?${params}`;
    return http.get(apiEndPoint);
}

export const getToptenValues = () => {
  const apiEndPoint = `${apiUrl}/topTen`;
  return http.get(apiEndPoint)
}

export const getDeliveryDetails = () => {
  const apiEndPoint = `${apiUrl}/deliverycount`;
  return http.get(apiEndPoint)
}


export const getProductsbyId = (params) => {    
  const apiEndPoint = `${apiUrl}/particularProduct?${params}`;
  return http.get(apiEndPoint);
}

