import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const IndexRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/dang-nhap" replace />;

  const role = user.role;
  if (role === 'STAFF') return <Navigate to="/tu-danh-gia" replace />;
  if (role === 'LEADER') return <Navigate to="/duyet-cbgv" replace />;
  if (role === 'VICE_DIRECTOR') return <Navigate to="/danh-gia-lanh-dao" replace />;
  if (role === 'DIRECTOR') return <Navigate to="/duyet-tong-the" replace />;
  return <Navigate to="/trang-chu" replace />;
};

export default IndexRedirect;
