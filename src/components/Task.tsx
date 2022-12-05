import styled from 'styled-components';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import taskSlice from 'store/slices/taskSlice';
import { deleteTask, getTasks } from 'api/taskService';
import { IBoardColumnTasks, ITaskOutputData, IItem, IBoardColumns } from 'types/types';
import { setModal } from 'store/slices/authSlice';
import { useAppDispatch, useAppSelector } from 'store/hook';
import React, { useEffect, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag, useDrop } from 'react-dnd';
import { DragSourceMonitor } from 'react-dnd/dist/types';
import { updateTaskColumn } from 'api/taskService';
import { ITaskPutData } from '../types/types';
import { useTranslation } from 'react-i18next';
import '../utils/i18n.ts';
import { setLoading } from 'store/slices/loadingSlice';
import EditIcon from '@mui/icons-material/Edit';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { getAllUsers } from 'api/usersServices';

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

interface IEditTaskForm {
  title: string;
  description?: string;
}

const TaskItem = styled.div`
  height: max-content;
  background-color: white;
  position: relative;
  border-radius: 5px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
  justify-content: space-between;
`;

const TaskTitle = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  color: black;
  background-color: rgb(191, 182, 179);
  padding: 0 5px;
`;

const TaskDescription = styled.p`
  display: flex;
  -webkit-box-pack: center;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  color: black;
  padding: 5px 5px;
  overflow-y: auto;
  word-break: break-all;
`;

const TaskFooter = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  color: black;
  font-size: 1em;
  border-top: 2px solid gray;
`;

const Task: React.FC<IItem> = ({
  taskTitle,
  taskDescription,
  columnId,
  boardId,
  userId,
  taskUsers,
  taskOrder,
  taskId,
  index,
  token,
  setTaskList,
  moveCardHandler,
}: IItem) => {
  const dispatch = useAppDispatch();

  const modal: string = useAppSelector((store) => store.auth.modal);

  const [currentUserId, setCurrentUserId] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<IEditTaskForm>();

  const handleClickDelete = (task_Id: string) => {
    dispatch(setModal('deleteTask'));
    setCurrentTask(task_Id);
    handleOpen();
  };

  const handleClickEdit = (task_Id: string, userId: string) => {
    setCurrentTask(task_Id);
    setCurrentUserId(userId);
    dispatch(setModal('editTask'));
    handleOpen();
  };

  const handleDeleteTask = async () => {
    await deleteTask(boardId, columnId, currentTask);

    const data: IBoardColumnTasks[] = await getTasks(boardId, columnId, token);
    setTaskList(data);
    handleClose();
  };

  const handleEditTask = handleSubmit(async (data) => {
    const updatedData: ITaskOutputData = {
      title: data.title,
      order: 1,
      description: data.description,
      columnId: columnId,
      userId: currentUserId,
      users: [''],
    };
    console.log(updatedData.userId);
    await updateTaskColumn(boardId, columnId, currentTask, updatedData);
    const taskData: IBoardColumns[] = await getTasks(boardId, columnId, token);
    dispatch(taskSlice.actions.setTasks(taskData));
    handleClose();
  });

  const renderTaskColumn = async (newColumnId: string) => {
    dispatch(setLoading(true));
    const data: ITaskPutData = {
      title: taskTitle,
      order: taskOrder,
      description: taskDescription,
      columnId: newColumnId,
      userId: userId,
      users: taskUsers,
    };
    await updateTaskColumn(boardId, columnId, taskId, data);

    dispatch(setLoading(false));
  };

  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: 'Our first type',
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      console.log(item);
      console.log(dragIndex, hoverIndex);
      moveCardHandler(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'Our first type',
    item: { name: taskTitle, type: 'Our first type' },
    end: (item, monitor: DragSourceMonitor) => {
      const dropResult: { name: string } = monitor.getDropResult();
      if (dropResult.name === columnId) {
        return;
      } else {
        renderTaskColumn(dropResult.name);
      }
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  drag(drop(ref));

  return (
    <>
      <TaskItem className="movable-item" ref={ref} style={{ opacity }}>
        <TaskTitle>{taskTitle}</TaskTitle>
        <TaskDescription>{taskDescription}</TaskDescription>
        <TaskFooter>
          <div>
            <ManageAccountsIcon />
            {userId}
          </div>
          <div>
            <EditIcon
              id="editTask"
              sx={{ fontSize: '1.25em' }}
              onClick={() => handleClickEdit(taskId, userId)}
            />
            <DeleteIcon
              id="deleteTask"
              sx={{ fontSize: '1.25em' }}
              onClick={() => handleClickDelete(taskId)}
            />
          </div>
        </TaskFooter>
      </TaskItem>
      <Dialog
        open={modal === 'deleteTask' && open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          sx={{ bgcolor: 'lightgray' }}
          id="responsive-dialog-title"
          variant="h5"
          component="h2"
        >
          {t('confirmDeleteTask')}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'lightgray' }}>
          <DialogContentText>{t('confirmDeleteTaskMessage')}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'lightgray' }}>
          <Button variant="contained" onClick={() => handleDeleteTask()} autoFocus>
            {t('delete')}
          </Button>
          <Button color="warning" variant="contained" autoFocus onClick={handleClose}>
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={modal === 'editTask' && open}
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
            {t('editTask')}
          </Typography>
          <Box component="form" onSubmit={handleEditTask}>
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
              <Button color="warning" onClick={handleClose}>
                {t('cancel')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Task;
