import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import logoDhdn from '../../../assets/logo_dhdn.webp';

const { Title, Text } = Typography;

const TrangDangNhap = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();
  
  if (user) {
    // Already logged in, redirect
    return <Navigate to="/" replace />;
  }

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const userInfo = await login(values.username, values.password);
      message.success(`Đăng nhập thành công! Xin chào ${userInfo.fullName}`);
      
      // Chuyển hướng theo role
      if (userInfo.role === 'STAFF') {
        navigate('/tu-danh-gia');
      } else if (userInfo.role === 'LEADER') {
        navigate('/duyet-cbgv');
      } else if (userInfo.role === 'VICE_DIRECTOR') {
        navigate('/danh-gia-lanh-dao');
      } else if (userInfo.role === 'DIRECTOR') {
        navigate('/duyet-tong-the');
      } else {
        navigate('/trang-chu');
      }
    } catch (error) {
      message.error(error.message || 'Tài khoản hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0050a0 0%, #002244 100%)',
    }}>
      <Card
        className="kpi-card"
        style={{ width: 400, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src={logoDhdn} alt="Logo ĐHĐN" style={{ height: '64px', marginBottom: '16px' }} />
          <Title level={3} style={{ color: '#0050a0', margin: 0, fontWeight: 700 }}>MIS - UDN</Title>
          <Text type="secondary" style={{ fontSize: 14 }}>Hệ thống Đánh giá KPI - Đại học Đà Nẵng</Text>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản UDN Workspace!' }]}
            help="Gợi ý: admin, pgd, leader, cbgv, gd"
          >
            <Input prefix={<UserOutlined style={{ color: '#1890ff' }} />} placeholder="Tài khoản UDN Workspace" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%', height: 48, borderRadius: 8, fontSize: 16, fontWeight: 500 }} loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TrangDangNhap;
