import { Endpoint } from 'constants/endpoints';
import { API_URL } from 'constants/registration';
import { IBoardsOfUser } from 'types/types';

interface INewBoard {
  title: {
    title: string;
    description: string;
  };
  owner: string;
  users: string[];
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

export async function addNewBoard(
  newBoard: INewBoard,
  token: string
): Promise<IBoardsOfUser | undefined> {
  const response = await fetch(`${API_URL}${Endpoint.BOARDS}`, {
    method: 'POST',
    body: JSON.stringify(newBoard),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    const board = await response.json();
    return board;
  } catch (error) {
    if (response.status === 403) {
      console.log('Access token is missing or invalid');
    } else {
      console.log('Some error');
    }
  }
}
