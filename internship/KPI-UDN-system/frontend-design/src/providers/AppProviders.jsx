import React from 'react';
import { AuthProvider } from '../contexts/AuthProvider';
import { ViolationProvider } from '../contexts/ViolationProvider';
import { PeriodProvider } from '../contexts/PeriodProvider';
import { TaskProvider } from '../contexts/TaskProvider';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ViolationProvider>
        <PeriodProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </PeriodProvider>
      </ViolationProvider>
    </AuthProvider>
  );
};

export default AppProviders;
