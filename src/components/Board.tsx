import { deleteBoard, getAllBoardsOfServer } from 'api/boardsService';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setBoards } from 'store/slices/authSlice';
import styled from 'styled-components';
import { IBoardsOfUser } from 'types/types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Board = styled.div`
   {
    cursor: pointer;
    min-height: 300px;
    background-color: rgba(255, 255, 255, 0.13);
    position: relative;
    border-radius: 10px;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
    letter-spacing: 0.5px;
    outline: none;
    border: none;
    justify-content: space-between;
    overflow: auto;
    text-overflow: ellipsis;
    word-wrap: break-word;
  }
  .info {
    font-size: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .description {
    max-width: max-content;
    max-height: 100px;
    margin: 0;
    -webkit-line-clamp: 4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .board h3 {
    font-size: 32px;
    font-weight: 500;
    line-height: 42px;
    text-align: center;
  }
  .board-title {
    margin-bottom: 30px;
  }
  .button-block {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 5px;
  }
  button {
    outline: none;
    border: none;
    margin-top: 30px;
    width: 100%;
    background-color: #23a2f6;
    color: white;
    padding: 15px 0;
    font-size: 18px;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
  }
`;

interface IBoardElement {
  _id?: string;
  title?: string;
  description?: string;
  owner?: string;
  users?: string[];
}

const BoardElement = ({
  _id = '1',
  title = 'Board Title',
  description = 'Description',
  owner = 'user',
  users = ['user1', 'user2'],
}: IBoardElement) => {
  const [open, setOpen] = useState(false);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  const handleClickOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setOpen(false);
  };

  const handleChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log('change');
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    await deleteBoard(_id, token);

    async function dispatchBoards() {
      const data: IBoardsOfUser[] = await getAllBoardsOfServer(token);
      dispatch(setBoards(data));
    }
    dispatchBoards();
    setOpen(false);
  };

  return (
    <>
      <Board id={_id}>
        <h3 className="board-title">{title}</h3>
        <div className="info">
          <div className="description">{description}</div>
          <div>{users}</div>
        </div>
        <div className="button-block">
          <button onClick={(e) => handleChange(e)}>Change</button>
          <button onClick={(e) => handleClickOpen(e)}>Delete</button>
        </div>
      </Board>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{'Confirm delete a board'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Delete a board permanently?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={(e) => handleDelete(e)} autoFocus>
            DELETE
          </Button>
          <Button variant="contained" autoFocus onClick={(e) => handleClose(e)}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BoardElement;
