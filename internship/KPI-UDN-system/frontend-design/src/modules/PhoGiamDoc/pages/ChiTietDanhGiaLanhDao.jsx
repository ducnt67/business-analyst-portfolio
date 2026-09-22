import React, { useEffect } from 'react';
import { Card, Typography, Row, Col, Descriptions, Button, Space, Form, Input, Select, message, Breadcrumb, Tag, Alert } from 'antd';
import { LeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { usePeriods } from '../../../hooks/usePeriods';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ChiTietDanhGiaLanhDao = () => {
  const navigate = useNavigate();
  const { periodId, leaderId } = useParams();
  const [form] = Form.useForm();
  const { periods, updateLeaderAssessment } = usePeriods();

  const currentPeriod = periods.find(p => p.id === periodId);
  const leaderData = currentPeriod?.leaders?.find(l => l.leaderId === leaderId);

  useEffect(() => {
    if (leaderData && leaderData.viceDirectorRating) {
      form.setFieldsValue({
        rating: leaderData.viceDirectorRating,
        comment: leaderData.viceDirectorComment
      });
    }
  }, [leaderData, form]);

  if (!currentPeriod || !leaderData) {
    return <Alert message="Không tìm thấy thông tin đánh giá" type="error" />;
  }

  const isDirectorRated = !!leaderData.directorRating;
  const isViceDirectorRated = !!leaderData.viceDirectorRating;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const assessmentData = {
        viceDirectorRating: values.rating,
        viceDirectorComment: values.comment,
        viceDirectorDate: dayjs().format('DD/MM/YYYY'),
        status: 'Đã đánh giá'
      };

      updateLeaderAssessment(periodId, leaderId, assessmentData);
      
      message.success('Đã gửi đề xuất thi đua lên Giám đốc!');
      navigate(`/danh-gia-lanh-dao/${periodId}`);
    } catch {
      message.error('Vui lòng chọn mức xếp loại đề xuất!');
    }
  };

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '16px' }} items={[
        { title: <a onClick={() => navigate('/danh-gia-lanh-dao')}>Danh sách kỳ đánh giá</a> },
        { title: <a onClick={() => navigate(`/danh-gia-lanh-dao/${periodId}`)}>Danh sách Lãnh đạo phụ trách</a> },
        { title: 'Đánh giá Lãnh đạo' },
      ]} />

      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<LeftOutlined />} onClick={() => navigate(`/danh-gia-lanh-dao/${periodId}`)} />
          <div>
            <Title level={4} className="page-title" style={{ margin: 0 }}>
              ĐỀ XUẤT ĐÁNH GIÁ LÃNH ĐẠO ĐƠN VỊ
            </Title>
            <Text type="secondary">Kỳ đánh giá: {currentPeriod.name}</Text>
          </div>
        </Space>
      </div>

      <Alert 
        message="Lưu ý về thẩm quyền" 
        description="Với vai trò Phó Giám đốc, kết quả đánh giá của bạn là ĐỀ XUẤT THI ĐUA. Kết quả này sẽ được chuyển lên Giám đốc xem xét và quyết định cuối cùng." 
        type="info" 
        showIcon 
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card 
            title="Thông tin Lãnh đạo đơn vị" 
            bordered={false} 
            className="kpi-card"
          >
            <Descriptions column={2} labelStyle={{ fontWeight: '600', color: '#595959', width: '150px' }} contentStyle={{ color: '#262626' }}>
              <Descriptions.Item label="Họ và tên">{leaderData.name}</Descriptions.Item>
              <Descriptions.Item label="Mã cán bộ">{leaderData.leaderId}</Descriptions.Item>
              <Descriptions.Item label="Chức vụ">{leaderData.title}</Descriptions.Item>
              <Descriptions.Item label="Tình trạng">
                <Tag color={isDirectorRated ? 'success' : (isViceDirectorRated ? 'processing' : 'default')} style={{ margin: 0 }}>
                  {isDirectorRated ? 'Giám đốc đã duyệt' : (isViceDirectorRated ? 'Đã đánh giá' : (leaderData.status || 'Chưa nộp'))}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Đơn vị công tác">{leaderData.department}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card 
            title="Phiếu đề xuất đánh giá" 
            bordered={false} 
            className="kpi-card"
          >
            <Form form={form} layout="vertical">
              <Form.Item 
                name="rating" 
                label={<strong>Mức xếp loại đề xuất <span style={{color: 'red'}}>*</span></strong>}
                rules={[{ required: true, message: 'Vui lòng chọn mức xếp loại đề xuất!' }]}
              >
                <Select placeholder="Chọn mức xếp loại..." size="large" disabled={isDirectorRated}>
                  <Select.Option value="Hoàn thành xuất sắc nhiệm vụ">Hoàn thành xuất sắc nhiệm vụ</Select.Option>
                  <Select.Option value="Hoàn thành tốt nhiệm vụ">Hoàn thành tốt nhiệm vụ</Select.Option>
                  <Select.Option value="Hoàn thành nhiệm vụ">Hoàn thành nhiệm vụ</Select.Option>
                  <Select.Option value="Không hoàn thành nhiệm vụ">Không hoàn thành nhiệm vụ</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item 
                name="comment" 
                label={<strong>Nhận xét / Ý kiến đánh giá của Phó Giám đốc</strong>}
              >
                <TextArea 
                  rows={6} 
                  placeholder="Nhập nhận xét về hiệu quả công việc, quản lý điều hành của lãnh đạo đơn vị..." 
                  disabled={isDirectorRated}
                />
              </Form.Item>

              {!isDirectorRated && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                  <Space size="middle">
                    <Button size="large" type="primary" icon={<CheckCircleOutlined />} onClick={handleSubmit}>
                      {isViceDirectorRated ? 'Cập nhật đề xuất' : 'Gửi đề xuất lên Giám đốc'}
                    </Button>
                  </Space>
                </div>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChiTietDanhGiaLanhDao;
