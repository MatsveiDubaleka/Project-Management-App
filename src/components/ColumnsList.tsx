import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { deleteColumn, getColumns } from 'api/columnService';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setModal } from 'store/slices/authSlice';
import columnSlice from 'store/slices/columnSlice';
import { IBoardColumns, IItem } from 'types/types';
import Column from './Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { setLoading } from 'store/slices/loadingSlice';

function ColumnsList({ boardId, token }: IItem): JSX.Element {
  const columns: IBoardColumns[] = useAppSelector((state) => state.columns);
  const isLoading = useAppSelector((state) => state.loading.isLoading);
  const modal: string = useAppSelector((store) => store.auth.modal);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleClickOpen = () => {
    dispatch(setModal('deleteColumn'));
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

  useEffect(() => {}, [columns]);

  return (
    <Box sx={{ display: 'flex', gap: '10px' }}>
      <DndProvider backend={HTML5Backend}>
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
                  deleteItem={async () => handleClickOpen()}
                />
                <Dialog
                  open={modal === 'deleteColumn' ? open : false}
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
