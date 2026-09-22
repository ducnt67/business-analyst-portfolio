import React, { useState } from 'react';
import { Modal, Form, Select, Button, Table, Typography, Space, message } from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { usePeriods } from '../../../hooks/usePeriods';

const { Option } = Select;
const { Text } = Typography;

const mockAllLeaders = [
  { leaderId: 'LD001', department: 'Phòng Đào tạo', name: 'Trần Thị Hà', title: 'Trưởng phòng' },
  { leaderId: 'LD002', department: 'Phòng Kế hoạch Tài chính', name: 'Lê Minh Khang', title: 'Trưởng phòng' },
  { leaderId: 'LD003', department: 'Ban Tổ chức Cán bộ', name: 'Nguyễn Thị Bích', title: 'Trưởng ban' },
  { leaderId: 'LD004', department: 'Trung tâm Công nghệ thông tin và Học liệu số', name: 'Nguyễn Văn Đạt', title: 'Giám đốc Trung tâm' },
];

const ModalThemLanhDao = ({ visible, onCancel, periodId }) => {
  const [form] = Form.useForm();
  const { periods, addLeaderToPeriod, mockHighLevelStaff } = usePeriods();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const period = periods.find(p => p.id === periodId);

  // Lọc ra các lãnh đạo chưa có trong kỳ
  const availableLeaders = mockAllLeaders.filter(l => !period?.leaders?.some(pl => pl.leaderId === l.leaderId));

  const handleOk = () => {
    form.validateFields().then(values => {
      if (selectedRows.length === 0) {
        message.error('Vui lòng chọn ít nhất 1 lãnh đạo đơn vị!');
        return;
      }

      const leadersToAdd = selectedRows.map(row => ({
        leaderId: row.leaderId,
        name: row.name,
        department: row.department,
        title: row.title,
        managerLevel: values.managerLevel, // VD: Phó Giám đốc
        managerId: values.managerId, // Tên người phụ trách (được gán trực tiếp)
        status: 'Chưa nộp'
      }));

      addLeaderToPeriod(periodId, leadersToAdd);
      message.success(`Đã thêm ${leadersToAdd.length} lãnh đạo đơn vị vào kỳ đánh giá!`);
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
    { title: 'Mã lãnh đạo', dataIndex: 'leaderId', key: 'leaderId', sorter: (a, b) => a.leaderId.localeCompare(b.leaderId) },
    { title: 'Họ và tên', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
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
          <span style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>THÊM LÃNH ĐẠO ĐƠN VỊ VÀO KỲ ĐÁNH GIÁ</span>
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

        <div style={{ display: 'flex', marginBottom: 24 }}>
          <div style={{ width: '20.83333333%', paddingTop: 5 }}>
            <span style={{ color: 'red' }}>*</span> Cấp phụ trách:
          </div>
          <div style={{ flex: 1 }}>
            <Space align="start">
              <Form.Item name="managerLevel" rules={[{ required: true, message: 'Vui lòng chọn cấp phụ trách!' }]} style={{ margin: 0 }}>
                <Select placeholder="Chọn Cấp phụ trách" style={{ width: 250 }} allowClear>
                  <Option value="Giám đốc">Giám đốc</Option>
                  <Option value="Phó Giám đốc">Phó Giám đốc</Option>
                </Select>
              </Form.Item>

              <Form.Item name="managerId" rules={[{ required: true, message: 'Vui lòng chọn người phụ trách!' }]} style={{ margin: 0 }}>
                <Select placeholder="Chọn Người phụ trách" style={{ width: 250 }} allowClear>
                  {mockHighLevelStaff?.directors?.map(d => (
                    <Option key={d.id} value={d.name}>{d.name} - {d.role}</Option>
                  ))}
                  {mockHighLevelStaff?.viceDirectors?.map(vd => (
                    <Option key={vd.id} value={vd.name}>{vd.name} - {vd.role}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Space>
            <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>Các lãnh đạo đơn vị được chọn bên dưới sẽ được gán cho người phụ trách này (Phó Giám đốc hoặc Giám đốc xét duyệt).</div>
          </div>
        </div>

        <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ marginRight: 16, width: 100 }}>Lọc đơn vị</span>
            <Select placeholder="Tất cả đơn vị" style={{ width: 300 }} allowClear>
              <Option value="all">Tất cả</Option>
            </Select>
          </div>

          <Table 
            rowKey="leaderId"
            rowSelection={{ type: 'checkbox', ...rowSelection }}
            columns={columns} 
            dataSource={availableLeaders} 
            pagination={false}
            size="small"
            scroll={{ y: 240 }}
            locale={{ emptyText: 'Không còn lãnh đạo nào để thêm' }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default ModalThemLanhDao;
