import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, Typography, Breadcrumb, Select, Checkbox, message, Tabs, Input, Alert } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, SearchOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const RATING_OPTIONS = [
  { value: 'Hoàn thành xuất sắc nhiệm vụ', label: 'Hoàn thành xuất sắc nhiệm vụ', color: 'purple' },
  { value: 'Hoàn thành tốt nhiệm vụ', label: 'Hoàn thành tốt nhiệm vụ', color: 'blue' },
  { value: 'Hoàn thành nhiệm vụ', label: 'Hoàn thành nhiệm vụ', color: 'green' },
  { value: 'Không hoàn thành nhiệm vụ', label: 'Không hoàn thành nhiệm vụ', color: 'red' },
];

const ChiTietDuyetTongThe = () => {
  const navigate = useNavigate();
  const { periodId } = useParams();
  const { periods, updateDirectorStaffAssessment, updateDirectorLeaderAssessment, completePeriod } = usePeriods();
  
  const currentPeriod = periods.find(p => p.id === periodId);

  // Local state for decisions
  const [staffDecisions, setStaffDecisions] = useState({});
  const [leaderDecisions, setLeaderDecisions] = useState({});

  useEffect(() => {
    if (currentPeriod) {
      // Initialize state for staffs
      const initStaff = {};
      currentPeriod.staffs?.forEach(s => {
        if (s.directorRating) {
          initStaff[s.staffId] = { agree: s.directorRating === s.reviewerRating, adjustedRating: s.directorRating };
        } else {
          initStaff[s.staffId] = { agree: true, adjustedRating: s.reviewerRating || 'Hoàn thành tốt nhiệm vụ' };
        }
      });
      setStaffDecisions(initStaff);

      // Initialize state for leaders
      const initLeader = {};
      currentPeriod.leaders?.forEach(l => {
        if (l.directorRating) {
          initLeader[l.leaderId] = { agree: l.directorRating === l.viceDirectorRating, adjustedRating: l.directorRating };
        } else {
          // For leaders without Vice Director (directly managed), viceDirectorRating is empty.
          initLeader[l.leaderId] = { agree: !!l.viceDirectorRating, adjustedRating: l.viceDirectorRating || 'Hoàn thành tốt nhiệm vụ' };
        }
      });
      setLeaderDecisions(initLeader);
    }
  }, [currentPeriod]);

  if (!currentPeriod) {
    return <Alert message="Không tìm thấy thông tin kỳ đánh giá" type="error" />;
  }

  const handleApproveAll = () => {
    // Tự động set agree = true cho tất cả những người chưa có điểm khác
    const newStaff = { ...staffDecisions };
    currentPeriod.staffs?.forEach(s => {
      newStaff[s.staffId] = { agree: true, adjustedRating: s.reviewerRating || 'Hoàn thành xuất sắc nhiệm vụ' };
    });
    setStaffDecisions(newStaff);

    const newLeader = { ...leaderDecisions };
    currentPeriod.leaders?.forEach(l => {
      newLeader[l.leaderId] = { agree: !!l.viceDirectorRating, adjustedRating: l.viceDirectorRating || 'Hoàn thành xuất sắc nhiệm vụ' };
    });
    setLeaderDecisions(newLeader);
    
    message.success('Đã áp dụng Đồng ý duyệt cho toàn bộ danh sách!');
  };

  const handleComplete = () => {
    // Validate if any missing adjustedRating when agree=false
    const unstaff = currentPeriod.staffs?.find(s => !staffDecisions[s.staffId]?.agree && !staffDecisions[s.staffId]?.adjustedRating);
    const unleaders = currentPeriod.leaders?.find(l => !leaderDecisions[l.leaderId]?.agree && !leaderDecisions[l.leaderId]?.adjustedRating);
    
    if (unstaff || unleaders) {
      message.error('Vui lòng chọn mức xếp loại cho những trường hợp KHÔNG ĐỒNG Ý với đề xuất!');
      return;
    }
    
    // Save to context
    currentPeriod.staffs?.forEach(s => {
      const decision = staffDecisions[s.staffId];
      const finalRating = decision.agree ? s.reviewerRating : decision.adjustedRating;
      updateDirectorStaffAssessment(periodId, s.staffId, {
        directorRating: finalRating || 'Hoàn thành xuất sắc nhiệm vụ', // fallback
        directorDate: dayjs().format('DD/MM/YYYY')
      });
    });

    currentPeriod.leaders?.forEach(l => {
      const decision = leaderDecisions[l.leaderId];
      const finalRating = decision.agree ? l.viceDirectorRating : decision.adjustedRating;
      updateDirectorLeaderAssessment(periodId, l.leaderId, {
        directorRating: finalRating || 'Hoàn thành xuất sắc nhiệm vụ',
        directorDate: dayjs().format('DD/MM/YYYY')
      });
    });

    completePeriod(periodId);
    
    message.success('Đã lưu kết quả và Hoàn thành duyệt tổng thể kỳ đánh giá!');
    navigate('/duyet-tong-the');
  };

  const renderRatingTag = (value) => {
    if (!value) return <Text type="secondary">Chưa có đề xuất</Text>;
    const option = RATING_OPTIONS.find(opt => opt.value === value);
    if (!option) return <Tag color="default">{value}</Tag>;
    return <Tag color={option.color}>{option.label}</Tag>;
  };

  // Columns for Staff
  const staffColumns = [
    { title: 'Họ và tên', dataIndex: 'name', key: 'name', render: (t) => <strong>{t}</strong> },
    { title: 'Phòng ban', dataIndex: 'department', key: 'department' },
    { 
      title: 'LĐ Đơn vị đánh giá', 
      key: 'evaluator', 
      render: (_, r) => <div>{r.reviewer}</div> 
    },
    { 
      title: 'Mức Đề xuất', 
      key: 'leaderRatingLabel',
      render: (_, r) => renderRatingTag(r.reviewerRating)
    },
    {
      title: 'Quyết định xếp loại',
      key: 'decision',
      width: 300,
      render: (_, record) => {
        const decision = staffDecisions[record.staffId] || { agree: true, adjustedRating: null };
        const hasProposal = !!record.reviewerRating;

        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            {hasProposal && (
              <Checkbox 
                checked={decision.agree} 
                onChange={e => setStaffDecisions({...staffDecisions, [record.staffId]: { ...decision, agree: e.target.checked }})}
              >
                Đồng ý với đề xuất
              </Checkbox>
            )}
            {(!decision.agree || !hasProposal) && (
              <Select 
                style={{ width: '100%' }} 
                placeholder="Chọn mức xếp loại khác"
                value={decision.adjustedRating}
                onChange={val => setStaffDecisions({...staffDecisions, [record.staffId]: { ...decision, adjustedRating: val, agree: false }})}
                options={RATING_OPTIONS}
              />
            )}
          </Space>
        );
      }
    }
  ];

  // Columns for Leaders
  const leaderColumns = [
    { title: 'Họ và tên', dataIndex: 'name', key: 'name', render: (t) => <strong>{t}</strong> },
    { title: 'Đơn vị', dataIndex: 'department', key: 'department' },
    { 
      title: 'Phó GĐ Đề xuất', 
      key: 'vpProposal', 
      render: (_, r) => r.managerLevel === 'Phó Giám đốc' ? renderRatingTag(r.viceDirectorRating) : <Text type="secondary">Trực tiếp báo cáo Giám đốc</Text>
    },
    {
      title: 'Quyết định xếp loại',
      key: 'decision',
      width: 300,
      render: (_, record) => {
        const decision = leaderDecisions[record.leaderId] || { agree: record.managerLevel === 'Phó Giám đốc', adjustedRating: null };
        const hasProposal = !!record.viceDirectorRating;
        
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            {record.managerLevel === 'Phó Giám đốc' && hasProposal && (
              <Checkbox 
                checked={decision.agree} 
                onChange={e => setLeaderDecisions({...leaderDecisions, [record.leaderId]: { ...decision, agree: e.target.checked }})}
              >
                Đồng ý với PGĐ đề xuất
              </Checkbox>
            )}
            {(!decision.agree || !hasProposal) && (
              <Select 
                style={{ width: '100%' }} 
                placeholder="Chọn mức xếp loại cuối cùng"
                value={decision.adjustedRating}
                onChange={val => setLeaderDecisions({...leaderDecisions, [record.leaderId]: { ...decision, adjustedRating: val, agree: false }})}
                options={RATING_OPTIONS}
              />
            )}
          </Space>
        );
      }
    }
  ];

  const items = [
    {
      key: '1',
      label: 'Danh sách Cán bộ Giảng viên',
      children: (
        <Table 
          columns={staffColumns} 
          dataSource={currentPeriod.staffs} 
          rowKey="staffId"
          pagination={{ pageSize: 10, position: ['bottomCenter'], showSizeChanger: false }}
          bordered
          size="middle"
        />
      ),
    },
    {
      key: '2',
      label: 'Danh sách Lãnh đạo đơn vị',
      children: (
        <Table 
          columns={leaderColumns} 
          dataSource={currentPeriod.leaders} 
          rowKey="leaderId"
          pagination={{ pageSize: 10, position: ['bottomCenter'], showSizeChanger: false }}
          bordered
          size="middle"
        />
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '16px' }} items={[
        { title: <a onClick={() => navigate('/duyet-tong-the')}>Danh sách kỳ duyệt</a> },
        { title: 'Duyệt tổng thể' },
      ]} />

      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/duyet-tong-the')} />
          <div>
            <Title level={4} className="page-title" style={{ margin: 0 }}>
              DUYỆT TỔNG THỂ KẾT QUẢ ĐÁNH GIÁ (GIÁM ĐỐC)
            </Title>
            <Text type="secondary">Kỳ đánh giá: {currentPeriod.name}</Text>
          </div>
        </Space>
      </div>

      <Card bordered={false} className="kpi-card">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Space>
            <Input 
              placeholder="Tìm kiếm theo tên..." 
              prefix={<SearchOutlined />} 
              style={{ width: 250 }}
            />
          </Space>
        </div>

        <Tabs defaultActiveKey="1" items={items} />

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
          <Button type="default" size="large" icon={<CheckSquareOutlined />} onClick={handleApproveAll} disabled={currentPeriod.status === 'Đã hoàn thành'}>
            Duyệt đồng ý tất cả đề xuất
          </Button>
          <Button type="primary" size="large" icon={<CheckCircleOutlined />} onClick={handleComplete} disabled={currentPeriod.status === 'Đã hoàn thành'}>
            Hoàn thành đánh giá xếp loại
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChiTietDuyetTongThe;
