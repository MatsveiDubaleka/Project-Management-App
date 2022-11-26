import { Box, Button, ButtonGroup, Modal, TextField, Typography } from '@mui/material';
import { deleteBoard } from 'api/boardsService';
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
}

const BoardPage = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector((state) => state.columns);
  const { index } = useParams();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const storeBoards: IBoardsOfUser[] = useAppSelector((store) => store.auth.boards);
  const boardData: IBoardsOfUser = storeBoards.find((board) => board._id === index);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<IAddColumnForm>();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const answer = confirm('Are you sure?');
    if (answer) {
      await deleteBoard(boardData._id, token);
      navigate(`${Endpoint.BOARDS}`);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    await createColumn(boardData._id, { title: data.title, order: 1 });
    const columns = await getColumns(boardData._id, token);
    dispatch(columnSlice.actions.setColumns(columns));
    reset();
    handleClose();
  });

  const showDescription = () => {};

  const editBoard = () => {};

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
                  variant="contained"
                  onClick={showDescription}
                  startIcon={<PageviewIcon />}
                  color="warning"
                >
                  Description
                </Button>
                <ButtonGroup>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    color="warning"
                    onClick={editBoard}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    color="warning"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
                <Button
                  variant="contained"
                  startIcon={<PlaylistAddIcon />}
                  color="warning"
                  onClick={handleOpen}
                >
                  Add List
                </Button>
              </Box>
              <ColumnsList boardId={boardData._id} token={token} />
            </BoardItem>
          ) : null}
        </Wrapper>
        <Modal
          open={open}
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
                {errors.title ? (
                  <span style={{ color: '#ff512f' }}>{errors.title.message}</span>
                ) : (
                  ' '
                )}
                <Button sx={{ ml: 'auto' }} color="primary" type="submit">
                  SUBMIT
                </Button>
                <Button color="warning" onClick={() => handleClose()}>
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
