import { createTask, getTasks } from 'api/taskService';
import { IAddBoardForm, IItem, ITaskOutputData } from 'types/types';

export const addTask = async (
  e: React.MouseEvent,
  task: IItem,
  addTaskData: IAddBoardForm,
  token: string
) => {
  const columnId = e.currentTarget.id;
  await createTask(task.boardId, columnId, {
    title: addTaskData.title,
    order: 0, // TODO Надо придумать как порядок назначать
    description: addTaskData.description,
    userId: task.userId,
    users: [], // TODO Надо реализовать добавление связанных юзеров
  });
  const data: ITaskOutputData[] = await getTasks(task.boardId, columnId, token);
  return data;
};
