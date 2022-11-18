import { INewUserResponse } from './../types/types';
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
  } catch (error) {
    if (response.status === 403) {
      console.log('Access token is missing or invalid');
    } else {
      console.log('Some error');
    }
  }
}
