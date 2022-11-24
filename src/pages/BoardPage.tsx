import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { deleteBoard, getAllBoardsOfServer, updateBoard } from 'api/boardsService';
import { Endpoint } from 'constants/endpoints';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hook';
import styled from 'styled-components';
import { IBoardsOfUser } from 'types/types';
import { BoardBackground } from './Boards';
import PageviewIcon from '@mui/icons-material/Pageview';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { createColumn, getColumns } from 'api/columnService';
import ColumnsList from 'components/ColumnsList';
import { useForm } from 'react-hook-form';
import columnSlice from 'store/slices/columnSlice';
import { LOCAL_STORAGE_DATA } from 'constants/registration';
import { setBoards } from 'store/slices/authSlice';
import { getAllUsers } from 'api/usersServices';

const BoardItem = styled.div`
  min-height: max-content;
  max-width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  letter-spacing: 0.5px;
  outline: none;
  border: none;

  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .board-title {
    font-size: 2em;
    font-weight: 700;
    text-align: center;
  }
`;

const Wrapper = styled.div`
  width: 1280px;
  margin: 3vh auto;
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

interface IAddColumnForm {
  title: string;
  description?: string;
}

const BoardPage = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector((state) => state.columns);
  const { index } = useParams();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const storeBoards: IBoardsOfUser[] = useAppSelector((store) => store.auth.boards);
  const boardData: IBoardsOfUser = storeBoards.find((board) => board._id === index);
  const [modal, setModal] = useState('');
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<IAddColumnForm>();

  const handleClickClose = () => {
    reset();
    handleClose();
  };

  const handleClickOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.target as HTMLTextAreaElement;
    switch (target.id as string) {
      case 'description':
        setModal('description');
        handleOpen();
        break;
      case 'edit':
        setModal('edit');
        handleOpen();
        break;
      case 'delete':
        setModal('delete');
        handleOpen();
        break;
      case 'add':
        setModal('add');
        handleOpen();
        break;
      default:
        throw new Error();
    }
  };

  const handleDelete = async () => {
    await deleteBoard(boardData._id, token);
    navigate(`${Endpoint.BOARDS}`);
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    await createColumn(boardData._id, { title: data.title, order: 1 });
    const columns = await getColumns(boardData._id, token);

    dispatch(columnSlice.actions.setColumns(columns));
    handleClickClose();
  });

  const editBoard = handleSubmit(async (data) => {
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
    handleClickClose();
  });

  useEffect(() => {
    if (!boardData) {
      navigate('/notFound');
    }
    (async () => {
      const columns = await getColumns(boardData._id, token);
      dispatch(columnSlice.actions.setColumns(columns));
    })();
  }, []);

  return (
    <>
      <BoardBackground>
        <div className="background">
          {Array.from(Array(4)).map((_, index) => (
            <div className="shape" key={index}></div>
          ))}
        </div>
        <Wrapper>
          {boardData ? (
            <BoardItem id={boardData._id}>
              <Box component="div" sx={{ display: 'flex', gap: '10px', height: '2em' }}>
                <h3 className="board-title">{boardData.title}</h3>
                <Button
                  id="description"
                  variant="contained"
                  onClick={(e) => handleClickOpen(e)}
                  startIcon={<PageviewIcon />}
                  color="warning"
                >
                  Description
                </Button>
                <ButtonGroup>
                  <Button
                    id="edit"
                    variant="contained"
                    startIcon={<EditIcon />}
                    color="warning"
                    onClick={(e) => handleClickOpen(e)}
                  >
                    Edit
                  </Button>
                  <Button
                    id="delete"
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    color="warning"
                    onClick={(e) => handleClickOpen(e)}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
                <Button
                  id="add"
                  variant="contained"
                  startIcon={<PlaylistAddIcon />}
                  color="warning"
                  onClick={(e) => handleClickOpen(e)}
                >
                  Add List
                </Button>
              </Box>
              <ColumnsList boardId={boardData._id} token={token} />
            </BoardItem>
          ) : null}
        </Wrapper>
        <Modal
          open={modal === 'add' ? open : false}
          onClose={handleClickClose}
          aria-labelledby="modal-modal-title-addlist"
          aria-describedby="modal-modal-description-addlist"
        >
          <Box sx={modalStyle}>
            <Typography
              id="modal-modal-title-addlist"
              variant="h6"
              component="h2"
              fontWeight="bold"
              color="primary"
            >
              ADD LIST
            </Typography>
            <Box component="form" onSubmit={onSubmit}>
              <TextField
                margin="normal"
                type="text"
                placeholder="Title"
                fullWidth
                label="Title"
                autoComplete="off"
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
              <Box sx={{ display: 'flex' }}>
                <Button sx={{ ml: 'auto' }} color="primary" type="submit">
                  SUBMIT
                </Button>
                <Button color="warning" onClick={handleClickClose}>
                  CANCEL
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={modal === 'description' ? open : false}
          onClose={handleClickClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              BOARD
            </Typography>
            <Typography id="modal-modal-subtitle" variant="h6">
              <div>{boardData.title}</div>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 6 }}>
              {boardData.description}
            </Typography>
          </Box>
        </Modal>

        <Dialog
          open={modal === 'delete' ? open : false}
          onClose={handleClickClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            sx={{ bgcolor: 'lightgray' }}
            id="responsive-dialog-title"
            variant="h5"
            component="h2"
          >
            {'Confirm delete a board'}
          </DialogTitle>
          <DialogContent sx={{ bgcolor: 'lightgray' }}>
            <DialogContentText>Delete a board permanently?</DialogContentText>
          </DialogContent>
          <DialogActions sx={{ bgcolor: 'lightgray' }}>
            <Button variant="contained" onClick={handleDelete} autoFocus>
              DELETE
            </Button>
            <Button color="warning" variant="contained" autoFocus onClick={handleClickClose}>
              CANCEL
            </Button>
          </DialogActions>
        </Dialog>

        <Modal
          open={modal === 'edit' ? open : false}
          onClose={handleClickClose}
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
              EDIT BOARD
            </Typography>
            <Box component="form" onSubmit={editBoard}>
              <TextField
                margin="normal"
                type="text"
                placeholder="Title"
                fullWidth
                label="Title"
                autoComplete="off"
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
                multiline={true}
                rows="5"
                {...register('description', {
                  required: {
                    value: true,
                    message: '*this field must be filled in',
                  },
                  maxLength: {
                    value: 500,
                    message: '*maximum of 500 characters',
                  },
                })}
              />

              <Box sx={{ display: 'flex' }}>
                <Button sx={{ ml: 'auto' }} color="primary" type="submit">
                  SUBMIT
                </Button>
                <Button color="warning" onClick={() => handleClickClose()}>
                  CANCEL
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </BoardBackground>
    </>
  );
};

export default BoardPage;
