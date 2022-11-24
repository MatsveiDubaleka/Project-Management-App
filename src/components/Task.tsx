import styled from 'styled-components';
import React from 'react';
import { IItem } from 'types/types';
import DeleteIcon from '@mui/icons-material/Delete';

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

function Task({ taskTitle, taskDescription, deleteItem }: IItem) {
  return (
    <TaskItem>
      <TaskTitle>
        {taskTitle}
        <DeleteIcon onClick={deleteItem} />
      </TaskTitle>
      {taskDescription}
    </TaskItem>
  );
}

export default Task;
