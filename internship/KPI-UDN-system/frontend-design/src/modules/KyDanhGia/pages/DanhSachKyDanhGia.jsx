import React, { useState } from 'react';
import { Button, Space, Tooltip, Modal, message, Row, Col, Input, Select } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import ModalKyDanhGia from '../components/ModalKyDanhGia';
import { useNavigate } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';
import DanhSachKyChung from '../../../components/common/DanhSachKyChung';

const { Search } = Input;
const { Option } = Select;

const DanhSachKyDanhGia = () => {
  const navigate = useNavigate();
  const { periods, deletePeriod } = usePeriods();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleAdd = () => {
    setEditingData(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingData(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    if (record.staffs.length > 0 || record.leaders.length > 0) {
      Modal.error({
        title: 'Không thể xóa kỳ đánh giá',
        content: 'Kỳ đánh giá này đã được thêm đối tượng, không thể xóa. Vui lòng sử dụng tính năng Hủy kỳ nếu cần.',
      });
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Kỳ đánh giá "${record.name}" sẽ bị xóa. Bạn có chắc chắn không?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        deletePeriod(record.id);
        message.success('Đã xóa kỳ đánh giá thành công!');
      }
    });
  };

  const filteredData = periods.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) || 
                        item.id.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const headerActions = (
    <Row gutter={16}>
      <Col span={8}>
        <Search 
          placeholder="Tìm kiếm..." 
          allowClear 
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </Col>
      <Col span={6}>
        <Select value={filterStatus} onChange={setFilterStatus} style={{ width: '100%' }}>
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="Chưa bắt đầu">Chưa bắt đầu</Option>
          <Option value="Đang diễn ra">Đang diễn ra</Option>
          <Option value="Đang xét duyệt">Đang xét duyệt</Option>
          <Option value="Chờ phê duyệt">Chờ phê duyệt</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Hủy">Hủy</Option>
        </Select>
      </Col>
      <Col span={4}>
        <Button icon={<ReloadOutlined />} onClick={() => {setSearchText(''); setFilterStatus('all');}}>Đặt lại</Button>
      </Col>
      <Col span={6} style={{ textAlign: 'right' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mới
        </Button>
      </Col>
    </Row>
  );

  return (
    <>
      <DanhSachKyChung
        title="Tra cứu Kỳ đánh giá KPI"
        data={filteredData}
        headerActions={headerActions}
        extraColumns={[{ title: 'Tiến độ', dataIndex: 'progress', key: 'progress' }]}
        actionRender={(_, record) => (
          <Space size="middle">
            <Tooltip title="Xem chi tiết">
              <Button type="text" icon={<EyeOutlined style={{ color: '#1890ff' }} />} onClick={() => navigate(`/ky-danh-gia/${record.id}`)} />
            </Tooltip>
            <Tooltip title="Cập nhật">
              <Button type="text" disabled={['Chờ phê duyệt', 'Hoàn thành', 'Hủy'].includes(record.status)} icon={<EditOutlined style={{ color: ['Chờ phê duyệt', 'Hoàn thành', 'Hủy'].includes(record.status) ? '#d9d9d9' : '#1890ff' }} />} onClick={() => handleEdit(record)} />
            </Tooltip>
            <Tooltip title="Xóa kỳ">
              <Button type="text" disabled={record.status !== 'Chưa bắt đầu'} icon={<DeleteOutlined style={{ color: record.status !== 'Chưa bắt đầu' ? '#d9d9d9' : '#ff4d4f' }} />} onClick={() => handleDelete(record)} />
            </Tooltip>
          </Space>
        )}
      />
      <ModalKyDanhGia visible={isModalVisible} onCancel={() => setIsModalVisible(false)} editingData={editingData} />
    </>
  );
};
export default DanhSachKyDanhGia;
