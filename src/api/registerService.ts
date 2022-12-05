import { Endpoint } from './../constants/endpoints';
import { API_URL } from './../constants/registration';
import {
  IAuthorizationResult,
  IBoardsOfUser,
  IFormInputs,
  INewUserResponse,
} from './../types/types';

export async function getAllBoardOfUser(
  userId: string,
  token: string
): Promise<IBoardsOfUser | undefined> {
  const response = await fetch(`${API_URL}${Endpoint.BOARDS}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    const boards = await response.json();
    return boards;
  } catch (error) {
    if (response.status === 403) {
      console.log('Access token is missing or invalid');
    } else {
      console.log('Some error');
    }
  }
}

export async function createUser(newuser: IFormInputs): Promise<INewUserResponse | undefined> {
  const response = await fetch(`${API_URL}${Endpoint.SIGN_UP}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newuser),
  });
  try {
    let newUser;
    if (response.ok) {
      newUser = await response.json();
    } else if (response.status === 409) {
      newUser = { login: 'Login already exist' };
    }
    return newUser;
  } catch (error) {
    console.log('Some error');
  }
}

export async function loginUser(user: IFormInputs): Promise<IAuthorizationResult | undefined> {
  const response = await fetch(`${API_URL}${Endpoint.SIGN_IN}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  try {
    let authUser;
    if (response.ok) {
      authUser = await response.json();
    } else if (response.status >= 400) {
      authUser = { error: await response.json() };
    }
    return authUser;
  } catch (error) {
    console.log('Some error');
  }
}

export async function getUserDataByLogin(
  login: string,
  token: string
): Promise<INewUserResponse | undefined> {
  const response = await fetch(`${API_URL}${Endpoint.USERS}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    const users = await response.json();
    const userData = users.find((user: INewUserResponse) => user.login === login);
    return userData;
  } catch (error) {
    if (response.status === 403) {
      console.log('Access token is missing or invalid');
    } else {
      console.log('Some error');
    }
  }
}

export async function getUserDataById(
  id: string,
  token: string
): Promise<INewUserResponse | undefined> {
  const response = await fetch(`${API_URL}${Endpoint.USERS}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const users = await response.json();
  const userData = users.find((user: INewUserResponse) => user._id === id);
  return userData;
}
