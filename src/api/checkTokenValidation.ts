import axios from 'axios';
import { LOCAL_STORAGE_DATA } from 'constants/registration';

const instance = axios.create({
  baseURL: 'https://projectmanagementappbackend.herokuapp.com',
  timeout: 0,
  headers: {},
});

export const checkTokenValidation = async () => {
  if (
    localStorage.getItem(`${LOCAL_STORAGE_DATA}`) === null ||
    localStorage.getItem(`${LOCAL_STORAGE_DATA}`) !== undefined
  ) {
    return;
  } else {
    const token = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DATA}`)).token;
    if (token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      return false;
    }

    const response = await instance.get('/users');

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  }
};
