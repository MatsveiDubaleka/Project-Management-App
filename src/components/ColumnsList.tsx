import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Modal,
  Typography,
  TextField,
} from '@mui/material';
import { deleteColumn, getColumns, updateColumn } from 'api/columnService';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setModal } from 'store/slices/authSlice';
import columnSlice from 'store/slices/columnSlice';
import { IBoardColumns, IItem } from 'types/types';
import Column from './Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { setLoading } from 'store/slices/loadingSlice';
import { useForm } from 'react-hook-form';

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

interface IEditColumnForm {
  title: string;
}

function ColumnsList({ boardId, token }: IItem): JSX.Element {
  const columns: IBoardColumns[] = useAppSelector((state) => state.columns);
  const isLoading = useAppSelector((state) => state.loading.isLoading);
  const modal: string = useAppSelector((store) => store.auth.modal);
  const dispatch = useAppDispatch();
  const [clickedButtonId, setClickedButtonId] = useState('');
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<IEditColumnForm>();

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

  useEffect(() => {}, [columns]);

  const isMobile = window.innerWidth < 600;

  return (
    <Box sx={{ display: 'flex', gap: '10px' }}>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        {isLoading ? (
          <CircularProgress />
        ) : columns.length > 0 ? (
          [...columns].map((column, i) => {
            return (
              <>
                <Column
                  key={i}
                  boardId={column.boardId}
                  columnId={column._id}
                  columnTitle={column.title}
                  token={token}
                  editItem={async () => handleClickEdit(column._id)}
                  deleteItem={async () => handleClickDelete()}
                />
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
                    {'Confirm delete a column'}
                  </DialogTitle>
                  <DialogContent sx={{ bgcolor: 'lightgray' }}>
                    <DialogContentText>Delete a column permanently?</DialogContentText>
                  </DialogContent>
                  <DialogActions sx={{ bgcolor: 'lightgray' }}>
                    <Button
                      variant="contained"
                      onClick={() => handleDeleteColumn(column._id)}
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
                      EDIT COLUMN
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
        ) : (
          'The board does not have lists yet'
        )}
      </DndProvider>
    </Box>
  );
}

export default ColumnsList;
