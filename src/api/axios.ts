import axios from 'axios';
import { API_URL } from 'constants/registration';

export const instance = axios.create({
  baseURL: API_URL,
  timeout: 1500,
  headers: {},
});
