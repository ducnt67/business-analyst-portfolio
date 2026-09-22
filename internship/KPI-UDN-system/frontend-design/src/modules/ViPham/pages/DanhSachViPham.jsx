import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Modal, Tooltip, Input, Select, Row, Col, Statistic, Tag, message, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, UploadOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import ModalViPham from '../components/ModalViPham';
import { useViolations } from '../../../hooks/useViolations';
import { useAuth } from '../../../hooks/useAuth';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const DanhSachViPham = () => {
  const { user } = useAuth();
  const { violations, deleteViolation, mockDepartments, processViolation } = useViolations();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessModalVisible, setIsProcessModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [filterDept, setFilterDept] = useState('all');

  const isLeader = user?.role === 'LEADER';

  // Lọc dữ liệu theo quyền và bộ lọc
  const filteredData = violations.filter(item => {
    // Nếu là Lãnh đạo, chỉ thấy người trong khoa của mình
    if (isLeader && item.department !== user?.unit) {
      return false;
    }
    
    // Áp dụng bộ lọc
    const matchSearch = item.staffName.toLowerCase().includes(searchText.toLowerCase()) || 
                        item.staffId.toLowerCase().includes(searchText.toLowerCase());
    const matchDept = filterDept === 'all' || item.department === filterDept;
    
    return matchSearch && matchDept;
  });

  // Thống kê
  const total = filteredData.length;
  const pending = filteredData.filter(i => i.status === 'Chờ xác nhận').length;
  const draft = filteredData.filter(i => i.status === 'Lưu nháp xử lý').length;
  const confirmedViolation = filteredData.filter(i => i.status === 'Đã xác nhận - Có vi phạm').length;
  const confirmedNoViolation = filteredData.filter(i => i.status === 'Đã xác nhận - Không vi phạm').length;

  const handleAdd = () => {
    setEditingData(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingData(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa vi phạm',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa vi phạm của cán bộ <b>{record.staffName}</b> không?</p>
          <Input.TextArea placeholder="Nhập lý do xóa (bắt buộc)" id="deleteReason" rows={3} />
        </div>
      ),
      okText: 'Xác nhận xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const reason = document.getElementById('deleteReason')?.value;
        if (!reason) {
          message.error('Vui lòng nhập lý do xóa');
          return Promise.reject();
        }
        deleteViolation(record.id);
        message.success('Đã xóa bản ghi vi phạm!');
      }
    });
  };

  const handleProcess = (record) => {
    setEditingData(record);
    setIsProcessModalVisible(true);
  };

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', width: 60, align: 'center', render: (_, __, index) => index + 1 },
    { title: 'Mã CB', dataIndex: 'staffId', key: 'staffId', width: 100 },
    { title: 'Họ tên CBGV', dataIndex: 'staffName', key: 'staffName' },
    { title: 'Đơn vị', dataIndex: 'department', key: 'department', width: 200 },
    { title: 'Loại vi phạm', dataIndex: 'violationType', key: 'violationType' },
    { title: 'Lỗi vi phạm', dataIndex: 'errorType', key: 'errorType' },
    { title: 'Ngày vi phạm', dataIndex: 'date', key: 'date', width: 120 },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Chờ xác nhận') color = 'warning';
        if (status === 'Lưu nháp xử lý') color = 'processing';
        if (status.includes('Có vi phạm')) color = 'error';
        if (status.includes('Không vi phạm')) color = 'success';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { title: 'Kết luận', dataIndex: 'finalConclusion', key: 'finalConclusion' },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (_, record) => {
        const isConfirmed = record.status.includes('Đã xác nhận');
        
        if (isLeader) {
          return (
            <Tooltip title={isConfirmed ? 'Xem chi tiết' : 'Xử lý vi phạm'}>
              <Button type="primary" size="small" onClick={() => handleProcess(record)}>
                {isConfirmed ? 'Xem' : 'Xử lý'}
              </Button>
            </Tooltip>
          );
        }

        // TCCB view
        return (
          <Space size="small">
            <Tooltip title="Xem chi tiết">
              <Button type="text" icon={<FileTextOutlined style={{ color: '#1890ff' }} />} onClick={() => handleEdit(record)} />
            </Tooltip>
            {!isConfirmed && (
              <>
                <Tooltip title="Cập nhật">
                  <Button type="text" icon={<EditOutlined style={{ color: '#faad14' }} />} onClick={() => handleEdit(record)} />
                </Tooltip>
                <Tooltip title="Xóa">
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                </Tooltip>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>
          {isLeader ? 'Xử lý vi phạm KPI Đơn vị' : 'Quản lý vi phạm KPI'}
        </Title>
      </div>

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Tổng số" value={total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col span={5}>
          <Card size="small" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Chờ xác nhận" value={pending} valueStyle={{ color: '#faad14' }} prefix={<SyncOutlined spin />} />
          </Card>
        </Col>
        <Col span={5}>
          <Card size="small" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Lưu nháp" value={draft} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={5}>
          <Card size="small" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Có vi phạm" value={confirmedViolation} valueStyle={{ color: '#cf1322' }} prefix={<CloseCircleOutlined />} />
          </Card>
        </Col>
        <Col span={5}>
          <Card size="small" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Không vi phạm" value={confirmedNoViolation} valueStyle={{ color: '#3f8600' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} className="kpi-card" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 16 }}>
          <Space>
            {!isLeader && (
              <>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  Thêm mới
                </Button>
                <Button icon={<UploadOutlined />} onClick={() => setIsUploadModalVisible(true)}>
                  Nhập dữ liệu
                </Button>
              </>
            )}
            <Button icon={<DownloadOutlined />}>
              Xuất PDF (Có vi phạm)
            </Button>
          </Space>
          
          <Space wrap>
            <Select 
              value={filterDept} 
              onChange={setFilterDept}
              style={{ width: 250 }}
              disabled={isLeader} // Lãnh đạo chỉ xem khoa mình
            >
              <Option value="all">Tất cả đơn vị</Option>
              {mockDepartments.map(d => <Option key={d} value={d}>{d}</Option>)}
            </Select>
            <Search 
              placeholder="Tìm mã, họ tên CBGV..." 
              style={{ width: 250 }} 
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10, position: ['bottomCenter'], showTotal: (total) => `Tổng số ${total} bản ghi` }}
          bordered
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Modal Thêm/Sửa của TCCB */}
      <ModalViPham 
        visible={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        editingData={editingData}
      />

      {/* Modal Upload (Mock UI only) */}
      <Modal
        title="Nhập dữ liệu từ file"
        open={isUploadModalVisible}
        onCancel={() => setIsUploadModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsUploadModalVisible(false)}>Hủy</Button>,
          <Button key="submit" type="primary" onClick={() => {
            message.success('Đã tải lên dữ liệu (Mock)');
            setIsUploadModalVisible(false);
          }}>Xác nhận tải lên</Button>
        ]}
      >
        <div style={{ padding: '10px 0' }}>
          <div style={{ marginBottom: 16, color: '#666' }}>
            <p>Vui lòng tải <a href="#"><DownloadOutlined /> File mẫu Excel</a> và điền dữ liệu trước khi tải lên.</p>
          </div>
          <Upload.Dragger accept=".xlsx, .xls" multiple={false} action={() => false}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">Nhấp hoặc kéo thả file vào khu vực này để tải lên</p>
            <p className="ant-upload-hint">
              Chỉ hỗ trợ file Excel (.xlsx, .xls)
            </p>
          </Upload.Dragger>
        </div>
      </Modal>

      {/* Modal Xử lý của Lãnh đạo (UC01.07) */}
      <Modal
        title={
          <div style={{ background: '#0050a0', color: '#fff', padding: '12px 16px', margin: '-20px -24px 20px -24px', borderRadius: '8px 8px 0 0' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              XỬ LÝ VI PHẠM CBGV
            </span>
          </div>
        }
        open={isProcessModalVisible}
        onCancel={() => setIsProcessModalVisible(false)}
        footer={null}
        width={700}
        closable={true}
      >
        {editingData && (
          <div>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={12}><Text type="secondary">Cán bộ:</Text> <Text strong>{editingData.staffName} ({editingData.staffId})</Text></Col>
                <Col span={12}><Text type="secondary">Ngày vi phạm:</Text> <Text strong>{editingData.date}</Text></Col>
                <Col span={12}><Text type="secondary">Loại vi phạm:</Text> <Text strong>{editingData.violationType}</Text></Col>
                <Col span={12}><Text type="secondary">Lỗi vi phạm:</Text> <Text strong>{editingData.errorType}</Text></Col>
                <Col span={24}><Text type="secondary">Mô tả của TCCB:</Text> <Text>{editingData.description || 'Không có'}</Text></Col>
              </Row>
            </div>

            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 16 }}>
              <Title level={5}>Kết luận của Lãnh đạo đơn vị</Title>
              {editingData.status.includes('Đã xác nhận') ? (
                // Chế độ View (Đã xác nhận)
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Kết luận:</Text> <Tag color={editingData.finalConclusion === 'Có vi phạm' ? 'error' : 'success'} style={{ marginLeft: 8, fontSize: 14 }}>{editingData.finalConclusion}</Tag>
                  </div>
                  <div>
                    <Text type="secondary">Giải trình/Ghi chú:</Text>
                    <div style={{ padding: '8px 12px', background: '#fafafa', border: '1px solid #d9d9d9', borderRadius: 4, minHeight: 60, marginTop: 4 }}>
                      {editingData.explanation || 'Không có giải trình'}
                    </div>
                  </div>
                  <div style={{ marginTop: 24, textAlign: 'right' }}>
                    <Button onClick={() => setIsProcessModalVisible(false)}>Đóng</Button>
                  </div>
                </div>
              ) : (
                // Chế độ Edit
                <ProcessForm 
                  record={editingData} 
                  onClose={() => setIsProcessModalVisible(false)} 
                  onProcess={processViolation} 
                />
              )}
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

// Form Xử lý cho Lãnh đạo
const ProcessForm = ({ record, onClose, onProcess }) => {
  const [conclusion, setConclusion] = useState(record.finalConclusion || 'Có vi phạm');
  const [explanation, setExplanation] = useState(record.explanation || '');

  const handleSaveDraft = () => {
    onProcess(record.id, 'Lưu nháp xử lý', conclusion, explanation);
    message.success('Đã lưu nháp kết quả xử lý!');
    onClose();
  };

  const handleConfirm = () => {
    if (conclusion === 'Không vi phạm' && !explanation.trim()) {
      message.error('Vui lòng nhập giải trình khi kết luận Không vi phạm!');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận kết luận',
      content: `Bạn có chắc chắn xác nhận kết luận "${conclusion}" đối với CBGV ${record.staffName}? Sau khi xác nhận, thông tin không thể chỉnh sửa.`,
      okText: 'Xác nhận chính thức',
      onOk: () => {
        onProcess(record.id, `Đã xác nhận - ${conclusion}`, conclusion, explanation);
        message.success('Đã xác nhận vi phạm thành công!');
        onClose();
      }
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}><Text strong>Kết luận <span style={{color: 'red'}}>*</span></Text></div>
        <Select value={conclusion} onChange={setConclusion} style={{ width: '100%' }}>
          <Option value="Có vi phạm">Có vi phạm</Option>
          <Option value="Không vi phạm">Không vi phạm</Option>
        </Select>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}><Text strong>{conclusion === 'Không vi phạm' ? 'Giải trình (Bắt buộc)' : 'Ghi chú'}</Text></div>
        <Input.TextArea 
          rows={4} 
          value={explanation} 
          onChange={(e) => setExplanation(e.target.value)}
          placeholder={conclusion === 'Không vi phạm' ? 'Nhập lý do không vi phạm...' : 'Nhập ghi chú thêm (nếu có)'}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSaveDraft}>Lưu nháp</Button>
        <Button type="primary" onClick={handleConfirm}>Xác nhận</Button>
      </div>
    </div>
  )
}

export default DanhSachViPham;
