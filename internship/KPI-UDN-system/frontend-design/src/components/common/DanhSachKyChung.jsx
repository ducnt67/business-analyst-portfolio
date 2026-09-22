import React from 'react';
import { Card, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import TheTrangThai from './TheTrangThai';

const { Title } = Typography;

const DanhSachKyChung = ({ title, data, extraColumns = [], actionRender, headerActions, emptyText = 'Không có dữ liệu' }) => {
  const baseColumns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên Kỳ đánh giá',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Loại đánh giá',
      dataIndex: 'evaluationType',
      key: 'evaluationType',
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, record) => `${dayjs(record.startDate).format('DD/MM/YYYY')} - ${dayjs(record.endDate).format('DD/MM/YYYY')}`,
    },
    ...extraColumns,
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <TheTrangThai status={status} />,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  if (actionRender) {
    baseColumns.push({
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: actionRender,
    });
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>
          {title}
        </Title>
      </div>

      <Card bordered={false} className="kpi-card">
        {headerActions && <div style={{ marginBottom: 16 }}>{headerActions}</div>}
        
        <Table
          rowKey="id"
          columns={baseColumns}
          dataSource={data}
          pagination={{ pageSize: 10, position: ['bottomCenter'], showSizeChanger: false }}
          bordered
          size="middle"
          locale={{ emptyText }}
        />
      </Card>
    </div>
  );
};

export default DanhSachKyChung;
