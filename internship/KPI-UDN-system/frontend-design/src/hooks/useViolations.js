import { useContext } from 'react';
import { ViolationContext } from '../contexts/ViolationContext';

export const useViolations = () => useContext(ViolationContext);
export default useViolations;
