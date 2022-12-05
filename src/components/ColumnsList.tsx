import { Box, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import { useAppSelector } from 'store/hook';
import { IBoardColumns, IItem } from 'types/types';
import Column from './Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import '../utils/i18n.ts';

const ColumnsList: React.FC<IItem> = ({ token }: IItem) => {
  const columns: IBoardColumns[] = useAppSelector((state) => state.columns);
  const isLoading = useAppSelector((state) => state.loading.isLoading);
  const mediaTrigger = useMediaQuery('(min-width: 800px)');

  const boxStyles = mediaTrigger
    ? { display: 'flex', gap: '10px' }
    : { display: 'flex', gap: '10px', flexDirection: 'column' };

  const { t } = useTranslation();

  const isMobile = window.innerWidth < 600;

  useEffect(() => {}, [columns]);

  return (
    <Box sx={boxStyles}>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        {isLoading ? (
          <CircularProgress />
        ) : columns.length > 0 ? (
          [...columns].map((column) => {
            return (
              <Column
                key={`column${column._id}`}
                boardId={column.boardId}
                columnId={column._id}
                columnTitle={column.title}
                token={token}
              />
            );
          })
        ) : (
          t('notHaveLists')
        )}
      </DndProvider>
    </Box>
  );
};

export default ColumnsList;
