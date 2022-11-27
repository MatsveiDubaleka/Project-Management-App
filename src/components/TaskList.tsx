import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IBoardColumnTasks, IItem } from 'types/types';
import Task from './Task';
import { deleteTask, getTasks } from 'api/taskService';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setModal } from 'store/slices/authSlice';
import { getAllUsers } from 'api/usersServices';
import { useDrop } from 'react-dnd';

const TaskList: React.FC<IItem> = ({ boardId, columnId, token, taskList, setTaskList }) => {
  const modal: string = useAppSelector((store) => store.auth.modal);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleClickOpen = () => {
    dispatch(setModal('deleteTask'));
    handleOpen();
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(boardId, columnId, taskId);
    const data: IBoardColumnTasks[] = await getTasks(boardId, columnId, token);
    setTaskList(data);
    handleClose();
  };

  useEffect(() => {
    (async () => {
      const data = await getTasks(boardId, columnId, token);
      if (data && data.length > 0) {
        const users = await getAllUsers(token);
        setTaskList(data);
        setUsers((state) => {
          state = [...users];
          return state;
        });
      }
    })();
  }, [setTaskList]);

  const [, drop] = useDrop({
    accept: 'Our first type',
    drop: () => ({ name: columnId }),
  });

  const returnItemsForColumn = (columnId: string) => {
    const tasks = taskList.filter((task) => task.columnId === columnId);
    return [...tasks].map((task) => {
      return (
        <>
          <Task
            key={task._id}
            taskTitle={task.title}
            taskDescription={task.description}
            columnId={task.columnId}
            taskUsers={task.users}
            userId={
              users.find((user) => user._id === task.userId)
                ? users.find((user) => user._id === task.userId).name
                : ''
            }
            taskOrder={task.order}
            taskId={task._id}
            deleteItem={async () => handleClickOpen()}
          />
          <Dialog
            open={modal === 'deleteTask' ? open : false}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle
              sx={{ bgcolor: 'lightgray' }}
              id="responsive-dialog-title"
              variant="h5"
              component="h2"
            >
              {'Confirm delete a task'}
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'lightgray' }}>
              <DialogContentText>Delete a task permanently?</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ bgcolor: 'lightgray' }}>
              <Button variant="contained" onClick={() => handleDeleteTask(task._id)} autoFocus>
                DELETE
              </Button>
              <Button color="warning" variant="contained" autoFocus onClick={handleClose}>
                CANCEL
              </Button>
            </DialogActions>
          </Dialog>
        </>
      );
    });
  };

  return (
    <Box
      ref={drop}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        minHeight: '25vh',
      }}
    >
      {taskList.length > 0 ? returnItemsForColumn(columnId) : null}
    </Box>
  );
};

export default TaskList;
