import React from 'react';
import { Tag } from 'antd';

const STATUS_COLORS = {
  'Chưa bắt đầu': 'default',
  'Đang diễn ra': 'processing',
  'Đang xét duyệt': 'warning',
  'Chờ phê duyệt': 'warning',
  'Hoàn thành': 'success',
  'Hủy': 'error',
};

const TheTrangThai = ({ status }) => {
  const color = STATUS_COLORS[status] || 'default';
  return <Tag color={color} style={{ borderRadius: 4 }}>{status}</Tag>;
};

export default TheTrangThai;
