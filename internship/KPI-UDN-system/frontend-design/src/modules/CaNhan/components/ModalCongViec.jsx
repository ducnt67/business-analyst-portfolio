import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, InputNumber, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../../../hooks/useAuth';
import { useTasks } from '../../../hooks/useTasks';

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const ModalCongViec = ({ visible, onCancel, editingData }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const { addTask, updateTask } = useTasks();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible) {
      if (editingData) {
        form.setFieldsValue({
          ...editingData,
          startDate: editingData.startDate ? dayjs(editingData.startDate) : null,
          endDate: editingData.endDate ? dayjs(editingData.endDate) : null,
        });
        
        // Mock file list
        if (editingData.evidences && editingData.evidences.length > 0) {
          setFileList(editingData.evidences.map((e, index) => ({
            uid: `-${index}`,
            name: e.name,
            status: 'done',
            size: e.size,
          })));
        } else {
          setFileList([]);
        }
      } else {
        form.resetFields();
        setFileList([]);
      }
    }
  }, [visible, editingData, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      const { startDate, endDate, ...rest } = values;

      if (endDate && startDate && endDate.isBefore(startDate)) {
        message.error('Ngày kết thúc phải lớn hơn hoặc bằng Ngày bắt đầu!');
        return;
      }

      const formattedValues = {
        ...rest,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
        endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
        evidences: fileList.map(f => ({
          name: f.name,
          size: f.size || 1024,
        }))
      };

      if (editingData) {
        updateTask(editingData.id, formattedValues);
        message.success('Cập nhật công việc cá nhân thành công!');
      } else {
        addTask(formattedValues, user);
        message.success('Ghi nhận công việc mới thành công!');
      }
      onCancel();
    }).catch(info => {
      console.log('Validate Failed:', info);
      message.error('Vui lòng điền đầy đủ các trường thông tin bắt buộc!');
    });
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file) => {
      setFileList((prev) => [...prev, file]);
      return false; // Prevent auto upload
    },
    fileList,
  };

  const isLocked = editingData && editingData.usedInPeriods && editingData.usedInPeriods.length > 0;

  return (
    <Modal
      title={editingData ? "CẬP NHẬT CÔNG VIỆC CÁ NHÂN" : "GHI NHẬN CÔNG VIỆC CÁ NHÂN"}
      open={visible}
      onCancel={onCancel}
      width={700}
      onOk={handleOk}
      okText="Lưu lại"
      cancelText="Đóng"
      okButtonProps={{ disabled: isLocked }}
    >
      {isLocked && (
        <div style={{ marginBottom: 16, color: '#d4380d', backgroundColor: '#fff2e8', padding: '8px 12px', border: '1px solid #ffbb96', borderRadius: 4 }}>
          Công việc này đã được đưa vào một Phiếu đánh giá đang xử lý nên không thể chỉnh sửa.
        </div>
      )}

      <Form form={form} layout="vertical" disabled={isLocked}>
        <Form.Item name="name" label="Tên công việc" rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}>
          <Input placeholder="Nhập tên công việc" />
        </Form.Item>

        <Form.Item name="description" label="Nội dung/Mô tả công việc">
          <TextArea rows={3} placeholder="Nhập mô tả chi tiết công việc" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="startDate" label="Ngày bắt đầu" style={{ flex: 1 }} rules={[{ required: true, message: 'Chọn ngày!' }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="endDate" label="Ngày kết thúc" style={{ flex: 1 }}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="status" label="Trạng thái" style={{ flex: 1 }} rules={[{ required: true, message: 'Chọn trạng thái!' }]}>
            <Select placeholder="Chọn trạng thái">
              <Option value="Chưa bắt đầu">Chưa bắt đầu</Option>
              <Option value="Đang thực hiện">Đang thực hiện</Option>
              <Option value="Hoàn thành">Hoàn thành</Option>
              <Option value="Tạm dừng">Tạm dừng</Option>
              <Option value="Hủy">Hủy</Option>
            </Select>
          </Form.Item>
          <Form.Item name="completionLevel" label="Mức độ hoàn thành (%)" style={{ flex: 1 }} rules={[{ required: true, message: 'Nhập %!' }]}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Form.Item name="note" label="Ghi chú / Giải trình">
          <TextArea rows={2} placeholder="Nhập ghi chú thêm nếu có" />
        </Form.Item>

        <Form.Item label="Minh chứng đính kèm">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Nhấp hoặc kéo thả file vào khu vực này để tải lên</p>
            <p className="ant-upload-hint">Hỗ trợ định dạng PDF, DOCX, XLSX, JPG, PNG (Tối đa 10MB/file).</p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCongViec;
