import React, { useState } from 'react';
import { Modal, Form, Select, Button, Table, Typography, message } from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { usePeriods } from '../../../hooks/usePeriods';

const { Option } = Select;
const { Text } = Typography;

const mockAllStaffs = [
  { staffId: 'CB002', department: 'Phòng Đào tạo', name: 'Trần Văn Bình', title: 'Chuyên viên' },
  { staffId: 'CB003', department: 'Phòng Kế hoạch Tài chính', name: 'Lê Thị Thu', title: 'Chuyên viên' },
  { staffId: 'CB004', department: 'Ban Tổ chức Cán bộ', name: 'Phạm Văn Đồng', title: 'Chuyên viên' },
  { staffId: 'CB005', department: 'Trung tâm Công nghệ thông tin và Học liệu số', name: 'Nguyễn Văn Nam', title: 'Chuyên viên' },
];

const mockReviewers = [
  { reviewerId: 'LD001', name: 'Nguyễn Văn Đạt', title: 'Giám đốc Trung tâm' },
  { reviewerId: 'LD002', name: 'Trần Thị Hà', title: 'Trưởng phòng Đào tạo' },
];

const ModalThemNhanVien = ({ visible, onCancel, periodId }) => {
  const [form] = Form.useForm();
  const { periods, addStaffToPeriod } = usePeriods();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const period = periods.find(p => p.id === periodId);

  // Filter out staffs that are already in the period
  const availableStaffs = mockAllStaffs.filter(s => !period?.staffs?.some(ps => ps.staffId === s.staffId));

  const handleOk = () => {
    form.validateFields().then(values => {
      if (selectedRows.length === 0) {
        message.error('Vui lòng chọn ít nhất 1 cán bộ!');
        return;
      }

      const staffsToAdd = selectedRows.map(row => ({
        staffId: row.staffId,
        name: row.name,
        department: row.department,
        title: row.title,
        reviewer: values.reviewerName, // Mock logic: store the reviewer name directly
        isMainReviewer: true,
        status: 'Chưa nộp'
      }));

      addStaffToPeriod(periodId, staffsToAdd);
      message.success(`Đã thêm ${staffsToAdd.length} cán bộ vào kỳ đánh giá!`);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      form.resetFields();
      onCancel();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const columns = [
    { title: 'STT', key: 'stt', width: 50, align: 'center', render: (_, __, i) => i + 1 },
    { title: 'Tên đơn vị', dataIndex: 'department', key: 'department', sorter: (a, b) => a.department.localeCompare(b.department) },
    { title: 'Mã cán bộ', dataIndex: 'staffId', key: 'staffId', sorter: (a, b) => a.staffId.localeCompare(b.staffId) },
    { title: 'Tên cán bộ', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Chức vụ', dataIndex: 'title', key: 'title' },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedRows(rows);
    },
  };

  return (
    <Modal
      title={
        <div style={{ background: '#0050a0', color: '#fff', padding: '12px 16px', margin: '-20px -24px 20px -24px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>THÊM CÁN BỘ GIẢNG VIÊN VÀO KỲ ĐÁNH GIÁ</span>
          <CloseOutlined style={{ cursor: 'pointer' }} onClick={onCancel} />
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      closable={false}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button onClick={onCancel} icon={<CloseOutlined />}>Đóng</Button>
          <Button type="primary" onClick={handleOk} icon={<SaveOutlined />}>Lưu lại</Button>
        </div>
      }
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} labelAlign="left">
        <Form.Item label="Cơ sở đào tạo:" style={{ marginBottom: 8 }}>
          <Text strong>Đại học Đà Nẵng</Text>
        </Form.Item>

        <Form.Item label="Kỳ đánh giá:" style={{ marginBottom: 16 }}>
          <Text strong>{period?.name}</Text>
        </Form.Item>

        <Form.Item label={<><span style={{ color: 'red', marginRight: 4 }}>*</span>Người xét duyệt:</>} style={{ marginBottom: 24 }}>
          <Form.Item name="reviewerName" rules={[{ required: true, message: 'Vui lòng chọn người xét duyệt!' }]} style={{ margin: 0 }}>
            <Select placeholder="Chọn người xét duyệt chính" style={{ width: 400 }} allowClear>
              {mockReviewers.map(r => (
                <Option key={r.reviewerId} value={r.name}>{r.name} - {r.title}</Option>
              ))}
            </Select>
          </Form.Item>
          <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>Tất cả cán bộ được chọn bên dưới sẽ được gán cho người xét duyệt này.</div>
        </Form.Item>

        <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ marginRight: 16, width: 100 }}>Lọc đơn vị</span>
            <Select placeholder="Tất cả đơn vị" style={{ width: 300 }} allowClear>
              <Option value="all">Tất cả</Option>
            </Select>
          </div>

          <Table 
            rowKey="staffId"
            rowSelection={{ type: 'checkbox', ...rowSelection }}
            columns={columns} 
            dataSource={availableStaffs} 
            pagination={false}
            size="small"
            scroll={{ y: 240 }}
            locale={{ emptyText: 'Không còn cán bộ nào để thêm' }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default ModalThemNhanVien;
