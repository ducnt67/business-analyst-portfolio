import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Tooltip, Typography, message, Modal, Descriptions, Input } from 'antd';
import { PlusOutlined, UserAddOutlined, DeleteOutlined, CloseOutlined, UserOutlined, WarningOutlined, StopOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import ModalThemLanhDao from '../components/ModalThemLanhDao';
import ModalThemNhanVien from '../components/ModalThemNhanVien';
import ModalChonGiamDoc from '../components/ModalChonGiamDoc';
import ModalThemNguoiDuyet from '../components/ModalThemNguoiDuyet';
import { usePeriods } from '../../../hooks/usePeriods';
import dayjs from 'dayjs';

const { Title } = Typography;

const ChiTietKyDanhGia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { periods, submitPeriod, cancelPeriod, removeStaffFromPeriod, removeLeaderFromPeriod } = usePeriods();
  
  const period = periods.find(p => p.id === id);

  const [isLeaderModalVisible, setIsLeaderModalVisible] = useState(false);
  const [isStaffModalVisible, setIsStaffModalVisible] = useState(false);
  const [isDirectorModalVisible, setIsDirectorModalVisible] = useState(false);
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isReviewerModalVisible, setIsReviewerModalVisible] = useState(false);
  const [currentReviewRecord, setCurrentReviewRecord] = useState(null);

  if (!period) {
    return <div>Không tìm thấy kỳ đánh giá</div>;
  }

  const isReadOnly = period.status === 'Chờ phê duyệt' || period.status === 'Hoàn thành' || period.status === 'Hủy';

  const handleCancelPeriod = () => {
    if (!cancelReason.trim()) {
      message.error('Vui lòng nhập lý do hủy kỳ đánh giá!');
      return;
    }
    cancelPeriod(period.id, cancelReason);
    message.success('Đã hủy kỳ đánh giá thành công!');
    setIsCancelModalVisible(false);
  };

  const handleSubmitDirector = () => {
    setIsWarningModalVisible(true);
  };

  const confirmSubmitDirector = () => {
    submitPeriod(period.id);
    message.success('Đã trình Giám đốc thành công!');
    setIsWarningModalVisible(false);
    setIsDirectorModalVisible(false);
  };

  const handleAssignReviewer = (record) => {
    setCurrentReviewRecord(record);
    setIsReviewerModalVisible(true);
  };

  const getStatusTag = (status) => {
    if (status === 'Chờ xét duyệt') return <Tag color="blue" style={{ borderRadius: 4 }}>{status}</Tag>;
    if (status === 'Chưa nộp' || status === 'Chưa đánh giá') return <Tag color="default" style={{ borderRadius: 4 }}>{status}</Tag>;
    return <Tag style={{ borderRadius: 4 }}>{status}</Tag>;
  };

  const leaderColumns = [
    { title: 'STT', key: 'stt', width: 60, align: 'center', render: (_, __, i) => i + 1 },
    { title: 'Mã cán bộ', dataIndex: 'leaderId', key: 'leaderId', sorter: (a, b) => a.leaderId.localeCompare(b.leaderId) },
    { title: 'Họ và tên', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Đơn vị', dataIndex: 'department', key: 'department' },
    { title: 'Chức vụ', dataIndex: 'title', key: 'title' },
    { title: 'Cấp phụ trách', dataIndex: 'managerLevel', key: 'managerLevel' },
    { title: 'Người phụ trách', dataIndex: 'managerId', key: 'managerId' },
    { title: 'Trạng thái đề xuất/quyết định', dataIndex: 'status', key: 'status', render: getStatusTag },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xóa khỏi kỳ">
            <Button type="text" danger disabled={isReadOnly} icon={<DeleteOutlined />} onClick={() => removeLeaderFromPeriod(period.id, record.leaderId)} />
          </Tooltip>
        </Space>
      ),
    }
  ];

  const staffColumns = [
    { title: 'STT', key: 'stt', width: 60, align: 'center', render: (_, __, i) => i + 1 },
    { title: 'Mã cán bộ', dataIndex: 'staffId', key: 'staffId', sorter: (a, b) => a.staffId.localeCompare(b.staffId) },
    { title: 'Họ và tên', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Đơn vị', dataIndex: 'department', key: 'department' },
    { title: 'Chức vụ', dataIndex: 'title', key: 'title' },
    { title: 'Người xét duyệt chính', dataIndex: 'reviewer', key: 'reviewer' },
    { title: 'Trạng thái phiếu', dataIndex: 'status', key: 'status', render: getStatusTag },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Gán người xét duyệt">
            <Button type="text" disabled={isReadOnly} icon={<UserAddOutlined style={{ color: isReadOnly ? '#d9d9d9' : '#0050a0' }} />} onClick={() => handleAssignReviewer(record)} />
          </Tooltip>
          <Tooltip title="Xóa khỏi kỳ">
            <Button type="text" disabled={isReadOnly} danger icon={<DeleteOutlined />} onClick={() => removeStaffFromPeriod(period.id, record.staffId)} />
          </Tooltip>
        </Space>
      ),
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/ky-danh-gia')} />
          <Title level={4} className="page-title" style={{ margin: 0 }}>
            CHI TIẾT KỲ ĐÁNH GIÁ: {period.name.toUpperCase()}
          </Title>
        </Space>
        <Space>
          {period.status !== 'Hủy' && period.status !== 'Chờ phê duyệt' && period.status !== 'Hoàn thành' && (
            <Button danger icon={<StopOutlined />} onClick={() => setIsCancelModalVisible(true)}>
              Hủy kỳ đánh giá
            </Button>
          )}
        </Space>
      </div>

      <Card bordered={false} style={{ marginBottom: 16 }} title="Thông tin cấu hình">
        <Descriptions column={2}>
          <Descriptions.Item label="Trạng thái"><Tag color="processing">{period.status}</Tag></Descriptions.Item>
          <Descriptions.Item label="Tiến độ xử lý">{period.progress}</Descriptions.Item>
          <Descriptions.Item label="Loại đánh giá">{period.evaluationType}</Descriptions.Item>
          <Descriptions.Item label="Phiếu đánh giá CBGV">{period.template}</Descriptions.Item>
          <Descriptions.Item label="Ngày bắt đầu">{dayjs(period.startDate).format('DD/MM/YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">{dayjs(period.endDate).format('DD/MM/YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Phạm vi áp dụng" span={2}>
            {period.departments?.map(d => <Tag key={d} style={{ marginBottom: 4 }}>{d}</Tag>)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <div className="kpi-card" style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <Space>
            <Button type="primary" disabled={isReadOnly} icon={<PlusOutlined />} onClick={() => setIsStaffModalVisible(true)} style={{ background: isReadOnly ? '#d9d9d9' : '#0050a0' }}>
              Thêm cán bộ giảng viên
            </Button>
            <Button type="primary" disabled={isReadOnly} icon={<UserAddOutlined />} onClick={() => setIsLeaderModalVisible(true)} style={{ background: isReadOnly ? '#d9d9d9' : '#0050a0' }}>
              Thêm lãnh đạo đơn vị
            </Button>
          </Space>
          
          <Space>
            <Button type="primary" disabled={isReadOnly} icon={<UserOutlined />} style={{ background: isReadOnly ? '#d9d9d9' : '#0050a0' }} onClick={handleSubmitDirector}>
              Trình giám đốc
            </Button>
          </Space>
        </div>

        <div style={{ marginBottom: 16 }}>
          <strong style={{ fontSize: 16 }}>Lãnh đạo đơn vị ({period.leaders?.length || 0})</strong>
        </div>
        <Table 
          rowKey="leaderId"
          columns={leaderColumns} 
          dataSource={period.leaders || []} 
          pagination={{ pageSize: 5 }}
          bordered
          size="middle"
          style={{ marginBottom: 32 }}
          locale={{ emptyText: 'Chưa có Lãnh đạo đơn vị nào trong kỳ' }}
        />

        <div style={{ marginBottom: 16 }}>
          <strong style={{ fontSize: 16 }}>Cán bộ giảng viên ({period.staffs?.length || 0})</strong>
        </div>
        <Table 
          rowKey="staffId"
          columns={staffColumns} 
          dataSource={period.staffs || []} 
          pagination={{ pageSize: 5 }}
          bordered
          size="middle"
          locale={{ emptyText: 'Chưa có Cán bộ giảng viên nào trong kỳ' }}
        />
      </div>

      <ModalThemLanhDao 
        visible={isLeaderModalVisible} 
        onCancel={() => setIsLeaderModalVisible(false)}
        periodId={period.id}
      />

      <ModalThemNhanVien 
        visible={isStaffModalVisible} 
        onCancel={() => setIsStaffModalVisible(false)}
        periodId={period.id}
      />

      <ModalChonGiamDoc
        visible={isDirectorModalVisible}
        onCancel={() => setIsDirectorModalVisible(false)}
        onSubmit={confirmSubmitDirector}
      />

      <Modal
        title={
          <div style={{ background: '#0050a0', color: '#fff', padding: '12px 16px', margin: '-20px -24px 20px -24px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>CẢNH BÁO TRÌNH GIÁM ĐỐC</span>
            <CloseOutlined style={{ cursor: 'pointer' }} onClick={() => setIsWarningModalVisible(false)} />
          </div>
        }
        open={isWarningModalVisible}
        onCancel={() => setIsWarningModalVisible(false)}
        width={700}
        closable={false}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <Button onClick={() => setIsWarningModalVisible(false)} icon={<CloseOutlined />}>Huỷ</Button>
            <Button type="primary" onClick={() => {
              setIsWarningModalVisible(false);
              setIsDirectorModalVisible(true);
            }} icon={<UserOutlined />} style={{ background: '#0050a0' }}>
              Tiếp tục trình
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0 24px 0', borderBottom: '1px solid #f0f0f0' }}>
          <WarningOutlined style={{ fontSize: 32, color: '#faad14', marginRight: 16 }} />
          <span style={{ fontSize: 16, color: '#555' }}>Hệ thống đang rà soát. Bạn có chắc chắn muốn trình Giám đốc phê duyệt kỳ đánh giá này không? Sau khi trình sẽ không thể thay đổi thông tin.</span>
        </div>
      </Modal>

      <Modal
        title="Xác nhận hủy kỳ đánh giá"
        open={isCancelModalVisible}
        onCancel={() => setIsCancelModalVisible(false)}
        onOk={handleCancelPeriod}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
      >
        <p>Kỳ đánh giá đã bị hủy sẽ không thể tiếp tục hoặc mở lại. Các dữ liệu đang xử lý sẽ bị khóa.</p>
        <Input.TextArea 
          rows={4} 
          placeholder="Nhập lý do hủy kỳ đánh giá (Bắt buộc)..." 
          value={cancelReason}
          onChange={e => setCancelReason(e.target.value)}
        />
      </Modal>

      <ModalThemNguoiDuyet
        visible={isReviewerModalVisible}
        onCancel={() => setIsReviewerModalVisible(false)}
        selectedRecord={currentReviewRecord}
        onSave={() => {
          message.success('Đã phân công người xét duyệt thành công!');
          setIsReviewerModalVisible(false);
        }}
      />
    </div>
  );
};

export default ChiTietKyDanhGia;
