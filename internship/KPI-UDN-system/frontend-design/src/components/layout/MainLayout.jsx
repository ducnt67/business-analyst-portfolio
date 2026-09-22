import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppSidebar from './Sidebar';
import AppHeader from './Header';

const { Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <AppSidebar collapsed={collapsed} />
      <Layout style={{ display: 'flex', flexDirection: 'column' }}>
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            flex: 1,
            overflowY: 'auto',
            margin: '24px 16px',
            padding: 24,
            background: '#f0f2f5',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
