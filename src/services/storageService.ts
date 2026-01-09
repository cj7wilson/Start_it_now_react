import AsyncStorage from '@react-native-async-storage/async-storage';
import { logService } from './logService';

const TASKS_KEY = 'tasks';

export interface Task {
  id: string;
  title: string;
  time: string;
  status: string;
  icon: string;
  notificationId?: string;
}

export const getTasks = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    logService.error('Failed to fetch tasks.', e);
    return [];
  }
};

export const saveTask = async (task: Task): Promise<void> => {
  try {
    const existingTasks = await getTasks();
    const newTasks = [...existingTasks, task];
    const jsonValue = JSON.stringify(newTasks);
    await AsyncStorage.setItem(TASKS_KEY, jsonValue);
  } catch (e) {
    logService.error('Failed to save task.', e);
  }
};

export const updateTask = async (updatedTask: Task): Promise<void> => {
    try {
      const existingTasks = await getTasks();
      const newTasks = existingTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      );
      const jsonValue = JSON.stringify(newTasks);
      await AsyncStorage.setItem(TASKS_KEY, jsonValue);
    } catch (e) {
      logService.error('Failed to update task.', e);
    }
  };

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const existingTasks = await getTasks();
    const newTasks = existingTasks.filter(task => task.id !== taskId);
    const jsonValue = JSON.stringify(newTasks);
    await AsyncStorage.setItem(TASKS_KEY, jsonValue);
  } catch (e) {
    logService.error('Failed to delete task.', e);
  }
};
