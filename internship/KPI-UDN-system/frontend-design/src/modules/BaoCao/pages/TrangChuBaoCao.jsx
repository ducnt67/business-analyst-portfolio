import React, { useMemo } from 'react';
import { Card, Row, Col, Typography, Statistic, Breadcrumb, Button, Space, Alert } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, PieChartOutlined, UserOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

const COLORS = {
  'Hoàn thành xuất sắc nhiệm vụ': '#722ed1', // purple
  'Hoàn thành tốt nhiệm vụ': '#1890ff', // blue
  'Hoàn thành nhiệm vụ': '#52c41a', // green
  'Không hoàn thành nhiệm vụ': '#f5222d', // red
  'Chưa xếp loại': '#d9d9d9', // gray
};

const ReportTrangChu = () => {
  const navigate = useNavigate();
  const { periodId } = useParams();
  const { periods } = usePeriods();
  
  const currentPeriod = periods.find(p => p.id === periodId);

  // Compute data for dashboard
  const { 
    totalItems, 
    ratedCount, 
    ratingDistribution, 
    departmentStats,
  } = useMemo(() => {
    if (!currentPeriod) return { totalItems: 0, ratedCount: 0, ratingDistribution: [], departmentStats: [] };

    const staffs = currentPeriod.staffs || [];
    const leaders = currentPeriod.leaders || [];
    const allItems = [...staffs.map(s => ({...s, finalRating: s.directorRating, type: 'CBGV'})), ...leaders.map(l => ({...l, finalRating: l.directorRating, type: 'Lãnh đạo'}))];

    const distributionMap = {
      'Hoàn thành xuất sắc nhiệm vụ': 0,
      'Hoàn thành tốt nhiệm vụ': 0,
      'Hoàn thành nhiệm vụ': 0,
      'Không hoàn thành nhiệm vụ': 0,
      'Chưa xếp loại': 0,
    };

    const deptMap = {};
    let rated = 0;

    allItems.forEach(item => {
      const rating = item.finalRating || 'Chưa xếp loại';
      distributionMap[rating] += 1;
      if (item.finalRating) rated += 1;

      const dept = item.department || 'Khác';
      if (!deptMap[dept]) {
        deptMap[dept] = { department: dept, 'Hoàn thành xuất sắc nhiệm vụ': 0, 'Hoàn thành tốt nhiệm vụ': 0, 'Hoàn thành nhiệm vụ': 0, 'Không hoàn thành nhiệm vụ': 0, 'Chưa xếp loại': 0, total: 0, completed: 0 };
      }
      deptMap[dept][rating] += 1;
      deptMap[dept].total += 1;
      if (item.finalRating) deptMap[dept].completed += 1;
    });

    const distData = Object.keys(distributionMap).filter(k => distributionMap[k] > 0).map(k => ({
      name: k,
      value: distributionMap[k]
    }));

    const deptData = Object.values(deptMap);

    return {
      totalItems: allItems.length,
      ratedCount: rated,
      ratingDistribution: distData,
      departmentStats: deptData,
    };
  }, [currentPeriod]);

  if (!currentPeriod) {
    return <Alert message="Không tìm thấy thông tin kỳ đánh giá" type="error" style={{ margin: 24 }} />;
  }


  return (
    <div>
      <Breadcrumb style={{ marginBottom: '16px' }} items={[
        { title: <a onClick={() => navigate('/bao-cao')}>Danh sách báo cáo</a> },
        { title: 'Dashboard Thống kê' },
      ]} />

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/bao-cao')} />
          <div>
            <Title level={4} className="page-title" style={{ margin: 0 }}>
              DASHBOARD BÁO CÁO THỐNG KÊ
            </Title>
            <Text type="secondary">Kỳ đánh giá: {currentPeriod.name}</Text>
          </div>
        </Space>
        <Button type="primary" icon={<DownloadOutlined />} onClick={() => navigate(`/bao-cao/${periodId}/summary`)}>
          Xem Bảng tổng hợp chi tiết
        </Button>
      </div>

      {/* Overview Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false} className="kpi-card">
            <Statistic title="Tổng số Nhân sự (CBGV + LĐ)" value={totalItems} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="kpi-card">
            <Statistic title="Đã có xếp loại cuối cùng" value={ratedCount} suffix={`/ ${totalItems}`} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="kpi-card">
            <Statistic title="Chưa có kết quả" value={totalItems - ratedCount} valueStyle={{ color: '#cf1322' }} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="kpi-card">
            <Statistic 
              title="Tỷ lệ hoàn thành đánh giá" 
              value={totalItems > 0 ? ((ratedCount / totalItems) * 100).toFixed(1) : 0} 
              suffix="%" 
              valueStyle={{ color: '#1890ff' }} 
              prefix={<PieChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Pie Chart: Rating Distribution */}
        <Col span={8}>
          <Card bordered={false} title="Cơ cấu kết quả xếp loại (Toàn đơn vị)" className="kpi-card" style={{ height: '400px' }}>
            {totalItems > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS['Chưa xếp loại']} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [value, 'Số lượng']} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', marginTop: 100 }}>Chưa có dữ liệu</div>
            )}
          </Card>
        </Col>

        {/* Bar Chart: Department Stats */}
        <Col span={16}>
          <Card bordered={false} title="Thống kê Xếp loại theo từng Đơn vị" className="kpi-card" style={{ height: '400px' }}>
            {departmentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={departmentStats}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="Hoàn thành xuất sắc nhiệm vụ" name="Xuất sắc" stackId="a" fill={COLORS['Hoàn thành xuất sắc nhiệm vụ']} />
                  <Bar dataKey="Hoàn thành tốt nhiệm vụ" name="Tốt" stackId="a" fill={COLORS['Hoàn thành tốt nhiệm vụ']} />
                  <Bar dataKey="Hoàn thành nhiệm vụ" name="Hoàn thành" stackId="a" fill={COLORS['Hoàn thành nhiệm vụ']} />
                  <Bar dataKey="Không hoàn thành nhiệm vụ" name="Không HT" stackId="a" fill={COLORS['Không hoàn thành nhiệm vụ']} />
                  <Bar dataKey="Chưa xếp loại" name="Chưa xếp loại" stackId="a" fill={COLORS['Chưa xếp loại']} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', marginTop: 100 }}>Chưa có dữ liệu</div>
            )}
          </Card>
        </Col>
      </Row>


    </div>
  );
};

export default ReportTrangChu;
