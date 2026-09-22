import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Typography, Tabs, Table, Alert } from 'antd';
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { usePeriods } from '../../../hooks/usePeriods';
import { useViolations } from '../../../hooks/useViolations';

const { Title } = Typography;

const COLORS = {
  'Hoàn thành xuất sắc nhiệm vụ': '#722ed1', // purple
  'Hoàn thành tốt nhiệm vụ': '#1890ff', // blue
  'Hoàn thành nhiệm vụ': '#52c41a', // green
  'Không hoàn thành nhiệm vụ': '#f5222d', // red
  'Chưa xếp loại': '#d9d9d9', // gray
};

const VIOLATION_COLORS = ['#ff4d4f', '#faad14', '#1890ff', '#d9d9d9', '#722ed1', '#52c41a'];

const TrangChu = () => {
  const { periods } = usePeriods();
  const { violations } = useViolations();

  // Pick the most relevant period (e.g., the first one, which is usually the most recent or active one)
  const currentPeriod = periods[0];

  // ===================== OVERVIEW DATA =====================
  const { totalItems, incompleteCount, rate, overviewData, gradeData, deptPerformanceData } = useMemo(() => {
    if (!currentPeriod) return { totalItems: 0, incompleteCount: 0, rate: 0, overviewData: [], gradeData: [], deptPerformanceData: [] };

    const staffs = currentPeriod.staffs || [];
    const leaders = currentPeriod.leaders || [];
    const allItems = [...staffs.map(s => ({...s, finalRating: s.directorRating})), ...leaders.map(l => ({...l, finalRating: l.directorRating}))];

    let rated = 0;
    const distMap = {
      'Hoàn thành xuất sắc nhiệm vụ': 0,
      'Hoàn thành tốt nhiệm vụ': 0,
      'Hoàn thành nhiệm vụ': 0,
      'Không hoàn thành nhiệm vụ': 0,
    };

    const deptMap = {};

    allItems.forEach(item => {
      const rating = item.finalRating;
      if (rating) {
        rated += 1;
        if (distMap[rating] !== undefined) {
          distMap[rating] += 1;
        }

        const dept = item.department || 'Khác';
        if (!deptMap[dept]) {
          deptMap[dept] = { totalItems: 0, scoreSum: 0 };
        }
        
        deptMap[dept].totalItems += 1;
        // Assign points to calculate an average score
        let score = 0;
        if (rating === 'Hoàn thành xuất sắc nhiệm vụ') score = 95;
        else if (rating === 'Hoàn thành tốt nhiệm vụ') score = 85;
        else if (rating === 'Hoàn thành nhiệm vụ') score = 75;
        else if (rating === 'Không hoàn thành nhiệm vụ') score = 50;
        
        deptMap[dept].scoreSum += score;
      }
    });

    const incomplete = allItems.length - rated;

    const oData = [
      { name: 'Đã hoàn thành', value: rated, color: '#52c41a' },
      { name: 'Chưa xếp loại', value: incomplete, color: '#faad14' },
    ];

    const gData = [
      { name: 'Xuất sắc', count: distMap['Hoàn thành xuất sắc nhiệm vụ'], fill: COLORS['Hoàn thành xuất sắc nhiệm vụ'] },
      { name: 'Tốt', count: distMap['Hoàn thành tốt nhiệm vụ'], fill: COLORS['Hoàn thành tốt nhiệm vụ'] },
      { name: 'Hoàn thành', count: distMap['Hoàn thành nhiệm vụ'], fill: COLORS['Hoàn thành nhiệm vụ'] },
      { name: 'Không HT', count: distMap['Không hoàn thành nhiệm vụ'], fill: COLORS['Không hoàn thành nhiệm vụ'] },
    ];

    const dData = Object.keys(deptMap).map(dept => {
      const data = deptMap[dept];
      const avgScore = data.totalItems > 0 ? Math.round(data.scoreSum / data.totalItems) : 0;
      return { dept, score: avgScore };
    }).sort((a, b) => b.score - a.score); // Sort by score descending

    return {
      totalItems: allItems.length,
      incompleteCount: incomplete,
      rate: allItems.length > 0 ? Math.round((rated / allItems.length) * 100) : 0,
      overviewData: oData,
      gradeData: gData,
      deptPerformanceData: dData
    };

  }, [currentPeriod]);


  // ===================== DEPARTMENT DATA =====================
  const topDepts = deptPerformanceData.slice(0, 3).map((d, index) => ({ ...d, rank: index + 1, key: `top_${index}` }));
  
  const bottomDepts = [...deptPerformanceData]
    .filter(d => d.score > 0)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((d, index) => ({ ...d, rank: deptPerformanceData.length - 2 + index, key: `bot_${index}` }));

  // ===================== VIOLATION DATA =====================
  const { violationTypeData, violationTrendData } = useMemo(() => {
    const typeMap = {};
    const monthMap = { 'Tháng 1': 0, 'Tháng 2': 0, 'Tháng 3': 0, 'Tháng 4': 0, 'Tháng 5': 0, 'Tháng 6': 0, 'Tháng 7': 0, 'Tháng 8': 0, 'Tháng 9': 0, 'Tháng 10': 0, 'Tháng 11': 0, 'Tháng 12': 0 };

    violations.forEach(v => {
      // Type
      const type = v.violationType || 'Khác';
      if (!typeMap[type]) typeMap[type] = 0;
      typeMap[type] += 1;

      // Month
      if (v.date) {
        const parts = v.date.split('/');
        if (parts.length >= 2) {
          const monthInt = parseInt(parts[1], 10);
          const monthStr = `Tháng ${monthInt}`;
          if (monthMap[monthStr] !== undefined) {
            monthMap[monthStr] += 1;
          }
        }
      }
    });

    const vTypeData = Object.keys(typeMap).map((k, idx) => ({
      name: k,
      value: typeMap[k],
      color: VIOLATION_COLORS[idx % VIOLATION_COLORS.length]
    }));

    const vTrendData = Object.keys(monthMap)
      .map(month => ({ month, count: monthMap[month] }))
      .filter(item => item.count > 0 || ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'].includes(item.month)); // Keep some empty months for context

    return { violationTypeData: vTypeData, violationTrendData: vTrendData };
  }, [violations]);


  // ===================== COMPONENTS =====================
  const OverviewTab = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false} className="kpi-card">
            <Statistic title="Tổng Cán bộ/Lãnh đạo" value={totalItems} prefix={<UserOutlined />} valueStyle={{ color: '#0050a0' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="kpi-card">
            <Statistic title="Tỷ lệ hoàn thành" value={rate} suffix="%" prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="kpi-card">
            <Statistic title="Chưa đánh giá" value={incompleteCount} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="kpi-card">
            <Statistic title="Số hồ sơ vi phạm" value={violations.length} prefix={<WarningOutlined />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Card title={`Tiến độ đánh giá (${currentPeriod?.name || ''})`} bordered={false} className="kpi-card">
            {overviewData.length > 0 ? (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={overviewData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                      {overviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Số lượng']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <Alert message="Chưa có dữ liệu" type="info" />}
          </Card>
        </Col>
        <Col span={12}>
          <Card title={`Kết quả Xếp loại (${currentPeriod?.name || ''})`} bordered={false} className="kpi-card">
            {gradeData.length > 0 ? (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="count" name="Số lượng" barSize={50}>
                      {gradeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <Alert message="Chưa có dữ liệu" type="info" />}
          </Card>
        </Col>
      </Row>
    </div>
  );

  const DepartmentTab = () => {
    const columns = [
      { title: 'Hạng', dataIndex: 'rank', key: 'rank', width: 60, align: 'center', render: (t) => <strong>{t}</strong> },
      { title: 'Tên Đơn vị', dataIndex: 'dept', key: 'dept' },
      { title: 'Điểm KPI TB', dataIndex: 'score', key: 'score', align: 'center', render: (t) => <span style={{ color: t >= 80 ? '#52c41a' : t < 60 ? '#f5222d' : '#1890ff' }}>{t}</span> },
    ];

    return (
      <div>
        <Card title="Điểm KPI Ước tính Trung bình theo Đơn vị" bordered={false} className="kpi-card">
          {deptPerformanceData.length > 0 ? (
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptPerformanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="dept" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" name="Điểm KPI TB" fill="#1890ff" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <Alert message="Chưa có dữ liệu" type="info" />}
        </Card>

        <Row gutter={24}>
          <Col span={12}>
            <Card title="Top 3 Đơn vị hiệu suất cao nhất" bordered={false} className="kpi-card">
              <Table columns={columns} dataSource={topDepts} pagination={false} size="small" locale={{ emptyText: 'Chưa có dữ liệu' }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Top 3 Đơn vị cần cải thiện" bordered={false} className="kpi-card">
              <Table columns={columns} dataSource={bottomDepts} pagination={false} size="small" locale={{ emptyText: 'Chưa có dữ liệu' }} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const ViolationTab = () => (
    <Row gutter={24}>
      <Col span={12}>
        <Card title="Tỷ trọng các loại vi phạm" bordered={false} className="kpi-card">
          {violationTypeData.length > 0 ? (
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={violationTypeData} cx="50%" cy="50%" outerRadius={120} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} dataKey="value">
                    {violationTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Số lượng']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <Alert message="Chưa có dữ liệu vi phạm" type="info" />}
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Xu hướng vi phạm trong năm nay" bordered={false} className="kpi-card">
          {violationTrendData.length > 0 ? (
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={violationTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" name="Số vi phạm" stroke="#cf1322" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : <Alert message="Chưa có dữ liệu vi phạm" type="info" />}
        </Card>
      </Col>
    </Row>
  );

  const items = [
    { key: '1', label: 'Tổng quan Đánh giá', children: <OverviewTab /> },
    { key: '2', label: 'Hiệu suất theo đơn vị', children: <DepartmentTab /> },
    { key: '3', label: 'Thống kê Vi phạm', children: <ViolationTab /> },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>
          DASHBOARD KỲ ĐÁNH GIÁ (TRANG CHỦ)
        </Title>
      </div>

      <div className="kpi-card" style={{ padding: '0 12px' }}>
        <Tabs defaultActiveKey="1" items={items} size="large" />
      </div>
    </div>
  );
};

export default TrangChu;
