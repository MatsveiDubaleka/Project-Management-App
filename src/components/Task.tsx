import styled from 'styled-components';
import React, { useEffect } from 'react';
import { IItem } from 'types/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag } from 'react-dnd';
import { DragSourceMonitor } from 'react-dnd/dist/types';
import { updateTaskColumn } from 'api/taskService';
import { ITaskPutData } from '../types/types';
import { useAppDispatch } from 'store/hook';
import { setLoading } from 'store/slices/loadingSlice';
import EditIcon from '@mui/icons-material/Edit';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const TaskItem = styled.div`
  height: max-content;
  background-color: white;
  position: relative;
  border-radius: 5px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
  justify-content: space-between;
`;

const TaskTitle = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  color: black;
  background-color: rgb(191, 182, 179);
  padding: 0 5px;
`;

const TaskDescription = styled.p`
  display: flex;
  -webkit-box-pack: center;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  color: black;
  padding: 5px 5px;
  overflow-y: auto;
  word-break: break-all;
`;

const TaskFooter = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  color: black;
  font-size: 1em;
  border-top: 2px solid gray;
`;

const Task: React.FC<IItem> = ({
  taskTitle,
  taskDescription,
  editItem,
  deleteItem,
  columnId,
  boardId,
  userId,
  taskId,
  taskUsers,
  taskOrder,
}) => {
  const renderTaskColumn = async (newColumnId: string) => {
    dispatch(setLoading(true));

    const data: ITaskPutData = {
      title: taskTitle,
      order: taskOrder,
      description: taskDescription,
      columnId: newColumnId,
      userId: userId,
      users: taskUsers,
    };
    const response = await updateTaskColumn(boardId, columnId, taskId, data);
    console.log(response);

    dispatch(setLoading(false));
  };

  const dispatch = useAppDispatch();

  const [{ isDragging }, drag] = useDrag({
    type: 'Our first type',
    item: { name: taskTitle, type: 'Our first type' },
    end: (item, monitor: DragSourceMonitor) => {
      const dropResult: { name: string } = monitor.getDropResult();
      console.log(`Drop result`, dropResult);
      if (dropResult.name === columnId) {
        console.log('1 column', columnId);
      } else {
        console.log('2 column', dropResult.name);
        renderTaskColumn(dropResult.name);
      }
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <TaskItem className="movable-item" ref={drag} style={{ opacity }}>
      <TaskTitle>{taskTitle}</TaskTitle>
      <TaskDescription>{taskDescription}</TaskDescription>
      <TaskFooter>
        <div>
          <ManageAccountsIcon />
          {userId}
        </div>
        <div>
          <EditIcon id="editTask" sx={{ fontSize: '1.25em' }} onClick={editItem} />
          <DeleteIcon id="deleteTask" sx={{ fontSize: '1.25em' }} onClick={deleteItem} />
        </div>
      </TaskFooter>
    </TaskItem>
  );
};

export default Task;
