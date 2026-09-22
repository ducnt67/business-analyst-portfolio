import React, { useEffect } from 'react';
import { Card, Button, Form, Input, Select, Typography, Breadcrumb, Divider, Table, Tag, Space, message, Row, Col, Alert } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ChiTietDuyetNhanVien = () => {
  const navigate = useNavigate();
  const { periodId, staffId } = useParams();
  const { periods, updateStaffAssessment } = usePeriods();
  const [form] = Form.useForm();
  
  const currentPeriod = periods.find(p => p.id === periodId);
  const staffInfo = currentPeriod?.staffs?.find(s => s.staffId === staffId);

  useEffect(() => {
    if (staffInfo) {
      form.setFieldsValue({
        leaderRating: staffInfo.leaderAssessmentLevel,
        leaderComment: staffInfo.leaderAssessmentNote,
      });
    }
  }, [staffInfo, form]);

  if (!currentPeriod || !staffInfo) {
    return <Alert message="Không tìm thấy thông tin nhân viên hoặc kỳ đánh giá" type="error" />;
  }

  const handleBack = () => {
    navigate(`/duyet-cbgv/${periodId}`);
  };

  const isApproved = staffInfo.status === 'Đã duyệt';

  const handleApprove = () => {
    form.validateFields().then(values => {
      updateStaffAssessment(periodId, staffId, {
        leaderAssessmentLevel: values.leaderRating,
        leaderAssessmentNote: values.leaderComment,
        status: 'Đã duyệt'
      });
      message.success('Đã xác nhận kết quả xét duyệt!');
      setTimeout(() => {
        handleBack();
      }, 1000);
    });
  };

  const taskColumns = [
    { 
      title: 'Nhiệm vụ / Công việc', 
      dataIndex: 'name', 
      key: 'name' 
    },
    { 
      title: 'Tỷ lệ hoàn thành', 
      dataIndex: 'completionRate', 
      key: 'completionRate',
      render: text => `${text}%`,
      width: 150,
      align: 'center'
    },
    { 
      title: 'Diễn giải / Ghi chú', 
      dataIndex: 'description', 
      key: 'description' 
    }
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <a onClick={() => navigate('/duyet-cbgv')} style={{ display: 'flex', alignItems: 'center' }}>
            <ArrowLeftOutlined style={{ marginRight: 8 }} />
            Danh sách kỳ xét duyệt
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a onClick={handleBack}>
            Danh sách Cán bộ
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Hồ sơ: {staffInfo.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: 16 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>
          HỒ SƠ ĐÁNH GIÁ CÁN BỘ: {staffInfo.name.toUpperCase()} ({staffInfo.staffId})
        </Title>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card title="Nội dung tự đánh giá" bordered={false} className="kpi-card" headStyle={{ borderBottom: '2px solid #f0f0f0' }}>
            <Title level={5}>1. Kết quả thực hiện công việc</Title>
            <Table 
              columns={taskColumns} 
              dataSource={staffInfo.selfAssessmentTasks || []} 
              rowKey="id"
              pagination={false} 
              bordered 
              size="small"
              style={{ marginBottom: 24 }}
              locale={{ emptyText: 'Không có nhiệm vụ nào được báo cáo' }}
            />

            <Title level={5}>2. Tổng hợp tự đánh giá</Title>
            <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
              <p><strong>Mức xếp loại tự đánh giá:</strong> <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px', marginLeft: 8 }}>{staffInfo.selfAssessmentLevel || 'Chưa đánh giá'}</Tag></p>
              <p style={{ margin: 0 }}><strong>Nhận xét cá nhân:</strong> {staffInfo.selfAssessmentNote || 'Không có nhận xét'}</p>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Quyết định xét duyệt" bordered={false} className="kpi-card" headStyle={{ borderBottom: '2px solid #f0f0f0', backgroundColor: '#e6f7ff' }}>
            {isApproved && (
              <Alert message="Phiếu đánh giá này đã được duyệt." type="success" showIcon style={{ marginBottom: 16 }} />
            )}
            
            <Form form={form} layout="vertical">
              <Form.Item 
                name="leaderRating" 
                label="Mức xếp loại (Lãnh đạo quyết định)"
                rules={[{ required: true, message: 'Vui lòng chọn mức xếp loại!' }]}
              >
                <Select placeholder="Chọn mức xếp loại" disabled={isApproved}>
                  <Option value="Hoàn thành xuất sắc nhiệm vụ">Hoàn thành xuất sắc nhiệm vụ</Option>
                  <Option value="Hoàn thành tốt nhiệm vụ">Hoàn thành tốt nhiệm vụ</Option>
                  <Option value="Hoàn thành nhiệm vụ">Hoàn thành nhiệm vụ</Option>
                  <Option value="Không hoàn thành nhiệm vụ">Không hoàn thành nhiệm vụ</Option>
                </Select>
              </Form.Item>

              <Form.Item 
                name="leaderComment" 
                label="Nhận xét của lãnh đạo"
              >
                <TextArea rows={5} placeholder="Nhập nhận xét, đánh giá chi tiết..." disabled={isApproved} />
              </Form.Item>

              <Divider style={{ margin: '12px 0' }} />
              
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={handleBack}>
                  Quay lại
                </Button>
                {!isApproved && (
                  <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleApprove}>
                    Xác nhận duyệt
                  </Button>
                )}
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChiTietDuyetNhanVien;
