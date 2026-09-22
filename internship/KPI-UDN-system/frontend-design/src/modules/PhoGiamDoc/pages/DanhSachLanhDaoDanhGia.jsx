import React, { useState } from 'react';
import { Table, Tag, Space, Button, Input, Typography, Card, Breadcrumb, Alert } from 'antd';
import { SearchOutlined, FilterOutlined, FormOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';
import { useAuth } from '../../../hooks/useAuth';

const { Title, Text } = Typography;

const DanhSachLanhDaoDanhGia = () => {
  const navigate = useNavigate();
  const { periodId } = useParams();
  const [searchText, setSearchText] = useState('');
  const { periods, mockHighLevelStaff } = usePeriods();
  const { user } = useAuth();

  const currentPeriod = periods.find(p => p.id === periodId);

  if (!currentPeriod) {
    return <Alert message="Không tìm thấy thông tin kỳ đánh giá" type="error" />;
  }

  // Find this vice director's ID from mockHighLevelStaff
  const viceDirector = mockHighLevelStaff?.viceDirectors?.find(vd => vd.name === user?.fullName);
  const managerId = viceDirector ? viceDirector.id : 'PGD001';

  // Lấy các lãnh đạo do Phó Giám đốc này quản lý
  const myLeaders = currentPeriod.leaders?.filter(l => l.managerId === managerId) || [];

  const columns = [
    {
      title: 'Mã LĐ',
      dataIndex: 'leaderId',
      key: 'leaderId',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Đơn vị / Chức vụ',
      key: 'unit',
      render: (_, record) => (
        <div>
          <div>{record.department}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.title}</Text>
        </div>
      ),
    },
    {
      title: 'Tình trạng xử lý',
      key: 'status',
      render: (_, record) => {
        let color = 'default';
        let text = 'Chưa nộp';

        if (record.directorRating) {
          color = 'success';
          text = 'Giám đốc đã duyệt';
        } else if (record.viceDirectorRating) {
          color = 'processing';
          text = 'Đã đánh giá';
        } else if (record.status === 'Hoàn tất' || record.status === 'Đã nộp') {
           color = 'warning';
           text = 'Chờ đánh giá';
        } else {
           color = 'default';
           text = record.status || 'Chưa nộp';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Mức xếp loại (Đề xuất)',
      key: 'result',
      render: (_, record) => record.viceDirectorRating ? <Text strong>{record.viceDirectorRating}</Text> : <Text type="secondary">Chưa có</Text>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => {
        const hasRated = !!record.viceDirectorRating;
        const isDirectorRated = !!record.directorRating;
        
        return (
          <Space size="middle">
            <Button 
              type="primary" 
              icon={<FormOutlined />} 
              onClick={() => navigate(`/danh-gia-lanh-dao/${periodId}/leader/${record.leaderId}`)}
            >
              {hasRated || isDirectorRated ? 'Xem chi tiết' : 'Đánh giá'}
            </Button>
          </Space>
        )
      },
    },
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '16px' }} items={[
        { title: <a onClick={() => navigate('/danh-gia-lanh-dao')}>Danh sách kỳ đánh giá</a> },
        { title: 'Danh sách Lãnh đạo phụ trách' },
      ]} />

      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<LeftOutlined />} onClick={() => navigate('/danh-gia-lanh-dao')} />
          <div>
            <Title level={4} className="page-title" style={{ margin: 0 }}>
              DANH SÁCH LÃNH ĐẠO ĐƠN VỊ PHỤ TRÁCH
            </Title>
            <Text type="secondary">Kỳ đánh giá: {currentPeriod.name}</Text>
          </div>
        </Space>
      </div>

      <Card bordered={false} className="kpi-card">
        <div style={{ marginBottom: 16 }}>
          <Space size="middle" style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Input 
              placeholder="Tìm kiếm theo mã, tên lãnh đạo..." 
              prefix={<SearchOutlined />} 
              style={{ width: 300 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button type="default" icon={<FilterOutlined />}>Lọc</Button>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={myLeaders} 
          rowKey="leaderId"
          pagination={{ pageSize: 10, position: ['bottomCenter'], showSizeChanger: false }}
          bordered
          size="middle"
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      </Card>
    </div>
  );
};

export default DanhSachLanhDaoDanhGia;
