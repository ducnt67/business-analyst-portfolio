import React, { useState } from 'react';
import { Space, Button, Input, DatePicker, Select, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, BarChartOutlined, TableOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';
import DanhSachKyChung from '../../../components/common/DanhSachKyChung';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DanhSachKyBaoCao = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const { periods } = usePeriods();

  const filteredData = periods.filter(item => {
    return item.name.toLowerCase().includes(searchText.toLowerCase());
  });

  const headerActions = (
    <Row gutter={16}>
      <Col span={8}>
        <Input 
          placeholder="Tìm kiếm kỳ đánh giá..." 
          prefix={<SearchOutlined />} 
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </Col>
      <Col span={8}>
        <RangePicker placeholder={['Từ ngày', 'Đến ngày']} format="DD/MM/YYYY" style={{ width: '100%' }} />
      </Col>
      <Col span={4}>
        <Select defaultValue="all" style={{ width: '100%' }}>
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="Đang diễn ra">Đang diễn ra</Option>
          <Option value="Chờ duyệt tổng thể">Chờ duyệt tổng thể</Option>
          <Option value="Đã hoàn thành">Đã hoàn thành</Option>
        </Select>
      </Col>
      <Col span={4}>
        <Button type="default" icon={<FilterOutlined />} style={{ width: '100%' }}>Lọc</Button>
      </Col>
    </Row>
  );

  const extraColumns = [
    {
      title: 'Tiến độ (Đã chốt / Tổng)',
      key: 'progress',
      render: (_, record) => {
        const totalStaffs = record.staffs?.length || 0;
        const totalLeaders = record.leaders?.length || 0;
        const totalItems = totalStaffs + totalLeaders;

        const approvedStaffs = record.staffs?.filter(s => s.directorRating).length || 0;
        const approvedLeaders = record.leaders?.filter(l => l.directorRating).length || 0;
        const approvedItems = approvedStaffs + approvedLeaders;

        return <span>{approvedItems} / {totalItems} hồ sơ</span>;
      },
    }
  ];

  return (
    <DanhSachKyChung
      title="DANH SÁCH KỲ ĐÁNH GIÁ (BÁO CÁO THỐNG KÊ)"
      data={filteredData}
      headerActions={headerActions}
      extraColumns={extraColumns}
      actionRender={(_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<BarChartOutlined />} 
            onClick={() => navigate(`/bao-cao/${record.id}/trang-chu`)}
          >
            Dashboard
          </Button>
          <Button 
            icon={<TableOutlined />} 
            onClick={() => navigate(`/bao-cao/${record.id}/summary`)}
          >
            Bảng tổng hợp
          </Button>
        </Space>
      )}
    />
  );
};

export default DanhSachKyBaoCao;
