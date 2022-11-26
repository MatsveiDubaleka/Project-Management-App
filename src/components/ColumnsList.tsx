import { Box, CircularProgress } from '@mui/material';
import { deleteColumn, getColumns } from 'api/columnService';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook';
import columnSlice from 'store/slices/columnSlice';
import { IBoardColumns, IItem } from 'types/types';
import Column from './Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { setLoading } from 'store/slices/loadingSlice';

function ColumnsList({ boardId, token }: IItem): JSX.Element {
  const columns: IBoardColumns[] = useAppSelector((state) => state.columns);
  const isLoading = useAppSelector((state) => state.loading.isLoading);
  const dispatch = useAppDispatch();

  const handleDeleteColumn = async (columnId: string) => {
    dispatch(setLoading(true));
    const answer = confirm('Are you sure?');
    if (answer) {
      await deleteColumn(boardId, columnId);
    }
    const data: IBoardColumns[] = await getColumns(boardId, token);
    dispatch(columnSlice.actions.setColumns(data));
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
              <Column
                key={i}
                boardId={column.boardId}
                columnId={column._id}
                columnTitle={column.title}
                token={token}
                deleteItem={() => handleDeleteColumn(column._id)}
              />
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
