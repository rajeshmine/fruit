import http from './httpService';
import { apiUrl } from "../config.json";




export function addFeedback(data) {
  const apiEndPoint = `${apiUrl}/feedback`;
  console.log(apiEndPoint, data)
  return http.post(`${apiEndPoint}`, data);
}




