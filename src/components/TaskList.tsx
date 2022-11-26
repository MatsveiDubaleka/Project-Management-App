import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { IBoardColumnTasks, IItem } from 'types/types';
import Task from './Task';
import { deleteTask, getTasks } from 'api/taskService';
import { useDrop } from 'react-dnd';
const TaskList: React.FC<IItem> = ({ boardId, columnId, token, taskList, setTaskList }) => {
  const handleDeleteTask = async (taskId: string) => {
    const answer = confirm('Are you sure?');
    if (answer) {
      await deleteTask(boardId, columnId, taskId);
    }
    const data: IBoardColumnTasks[] = await getTasks(boardId, columnId, token);
    setTaskList(data);
  };

  useEffect(() => {
    (async () => {
      const data = await getTasks(boardId, columnId, token);
      if (data && data.length > 0) {
        setTaskList(data);
      }
    })();
  }, [boardId, columnId, token, setTaskList]);

  const [, drop] = useDrop({
    accept: 'Our first type',
    drop: () => ({ name: columnId }),
  });

  const returnItemsForColumn = (columnId: string) => {
    const tasks = taskList.filter((task) => task.columnId === columnId);
    return [...tasks].map((task) => {
      return (
        <Task
          key={task._id}
          taskTitle={task.title}
          taskDescription={task.description}
          columnId={task.columnId}
          taskUsers={task.users}
          userId={task.userId}
          taskOrder={task.order}
          taskId={task._id}
        />
      );
    });
  };

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
      {taskList.length > 0 ? returnItemsForColumn(columnId) : null}
    </Box>
  );
};

export default TaskList;
