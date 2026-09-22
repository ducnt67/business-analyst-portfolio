import React, { useState } from 'react';
import { ViolationContext } from './ViolationContext';
import { defaultViolations, mockStaff, mockDepartments, violationTypes } from '../mocks/violations';

export const ViolationProvider = ({ children }) => {
  const [violations, setViolations] = useState(defaultViolations);

  const addViolation = (data) => {
    const newId = `VP00${violations.length + 1}`;
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    setViolations([{
      ...data,
      id: newId,
      status: 'Chờ xác nhận',
      finalConclusion: '',
      explanation: '',
      createdBy: 'Ban TCCB',
      createdAt: formattedDate,
    }, ...violations]);
  };

  const updateViolation = (id, data) => {
    setViolations(violations.map(v => v.id === id ? { ...v, ...data } : v));
  };

  const deleteViolation = (id) => {
    setViolations(violations.filter(v => v.id !== id));
  };

  const processViolation = (id, status, conclusion, explanation) => {
    setViolations(violations.map(v => 
      v.id === id ? { 
        ...v, 
        status: status, 
        finalConclusion: conclusion, 
        explanation: explanation 
      } : v
    ));
  };

  return (
    <ViolationContext.Provider value={{
      violations,
      addViolation,
      updateViolation,
      deleteViolation,
      processViolation,
      mockStaff,
      mockDepartments,
      violationTypes
    }}>
      {children}
    </ViolationContext.Provider>
  );
};

export default ViolationProvider;
