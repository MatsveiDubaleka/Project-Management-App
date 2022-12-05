import { deleteBoard, getAllBoardsOfServer, updateBoard } from 'api/boardsService';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setBoards, setModal } from 'store/slices/authSlice';
import styled from 'styled-components';
import { IBoardsOfUser } from 'types/types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { LOCAL_STORAGE_DATA } from 'constants/registration';
import { getAllUsers } from 'api/usersServices';
import { Box, Modal, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { Endpoint } from 'constants/endpoints';
import { useTranslation } from 'react-i18next';
import '../utils/i18n.ts';

const Board = styled.div`
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
  text-align: center;
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
  .info {
    font-size: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .description-title {
    margin-bottom: 5px;
    font-size: 20px;
  }
  .description {
    background-color: rgba(255, 255, 255, 0.3);
    padding-left: 5px;
    color: black;
    border-radius: 3px;
    text-align: left;
    min-width: 230px;
    max-height: 100px;
    margin: 0;
    -webkit-line-clamp: 4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .owner {
    margin-top: 30px;
    font-size: 20px;
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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30vw',
  minWidth: '300px',
  minHeight: '200px',
  bgcolor: 'lightgray',
  border: '2px solid #000',
  borderRadius: '7px',
  boxShadow: '2px 2px 2px #433f39',
  p: 4,
};

interface IBoardElement {
  _id?: string;
  title?: string;
  description?: string;
  owner?: string;
  users?: string[];
}

interface IEditBoardForm {
  title: string;
  description?: string;
}

const BoardElement: React.FC<IBoardElement> = ({
  _id = '1',
  title = 'Board Title',
  description = 'Description',
  owner = 'user',
  users = ['user1', 'user2'],
}: IBoardElement) => {
  const modal: string = useAppSelector((store) => store.auth.modal);
  const storeBoards: IBoardsOfUser[] = useAppSelector((store) => store.auth.boards);
  const boardData: IBoardsOfUser = storeBoards.find((board) => board._id === _id);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<IEditBoardForm>();

  const handleClickClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    reset();
    handleClose();
  };

  const handleClickOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const target = e.target as HTMLTextAreaElement;
    switch (target.id as string) {
      case 'editBoardOnBoardPage':
        dispatch(setModal('editBoardOnBoardPage'));
        handleOpen();
        break;
      case 'deleteBoardOnBoardPage':
        dispatch(setModal('deleteBoardOnBoardPage'));
        handleOpen();
        break;
      default:
        throw new Error();
    }
  };

  const editBoard = handleSubmit(async (data, e) => {
    e.preventDefault();
    const currentUserId = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DATA}`))._id;
    await updateBoard(
      boardData._id,
      {
        title: data.title,
        description: data.description,
        owner: currentUserId,
        users: [],
      },
      token
    );

    async function dispatchBoards() {
      const data: IBoardsOfUser[] = await getAllBoardsOfServer(token);
      dispatch(setBoards(data));
    }
    dispatchBoards();

    getAllUsers(token);
    handleClose();
  });

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
      <NavLink style={{ textDecoration: 'none' }} to={`/bord_${_id}`}>
        <Board id={_id}>
          <h3 className="board-title">{title}</h3>
          <div className="info">
            <div className="description-title">{t('boardDescription')}</div>
            <div className="description">{description}</div>
            <div className="owner">
              {t('boardOwner')}: {owner}
            </div>
            <div className="users">{users}</div>
          </div>
          <div className="button-block">
            <button id="editBoardOnBoardPage" onClick={(e) => handleClickOpen(e)}>
              {t('edit')}
            </button>
            <button id="deleteBoardOnBoardPage" onClick={(e) => handleClickOpen(e)}>
              {t('delete')}
            </button>
          </div>
        </Board>
      </NavLink>
      <Dialog
        open={modal === 'deleteBoardOnBoardPage' && open}
        onClose={handleClickClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{t('confirmDeleteBoard')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('confirmDeleteBoardMessage')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={(e) => handleDelete(e)} autoFocus>
            {t('delete')}
          </Button>
          <Button variant="contained" autoFocus onClick={(e) => handleClickClose(e)}>
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={modal === 'editBoardOnBoardPage' && open}
        onClose={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleClickClose(e)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            fontWeight="bold"
            color="primary"
          >
            {t('editBoard')}
          </Typography>
          <Box component="form" onSubmit={editBoard}>
            <TextField
              margin="normal"
              type="text"
              placeholder="Title"
              fullWidth
              label="Title"
              autoComplete="off"
              defaultValue={title}
              {...register('title', {
                required: {
                  value: true,
                  message: '*this field must be filled in',
                },
                minLength: {
                  value: 3,
                  message: '*at least 3 characters',
                },
                maxLength: {
                  value: 30,
                  message: '*maximum of 30 characters',
                },
              })}
            />
            <TextField
              margin="normal"
              type="text"
              placeholder="Description"
              fullWidth
              label="Description"
              autoComplete="off"
              defaultValue={description}
              multiline={true}
              rows="5"
              {...register('description', {
                required: {
                  value: true,
                  message: t('thisFieldMustBe'),
                },
                maxLength: {
                  value: 500,
                  message: t('maximum500'),
                },
              })}
            />

            <Box sx={{ display: 'flex' }}>
              <Button sx={{ ml: 'auto' }} color="primary" type="submit">
                {t('submit')}
              </Button>
              <Button color="warning" onClick={(e) => handleClickClose(e)}>
                {t('cancel')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default BoardElement;
