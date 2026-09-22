import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ProfileOutlined,
  FileTextOutlined,
  WarningOutlined,
  SolutionOutlined,
  UnorderedListOutlined,
  CheckSquareOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

import logoDhdn from '../../assets/logo_dhdn.webp';

const AppSidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role') || 'ADMIN';

    const groupLabelStyle = { 
      color: '#82b0e3', 
      fontWeight: '600', 
      fontSize: '12px', 
      letterSpacing: '0.05em' 
    };

    const staffItems = [
      {
        type: 'group',
        label: <span style={groupLabelStyle}>TÀI KHOẢN CÁ NHÂN</span>,
      children: [
        {
          key: 'kpi-group',
          icon: <BarChartOutlined />,
          label: 'KPI',
          children: [
            { key: '/cong-viec-ca-nhan', icon: <UnorderedListOutlined />, label: 'Công việc cá nhân' },
            { key: '/tu-danh-gia', icon: <SolutionOutlined />, label: 'Tự đánh giá cá nhân' },
          ],
        },
      ],
    }
  ];

  const adminItems = [
    {
      type: 'group',
      label: <span style={groupLabelStyle}>QUẢN LÝ ĐÁNH GIÁ</span>,
      children: [
        { key: '/trang-chu', icon: <DashboardOutlined />, label: 'Dashboard' },
        {
          key: 'sub1',
          icon: <ProfileOutlined />,
          label: 'Đợt đánh giá',
          children: [
            { key: '/ky-danh-gia', label: 'Quản lý kỳ đánh giá' },
          ],
        },
        { key: '/vi-pham', icon: <WarningOutlined />, label: 'Quản lý vi phạm' },
        { key: '/bao-cao', icon: <FileTextOutlined />, label: 'Báo cáo thống kê' },
      ],
    }
  ];

  const leaderItems = [
    {
      type: 'group',
      label: <span style={groupLabelStyle}>TÀI KHOẢN CÁ NHÂN</span>,
      children: [
        {
          key: 'kpi-group',
          icon: <BarChartOutlined />,
          label: 'KPI',
          children: [
            { key: '/ket-qua-lanh-dao', icon: <SolutionOutlined />, label: 'Kết quả đánh giá cá nhân' },
            { key: '/duyet-cbgv', icon: <CheckSquareOutlined />, label: 'Xét duyệt đánh giá CBGV' },
            { key: '/vi-pham', icon: <WarningOutlined />, label: 'Xử lý và xác nhận vi phạm CBGV' },
          ],
        },
      ],
    }
  ];

  const viceDirectorItems = [
    {
      type: 'group',
      label: <span style={groupLabelStyle}>TÀI KHOẢN CÁ NHÂN</span>,
      children: [
        {
          key: 'kpi-group',
          icon: <BarChartOutlined />,
          label: 'KPI',
          children: [
            { key: '/danh-gia-lanh-dao', icon: <CheckSquareOutlined />, label: 'Đánh giá Lãnh đạo phụ trách' },
          ],
        },
      ],
    }
  ];

  const directorItems = [
    {
      type: 'group',
      label: <span style={groupLabelStyle}>TÀI KHOẢN CÁ NHÂN</span>,
      children: [
        {
          key: 'kpi-group',
          icon: <BarChartOutlined />,
          label: 'KPI',
          children: [
            { key: '/duyet-tong-the', icon: <CheckSquareOutlined />, label: 'Xét duyệt tổng thể' },
          ],
        },
      ],
    },
    {
      type: 'group',
      label: <span style={groupLabelStyle}>BÁO CÁO</span>,
      children: [
        { key: '/bao-cao', icon: <FileTextOutlined />, label: 'Báo cáo thống kê' },
      ],
    }
  ];

  const items = role === 'STAFF' ? staffItems : role === 'LEADER' ? leaderItems : role === 'VICE_DIRECTOR' ? viceDirectorItems : role === 'DIRECTOR' ? directorItems : adminItems;

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={260} theme="dark" style={{ background: '#003b7a', boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)' }}>
      <div style={{ height: 64, margin: '16px 16px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <img src={logoDhdn} alt="Logo ĐHĐN" style={{ height: '36px', width: '36px', objectFit: 'contain' }} />
        {!collapsed && (
          <h2 style={{ color: 'white', margin: 0, fontSize: '18px', textAlign: 'center', fontWeight: '700', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
            MIS - UDN
          </h2>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[`/${location.pathname.split('/')[1]}`]}
        defaultOpenKeys={(role === 'STAFF' || role === 'LEADER' || role === 'VICE_DIRECTOR' || role === 'DIRECTOR') ? ['kpi-group'] : ['sub1']}
        style={{ background: '#003b7a', borderRight: 0, padding: '0 8px' }}
        items={items}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default AppSidebar;
