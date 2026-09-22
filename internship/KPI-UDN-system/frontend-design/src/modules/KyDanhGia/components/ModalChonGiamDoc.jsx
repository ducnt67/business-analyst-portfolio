import React, { useState } from 'react';
import { Modal, Form, Select, Button, Table, Input } from 'antd';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;

const ModalChonGiamDoc = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  const tableData = [
    { key: '1', code: 'D2501550.130001', name: 'Trần Vĩnh An', department: 'FPE_Khoa Giáo dục thể chất' },
    { key: '2', code: 'D2501592.150037', name: 'Lê Thị Thiên An', department: 'G03.74.27_Ban Khoa học và Hợp tác Quốc tế' },
    { key: '3', code: '', name: 'Quảng Hòa An', department: 'G03.74.25_Ban Đào tạo và Đảm bảo chất lượng giáo dục' },
    { key: '4', code: '100100118001.190001', name: 'Cao Đức Anh', department: 'FPE_Khoa Giáo dục thể chất' },
    { key: '5', code: '', name: 'Phạm Trần Ngọc Anh', department: 'G03.74.29_Ban Công tác sinh viên, Quan hệ doanh nghiệp và Truyền thông' },
    { key: '6', code: 'D2501570.130080', name: 'Trần Nhật Anh', department: 'G03.74.18_Trung tâm Công nghệ thông tin và Học liệu số' },
    { key: '7', code: '', name: 'Nguyễn Thị Kim Ánh', department: 'VPDU_Văn phòng Đảng - Đoàn thể' },
  ];

  const columns = [
    { title: 'Mã cán bộ', dataIndex: 'code', key: 'code', width: '25%' },
    { title: 'Họ và tên', dataIndex: 'name', key: 'name', width: '30%' },
    { title: 'Phòng ban', dataIndex: 'department', key: 'department', width: '45%' },
  ];

  const rowSelection = {
    type: 'radio',
    selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
    onChange: (selectedRowKeys) => {
      setSelectedRowKey(selectedRowKeys[0]);
    },
  };

  const handleOk = () => {
    onSubmit(selectedRowKey);
    setSelectedRowKey(null);
  };

  return (
    <Modal
      title={
        <div style={{ background: '#0050a0', color: '#fff', padding: '12px 16px', margin: '-20px -24px 20px -24px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>CHỌN GIÁM ĐỐC DUYỆT</span>
          <CloseOutlined style={{ cursor: 'pointer' }} onClick={onCancel} />
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={700}
      closable={false}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button onClick={onCancel} icon={<CloseOutlined />}>Đóng</Button>
          <Button type="primary" onClick={handleOk} disabled={!selectedRowKey} icon={<UserOutlined />} style={{ background: '#0050a0' }}>
            Trình giám đốc
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Phòng ban" style={{ marginBottom: 12 }}>
          <Select defaultValue="all">
            <Option value="all">Tất cả phòng ban</Option>
            <Option value="fpe">FPE_Khoa Giáo dục thể chất</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Tìm kiếm cán bộ" style={{ marginBottom: 20 }}>
          <Search placeholder="Nhập họ tên hoặc mã cán bộ..." enterButton style={{ width: '100%' }} />
        </Form.Item>

        <div style={{ border: '1px solid #f0f0f0', borderRadius: 8 }}>
          <Table 
            rowSelection={rowSelection}
            columns={columns} 
            dataSource={tableData} 
            pagination={false}
            size="small"
            scroll={{ y: 240 }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default ModalChonGiamDoc;
