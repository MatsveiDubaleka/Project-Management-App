import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://projectmanagementappbackend.herokuapp.com',
  timeout: 0,
  headers: {},
});

export const checkTokenValidation = async () => {
  const token = JSON.parse(localStorage.getItem('kanKan_currentUser#')).token;
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
};
