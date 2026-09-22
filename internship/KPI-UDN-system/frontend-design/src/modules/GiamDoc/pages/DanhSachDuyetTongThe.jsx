import React, { useState } from 'react';
import { Space, Button, Input, DatePicker, Select, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';
import DanhSachKyChung from '../../../components/common/DanhSachKyChung';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DanhSachDuyetTongThe = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const { periods } = usePeriods();

  const myPeriods = periods.filter(p => p.status === 'Chờ duyệt tổng thể' || p.status === 'Đã hoàn thành');
  
  const filteredData = myPeriods.filter(item => {
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
          <Option value="submitted">Chờ duyệt tổng thể</Option>
          <Option value="completed">Đã hoàn thành</Option>
        </Select>
      </Col>
      <Col span={4}>
        <Button type="default" icon={<FilterOutlined />} style={{ width: '100%' }}>Lọc</Button>
      </Col>
    </Row>
  );

  const extraColumns = [
    {
      title: 'Tiến độ duyệt',
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
      title="DANH SÁCH KỲ ĐÁNH GIÁ TRÌNH DUYỆT TỔNG THỂ"
      data={filteredData}
      headerActions={headerActions}
      extraColumns={extraColumns}
      emptyText="Chưa có kỳ đánh giá nào được trình lên"
      actionRender={(_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/duyet-tong-the/${record.id}`)}
          >
            Duyệt tổng thể
          </Button>
        </Space>
      )}
    />
  );
};

export default DanhSachDuyetTongThe;
