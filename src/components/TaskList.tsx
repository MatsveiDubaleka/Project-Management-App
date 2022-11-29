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
import React, { useEffect, useState } from 'react';
import { IBoardColumns, IBoardColumnTasks, IItem, ITaskOutputData } from 'types/types';
import Task from './Task';
import { deleteTask, getTasks, updateTaskColumn } from 'api/taskService';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setModal } from 'store/slices/authSlice';
import { getAllUsers } from 'api/usersServices';
import { useDrop } from 'react-dnd';
import { useForm } from 'react-hook-form';
import taskSlice from 'store/slices/taskSlice';

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

const TaskList: React.FC<IItem> = ({ boardId, columnId, token, taskList, setTaskList }) => {
  const modal: string = useAppSelector((store) => store.auth.modal);
  const tasks: IBoardColumns[] = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();
  const [taskId, setTaskId] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<IEditTaskForm>();

  const handleClickDelete = () => {
    dispatch(setModal('deleteTask'));
    handleOpen();
  };

  const handleClickEdit = (taskId: string, userId: string) => {
    setTaskId(taskId);
    setCurrentUserId(userId);
    dispatch(setModal('editTask'));
    handleOpen();
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(boardId, columnId, taskId);
    const data: IBoardColumnTasks[] = await getTasks(boardId, columnId, token);
    setTaskList(data);
    handleClose();
  };

  const handleEditTask = handleSubmit(async (data) => {
    const updatedData: ITaskOutputData = {
      title: data.title,
      order: 0,
      description: data.description,
      columnId: columnId,
      userId: currentUserId,
      users: [''],
    };
    await updateTaskColumn(boardId, columnId, taskId, updatedData);
    const taskData: IBoardColumns[] = await getTasks(boardId, columnId, token);
    dispatch(taskSlice.actions.setTasks(taskData));
    handleClose();
  });

  useEffect(() => {
    (async () => {
      const data = await getTasks(boardId, columnId, token);
      if (data && data.length > 0) {
        const users = await getAllUsers(token);
        const sorted = data.sort((a: IItem, b: IItem) => b.order - a.order);
        sorted.reverse();
        setTaskList(sorted);
        setUsers((state) => {
          state = [...users];
          return state;
        });
      }
    })();
  }, [tasks]);

  const [, drop] = useDrop({
    accept: 'Our first type',
    drop: () => ({ name: columnId }),
  });

  const moveCardHandler = async (dragIndex: number, hoverIndex: number) => {
    const dragItem = taskList[dragIndex];

    if (dragItem) {
      setTaskList((prevState) => {
        const coppiedStateArray = [...prevState];
        const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragItem);

        coppiedStateArray.splice(dragIndex, 1, prevItem[0]);
        return coppiedStateArray;
      });

      await updateTaskColumn(boardId, columnId, dragItem._id, {
        title: dragItem.title,
        order: hoverIndex,
        description: dragItem.description,
        columnId: dragItem.columnId,
        userId: dragItem.userId,
        users: dragItem.users,
      });
    }
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
      {taskList.length > 0
        ? taskList.map((task, index: number) => {
            return (
              <>
                <Task
                  key={Date.now()}
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
                  editItem={async () => handleClickEdit(task._id, task.userId)} // Dont work user id
                  deleteItem={async () => handleClickDelete()}
                  index={index}
                  moveCardHandler={moveCardHandler}
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

                <Modal
                  open={modal === 'editTask' ? open : false}
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
                      EDIT TASK
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
                        <Button color="warning" onClick={handleClose}>
                          CANCEL
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Modal>
              </>
            );
          })
        : null}
    </Box>
  );
};

export default TaskList;
