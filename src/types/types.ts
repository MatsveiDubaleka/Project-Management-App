import { Dispatch, SetStateAction } from 'react';

export type HeaderSliderType = {
  children: React.ReactElement;
};

export type TaskListType = {
  children: React.ReactElement;
};

export interface IItem {
  boardId?: string;
  columnId?: string;
  columnTitle?: string;
  taskId?: string;
  token?: string;
  taskTitle?: string;
  taskDescription?: string;
  userId?: string;
  deleteItem?: () => Promise<void>;
  taskList?: ITaskOutputData[];
  setTaskList?: Dispatch<SetStateAction<ITaskOutputData[]>>;
  taskUsers?: string[];
  taskOrder?: number;
}
export interface IFormInputs {
  name?: string;
  login: string;
  password: string;
  exist?: string;
  wrong?: string;
}

export interface INewUserResponse {
  _id: string;
  name: string;
  login: string;
}

export interface IAuthorizationResult {
  token: string;
  error?: { message: string };
}

export interface IBoardsOfUser {
  _id?: string;
  title?: string;
  description?: string;
  owner?: string;
  users?: string[];
}

export interface IBoardColumns {
  _id: string;
  title: string;
  order: number;
  boardId: string;
}

export interface IBoardColumnTasks {
  _id: string;
  title: string;
  order: number;
  boardId: string;
  columnId: string;
  description: string;
  userId: string;
  users: string[];
}

export interface ITaskInputData {
  title: string;
  order: number;
  description: string;
  userId: string;
  users: string[];
}

export interface ITaskOutputData {
  _id: string;
  title: string;
  order: number;
  boardId: string;
  columnId: string;
  description: string;
  userId: string;
  users: string[];
}

export interface IAddBoardForm {
  title: string;
  description: string;
}

export interface ITaskPutData {
  title: string;
  order: number;
  description: string;
  columnId: string;
  userId: string;
  users: string[];
}
