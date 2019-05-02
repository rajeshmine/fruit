import http from './httpService';
import { apiUrl } from "../config.json";

// Get banners
export const BannerDetails = () => {
  const apiEndPoint = `${apiUrl}/banners`;
  return http.get(apiEndPoint)
}

//  Add banners
export function addBanners(data) {
  const apiEndPoint = `${apiUrl}/banners`;
  console.log(apiEndPoint, data)
  return http.post(`${apiEndPoint}`, data);
}

// edit banners
export function updateBanners(data) {
  const apiEndPoint = `${apiUrl}/banners`;
  console.log(apiEndPoint, data)
  return http.put(`${apiEndPoint}`, data);
}
 

// delete banners
export function deleteBanners(params) {
  const apiEndPoint = `${apiUrl}/banners`;
  return http.delete(`${apiEndPoint}?${params}`);
}



