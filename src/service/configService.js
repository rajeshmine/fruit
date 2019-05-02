import http from './httpService';
import { apiUrl } from "../config.json";

export function getConfig() {
  const apiEndPoint = `${apiUrl}/configuration`;
  return http.get(`${apiEndPoint}`);
}

export function putConfig(data) {
  const apiEndPoint = `${apiUrl}/configuration`;
  return http.put(`${apiEndPoint}`, data);
}

export function postConfig(data) {
  const apiEndPoint = `${apiUrl}/configuration`;
  return http.post(`${apiEndPoint}`, data);
}

