import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { PeriodContext } from './PeriodContext';
import { defaultPeriods, mockHighLevelStaff } from '../mocks/periods';

export const PeriodProvider = ({ children }) => {
  const getInitialPeriods = () => {
    const saved = localStorage.getItem('mock_periods_v8');
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultPeriods;
  };

  const [periods, setPeriods] = useState(getInitialPeriods);

  useEffect(() => {
    localStorage.setItem('mock_periods_v8', JSON.stringify(periods));
  }, [periods]);

  const addPeriod = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setPeriods(prev => {
          const newId = `K${dayjs().format('YYYY')}${prev.length + 1}`;
          
          let status = 'Chưa bắt đầu';
          const today = dayjs();
          const start = dayjs(data.startDate);
          const end = dayjs(data.endDate);
          
          if (today.isAfter(start) || today.isSame(start)) {
            status = 'Đang diễn ra';
          }
          if (today.isAfter(end)) {
            status = 'Đang xét duyệt';
          }

          const newPeriod = {
            ...data,
            id: newId,
            status: status,
            progress: 'Khởi tạo',
            createdBy: 'admin',
            createdAt: dayjs().format('YYYY-MM-DD'),
            staffs: [],
            leaders: []
          };
          
          resolve(newPeriod);
          return [newPeriod, ...prev];
        });
      }, 500);
    });
  };

  const updatePeriod = async (id, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setPeriods(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
        resolve(true);
      }, 500);
    });
  };

  const deletePeriod = async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setPeriods(prev => prev.filter(p => p.id !== id));
        resolve(true);
      }, 500);
    });
  };

  const cancelPeriod = async (id, reason) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setPeriods(prev => prev.map(p => p.id === id ? { ...p, status: 'Hủy', cancelReason: reason, canceledAt: dayjs().format('YYYY-MM-DD') } : p));
        resolve(true);
      }, 500);
    });
  };

  const submitPeriod = async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setPeriods(prev => prev.map(p => p.id === id ? { ...p, status: 'Chờ phê duyệt', progress: 'Chờ Giám đốc phê duyệt' } : p));
        resolve(true);
      }, 500);
    });
  };

  const addStaffToPeriod = (periodId, staffs) => {
    setPeriods(prev => prev.map(p => {
      if (p.id === periodId) {
        return { ...p, staffs: [...p.staffs, ...staffs] };
      }
      return p;
    }));
  };

  const addLeaderToPeriod = (periodId, leaders) => {
    setPeriods(prev => prev.map(p => {
      if (p.id === periodId) {
        return { ...p, leaders: [...p.leaders, ...leaders] };
      }
      return p;
    }));
  };

  const removeStaffFromPeriod = (periodId, staffId) => {
    setPeriods(prev => prev.map(p => {
      if (p.id === periodId) {
        return { ...p, staffs: p.staffs.filter(s => s.staffId !== staffId) };
      }
      return p;
    }));
  };
  
  const removeLeaderFromPeriod = (periodId, leaderId) => {
    setPeriods(prev => prev.map(p => {
      if (p.id === periodId) {
        return { ...p, leaders: p.leaders.filter(l => l.leaderId !== leaderId) };
      }
      return p;
    }));
  };

  const updateStaffAssessment = async (periodId, staffId, assessmentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setPeriods(prev => prev.map(p => {
          if (p.id === periodId) {
            return {
              ...p,
              staffs: p.staffs.map(s => {
                if (s.staffId === staffId) {
                  return { ...s, ...assessmentData };
                }
                return s;
              })
            };
          }
          return p;
        }));
        resolve(true);
      }, 500);
    });
  };

  const updateLeaderAssessment = (periodId, leaderId, assessmentData) => {
    setPeriods(prev => prev.map(p => {
      if (p.id === periodId) {
        return {
          ...p,
          leaders: p.leaders.map(l => {
            if (l.leaderId === leaderId) {
              return { ...l, ...assessmentData };
            }
            return l;
          })
        };
      }
      return p;
    }));
  };

  const updateDirectorStaffAssessment = (periodId, staffId, assessmentData) => {
    setPeriods(prev => prev.map(p => {
      if (p.id === periodId) {
        return {
          ...p,
          staffs: p.staffs.map(s => {
            if (s.staffId === staffId) {
              return { ...s, ...assessmentData };
            }
            return s;
          })
        };
      }
      return p;
    }));
  };

  const updateDirectorLeaderAssessment = (periodId, leaderId, assessmentData) => {
    setPeriods(prev => prev.map(p => {
      if (p.id === periodId) {
        return {
          ...p,
          leaders: p.leaders.map(l => {
            if (l.leaderId === leaderId) {
              return { ...l, ...assessmentData };
            }
            return l;
          })
        };
      }
      return p;
    }));
  };

  const completePeriod = async (periodId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setPeriods(prev => prev.map(p => p.id === periodId ? { ...p, status: 'Đã hoàn thành' } : p));
        resolve(true);
      }, 500);
    });
  };

  return (
    <PeriodContext.Provider value={{
      periods,
      addPeriod,
      updatePeriod,
      deletePeriod,
      cancelPeriod,
      submitPeriod,
      addStaffToPeriod,
      addLeaderToPeriod,
      removeStaffFromPeriod,
      removeLeaderFromPeriod,
      updateStaffAssessment,
      updateLeaderAssessment,
      updateDirectorStaffAssessment,
      updateDirectorLeaderAssessment,
      completePeriod,
      mockHighLevelStaff
    }}>
      {children}
    </PeriodContext.Provider>
  );
};

export default PeriodProvider;
