import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://projectmanagementappbackend.herokuapp.com',
  timeout: 0,
  headers: {},
});

export const checkTokenValidation = async () => {
  try {
    const LOCAL_STORAGE = localStorage.getItem('kanKan_currentUser#');

    if (LOCAL_STORAGE === null || LOCAL_STORAGE === '' || LOCAL_STORAGE === undefined) {
      return false;
    }

    const token = JSON.parse(LOCAL_STORAGE).token;
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const response = await instance.get('/users');

    if (response.status === 200) {
      return true;
    }
  } catch (e) {
    return false;
  }
};
