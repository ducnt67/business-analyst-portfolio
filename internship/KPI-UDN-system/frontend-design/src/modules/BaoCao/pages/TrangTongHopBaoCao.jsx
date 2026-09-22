import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Typography, Breadcrumb, Space, Dropdown, message, Input, Select, Tag, Alert, Tabs } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, FilePdfOutlined, SearchOutlined, FilterOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';

const { Title, Text } = Typography;
const { Option } = Select;

const TrangTongHopBaoCao = () => {
  const navigate = useNavigate();
  const { periodId } = useParams();
  const { periods } = usePeriods();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('cbgv');

  const currentPeriod = periods.find(p => p.id === periodId);

  const { staffs, leaders } = useMemo(() => {
    if (!currentPeriod) return { staffs: [], leaders: [] };
    const sList = (currentPeriod.staffs || []).map(s => ({
      ...s,
      key: `s_${s.staffId}`,
      finalRating: s.directorRating || 'Chưa xếp loại',
      selfRating: s.selfRating || 'Chưa có',
      managerRating: s.leaderRating || 'Chưa có',
      approvedDate: s.approvedDate || '20/06/2026'
    }));
    
    const lList = (currentPeriod.leaders || []).map(l => ({
      ...l,
      key: `l_${l.leaderId}`,
      finalRating: l.directorRating || 'Chưa xếp loại',
      proposedRating: l.viceDirectorRating || 'Không có',
      supervisorLevel: l.supervisorLevel || 'Giám đốc',
      supervisorName: l.supervisorName || 'Nguyễn Văn A',
      approvedDate: l.approvedDate || '22/06/2026'
    }));

    return { staffs: sList, leaders: lList };
  }, [currentPeriod]);

  if (!currentPeriod) {
    return <Alert message="Không tìm thấy thông tin kỳ đánh giá" type="error" style={{ margin: 24 }} />;
  }

  // UC08.03: Xuất báo cáo kết quả đánh giá (Chỉ xuất PDF)
  const handleExportPDF = () => {
    message.loading({ content: 'Đang trích xuất dữ liệu và tạo tệp PDF...', key: 'exportPdf' });
    setTimeout(() => {
      message.success({ content: `Đã xuất thành công: BaoCao_KetQua_${currentPeriod.name}_${activeTab === 'cbgv' ? 'CBGV' : 'LanhDao'}.pdf`, key: 'exportPdf', duration: 4 });
    }, 1500);
  };

  const exportMenuItems = [
    {
      key: 'pdf',
      icon: <FilePdfOutlined style={{ color: '#f5222d' }} />,
      label: 'Xuất báo cáo (PDF)',
      onClick: handleExportPDF,
    }
  ];

  const getRatingTagColor = (rating) => {
    const map = {
      'Hoàn thành xuất sắc nhiệm vụ': 'purple',
      'Hoàn thành tốt nhiệm vụ': 'blue',
      'Hoàn thành nhiệm vụ': 'green',
      'Không hoàn thành nhiệm vụ': 'red',
      'Chưa xếp loại': 'default'
    };
    return map[rating] || 'default';
  };

  const filteredStaffs = staffs.filter(item => 
    String(item.name || '').toLowerCase().includes(String(searchText || '').toLowerCase()) || 
    String(item.staffId || '').toLowerCase().includes(String(searchText || '').toLowerCase())
  );
  
  const filteredLeaders = leaders.filter(item => 
    String(item.name || '').toLowerCase().includes(String(searchText || '').toLowerCase())
  );

  // Cột cho CBGV
  const cbgvColumns = [
    { title: 'Mã CB', dataIndex: 'staffId', key: 'id', width: 80 },
    { title: 'Họ tên', dataIndex: 'name', key: 'name', render: t => <strong>{t}</strong> },
    { title: 'Đơn vị/Phòng ban', dataIndex: 'department', key: 'dept' },
    { title: 'Chức vụ', dataIndex: 'title', key: 'title' },
    { title: 'Mức tự ĐG', dataIndex: 'selfRating', key: 'self' },
    { title: 'Mức xét duyệt', dataIndex: 'managerRating', key: 'manager' },
    { title: 'Mức cuối cùng', dataIndex: 'finalRating', key: 'final', render: (r) => <Tag color={getRatingTagColor(r)}>{r}</Tag> },
    { title: 'Ngày duyệt', dataIndex: 'approvedDate', key: 'date' },
    { title: 'Thao tác', key: 'action', render: () => <Button type="text" icon={<EyeOutlined />} onClick={() => message.info('Chức năng xem chi tiết đang phát triển')} /> }
  ];

  // Cột cho Lãnh đạo đơn vị
  const lanhDaoColumns = [
    { title: 'Họ tên', dataIndex: 'name', key: 'name', render: t => <strong>{t}</strong> },
    { title: 'Đơn vị', dataIndex: 'department', key: 'dept' },
    { title: 'Chức vụ', dataIndex: 'title', key: 'title' },
    { title: 'Cấp phụ trách', dataIndex: 'supervisorLevel', key: 'supLevel' },
    { title: 'Mức đề xuất', dataIndex: 'proposedRating', key: 'proposed', render: r => r !== 'Không có' ? <Tag>{r}</Tag> : <Text type="secondary">N/A</Text> },
    { title: 'Mức cuối cùng', dataIndex: 'finalRating', key: 'final', render: (r) => <Tag color={getRatingTagColor(r)}>{r}</Tag> },
    { title: 'Ngày duyệt', dataIndex: 'approvedDate', key: 'date' },
    { title: 'Thao tác', key: 'action', render: () => <Button type="text" icon={<EyeOutlined />} onClick={() => message.info('Chức năng xem chi tiết đang phát triển')} /> }
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }} items={[
        { title: <a onClick={() => navigate('/bao-cao')}>Danh sách báo cáo</a> },
        { title: <a onClick={() => navigate(`/bao-cao/${periodId}/trang-chu`)}>Dashboard Thống kê</a> },
        { title: 'Bảng tổng hợp chi tiết' },
      ]} />

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/bao-cao/${periodId}/trang-chu`)} />
          <div>
            <Title level={4} className="page-title" style={{ margin: 0 }}>
              BẢNG TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ
            </Title>
            <Text type="secondary">Kỳ đánh giá: {currentPeriod.name}</Text>
          </div>
        </Space>
        
        <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
          <Button type="primary" icon={<DownloadOutlined />}>
            Xuất PDF
          </Button>
        </Dropdown>
      </div>

      <Card bordered={false} className="kpi-card">
        <div style={{ display: 'flex', gap: '16px', marginBottom: 16 }}>
          <Input 
            placeholder="Tìm kiếm theo mã, họ tên..." 
            prefix={<SearchOutlined />} 
            style={{ width: 250 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Select defaultValue="all" style={{ width: 200 }}>
            <Option value="all">Tất cả đơn vị</Option>
            <Option value="TTCNTT">Trung tâm Công nghệ thông tin</Option>
            <Option value="HCTH">Phòng Hành chính</Option>
          </Select>
          <Select defaultValue="all" style={{ width: 180 }}>
            <Option value="all">Tất cả xếp loại</Option>
            <Option value="xuat_sac">Xuất sắc</Option>
            <Option value="tot">Tốt</Option>
            <Option value="hoan_thanh">Hoàn thành</Option>
            <Option value="khong_hoan_thanh">Không HT</Option>
          </Select>
          <Button icon={<FilterOutlined />}>Lọc</Button>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: 'cbgv',
              label: `Danh sách CBGV (${filteredStaffs.length})`,
              children: (
                <Table
                  columns={cbgvColumns}
                  dataSource={filteredStaffs}
                  pagination={{ pageSize: 15, position: ['bottomCenter'] }}
                  bordered
                  size="middle"
                />
              )
            },
            {
              key: 'lanhdao',
              label: `Danh sách Lãnh đạo đơn vị (${filteredLeaders.length})`,
              children: (
                <Table
                  columns={lanhDaoColumns}
                  dataSource={filteredLeaders}
                  pagination={{ pageSize: 15, position: ['bottomCenter'] }}
                  bordered
                  size="middle"
                />
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default TrangTongHopBaoCao;
