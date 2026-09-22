import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Table, Typography, Space, Select, Row, Col, Alert, message, InputNumber, Modal, Tag } from 'antd';
import { SaveOutlined, SendOutlined, DownloadOutlined, PlusOutlined, DeleteOutlined, ImportOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';
import { useAuth } from '../../../hooks/useAuth';
import { useTasks } from '../../../hooks/useTasks';
import ModalChonCongViec from '../components/ModalChonCongViec';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ChiTietTuDanhGia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const { periods, updateStaffAssessment } = usePeriods();
  const { markTaskUsedInPeriod, unmarkTaskUsedInPeriod } = useTasks();
  const { user } = useAuth();
  
  const currentPeriod = periods.find(p => p.id === id);
  const staffInfo = currentPeriod?.staffs?.find(s => s.staffId === user?.username);

  const [tasks, setTasks] = useState([]);
  const [isSelectionModalVisible, setIsSelectionModalVisible] = useState(false);

  useEffect(() => {
    if (staffInfo) {
      if (staffInfo.selfAssessmentTasks) {
        setTasks(staffInfo.selfAssessmentTasks);
      }
      form.setFieldsValue({
        rating: staffInfo.selfAssessmentLevel,
        comments: staffInfo.selfAssessmentNote,
      });
    }
  }, [staffInfo, form]);

  if (!currentPeriod || !staffInfo) {
    return <Alert message="Không tìm thấy thông tin đánh giá" type="error" />;
  }

  // isClosed logic based on spec
  const formStatus = staffInfo.status || 'Chưa nộp';
  const isClosed = formStatus === 'Đã nộp' || formStatus === 'Đã duyệt' || currentPeriod.status === 'Hủy' || currentPeriod.status === 'Hoàn thành';

  const handleSelectTasks = (selectedTasks) => {
    // Merge new tasks with existing
    const newTasks = selectedTasks.map(t => ({
      id: t.id,
      name: t.name,
      completionRate: t.completionLevel,
      description: t.note || ''
    }));
    
    const existingIds = tasks.map(t => t.id);
    const filteredNew = newTasks.filter(t => !existingIds.includes(t.id));
    
    setTasks([...tasks, ...filteredNew]);
    setIsSelectionModalVisible(false);
  };

  const handleAddTask = () => {
    const newTask = {
      id: `manual_${Date.now()}`,
      name: 'Nhiệm vụ mới',
      completionRate: 0,
      description: ''
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    // If it's a synced task from diary, unmark it when deleted before submitting
    if (String(taskId).startsWith('T')) {
      unmarkTaskUsedInPeriod(taskId, currentPeriod.id);
    }
  };

  const syncTasksWithDiary = () => {
    // Mark all diary tasks used in this period
    tasks.forEach(t => {
      if (String(t.id).startsWith('T')) {
        markTaskUsedInPeriod(t.id, currentPeriod.id);
      }
    });
  };

  const handleSaveDraft = () => {
    const values = form.getFieldsValue();
    updateStaffAssessment(currentPeriod.id, user.username, {
      selfAssessmentTasks: tasks,
      selfAssessmentLevel: values.rating,
      selfAssessmentNote: values.comments,
      status: 'Nháp'
    });
    syncTasksWithDiary();
    message.success('Đã lưu nháp phiếu tự đánh giá!');
  };

  const handleSubmit = () => {
    if (tasks.length === 0) {
      message.warning('Vui lòng thêm ít nhất một nhiệm vụ vào phiếu đánh giá!');
      return;
    }

    form.validateFields().then(values => {
      Modal.confirm({
        title: 'Xác nhận nộp Phiếu đánh giá?',
        content: 'Sau khi nộp, bạn sẽ không thể chỉnh sửa nội dung phiếu. Bạn có chắc chắn muốn nộp không?',
        okText: 'Nộp phiếu',
        cancelText: 'Hủy',
        onOk: () => {
          updateStaffAssessment(currentPeriod.id, user.username, {
            selfAssessmentTasks: tasks,
            selfAssessmentLevel: values.rating,
            selfAssessmentNote: values.comments,
            status: 'Đã nộp',
            submittedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
          });
          syncTasksWithDiary();
          message.success('Đã gửi phiếu tự đánh giá thành công!');
          navigate('/tu-danh-gia');
        }
      });
    }).catch(() => {
      message.error('Vui lòng điền đầy đủ thông tin bắt buộc (Mức xếp loại)!');
    });
  };

  const handleExport = () => {
    message.info('Đang tải xuống báo cáo tự đánh giá (PDF)...');
  };

  const taskColumns = [
    {
      title: 'Nhiệm vụ / Công việc',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Input 
          value={text} 
          disabled={isClosed || String(record.id).startsWith('T')} // Diary tasks shouldn't change name here
          onChange={(e) => {
            const newTasks = [...tasks];
            const idx = newTasks.findIndex(t => t.id === record.id);
            newTasks[idx].name = e.target.value;
            setTasks(newTasks);
          }} 
        />
      ),
    },
    {
      title: 'Mức độ hoàn thành (%)',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 150,
      render: (text, record) => (
        <InputNumber 
          value={text} 
          min={0} max={100}
          disabled={isClosed}
          style={{ width: '100%' }}
          onChange={(val) => {
            const newTasks = [...tasks];
            const idx = newTasks.findIndex(t => t.id === record.id);
            newTasks[idx].completionRate = val;
            setTasks(newTasks);
          }}
        />
      ),
    },
    {
      title: 'Giải trình / Ghi chú',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <Input 
          value={text} 
          disabled={isClosed}
          onChange={(e) => {
            const newTasks = [...tasks];
            const idx = newTasks.findIndex(t => t.id === record.id);
            newTasks[idx].description = e.target.value;
            setTasks(newTasks);
          }}
        />
      ),
    },
    {
      title: 'Nguồn',
      key: 'source',
      width: 120,
      align: 'center',
      render: (_, record) => (
        String(record.id).startsWith('T') ? <Tag color="blue">Từ nhật ký</Tag> : <Tag color="orange">Nhập tay</Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => handleDeleteTask(record.id)}
          disabled={isClosed}
        />
      ),
    }
  ];

  const getStatusAlert = () => {
    if (currentPeriod.status === 'Hủy') {
      return <Alert message={`Kỳ đánh giá đã bị hủy. Lý do: ${currentPeriod.cancelReason}`} type="error" showIcon style={{ marginBottom: 24 }} />;
    }
    if (formStatus === 'Đã nộp') {
      return <Alert message="Phiếu đánh giá đã được nộp cho Lãnh đạo Đơn vị xét duyệt." type="info" showIcon style={{ marginBottom: 24 }} />;
    }
    if (formStatus === 'Đã duyệt') {
      return (
        <Alert 
          message="Phiếu đánh giá đã được xét duyệt." 
          description={
            <div>
              <p>Mức xếp loại từ Lãnh đạo Đơn vị: <strong>{staffInfo.leaderAssessmentLevel || 'Chưa có'}</strong></p>
              {staffInfo.directorAssessmentLevel && <p>Mức xếp loại cuối cùng (Giám đốc): <strong style={{ color: '#1890ff' }}>{staffInfo.directorAssessmentLevel}</strong></p>}
            </div>
          }
          type="success" showIcon style={{ marginBottom: 24 }} 
        />
      );
    }
    return null;
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tu-danh-gia')} />
          <Title level={4} className="page-title" style={{ margin: 0 }}>
            {isClosed ? 'CHI TIẾT PHIẾU TỰ ĐÁNH GIÁ' : 'LẬP PHIẾU TỰ ĐÁNH GIÁ'}
          </Title>
        </Space>
        <Tag color={formStatus === 'Chưa nộp' ? 'default' : formStatus === 'Nháp' ? 'processing' : formStatus === 'Đã nộp' ? 'blue' : 'success'} style={{ marginLeft: 16, fontSize: 14, padding: '4px 12px' }}>
          {formStatus}
        </Tag>
      </div>

      <Card bordered={false} className="kpi-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={5} style={{ margin: 0, color: '#0050a0' }}>{currentPeriod.name}</Title>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>Xuất báo cáo</Button>
            {!isClosed && <Button icon={<SaveOutlined />} onClick={handleSaveDraft}>Lưu nháp</Button>}
            {!isClosed && <Button type="primary" icon={<SendOutlined />} onClick={handleSubmit} style={{ background: '#0050a0' }}>Gửi đánh giá</Button>}
          </Space>
        </div>

      {getStatusAlert()}

      <Form form={form} layout="vertical">
        <Card title="1. Thông tin kỳ đánh giá" style={{ marginBottom: 24 }} size="small" type="inner">
          <Row gutter={24}>
            <Col span={8}>
              <Text type="secondary">Loại đánh giá:</Text>
              <div style={{ fontWeight: 'bold' }}>{currentPeriod.evaluationType}</div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Thời gian thực hiện:</Text>
              <div style={{ fontWeight: 'bold' }}>{dayjs(currentPeriod.startDate).format('DD/MM/YYYY')} - {dayjs(currentPeriod.endDate).format('DD/MM/YYYY')}</div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Người xét duyệt:</Text>
              <div style={{ fontWeight: 'bold' }}>{staffInfo.reviewer}</div>
            </Col>
          </Row>
        </Card>

        <Card title="2. Dữ liệu vi phạm (nếu có)" style={{ marginBottom: 24 }} size="small" type="inner">
          <Alert message="Không có dữ liệu vi phạm trong kỳ này." type="info" />
        </Card>

        <Card 
          title="3. Danh sách nhiệm vụ / công việc đã thực hiện" 
          style={{ marginBottom: 24 }}
          size="small" type="inner"
          extra={!isClosed && (
            <Space>
              <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddTask}>
                Thêm thủ công
              </Button>
              <Button type="primary" icon={<ImportOutlined />} onClick={() => setIsSelectionModalVisible(true)}>
                Chọn từ Nhật ký
              </Button>
            </Space>
          )}
        >
          <Table 
            columns={taskColumns} 
            dataSource={tasks} 
            rowKey="id"
            pagination={false}
            locale={{ emptyText: 'Chưa có nhiệm vụ nào được thêm vào phiếu' }}
            bordered
          />
        </Card>

        <Card title="4. Đánh giá chung & Tự xếp loại" style={{ marginBottom: 24 }} size="small" type="inner">
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="Tổng số nhiệm vụ">
                <Input value={Array.isArray(tasks) ? tasks.length : 0} disabled style={{ fontWeight: 'bold' }} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item 
                name="rating" 
                label="Mức tự xếp loại thi đua"
                rules={[{ required: !isClosed, message: 'Vui lòng chọn mức tự xếp loại!' }]}
              >
                <Select placeholder="Chọn mức xếp loại..." disabled={isClosed} size="large">
                  <Option value="Hoàn thành xuất sắc nhiệm vụ">Hoàn thành xuất sắc nhiệm vụ</Option>
                  <Option value="Hoàn thành tốt nhiệm vụ">Hoàn thành tốt nhiệm vụ</Option>
                  <Option value="Hoàn thành nhiệm vụ">Hoàn thành nhiệm vụ</Option>
                  <Option value="Không hoàn thành nhiệm vụ">Không hoàn thành nhiệm vụ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="comments" label="Nhận xét / Kiến nghị thêm (Nếu có)">
            <TextArea rows={4} placeholder="Nhập tự nhận xét, khó khăn vướng mắc hoặc kiến nghị" disabled={isClosed} />
          </Form.Item>
        </Card>
      </Form>
      </Card>

      <ModalChonCongViec
        visible={isSelectionModalVisible}
        onCancel={() => setIsSelectionModalVisible(false)}
        period={currentPeriod}
        existingTaskIds={Array.isArray(tasks) ? tasks.map(t => t.id) : []}
        onSelectTasks={handleSelectTasks}
      />
    </div>
  );
};

export default ChiTietTuDanhGia;
