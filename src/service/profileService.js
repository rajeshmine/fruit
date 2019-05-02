import { apiUrl } from "../config.json";
import http from './httpService';

// change password
export function editPassword(data) {
  const apiEndPoint = `${apiUrl}/changePassword`;
  console.log(apiEndPoint, data)
  return http.post(`${apiEndPoint}`, data);
}



 
// view profile
export const getProfileDetails = (params) => {
  const apiEndPoint = `${apiUrl}/particularUser?${params}`;  
  return http.get(apiEndPoint)
}

// edit profile
export function updateProfileDetails(data) {
  const apiEndPoint = `${apiUrl}/userDetails`;
  return http.put(`${apiEndPoint}`, data);
}

// view wishlist
export const getWishList = (params) => {
  const apiEndPoint = `${apiUrl}/wishlist?${params}`;  
  console.log(apiEndPoint)
  return http.get(apiEndPoint)
} 

// delete wishlist

export const removeWishList = (params) => {
  const apiEndPoint = `${apiUrl}/wishlist?${params}`;  
 
  return http.delete(apiEndPoint)
} 

//  Add Cart
export function addtoCart(data) {
  const apiEndPoint = `${apiUrl}/cart`;
  console.log(apiEndPoint, data)
  return http.post(`${apiEndPoint}`, data);
}


//  Add Wishlist
export function addtoWishlist(data) {
  const apiEndPoint = `${apiUrl}/wishlist`;
  console.log(apiEndPoint, data)
  return http.post(`${apiEndPoint}`, data);
}
