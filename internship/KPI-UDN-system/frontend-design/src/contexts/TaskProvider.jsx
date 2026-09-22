import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { TaskContext } from './TaskContext';
import { defaultTasks } from '../mocks/tasks';

export const TaskProvider = ({ children }) => {
  const getInitialTasks = () => {
    const saved = localStorage.getItem('mock_tasks');
    if (saved) return JSON.parse(saved);
    return defaultTasks;
  };

  const [tasks, setTasks] = useState(getInitialTasks);

  useEffect(() => {
    localStorage.setItem('mock_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (data, user) => {
    setTasks(prev => {
      const newId = `T${dayjs().format('YYYY')}${String(prev.length + 1).padStart(3, '0')}`;
      return [{
        ...data,
        id: newId,
        createdBy: user.username,
        createdAt: dayjs().format('YYYY-MM-DD'),
        usedInPeriods: []
      }, ...prev];
    });
  };

  const updateTask = (id, data) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data, updatedAt: dayjs().format('YYYY-MM-DD') } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const markTaskUsedInPeriod = (taskId, periodId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && !t.usedInPeriods.includes(periodId)) {
        return { ...t, usedInPeriods: [...t.usedInPeriods, periodId] };
      }
      return t;
    }));
  };

  const unmarkTaskUsedInPeriod = (taskId, periodId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, usedInPeriods: t.usedInPeriods.filter(p => p !== periodId) };
      }
      return t;
    }));
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      markTaskUsedInPeriod,
      unmarkTaskUsedInPeriod
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;
