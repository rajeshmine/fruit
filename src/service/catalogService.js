import http from './httpService';
import { apiUrl } from "../config.json";

//Offers
export const getOfferList = () => {
  const apiEndPoint = `${apiUrl}/specialOffer`;
  return http.get(apiEndPoint);
}

export function addOffers(data) {
  const apiEndPoint = `${apiUrl}/specialOffer`;
  return http.post(`${apiEndPoint}`, data);
}

export function updateOffers(data) {
  const apiEndPoint = `${apiUrl}/specialOffer`;
  return http.put(`${apiEndPoint}`, data);
}

export function deleteOffers(params) {
  const apiEndPoint = `${apiUrl}/specialOffer`;
  return http.delete(`${apiEndPoint}?${params}`);
}

//Category 
export function addCategory(data) {
  const apiEndPoint = `${apiUrl}/categories`;
  return http.post(`${apiEndPoint}`, data);
}

export const getCategories = () => {
  const apiEndPoint = `${apiUrl}/categories`;
  return http.get(apiEndPoint);
}

export const getcategoryByStatus = () => {
  const apiEndPoint = `${apiUrl}/categoryByStatus?categoryStatus=A`;
  return http.get(apiEndPoint);
}


export function updateCategory(data) {
  const apiEndPoint = `${apiUrl}/categories`;
  return http.put(`${apiEndPoint}`, data);
}

export function deleteCategory(params) {
  const apiEndPoint = `${apiUrl}/categories`;
  return http.delete(`${apiEndPoint}?${params}`);
}

//Products
export function addProduct(data) {
  const apiEndPoint = `${apiUrl}/products`;
  return http.post(`${apiEndPoint}`, data);
}

export const getAllProducts = () => {
  const apiEndPoint = `${apiUrl}/products`;
  return http.get(apiEndPoint);
}

export function updateProduct(data) {
  const apiEndPoint = `${apiUrl}/products`;
  return http.put(`${apiEndPoint}`, data);
}

export function deleteProduct(params) {
  const apiEndPoint = `${apiUrl}/products`;
  return http.delete(`${apiEndPoint}?${params}`);
}

export const getUoM = () => {
  const apiEndPoint = `${apiUrl}/configuration?configName=uom`;
  return http.get(apiEndPoint);
}

export const getSubCategory = () => {
  const apiEndPoint = `${apiUrl}/subCategories`;
  return http.get(apiEndPoint);
}

// Search Products


export const searchProduct = (term) => {
  const apiEndPoint = `${apiUrl}/searchItem?searchItem=${term}`;
  return http.post(apiEndPoint);
}