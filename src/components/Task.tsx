import styled from 'styled-components';
import React from 'react';
import { IItem } from 'types/types';
import DeleteIcon from '@mui/icons-material/Delete';
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

function Task({ taskTitle, taskDescription, userId, deleteItem }: IItem) {
  return (
    <TaskItem>
      <TaskTitle>{taskTitle}</TaskTitle>
      <TaskDescription>{taskDescription}</TaskDescription>
      <TaskFooter>
        <div>
          <ManageAccountsIcon />
          {userId}
        </div>
        <div>
          <EditIcon sx={{ fontSize: '1.25em' }} />
          <DeleteIcon sx={{ fontSize: '1.25em' }} onClick={deleteItem} />
        </div>
      </TaskFooter>
    </TaskItem>
  );
}

export default Task;
