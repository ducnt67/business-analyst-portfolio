import React from 'react';
import { Card, Table, Button, Typography, Breadcrumb, Space, Dropdown, message, Alert } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, FileWordOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';
import { useAuth } from '../../../hooks/useAuth';

const { Title } = Typography;

const TrangTongHopDanhGia = () => {
  const navigate = useNavigate();
  const { periodId } = useParams();
  const { periods } = usePeriods();
  const { user } = useAuth();

  const currentPeriod = periods.find(p => p.id === periodId);

  if (!currentPeriod) {
    return <Alert message="Không tìm thấy thông tin kỳ đánh giá" type="error" />;
  }

  // Filter staffs belonging to this leader
  const safeStaffs = currentPeriod.staffs || [];
  const myStaffs = safeStaffs.filter(s => s.reviewer === user?.fullName);
  const totalApproved = myStaffs.filter(s => s.status === 'Đã duyệt').length;

  const handleBack = () => {
    navigate(`/duyet-cbgv/${periodId}`);
  };

  const handleExport = (format) => {
    message.success(`Đang xuất file bảng tổng hợp định dạng ${format.toUpperCase()}...`);
  };

  const exportMenuItems = [
    {
      key: 'word',
      icon: <FileWordOutlined style={{ color: '#1890ff' }} />,
      label: 'Xuất ra Word',
      onClick: () => handleExport('word')
    },
    {
      key: 'pdf',
      icon: <FilePdfOutlined style={{ color: '#f5222d' }} />,
      label: 'Xuất ra PDF',
      onClick: () => handleExport('pdf')
    }
  ];

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: 'Mã CB',
      dataIndex: 'staffId',
      key: 'staffId',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
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
      render: (rating) => rating || '-'
    },
    {
      title: 'Lãnh đạo đơn vị xét duyệt',
      dataIndex: 'leaderAssessmentLevel',
      key: 'leaderAssessmentLevel',
      render: (rating) => (
        <span style={{ fontWeight: 'bold' }}>{rating || 'Chưa duyệt'}</span>
      )
    },
    {
      title: 'Hội đồng thống nhất',
      dataIndex: 'directorAssessmentLevel',
      key: 'directorAssessmentLevel',
      render: (rating) => rating || '-'
    },
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <a onClick={() => navigate('/duyet-cbgv')} style={{ display: 'flex', alignItems: 'center' }}>
            <ArrowLeftOutlined style={{ marginRight: 8 }} />
            Danh sách kỳ xét duyệt
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a onClick={handleBack}>
            Danh sách Cán bộ
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Bảng tổng hợp</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: 16 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>
          BẢNG TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ
        </Title>
      </div>

      <Card bordered={false} className="kpi-card">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Space>
            <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
              <Button type="primary" icon={<DownloadOutlined />}>
                Xuất dữ liệu
              </Button>
            </Dropdown>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={myStaffs}
          rowKey="staffId"
          pagination={false}
          bordered
          size="middle"
          locale={{ emptyText: 'Không có dữ liệu' }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5} align="right">
                  <strong>Tiến độ Lãnh đạo xét duyệt:</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={2}>
                  <strong style={{ color: totalApproved === myStaffs.length && myStaffs.length > 0 ? '#52c41a' : '#1890ff' }}>
                    {totalApproved} / {myStaffs.length} ({myStaffs.length > 0 ? Math.round((totalApproved / myStaffs.length) * 100) : 0}%)
                  </strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  );
};

export default TrangTongHopDanhGia;
