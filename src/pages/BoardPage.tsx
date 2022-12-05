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
import { setBoards, setModal } from 'store/slices/authSlice';
import { getAllUsers } from 'api/usersServices';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import '../utils/i18n.ts';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

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
  const modal: string = useAppSelector((store) => store.auth.modal);
  const { index } = useParams();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const storeBoards: IBoardsOfUser[] = useAppSelector((store) => store.auth.boards);
  const boardData: IBoardsOfUser = storeBoards.find((board) => board._id === index);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const mediaTrigger = useMediaQuery('(min-width: 768px)');
  const boardBoxStyles = mediaTrigger
    ? { display: 'flex', gap: '10px', height: '2em' }
    : {
        display: 'flex',
        gap: '10px',
        width: '100vw',
        height: 'max-content',
        flexDirection: 'column',
        alignItems: 'center',
      };

  const { t } = useTranslation();

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
      case 'showDescription':
        dispatch(setModal('showDescription'));
        handleOpen();
        break;
      case 'editBoard':
        dispatch(setModal('editBoard'));
        handleOpen();
        break;
      case 'deleteBoard':
        dispatch(setModal('deleteBoard'));
        handleOpen();
        break;
      case 'addColumn':
        dispatch(setModal('addColumn'));
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

  const isMobile = window.innerWidth < 600;

  return (
    <>
      <BoardBackground>
        <div className="background">
          {mediaTrigger ? <div className="shape"></div> : null}
          {mediaTrigger ? <div className="shape"></div> : null}
          {mediaTrigger ? <div className="shape"></div> : null}
          {mediaTrigger ? <div className="shape"></div> : null}
        </div>
        <Wrapper>
          <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            {boardData ? (
              <BoardItem id={boardData._id}>
                <Box component="div" sx={boardBoxStyles}>
                  <h3 className="board-title">{boardData.title}</h3>
                  <ButtonGroup>
                    <Button
                      id="showDescription"
                      variant="contained"
                      onClick={(e) => handleClickOpen(e)}
                      startIcon={<PageviewIcon />}
                      color="warning"
                    >
                      {t('boardDescription')}
                    </Button>
                    <ButtonGroup>
                      <Button
                        id="editBoard"
                        variant="contained"
                        startIcon={<EditIcon />}
                        color="warning"
                        onClick={(e) => handleClickOpen(e)}
                      >
                        {t('edit')}
                      </Button>
                      <Button
                        id="deleteBoard"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        color="warning"
                        onClick={(e) => handleClickOpen(e)}
                      >
                        {t('delete')}
                      </Button>
                    </ButtonGroup>
                    <Button
                      id="addColumn"
                      variant="contained"
                      startIcon={<PlaylistAddIcon />}
                      color="warning"
                      onClick={(e) => handleClickOpen(e)}
                    >
                      {t('addList')}
                    </Button>
                  </ButtonGroup>
                </Box>
                <ColumnsList boardId={boardData._id} token={token} />
              </BoardItem>
            ) : null}
          </DndProvider>
        </Wrapper>
        <Modal
          open={modal === 'addColumn' && open}
          onClose={handleClose}
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
              {t('addList')}
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
                    message: t('thisFieldMustBe'),
                  },
                  minLength: {
                    value: 3,
                    message: t('atList'),
                  },
                  maxLength: {
                    value: 30,
                    message: t('maximum30'),
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
                rows="3"
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
                {errors.title ? (
                  <span style={{ color: '#ff512f' }}>{errors.title.message}</span>
                ) : (
                  ' '
                )}
                <Button sx={{ ml: 'auto' }} color="primary" type="submit">
                  {t('submit')}
                </Button>
                <Button color="warning" onClick={() => handleClose()}>
                  {t('cancel')}
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={modal === 'showDescription' && open}
          onClose={handleClickClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              {t('titleBoard')}
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
          open={modal === 'deleteBoard' && open}
          onClose={handleClickClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            sx={{ bgcolor: 'lightgray' }}
            id="responsive-dialog-title"
            variant="h5"
            component="h2"
          >
            {t('confirmDeleteBoard')}
          </DialogTitle>
          <DialogContent sx={{ bgcolor: 'lightgray' }}>
            <DialogContentText>{t('confirmDeleteBoardMessage')}</DialogContentText>
          </DialogContent>
          <DialogActions sx={{ bgcolor: 'lightgray' }}>
            <Button variant="contained" onClick={handleDelete} autoFocus>
              {t('delete')}
            </Button>
            <Button color="warning" variant="contained" autoFocus onClick={handleClickClose}>
              {t('cancel')}
            </Button>
          </DialogActions>
        </Dialog>

        <Modal
          open={modal === 'editBoard' && open}
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
              {t('editBoard')}
            </Typography>
            <Box id="edit" component="form" onSubmit={editBoard}>
              <TextField
                margin="normal"
                type="text"
                placeholder="Title"
                fullWidth
                label="Title"
                autoComplete="off"
                defaultValue={boardData.title}
                {...register('title', {
                  required: {
                    value: true,
                    message: t('thisFieldMustBe'),
                  },
                  minLength: {
                    value: 3,
                    message: t('atLeast'),
                  },
                  maxLength: {
                    value: 30,
                    message: t('maximum30'),
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
                defaultValue={boardData.description}
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
                <Button color="warning" onClick={() => handleClickClose()}>
                  {t('cancel')}
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
