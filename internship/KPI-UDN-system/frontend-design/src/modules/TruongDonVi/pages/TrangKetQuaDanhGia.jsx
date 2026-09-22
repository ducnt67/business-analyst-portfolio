import React from 'react';
import { Card, Typography, Row, Col, Tag, Steps, Descriptions, Alert } from 'antd';
import { CheckCircleOutlined, UserOutlined, SolutionOutlined, LoadingOutlined } from '@ant-design/icons';
import { usePeriods } from '../../../hooks/usePeriods';
import { useAuth } from '../../../hooks/useAuth';

const { Title, Text } = Typography;

const TrangKetQuaDanhGia = () => {
  const { periods } = usePeriods();
  const { user } = useAuth();

  // Find the most recent period where this user is a leader
  const activePeriod = periods.find(p => p.leaders?.some(l => l.name === user?.fullName));
  const leaderData = activePeriod?.leaders?.find(l => l.name === user?.fullName);

  if (!activePeriod || !leaderData) {
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Title level={4} className="page-title" style={{ margin: 0 }}>
            KẾT QUẢ ĐÁNH GIÁ CÁ NHÂN
          </Title>
        </div>
        <Alert message="Chưa có dữ liệu đánh giá nào cho tài khoản của bạn." type="info" />
      </div>
    );
  }

  const vdStatus = leaderData.viceDirectorRating ? 'finish' : (leaderData.status === 'Chưa nộp' ? 'wait' : 'process');
  const dStatus = leaderData.directorRating ? 'finish' : (vdStatus === 'finish' ? 'process' : 'wait');

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>
          KẾT QUẢ ĐÁNH GIÁ CÁ NHÂN (DÀNH CHO LÃNH ĐẠO ĐƠN VỊ)
        </Title>
      </div>

      <Alert 
        message="Thông tin quan trọng" 
        description="Lãnh đạo đơn vị không cần tự đánh giá bằng form chi tiết. Kết quả đánh giá được thực hiện thông qua quy trình xét duyệt 2 cấp (Phó Giám đốc phụ trách đề xuất, Giám đốc phê duyệt cuối cùng)." 
        type="info" 
        showIcon 
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card 
            title={<span><UserOutlined /> Thông tin Lãnh đạo</span>}
            bordered={false} 
            className="kpi-card"
          >
            <Descriptions column={2} labelStyle={{ fontWeight: '600', color: '#595959', width: '150px' }} contentStyle={{ color: '#262626' }}>
              <Descriptions.Item label="Họ và tên">{leaderData.name}</Descriptions.Item>
              <Descriptions.Item label="Kỳ đánh giá">{activePeriod.name}</Descriptions.Item>
              <Descriptions.Item label="Chức vụ">{leaderData.title}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={leaderData.status === 'Hoàn tất' ? 'success' : 'processing'} style={{ margin: 0 }}>
                  {leaderData.status || 'Chờ duyệt'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Đơn vị công tác">{leaderData.department}</Descriptions.Item>
              <Descriptions.Item label="Kết quả cuối cùng">
                <Text strong style={{ color: leaderData.directorRating ? '#1890ff' : '#999', fontSize: '15px' }}>
                  {leaderData.directorRating || 'Đang cập nhật'}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card 
            title={<span><SolutionOutlined /> Quá trình xét duyệt đánh giá</span>}
            bordered={false} 
            className="kpi-card"
          >
            <Steps
              direction="vertical"
              current={vdStatus === 'finish' ? (dStatus === 'finish' ? 2 : 1) : 0}
              items={[
                {
                  title: 'Cấp 1: Phó Giám đốc phụ trách xét duyệt & Đề xuất',
                  status: vdStatus,
                  icon: vdStatus === 'process' ? <LoadingOutlined /> : <CheckCircleOutlined />,
                  description: (
                    <div style={{ marginTop: 8, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
                      <p><strong>Người duyệt:</strong> {activePeriod.mockHighLevelStaff?.viceDirectors?.find(vd => vd.id === leaderData.managerId)?.name || 'Trần Thanh Hải'} ({leaderData.managerLevel})</p>
                      <p><strong>Ngày duyệt:</strong> {leaderData.viceDirectorDate || 'Chưa duyệt'}</p>
                      <p><strong>Mức xếp loại đề xuất:</strong> <Tag color={leaderData.viceDirectorRating ? 'blue' : 'default'}>{leaderData.viceDirectorRating || 'Chưa có kết quả'}</Tag></p>
                      <p><strong>Nhận xét:</strong> {leaderData.viceDirectorComment || 'Chưa có nhận xét'}</p>
                    </div>
                  ),
                },
                {
                  title: 'Cấp 2: Giám đốc Phê duyệt cuối cùng',
                  status: dStatus,
                  icon: dStatus === 'process' ? <LoadingOutlined /> : <CheckCircleOutlined />,
                  description: (
                    <div style={{ marginTop: 8, padding: 16, background: '#f9f0ff', border: '1px solid #d3adf7', borderRadius: 8 }}>
                      <p><strong>Người duyệt:</strong> {activePeriod.mockHighLevelStaff?.directors?.[0]?.name || 'Lê Minh Tuấn'} (Giám đốc)</p>
                      <p><strong>Ngày duyệt:</strong> {leaderData.directorDate || 'Chưa duyệt'}</p>
                      <p><strong>Mức xếp loại phê duyệt:</strong> <Tag color={leaderData.directorRating ? 'purple' : 'default'}>{leaderData.directorRating || 'Chưa có kết quả'}</Tag></p>
                      <p><strong>Nhận xét:</strong> {leaderData.directorComment || 'Chưa có nhận xét'}</p>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TrangKetQuaDanhGia;
