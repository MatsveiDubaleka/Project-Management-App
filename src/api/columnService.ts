import { Endpoint } from './../constants/endpoints';
import { LOCAL_STORAGE_DATA } from 'constants/registration';
import { instance } from './axios';

export const createColumn = async (boardId: string, data: { title: string; order: number }) => {
  const token = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA)).token;
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    return false;
  }

  const response = await instance.post(`${Endpoint.BOARDS}/${boardId}${Endpoint.COLUMNS}`, data);

  if (response.status === 200) {
    return response;
  } else {
    return false;
  }
};

export const getColumns = async (boardId: string, token: string) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    return false;
  }

  const response = await instance.get(`${Endpoint.BOARDS}/${boardId}${Endpoint.COLUMNS}`);

  if (response.status === 200) {
    return response.data;
  } else {
    return false;
  }
};

export const deleteColumn = async (boardId: string, columnId: string) => {
  const token = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA)).token;
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    return false;
  }

  const response = await instance.delete(
    `${Endpoint.BOARDS}/${boardId}${Endpoint.COLUMNS}/${columnId}`
  );

  if (response.status === 200) {
    return response;
  } else {
    return false;
  }
};
