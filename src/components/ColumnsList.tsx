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
import React, { DragEventHandler, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setModal } from 'store/slices/authSlice';
import columnSlice from 'store/slices/columnSlice';
import { IBoardColumns, IItem } from 'types/types';
import Column from './Column';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { setLoading } from 'store/slices/loadingSlice';
import { useForm } from 'react-hook-form';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import '../utils/i18n.ts';

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
  const [dropColumn, setDropColumn] = useState<string>('');
  const mediaTrigger = useMediaQuery('(min-width: 800px)');

  const boxStyles = mediaTrigger
    ? { display: 'flex', gap: '10px' }
    : { display: 'flex', gap: '10px', flexDirection: 'column' };

  const { t } = useTranslation();

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

  const [, drop] = useDrop({
    accept: 'Our second type',
    drop: () => ({ name: dropColumn }),
  });

  const handleDrop = (id: string) => {
    setDropColumn(id);
  };

  const changeColumnOrder = (dragColumnID: string, dropColumnID: string) => {
    const newColumns = [...columns];
    const idArray: string[] = [];

    newColumns.map((column) => idArray.push(column._id));
    const dragIndex = idArray.indexOf(dragColumnID);
    const dropIndex = idArray.indexOf(dropColumnID);

    const element = newColumns.splice(dragIndex, 1)[0];
    newColumns.splice(dropIndex, 0, element);

    dispatch(columnSlice.actions.setColumns(newColumns));
  };

  const isMobile = window.innerWidth < 600;
  return (
    <Box ref={drop} sx={{ display: 'flex', gap: '10px' }}>
      {isLoading ? (
        <CircularProgress />
      ) : columns.length > 0 ? (
        [...columns].map((column) => {
          return (
            <div onDrop={() => handleDrop(column._id)} key={`div-column-${column._id}`}>
              <Column
                key={`column-${column._id}`}
                boardId={column.boardId}
                columnId={column._id}
                columnTitle={column.title}
                token={token}
                editItem={async () => handleClickEdit(column._id)}
                deleteItem={async () => handleClickDelete()}
                changeColumnOrder={changeColumnOrder}
              />
              <Dialog
                key={`deleteColumn${column._id}`}
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
                  <Button
                    variant="contained"
                    onClick={() => handleDeleteColumn(column._id)}
                    autoFocus
                  >
                    {t('delete')}
                  </Button>
                  <Button color="warning" variant="contained" autoFocus onClick={handleClose}>
                    {t('cancel')}
                  </Button>
                </DialogActions>
              </Dialog>

              <Modal
                key={`editColumn${column._id}`}
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
                    {t('confirmDeleteColumn')}
                  </DialogTitle>
                  <DialogContent sx={{ bgcolor: 'lightgray' }}>
                    <DialogContentText>{t('confirmDeleteColumnMessage')}</DialogContentText>
                  </DialogContent>
                  <DialogActions sx={{ bgcolor: 'lightgray' }}>
                    <Button
                      variant="contained"
                      onClick={() => handleDeleteColumn(column._id)}
                      autoFocus
                    >
                      {t('delete')}
                    </Button>
                    <Button color="warning" variant="contained" autoFocus onClick={handleClose}>
                      {t('cancel')}
                    </Button>
                  </DialogActions>
                </Dialog>

                <Modal
                  key={`editColumn${column._id}`}
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
                </Box>
              </Modal>
            </div>
          );
        })
      ) : (
        t('notHaveLists')
      )}
    </Box>
  );
}

export default ColumnsList;
