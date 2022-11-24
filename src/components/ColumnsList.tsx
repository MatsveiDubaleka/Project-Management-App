import { Box } from '@mui/material';
import { deleteColumn, getColumns } from 'api/columnService';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook';
import columnSlice from 'store/slices/columnSlice';
import { IBoardColumns, IItem } from 'types/types';
import Column from './Column';

function ColumnsList({ boardId, token }: IItem) {
  const columns: IBoardColumns[] = useAppSelector((state) => state.columns);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDeleteColumn = async (columnId: string) => {
    const answer = confirm('Are you sure?');
    if (answer) {
      await deleteColumn(boardId, columnId);
    }
    const data: IBoardColumns[] = await getColumns(boardId, token);
    dispatch(columnSlice.actions.setColumns(data));
  };

  useEffect(() => {}, [columns]);

  return (
    <Box sx={{ display: 'flex', gap: '10px' }}>
      {isLoading
        ? 'Loading...'
        : columns.length > 0
        ? [...columns].map((column, i) => {
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
        : 'The board does not have lists yet'}
    </Box>
  );
}

export default ColumnsList;
