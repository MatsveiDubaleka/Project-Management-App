import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { IBoardColumns, IItem } from 'types/types';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskList from './TaskList';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { LOCAL_STORAGE_DATA } from 'constants/registration';
import { setModal } from 'store/slices/authSlice';
import columnSlice from 'store/slices/columnSlice';
import { useDrop } from 'react-dnd';
import { useForm } from 'react-hook-form';
import { DropTargetMonitor } from 'react-dnd/dist/types';
import { setLoading } from 'store/slices/loadingSlice';
import { deleteColumn, getColumns, updateColumn } from 'api/columnService';
import { useTranslation } from 'react-i18next';
import '../utils/i18n.ts';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Typography,
  TextField,
} from '@mui/material';

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

const ColumnItem = styled.div`
  cursor: pointer;
  height: max-content;
  width: 20vw;
  max-width: 300px;
  background-color: rgba(255, 255, 255, 0.13);
  position: relative;
  border-radius: 5px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 15px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
  justify-content: space-between;
  button {
    outline: none;
    border: none;
    width: 100%;
    background-color: #23a2f6;
    color: white;
    padding: 5px 0;
    font-size: 1em;
    line-height: 1em;
    font-weight: 500;
    border-radius: 5px;
    cursor: pointer;
  }
  @media (max-width: 1080px) {
    width: 25vw;
  }
  @media (max-width: 800px) {
    min-width: 100vw;
  }
`;

const ColumnTitle = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  background-color: rgb(66, 63, 62);
  padding: 0 5px;
`;

interface IEditColumnForm {
  title: string;
}

const Column: React.FC<IItem> = ({ boardId, columnId, columnTitle }: IItem) => {
  const userId = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA))._id;

  const token = useAppSelector((state) => state.auth.token);
  const [taskList, setTaskList] = useState([]);
  const [open, setOpen] = useState(false);
  const [clickedButtonId, setClickedButtonId] = useState('');
  const dispatch = useAppDispatch();
  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const modal: string = useAppSelector((store) => store.auth.modal);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<IEditColumnForm>();
  const { t } = useTranslation();

  const handleClickDelete = () => {
    dispatch(setModal('deleteColumn'));
    handleOpen();
  };

  const handleClickEdit = (columnId: string) => {
    setClickedButtonId(columnId);
    dispatch(setModal('editColumn'));
    handleOpen();
  };

  const handleDeleteColumn = async (columnId: string) => {
    dispatch(setLoading(true));
    await deleteColumn(boardId, columnId);
    const data: IBoardColumns[] = await getColumns(boardId, token);
    dispatch(columnSlice.actions.setColumns(data));
    handleClose();
    dispatch(setLoading(false));
  };

  const handleEditColumn = handleSubmit(async (data) => {
    dispatch(setLoading(true));
    const exitData = Object.assign(data, { order: 0 });

    await updateColumn(boardId, clickedButtonId, exitData);
    const columnData: IBoardColumns[] = await getColumns(boardId, token);
    dispatch(columnSlice.actions.setColumns(columnData));
    handleClose();
    dispatch(setLoading(false));
  });

  return (
    <ColumnItem>
      <ColumnTitle>
        {columnTitle}
        <div>
          <EditIcon
            id="editColumn"
            sx={{ fontSize: '1.25em' }}
            onClick={() => handleClickEdit(columnId)}
          />
          <DeleteIcon id="deleteColumn" sx={{ fontSize: '1.25em' }} onClick={handleClickDelete} />
        </div>
      </ColumnTitle>
      <TaskList
        boardId={boardId}
        columnId={columnId}
        token={token}
        taskList={taskList}
        setTaskList={setTaskList}
      />
      <Button id={columnId} onClick={handleOpen}>
        <AddIcon />
        {t('addTask')}
      </Button>

      <Dialog
        open={modal === 'deleteColumn' && open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          sx={{ bgcolor: 'lightgray' }}
          id="responsive-dialog-title"
          variant="h5"
          component="h2"
        >
          {t('confirmDeleteColumn')}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'lightgray' }}>
          <DialogContentText>{t('confirmDeleteColumnMessage')}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'lightgray' }}>
          <Button variant="contained" onClick={() => handleDeleteColumn(columnId)} autoFocus>
            {t('delete')}
          </Button>
          <Button color="warning" variant="contained" autoFocus onClick={handleClose}>
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={modal === 'editColumn' && open}
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
            {t('editColumn')}
          </Typography>
          <Box component="form" onSubmit={handleEditColumn}>
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
                  message: t('atLeast'),
                },
                maxLength: {
                  value: 30,
                  message: t('maximum30'),
                },
              })}
            />
            <Box sx={{ display: 'flex' }}>
              <Button sx={{ ml: 'auto' }} color="primary" type="submit">
                {t('submit')}
              </Button>
              <Button color="warning" onClick={handleClose}>
                {t('cancel')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </ColumnItem>
  );
};

export default Column;
