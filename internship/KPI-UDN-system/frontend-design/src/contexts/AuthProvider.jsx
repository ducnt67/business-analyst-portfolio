import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/dang-nhap');
  }, [navigate]);

  useEffect(() => {
    // Check auth on mount
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userInfo = localStorage.getItem('userInfo');

    if (token && role && userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (e) {
        console.error('Failed to parse user info', e);
        handleLogout();
      }
    }
    setLoading(false);
  }, [handleLogout]);

  const login = async (username, password) => {
    return new Promise((resolve, reject) => {
      // Mock API call to UDN Workspace Auth
      setTimeout(() => {
        let role = '';
        let userInfo = { username, fullName: '' };

        if (username === 'admin' && password === 'admin') {
          role = 'ADMIN';
          userInfo.fullName = 'Nguyễn Trọng Ban';
        } else if ((username === 'leader' && password === 'leader') || (username === 'ld01' && password === 'ld01')) {
          role = 'LEADER';
          userInfo.fullName = 'Nguyễn Tiến Đức';
          userInfo.unit = 'Trung tâm Công nghệ thông tin và Học liệu số';
        } else if (username === 'pgd' && password === 'pgd') {
          role = 'VICE_DIRECTOR';
          userInfo.fullName = 'Trần Thanh Hải';
        } else if (username === 'cbgv' && password === 'cbgv') {
          role = 'STAFF';
          userInfo.fullName = 'Lê Hữu Lập';
          userInfo.unit = 'Trung tâm Công nghệ thông tin và Học liệu số';
        } else if (username === 'gd' && password === 'gd') {
          role = 'DIRECTOR';
          userInfo.fullName = 'Lê Quang Sơn';
        } else {
          return reject(new Error('Thông tin đăng nhập không chính xác'));
        }

        userInfo.role = role;
        
        // Cập nhật localStorage
        localStorage.setItem('token', `mock-token-${role}`);
        localStorage.setItem('role', role);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        setUser(userInfo);
        resolve(userInfo);
      }, 800);
    });
  };

  const value = {
    user,
    loading,
    login,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthProvider;
