import { Endpoint } from 'constants/endpoints';
import { API_URL } from 'constants/registration';
import { IBoardsOfUser } from 'types/types';

interface INewBoard {
  title: string;
  description: string;
  owner: string;
  users: string[];
}

interface INewBoardResponse {
  _id: string;
  title: string;
  description: string;
  owner: string;
  users: string[];
}

export async function getAllBoardsOfUser(
  userId: string,
  token: string
): Promise<IBoardsOfUser[] | undefined> {
  const response = await fetch(`${API_URL}${Endpoint.BOARDSSET}/${userId}`, {
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

export async function getBoardById(
  boardId: string,
  token: string
): Promise<IBoardsOfUser | undefined> {
  const response = await fetch(`${API_URL}${Endpoint.BOARDS}/${boardId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      redirect: 'follow',
    },
  });
  try {
    const board = await response.json();
    console.log(board);
    return board;
  } catch (error) {
    if (response.status === 403) {
      console.log('Access token is missing or invalid');
    } else {
      console.log('Some error');
    }
  }
}

export async function getAllBoardsOfServer(token: string): Promise<IBoardsOfUser[] | undefined> {
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
): Promise<INewBoardResponse | undefined> {
  const response = await fetch(`${API_URL}${Endpoint.BOARDS}`, {
    method: 'POST',
    body: JSON.stringify(newBoard),
    mode: 'cors',
    headers: {
      Accept: 'application/json',
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

export async function deleteBoard(boardId: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}${Endpoint.BOARDS}/${boardId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    redirect: 'follow',
  });
  try {
    const deletedBoard = await response.text();
    console.log(deletedBoard);
  } catch (error) {
    if (response.status === 403) {
      console.log('Access token is missing or invalid');
    } else {
      console.log('Some error');
    }
  }
}

export async function updateBoard(
  boardId: string,
  updatedBoard: INewBoard,
  token: string
): Promise<INewBoardResponse | undefined> {
  const response = await fetch(`${API_URL}${Endpoint.BOARDS}/${boardId}`, {
    method: 'PUT',
    body: JSON.stringify(updatedBoard),
    mode: 'cors',
    headers: {
      Accept: 'application/json',
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
