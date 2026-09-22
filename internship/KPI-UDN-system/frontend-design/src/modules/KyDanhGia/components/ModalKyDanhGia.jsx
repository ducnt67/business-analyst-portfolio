import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Upload, message, Alert } from 'antd';
import { CloseOutlined, SaveOutlined, InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { usePeriods } from '../../../hooks/usePeriods';

const { Option } = Select;
const { Dragger } = Upload;

const ModalKyDanhGia = ({ visible, onCancel, editingData }) => {
  const [form] = Form.useForm();
  const { addPeriod, updatePeriod } = usePeriods();
  const [fileList, setFileList] = useState([]);
  
  // Xác định dữ liệu đã phát sinh hay chưa
  const hasData = editingData && (editingData.staffs?.length > 0 || editingData.leaders?.length > 0);

  useEffect(() => {
    if (visible) {
      if (editingData) {
        form.setFieldsValue({
          ...editingData,
          startDate: editingData.startDate ? dayjs(editingData.startDate) : null,
          endDate: editingData.endDate ? dayjs(editingData.endDate) : null,
          violationStartDate: editingData.violationStartDate ? dayjs(editingData.violationStartDate) : null,
          violationEndDate: editingData.violationEndDate ? dayjs(editingData.violationEndDate) : null,
        });
        setFileList(editingData.files || []);
      } else {
        form.resetFields();
        setFileList([]);
      }
    }
  }, [visible, editingData, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      const { startDate, endDate, violationStartDate, violationEndDate, ...rest } = values;
      
      // Validate dates
      if (endDate && startDate && endDate.isBefore(startDate)) {
        message.error('Ngày kết thúc phải lớn hơn hoặc bằng Ngày bắt đầu!');
        return;
      }
      if (violationEndDate && violationStartDate && violationEndDate.isBefore(violationStartDate)) {
        message.error('Đến ngày tính vi phạm phải lớn hơn hoặc bằng Từ ngày tính vi phạm!');
        return;
      }

      const formattedValues = {
        ...rest,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
        endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
        violationStartDate: violationStartDate ? violationStartDate.format('YYYY-MM-DD') : null,
        violationEndDate: violationEndDate ? violationEndDate.format('YYYY-MM-DD') : null,
        files: fileList
      };

      if (editingData) {
        updatePeriod(editingData.id, formattedValues);
        message.success('Cập nhật kỳ đánh giá thành công!');
      } else {
        addPeriod(formattedValues);
        message.success('Tạo mới kỳ đánh giá thành công!');
      }
      onCancel();
    }).catch(info => {
      console.log('Validate Failed:', info);
      message.error('Vui lòng điền đầy đủ các trường thông tin bắt buộc!');
    });
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      if (fileList.length >= 5) {
        message.error('Chỉ được tải lên tối đa 5 tài liệu!');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('Tài liệu phải nhỏ hơn 10MB!');
        return false;
      }
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      title={
        <div style={{ background: '#0050a0', color: '#fff', padding: '12px 16px', margin: '-20px -24px 20px -24px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {editingData ? 'CẬP NHẬT KỲ ĐÁNH GIÁ' : 'THÊM MỚI KỲ ĐÁNH GIÁ'}
          </span>
          <CloseOutlined style={{ cursor: 'pointer' }} onClick={onCancel} />
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      closable={false}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button onClick={onCancel} icon={<CloseOutlined />}>Đóng</Button>
          <Button type="primary" onClick={handleOk} icon={<SaveOutlined />}>Lưu lại</Button>
        </div>
      }
    >
      {hasData && (
        <Alert
          message="Lưu ý"
          description="Kỳ đánh giá đã phát sinh đối tượng. Một số trường thông tin quan trọng đã bị khóa để đảm bảo toàn vẹn dữ liệu."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        labelAlign="left"
      >
        <Form.Item name="name" label="Tên kỳ đánh giá" rules={[{ required: true, message: 'Vui lòng nhập tên kỳ đánh giá!' }]}>
          <Input placeholder="Nhập tên kỳ đánh giá" />
        </Form.Item>

        <Form.Item name="departments" label="Phạm vi đơn vị áp dụng" rules={[{ required: true, message: 'Vui lòng chọn phạm vi đơn vị!' }]}>
          <Select mode="multiple" placeholder="Chọn một hoặc nhiều đơn vị" disabled={hasData}>
            <Option value="Trung tâm Công nghệ thông tin và Học liệu số">Trung tâm Công nghệ thông tin và Học liệu số</Option>
            <Option value="Phòng Kế hoạch Tài chính">Phòng Kế hoạch Tài chính</Option>
            <Option value="Phòng Đào tạo">Phòng Đào tạo</Option>
            <Option value="Phòng Khảo thí và Đảm bảo chất lượng giáo dục">Phòng Khảo thí và Đảm bảo chất lượng giáo dục</Option>
            <Option value="Ban Tổ chức Cán bộ">Ban Tổ chức Cán bộ</Option>
            <Option value="Phòng Khoa học Công nghệ và Hợp tác Quốc tế">Phòng Khoa học Công nghệ và Hợp tác Quốc tế</Option>
          </Select>
        </Form.Item>

        <Form.Item name="evaluationType" label="Loại đánh giá" rules={[{ required: true, message: 'Vui lòng chọn loại đánh giá!' }]}>
          <Select placeholder="Chọn loại đánh giá" disabled={hasData}>
            <Option value="Đánh giá hàng tháng">Đánh giá hàng tháng</Option>
            <Option value="Đánh giá hàng quý">Đánh giá hàng quý</Option>
            <Option value="Đánh giá cuối năm">Đánh giá cuối năm</Option>
          </Select>
        </Form.Item>

        <Form.Item name="template" label="Mẫu phiếu đánh giá CBGV" rules={[{ required: true, message: 'Vui lòng chọn mẫu phiếu!' }]}>
          <Select placeholder="Chọn Mẫu phiếu đánh giá" disabled={hasData}>
            <Option value="Mẫu đánh giá CBGV Tháng">Mẫu đánh giá CBGV Tháng</Option>
            <Option value="Mẫu đánh giá CBGV Quý">Mẫu đánh giá CBGV Quý</Option>
            <Option value="Mẫu đánh giá CBGV Năm">Mẫu đánh giá CBGV Năm</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Thời gian thực hiện" style={{ marginBottom: 0 }}>
          <Form.Item name="startDate" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} rules={[{ required: true, message: 'Chọn ngày!' }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Ngày bắt đầu" disabled={hasData} />
          </Form.Item>
          <span style={{ display: 'inline-block', width: '16px', lineHeight: '32px', textAlign: 'center' }}>-</span>
          <Form.Item name="endDate" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} rules={[{ required: true, message: 'Chọn ngày!' }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Ngày kết thúc" disabled={hasData} />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Khoảng tính vi phạm" style={{ marginBottom: 0 }}>
          <Form.Item name="violationStartDate" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Từ ngày" disabled={hasData} />
          </Form.Item>
          <span style={{ display: 'inline-block', width: '16px', lineHeight: '32px', textAlign: 'center' }}>-</span>
          <Form.Item name="violationEndDate" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Đến ngày" disabled={hasData} />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Tài liệu hướng dẫn">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Nhấp hoặc kéo thả file vào khu vực này để tải lên</p>
            <p className="ant-upload-hint">Hỗ trợ tải lên tối đa 5 tài liệu. Dung lượng không vượt quá 10MB/file.</p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalKyDanhGia;
