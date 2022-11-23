import { Endpoint } from './../constants/endpoints';
import { LOCAL_STORAGE_DATA } from 'constants/registration';
import { instance } from './axios';
import { ITaskInputData } from 'types/types';

export const createTask = async (boardId: string, columnId: string, data: ITaskInputData) => {
  const token = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA)).token;
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    return false;
  }

  const response = await instance.post(
    `${Endpoint.BOARDS}/${boardId}${Endpoint.COLUMNS}/${columnId}${Endpoint.TASKS}`,
    data
  );

  if (response.status === 200) {
    return response;
  } else {
    return false;
  }
};

export const getTasks = async (boardId: string, columnId: string, token: string) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    return false;
  }

  const response = await instance.get(
    `${Endpoint.BOARDS}/${boardId}${Endpoint.COLUMNS}/${columnId}${Endpoint.TASKS}`
  );

  if (response.status === 200) {
    return response.data;
  } else {
    return false;
  }
};

export const deleteTask = async (boardId: string, columnId: string, taskId: string) => {
  const token = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA)).token;
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    return false;
  }

  const response = await instance.delete(
    `${Endpoint.BOARDS}/${boardId}${Endpoint.COLUMNS}/${columnId}${Endpoint.TASKS}/${taskId}`
  );

  if (response.status === 200) {
    return response;
  } else {
    return false;
  }
};
