import React, { useState } from 'react';
import { Space, Button, Input, DatePicker, Select, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';
import { useAuth } from '../../../hooks/useAuth';
import DanhSachKyChung from '../../../components/common/DanhSachKyChung';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DanhSachKyDanhGiaLanhDao = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const { periods, mockHighLevelStaff } = usePeriods();
  const { user } = useAuth();

  const viceDirector = mockHighLevelStaff?.viceDirectors?.find(vd => vd.name === user?.fullName);
  const managerId = viceDirector ? viceDirector.id : 'PGD001';

  const myPeriods = periods.filter(p => p.leaders?.some(l => l.managerId === managerId));
  
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
          <Option value="active">Đang diễn ra</Option>
          <Option value="completed">Đã kết thúc</Option>
        </Select>
      </Col>
      <Col span={4}>
        <Button type="default" icon={<FilterOutlined />} style={{ width: '100%' }}>Lọc</Button>
      </Col>
    </Row>
  );

  const extraColumns = [
    {
      title: 'Tiến độ đánh giá',
      key: 'progress',
      render: (_, record) => {
        const myLeaders = record.leaders?.filter(l => l.managerId === managerId) || [];
        const evaluated = myLeaders.filter(l => l.viceDirectorRating).length;
        return <span>{evaluated} / {myLeaders.length} lãnh đạo</span>;
      },
    }
  ];

  return (
    <DanhSachKyChung
      title="DANH SÁCH KỲ ĐÁNH GIÁ LÃNH ĐẠO ĐƠN VỊ"
      data={filteredData}
      headerActions={headerActions}
      extraColumns={extraColumns}
      actionRender={(_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/danh-gia-lanh-dao/${record.id}`)}
          >
            Mở
          </Button>
        </Space>
      )}
    />
  );
};

export default DanhSachKyDanhGiaLanhDao;
