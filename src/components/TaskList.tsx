import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IBoardColumnTasks, IItem, ITaskOutputData } from 'types/types';
import Task from './Task';
import { deleteTask, getTasks } from 'api/taskService';

function TaskList({ boardId, columnId, token, taskList, setTaskList }: IItem) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  }, []);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {isLoading
        ? 'Loading...'
        : taskList.length > 0
        ? [...taskList].map((task, i) => {
            return (
              <Task
                key={i}
                boardId={task.boardId}
                columnId={task.columnId}
                taskId={task._id}
                taskTitle={task.title}
                taskDescription={task.description}
                token={token}
                deleteItem={() => handleDeleteTask(task._id)}
              />
            );
          })
        : null}
    </Box>
  );
}

export default TaskList;
