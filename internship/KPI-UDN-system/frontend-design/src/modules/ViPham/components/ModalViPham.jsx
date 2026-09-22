import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useViolations } from '../../../hooks/useViolations';

const { Option } = Select;
const { TextArea } = Input;

const ModalViPham = ({ visible, onCancel, editingData }) => {
  const [form] = Form.useForm();
  const { mockStaff, violationTypes, addViolation, updateViolation } = useViolations();
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    if (visible) {
      if (editingData) {
        form.setFieldsValue({
          ...editingData,
          date: editingData.date ? dayjs(editingData.date, 'DD/MM/YYYY') : null,
        });
        setSelectedType(editingData.violationType);
      } else {
        form.resetFields();
        setSelectedType(null);
      }
    }
  }, [visible, editingData, form]);

  const handleStaffChange = (staffId) => {
    const staff = mockStaff.find(s => s.id === staffId);
    if (staff) {
      form.setFieldsValue({
        staffName: staff.name,
        department: staff.department,
      });
    }
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    form.setFieldsValue({ errorType: undefined });
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const payload = {
        ...values,
        date: values.date.format('DD/MM/YYYY'),
      };
      
      if (editingData) {
        updateViolation(editingData.id, payload);
        message.success('Cập nhật vi phạm thành công!');
      } else {
        addViolation(payload);
        message.success('Ghi nhận vi phạm thành công!');
      }
      onCancel();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const errorOptions = selectedType && violationTypes[selectedType] ? violationTypes[selectedType] : [];

  return (
    <Modal
      title={
        <div style={{ background: '#0050a0', color: '#fff', padding: '12px 16px', margin: '-20px -24px 20px -24px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {editingData ? 'CẬP NHẬT VI PHẠM KPI' : 'GHI NHẬN VI PHẠM KPI'}
          </span>
          <CloseOutlined style={{ cursor: 'pointer' }} onClick={onCancel} />
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={650}
      closable={false}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button onClick={onCancel} icon={<CloseOutlined />}>Hủy</Button>
          <Button type="primary" onClick={handleOk} icon={<SaveOutlined />}>Lưu lại</Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item name="staffId" label="Cán bộ giảng viên vi phạm" rules={[{ required: true, message: 'Vui lòng chọn CBGV!' }]}>
          <Select 
            placeholder="Tìm theo Mã hoặc Họ tên CBGV" 
            showSearch 
            optionFilterProp="children"
            onChange={handleStaffChange}
            disabled={!!editingData} // Không cho sửa CBGV khi cập nhật để đơn giản, thực tế spec cho phép sửa và định tuyến lại
          >
            {mockStaff.map(s => (
              <Option key={s.id} value={s.id}>{s.name} - {s.id}</Option>
            ))}
          </Select>
        </Form.Item>
        
        {/* Ẩn staffName, chỉ submit */}
        <Form.Item name="staffName" hidden><Input /></Form.Item>

        <Form.Item name="department" label="Đơn vị" rules={[{ required: true }]}>
          <Input disabled style={{ color: '#000', backgroundColor: '#f5f5f5' }} />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="violationType" label="Loại vi phạm" rules={[{ required: true, message: 'Vui lòng chọn loại vi phạm!' }]} style={{ flex: 1 }}>
            <Select placeholder="Chọn loại vi phạm" onChange={handleTypeChange}>
              {Object.keys(violationTypes).map(t => <Option key={t} value={t}>{t}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="errorType" label="Lỗi vi phạm" rules={[{ required: true, message: 'Vui lòng chọn lỗi vi phạm!' }]} style={{ flex: 1 }}>
            <Select placeholder="Chọn lỗi vi phạm" disabled={!selectedType}>
              {errorOptions.map(e => <Option key={e} value={e}>{e}</Option>)}
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="date" label="Ngày vi phạm" rules={[{ required: true, message: 'Vui lòng chọn ngày vi phạm!' }]}>
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="dd/MM/yyyy" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả/Thông tin bổ sung">
          <TextArea rows={3} placeholder="Nhập mô tả cụ thể về vi phạm..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalViPham;
