import React, { useEffect } from 'react';
import { Modal, Form, Select, Button, Typography, Space } from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

const ModalThemNguoiDuyet = ({ visible, onCancel, onSave, selectedRecord }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && selectedRecord) {
      form.resetFields();
    }
  }, [visible, selectedRecord, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      onSave(values);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <Modal
      title={
        <div style={{ background: '#0050a0', color: '#fff', padding: '12px 16px', margin: '-20px -24px 20px -24px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>THÊM NGƯỜI XÉT DUYỆT</span>
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
          <Button type="primary" onClick={handleOk} icon={<SaveOutlined />} style={{ background: '#0050a0' }}>Lưu lại</Button>
        </div>
      }
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="left">
        <Form.Item label="Kỳ đánh giá:" style={{ marginBottom: 8 }}>
          <Text strong>QUÝ II NĂM 26-3</Text>
        </Form.Item>

        <Form.Item label="Đối tượng:" style={{ marginBottom: 16 }}>
          <Text>{selectedRecord ? selectedRecord.name : ''}</Text>
        </Form.Item>

        <div style={{ display: 'flex', marginBottom: 24 }}>
          <div style={{ width: '25%', paddingTop: 5 }}>
            <span style={{ color: 'red' }}>*</span> Người xét duyệt:
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: 4, width: '80%' }}>
              <span style={{ color: '#666', fontSize: 12 }}>Người xét duyệt chính</span>
            </div>
            <Space align="start">
              <Select placeholder="Lọc đơn vị xét duyệt" style={{ width: 220 }} allowClear>
                <Option value="khoa_cntt">Khoa CNTT</Option>
              </Select>
              <Select placeholder="Người xét duyệt" style={{ width: 220 }} allowClear>
                <Option value="nguyen_van_a">Nguyễn Văn A</Option>
              </Select>
              <Button type="primary" style={{ background: '#0050a0' }}>Thêm</Button>
            </Space>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalThemNguoiDuyet;
