import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IBoardColumns, IItem } from 'types/types';
import Task from './Task';
import { getTasks, updateTaskColumn } from 'api/taskService';
import { getAllUsers } from 'api/usersServices';
import { useDrop } from 'react-dnd';
import '../utils/i18n.ts';
import { useAppSelector } from 'store/hook';

const TaskList: React.FC<IItem> = ({ boardId, columnId, token, taskList, setTaskList }) => {
  const tasks: IBoardColumns[] = useAppSelector((state) => state.tasks);
  const [users, setUsers] = useState([]);

  const [, drop] = useDrop({
    accept: 'Our first type',
    drop: () => ({ name: columnId }),
  });

  const moveCardHandler = async (dragIndex: number, hoverIndex: number) => {
    const dragItem = taskList[dragIndex];

    if (dragItem) {
      setTaskList((prevState) => {
        const coppiedStateArray = [...prevState];
        const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragItem);

        coppiedStateArray.splice(dragIndex, 1, prevItem[0]);
        return coppiedStateArray;
      });

      await updateTaskColumn(boardId, columnId, dragItem._id, {
        title: dragItem.title,
        order: hoverIndex,
        description: dragItem.description,
        columnId: dragItem.columnId,
        userId: dragItem.userId,
        users: dragItem.users,
      });
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getTasks(boardId, columnId, token);
      if (data && data.length > 0) {
        const users = await getAllUsers(token);
        const sorted = data.sort((a: IItem, b: IItem) => b.order - a.order);
        sorted.reverse();
        setTaskList(sorted);
        setUsers((state) => {
          state = [...users];
          return state;
        });
      }
    })();
  }, [tasks]);

  return (
    <Box
      ref={drop}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        minHeight: '25vh',
      }}
    >
      {taskList.length > 0
        ? taskList.map((task, index: number) => {
            return (
              <Task
                key={`task${task._id}`}
                taskTitle={task.title}
                taskDescription={task.description}
                columnId={task.columnId}
                taskUsers={task.users}
                userId={task.userId}
                taskOrder={task.order}
                taskId={task._id}
                index={index}
                moveCardHandler={moveCardHandler}
              />
            );
          })
        : null}
    </Box>
  );
};

export default TaskList;
