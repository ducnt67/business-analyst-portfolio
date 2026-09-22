import { useContext } from 'react';
import { PeriodContext } from '../contexts/PeriodContext';

export const usePeriods = () => useContext(PeriodContext);
export default usePeriods;
