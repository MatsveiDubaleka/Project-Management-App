import React, { Dispatch, FC, SetStateAction } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { IAddBoardForm, ITaskOutputData } from 'types/types';
import { createTask, getTasks } from 'api/taskService';
import { useTranslation } from 'react-i18next';
import '../utils/i18n.ts';

interface IModalTask {
  open: boolean;
  boardId: string;
  columnId: string;
  handleClose: () => void;
  setTaskList: Dispatch<SetStateAction<ITaskOutputData[]>>;
  token: string;
  userId: string;
}

const ModalWindow: React.FC<IModalTask> = ({
  open,
  boardId,
  columnId,
  handleClose,
  setTaskList,
  token,
  userId,
}: IModalTask) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<IAddBoardForm>();

  const { t } = useTranslation();

  const onSubmit = handleSubmit(async (data) => {
    const inputData = {
      title: data.title,
      order: 1, // TODO Надо придумать как порядок назначать
      description: data.description,
      userId,
      users: [''], // TODO Надо реализовать добавление связанных юзеров
    };
    await createTask(boardId, columnId, inputData);
    const tasks = await getTasks(boardId, columnId, token);
    setTaskList((state) => {
      state = [...tasks];
      return state;
    });
    reset();
    handleClose();
  });
  return (
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
          {t('addTask')}
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
            <Button color="warning" onClick={() => handleClose()}>
              {t('cancel')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalWindow;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30vw',
  minWidth: '300px',
  minHeight: '300px',
  bgcolor: 'lightgray',
  border: '2px solid #000',
  borderRadius: '7px',
  boxShadow: '2px 2px 2px #433f39',
  p: 4,
};
