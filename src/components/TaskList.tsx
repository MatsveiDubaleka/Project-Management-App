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

function TaskList({ boardId, columnId, token, taskList, setTaskList }: IItem) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskList]);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {taskList.length > 0
        ? [...taskList].map((task, i) => {
            return (
              <>
                <Task
                  key={i}
                  boardId={task.boardId}
                  columnId={task.columnId}
                  taskId={task._id}
                  taskTitle={task.title}
                  taskDescription={task.description}
                  userId={
                    users.find((user) => user._id === task.userId)
                      ? users.find((user) => user._id === task.userId).name
                      : ''
                  }
                  token={token}
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
                    <Button
                      variant="contained"
                      onClick={() => handleDeleteTask(task._id)}
                      autoFocus
                    >
                      DELETE
                    </Button>
                    <Button color="warning" variant="contained" autoFocus onClick={handleClose}>
                      CANCEL
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            );
          })
        : null}
    </Box>
  );
}

export default TaskList;
