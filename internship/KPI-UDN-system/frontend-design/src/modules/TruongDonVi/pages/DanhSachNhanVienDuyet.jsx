import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Tooltip, Typography, Breadcrumb, Input, Alert } from 'antd';
import { EyeOutlined, CheckSquareOutlined, ArrowLeftOutlined, SearchOutlined, ProfileOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';
import { useAuth } from '../../../hooks/useAuth';

const { Title } = Typography;

const DanhSachNhanVienDuyet = () => {
  const navigate = useNavigate();
  const { periodId } = useParams();
  const { periods } = usePeriods();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');

  const currentPeriod = periods.find(p => p.id === periodId);

  if (!currentPeriod) {
    return <Alert message="Không tìm thấy kỳ đánh giá" type="error" />;
  }

  // Lấy các nhân viên mà leader này phụ trách
  const myStaffs = currentPeriod.staffs.filter(s => s.reviewer === user?.fullName);

  const filteredData = myStaffs.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) || 
    item.staffId.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBack = () => {
    navigate('/duyet-cbgv');
  };

  const handleViewSummary = () => {
    navigate(`/duyet-cbgv/${periodId}/summary`);
  };

  const handleApproveStaff = (record) => {
    navigate(`/duyet-cbgv/${periodId}/staff/${record.staffId}`);
  };

  const columns = [
    {
      title: 'Mã CB',
      dataIndex: 'staffId',
      key: 'staffId',
      width: 100,
      render: text => <strong>{text}</strong>
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Chức danh',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Cá nhân tự đánh giá',
      dataIndex: 'selfAssessmentLevel',
      key: 'selfAssessmentLevel',
      render: (rating) => (
        <span style={{ color: !rating ? '#999' : 'inherit', fontWeight: rating ? 'bold' : 'normal' }}>
          {rating || 'Chưa có'}
        </span>
      )
    },
    {
      title: 'Kết quả xét duyệt',
      dataIndex: 'leaderAssessmentLevel',
      key: 'leaderAssessmentLevel',
      render: (rating) => (
        <span style={{ fontWeight: rating ? 'bold' : 'normal', color: rating ? '#1890ff' : '#999' }}>
          {rating || 'Chưa duyệt'}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Đã duyệt') color = 'success';
        if (status === 'Đã nộp') color = 'processing';
        if (status === 'Chưa nộp' || status === 'Nháp') color = 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={record.status === 'Đã duyệt' ? "Xem lại hồ sơ" : "Xét duyệt"}>
            <Button 
              type={record.status === 'Đã duyệt' ? 'default' : 'primary'}
              icon={record.status === 'Đã duyệt' ? <EyeOutlined /> : <CheckSquareOutlined />} 
              onClick={() => handleApproveStaff(record)}
              disabled={record.status === 'Chưa nộp' || record.status === 'Nháp'}
            >
              {record.status === 'Đã duyệt' ? 'Xem' : 'Duyệt'}
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <a onClick={handleBack} style={{ display: 'flex', alignItems: 'center' }}>
            <ArrowLeftOutlined style={{ marginRight: 8 }} />
            Danh sách kỳ xét duyệt
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Danh sách Cán bộ - {currentPeriod.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: 16 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>
          DANH SÁCH CÁN BỘ THUỘC PHẠM VI XÉT DUYỆT
        </Title>
      </div>

      <Card bordered={false} className="kpi-card">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Space>
            <Input 
              placeholder="Tìm kiếm theo Mã/Tên CB..." 
              prefix={<SearchOutlined />} 
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Button type="primary" icon={<ProfileOutlined />} onClick={handleViewSummary}>
              Bảng tổng hợp kết quả
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="staffId"
          pagination={{ pageSize: 10, position: ['bottomCenter'], showSizeChanger: false }}
          bordered
          size="middle"
          locale={{ emptyText: 'Không có nhân viên nào' }}
        />
      </Card>
    </div>
  );
};

export default DanhSachNhanVienDuyet;
