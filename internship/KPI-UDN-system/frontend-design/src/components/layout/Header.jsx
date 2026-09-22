import React from 'react';
import { Layout, Avatar, Dropdown, Modal } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const { Header } = Layout;
const { confirm } = Modal;

const AppHeader = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();

  const roleNames = {
    ADMIN: 'Quản trị viên',
    STAFF: 'Cán bộ / Giảng viên',
    LEADER: 'Lãnh đạo đơn vị',
    VICE_DIRECTOR: 'Phó Giám đốc',
    DIRECTOR: 'Giám đốc'
  };

  const handleLogout = () => {
    confirm({
      title: 'Xác nhận đăng xuất',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk() {
        logout();
      },
      onCancel() {
        // do nothing
      },
    });
  };

  const menuItems = [
    {
      key: 'info',
      disabled: true,
      label: (
        <div style={{ color: '#333' }}>
          <strong>{user?.fullName || 'Người dùng'}</strong>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Vai trò: {user?.role ? (roleNames[user.role] || user.role) : 'N/A'}
          </div>
        </div>
      )
    },
    { type: 'divider' },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Lấy chữ cái đầu của tên để làm Avatar
  const avatarLetter = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <Header
      style={{
        padding: '0 16px',
        background: '#0050a0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: () => setCollapsed(!collapsed),
          style: { fontSize: '18px', cursor: 'pointer', marginRight: '24px' }
        })}
        <h3 style={{ margin: 0, fontWeight: 500, fontSize: '16px', color: 'white' }}>
          HỆ THỐNG THÔNG TIN QUẢN LÝ MIS - ĐẠI HỌC ĐÀ NẴNG
        </h3>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
          <Avatar size="large" style={{ backgroundColor: '#fff', color: '#0050a0', cursor: 'pointer', fontWeight: 'bold' }}>
            {avatarLetter}
          </Avatar>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
