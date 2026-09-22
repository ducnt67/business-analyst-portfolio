import React from 'react';
import { Card, Table, Typography, Tag, Button, Space } from 'antd';
import { FormOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';
import { useAuth } from '../../../hooks/useAuth';
import dayjs from 'dayjs';

const { Title } = Typography;

const DanhSachTuDanhGia = () => {
  const navigate = useNavigate();
  const { periods } = usePeriods();
  const { user } = useAuth();

  // Filter periods where current user is assigned as staff
  const myPeriods = periods.filter(p => p.staffs.some(s => s.staffId === user?.username));

  const getMyStaffInfo = (period) => {
    return period.staffs.find(s => s.staffId === user?.username);
  };

  const columns = [
    {
      title: 'Tên kỳ đánh giá',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Loại đánh giá',
      dataIndex: 'evaluationType',
      key: 'evaluationType',
    },
    {
      title: 'Thời gian đánh giá',
      key: 'time',
      render: (_, record) => `${dayjs(record.startDate).format('DD/MM/YYYY')} - ${dayjs(record.endDate).format('DD/MM/YYYY')}`
    },
    {
      title: 'Trạng thái kỳ',
      dataIndex: 'status',
      key: 'periodStatus',
      align: 'center',
      render: (status) => {
        let color = 'default';
        if (status === 'Đang diễn ra') color = 'processing';
        if (status === 'Hoàn thành') color = 'success';
        if (status === 'Hủy') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Trạng thái phiếu',
      key: 'formStatus',
      align: 'center',
      render: (_, record) => {
        const staffInfo = getMyStaffInfo(record);
        const status = staffInfo?.status || 'Chưa nộp';
        let color = 'default';
        if (status === 'Nháp') color = 'processing';
        if (status === 'Đã nộp') color = 'blue';
        if (status === 'Đã duyệt') color = 'success';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        const staffInfo = getMyStaffInfo(record);
        const formStatus = staffInfo?.status || 'Chưa nộp';
        const isEditable = (formStatus === 'Chưa nộp' || formStatus === 'Nháp') && record.status !== 'Hủy' && record.status !== 'Hoàn thành';
        
        return (
          <Space size="middle">
            <Button 
              type={isEditable ? "primary" : "default"}
              icon={isEditable ? <FormOutlined /> : <EyeOutlined />}
              onClick={() => navigate(`/tu-danh-gia/${record.id}`)}
            >
              {isEditable ? 'Lập phiếu' : 'Xem phiếu'}
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>
          KỲ TỰ ĐÁNH GIÁ CÁ NHÂN
        </Title>
      </div>

      <Card bordered={false} className="kpi-card">
        <Table 
          columns={columns} 
          dataSource={myPeriods} 
          rowKey="id" 
          pagination={{ pageSize: 10, position: ['bottomCenter'], showSizeChanger: false }} 
          bordered
          size="middle"
          locale={{ emptyText: 'Bạn chưa được phân công vào kỳ đánh giá nào' }}
        />
      </Card>
    </div>
  );
};

export default DanhSachTuDanhGia;
