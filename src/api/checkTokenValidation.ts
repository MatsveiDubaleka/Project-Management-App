import { Endpoint } from './../constants/endpoints';
import { API_URL, LOCAL_STORAGE_DATA } from 'constants/registration';
import axios from 'axios';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 500,
  headers: {},
});

export const checkTokenValidation = async () => {
  try {
    const LOCAL_STORAGE = localStorage.getItem(LOCAL_STORAGE_DATA);

    if (LOCAL_STORAGE === null || LOCAL_STORAGE === '' || LOCAL_STORAGE === undefined) {
      return false;
    }
    const token = JSON.parse(LOCAL_STORAGE).token;
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await instance.get(Endpoint.USERS);
    if (response.status === 200) {
      return true;
    }
  } catch (e) {
    return false;
  }
};
