import React from 'react';
import { Button, Tooltip, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usePeriods } from '../../../hooks/usePeriods';
import { useAuth } from '../../../hooks/useAuth';
import DanhSachKyChung from '../../../components/common/DanhSachKyChung';

const ApproveDanhSachKyDanhGia = () => {
  const navigate = useNavigate();
  const { periods } = usePeriods();
  const { user } = useAuth();

  const myPeriods = periods.filter(p => p.staffs.some(s => s.reviewer === user?.fullName));

  const extraColumns = [
    {
      title: 'Tiến độ nhân viên nộp',
      key: 'progress',
      render: (_, record) => {
        const myStaffs = record.staffs.filter(s => s.reviewer === user?.fullName);
        const submitted = myStaffs.filter(s => s.status === 'Đã nộp' || s.status === 'Đã duyệt').length;
        return <span>{submitted} / {myStaffs.length}</span>;
      },
      align: 'center',
    },
    {
      title: 'Đã duyệt',
      key: 'approved',
      render: (_, record) => {
        const myStaffs = record.staffs.filter(s => s.reviewer === user?.fullName);
        const approved = myStaffs.filter(s => s.status === 'Đã duyệt').length;
        return <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{approved} / {myStaffs.length}</span>;
      },
      align: 'center',
    }
  ];

  return (
    <DanhSachKyChung
      title="DANH SÁCH KỲ ĐÁNH GIÁ CẦN XÉT DUYỆT"
      data={myPeriods}
      extraColumns={extraColumns}
      emptyText="Không có kỳ đánh giá nào cần bạn xét duyệt"
      actionRender={(_, record) => (
        <Space size="middle">
          <Tooltip title="Mở danh sách xét duyệt">
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              onClick={() => navigate(`/duyet-cbgv/${record.id}`)}
            >
              Xét duyệt Đơn vị
            </Button>
          </Tooltip>
        </Space>
      )}
    />
  );
};

export default ApproveDanhSachKyDanhGia;
