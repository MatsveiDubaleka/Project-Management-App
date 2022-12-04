import { Button } from '@mui/material';
import styled from 'styled-components';
import React, { useState } from 'react';
import { IItem } from 'types/types';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskList from './TaskList';
import { useAppSelector } from 'store/hook';
import ModalWindow from './Modal';
import { LOCAL_STORAGE_DATA } from 'constants/registration';
import { useDrag, useDrop } from 'react-dnd';
import { DragSourceMonitor, DropTargetMonitor } from 'react-dnd/dist/types';
import { useTranslation } from 'react-i18next';
import '../utils/i18n.ts';

const ColumnItem = styled.div`
  cursor: pointer;
  height: max-content;
  width: 20vw;
  max-width: 300px;
  background-color: rgba(255, 255, 255, 0.13);
  position: relative;
  border-radius: 5px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 15px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
  justify-content: space-between;
  button {
    outline: none;
    border: none;
    width: 100%;
    background-color: #23a2f6;
    color: white;
    padding: 5px 0;
    font-size: 1em;
    line-height: 1em;
    font-weight: 500;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const ColumnTitle = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  background-color: rgb(66, 63, 62);
  padding: 0 5px;
`;

const Column: React.FC<IItem> = ({
  boardId,
  columnId,
  columnTitle,
  deleteItem,
  editItem,
  changeColumnOrder,
}) => {
  const userId = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA))._id;
  const token = useAppSelector((state) => state.auth.token);
  const [taskList, setTaskList] = useState([]);
  const [open, setOpen] = useState(false);
  const [clickedButtonId, setClickedButtonId] = useState('');
  const handleClose = () => setOpen(false);
  const handleOpen = (e: React.MouseEvent) => {
    setOpen(true);
    setClickedButtonId(e.currentTarget.id);
  };

  const { t } = useTranslation();

  const [{ isDragging }, drag] = useDrag({
    type: 'Our second type',
    end: (item, monitor: DragSourceMonitor) => {
      const dropResult: { name: string } = monitor.getDropResult();
      changeColumnOrder(columnId, dropResult.name);
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.7 : 1;

  return (
    <ColumnItem ref={drag} style={{ opacity }}>
      <ColumnTitle>
        {columnTitle}
        <div>
          <EditIcon id="editColumn" sx={{ fontSize: '1.25em' }} onClick={editItem} />
          <DeleteIcon id="deleteColumn" sx={{ fontSize: '1.25em' }} onClick={deleteItem} />
        </div>
      </ColumnTitle>
      <TaskList
        boardId={boardId}
        columnId={columnId}
        token={token}
        taskList={taskList}
        setTaskList={setTaskList}
      />
      <Button id={columnId} onClick={(e) => handleOpen(e)}>
        <AddIcon />
        {t('addTask')}
      </Button>
      <ModalWindow
        open={open}
        boardId={boardId}
        columnId={clickedButtonId}
        handleClose={handleClose}
        setTaskList={setTaskList}
        token={token}
        userId={userId}
      />
    </ColumnItem>
  );
};

export default Column;
