import { INewUserResponse, IFormInputs } from './../types/types';
import { Endpoint } from 'constants/endpoints';
import { API_URL } from 'constants/registration';

export async function getAllUsers(token: string): Promise<INewUserResponse[] | undefined> {
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
    return users;
  } catch (error) {}
}

export async function deleteUser(userId: string, token: string): Promise<INewUserResponse> {
  const response = await fetch(`${API_URL}${Endpoint.USERS}/${userId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    redirect: 'follow',
  });
  try {
    const deletedUser = await response.json();
    return deletedUser;
  } catch (error) {
    if (response.status === 403) {
      console.log('Access token is missing or invalid');
    } else {
      console.log('Some error');
    }
  }
}

export async function updateUser(
  userId: string,
  token: string,
  updatedUser: IFormInputs
): Promise<INewUserResponse | undefined> {
  const response = await fetch(`${API_URL}${Endpoint.USERS}/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updatedUser),
    mode: 'cors',
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
