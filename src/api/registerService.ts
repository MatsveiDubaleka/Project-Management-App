import { Endpoint } from './../constants/endpoints';
import { API_URL } from './../constants/registration';
import {
  IAuthorizationResult,
  IBoardsOfUser,
  IFormInputs,
  INewUserResponse,
} from './../types/types';

export async function createUser(newuser: IFormInputs): Promise<INewUserResponse | undefined> {
  const response = await fetch(`${API_URL}${Endpoint.SIGN_UP}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newuser),
  });
  try {
    const newUser = await response.json();
    console.log(newUser);
    return newUser;
  } catch (error) {
    console.log('Some error');
  }
}

export async function loginUser(user: IFormInputs): Promise<IAuthorizationResult | undefined> {
  try {
    const response = await fetch(`${API_URL}${Endpoint.SIGN_IN}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const authUser = await response.json();
    return authUser;
  } catch (error) {
    console.log('Incorrect e-mail or password');
  }
}

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
    const user = await response.json();
    return user;
  } catch (error) {
    if (response.status === 403) {
      console.log('Access token is missing or invalid');
    } else {
      console.log('Some error');
    }
  }
}
