import React, { useState } from 'react';
import { Table, Button, Card, Space, Input, Select, Tag, Popconfirm, message, Typography, Tooltip, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ImportOutlined, PaperClipOutlined, LockOutlined } from '@ant-design/icons';
import ModalCongViec from '../components/ModalCongViec';
import { useTasks } from '../../../hooks/useTasks';
import { useAuth } from '../../../hooks/useAuth';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TrangCongViecCaNhan = () => {
  const { tasks, deleteTask } = useTasks();
  const { user } = useAuth();
  
  // Filter tasks for the current user
  const myTasks = tasks.filter(t => t.createdBy === user?.username);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Filters
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);

  const handleAdd = () => {
    setEditingTask(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingTask(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteTask(id);
    message.success('Đã xóa công việc khỏi hệ thống!');
  };

  const filteredTasks = myTasks.filter(t => {
    const matchName = t.name.toLowerCase().includes(searchText.toLowerCase()) || (t.id && t.id.toLowerCase().includes(searchText.toLowerCase()));
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    
    let matchDate = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const taskStart = dayjs(t.startDate);
      const taskEnd = dayjs(t.endDate);
      const filterStart = dateRange[0];
      const filterEnd = dateRange[1];
      
      // Task overlaps with filter range if its start is before filter end AND its end is after filter start
      matchDate = taskStart.isBefore(filterEnd) && taskEnd.isAfter(filterStart);
    }
    
    return matchName && matchStatus && matchDate;
  });

  const columns = [
    {
      title: 'Mã CV',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: 'Thời gian thực hiện',
      key: 'time',
      render: (_, record) => `${dayjs(record.startDate).format('DD/MM/YYYY')} - ${dayjs(record.endDate).format('DD/MM/YYYY')}`,
    },
    {
      title: 'Tiến độ',
      dataIndex: 'completionLevel',
      key: 'completionLevel',
      render: (val) => `${val}%`,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Đang thực hiện') color = 'processing';
        if (status === 'Hoàn thành') color = 'success';
        if (status === 'Tạm dừng') color = 'warning';
        if (status === 'Hủy') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Minh chứng',
      key: 'evidence',
      align: 'center',
      render: (_, record) => (
        record.evidences && record.evidences.length > 0 ? (
          <Tooltip title={`${record.evidences.length} file đính kèm`}>
            <Tag icon={<PaperClipOutlined />} color="blue">{record.evidences.length}</Tag>
          </Tooltip>
        ) : <span style={{ color: '#bfbfbf' }}>-</span>
      ),
    },
    {
      title: 'Sử dụng',
      key: 'usage',
      align: 'center',
      render: (_, record) => {
        if (record.usedInPeriods && record.usedInPeriods.length > 0) {
          return (
            <Tooltip title={`Đã dùng trong ${record.usedInPeriods.length} kỳ đánh giá`}>
              <LockOutlined style={{ color: '#faad14' }} />
            </Tooltip>
          );
        }
        return null;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        const isLocked = record.usedInPeriods && record.usedInPeriods.length > 0;
        return (
          <Space size="small">
            <Tooltip title={isLocked ? "Xem chi tiết (Đã khóa)" : "Chỉnh sửa"}>
              <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => handleEdit(record)} />
            </Tooltip>
            <Tooltip title={isLocked ? "Không thể xóa công việc đã dùng trong kỳ đánh giá" : "Xóa"}>
              <Popconfirm
                title="Xác nhận xóa công việc này?"
                description="Hành động này không thể hoàn tác."
                onConfirm={() => handleDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
                disabled={isLocked}
                okButtonProps={{ danger: true }}
              >
                <Button type="text" danger icon={<DeleteOutlined />} disabled={isLocked} />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>
          NHẬT KÝ CÔNG VIỆC CÁ NHÂN
        </Title>
      </div>
      
      <Card bordered={false} className="kpi-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="Tìm kiếm công việc..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              value={statusFilter}
              style={{ width: 150 }}
              onChange={val => setStatusFilter(val)}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="Chưa bắt đầu">Chưa bắt đầu</Option>
              <Option value="Đang thực hiện">Đang thực hiện</Option>
              <Option value="Hoàn thành">Hoàn thành</Option>
              <Option value="Tạm dừng">Tạm dừng</Option>
              <Option value="Hủy">Hủy</Option>
            </Select>
            <RangePicker 
              placeholder={['Từ ngày', 'Đến ngày']} 
              format="DD/MM/YYYY" 
              onChange={val => setDateRange(val)}
              allowClear
            />
          </Space>
          
          <Space>
            <Button icon={<ImportOutlined />}>Nhập từ File</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ background: '#0050a0' }}>
              Ghi nhận công việc
            </Button>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredTasks} 
          rowKey="id" 
          pagination={{ pageSize: 10, position: ['bottomCenter'], showSizeChanger: false }}
          bordered
          size="middle"
          locale={{ emptyText: 'Chưa có công việc nào được ghi nhận' }}
        />
      </Card>

      <ModalCongViec
        visible={isModalVisible}
        editingData={editingTask}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default TrangCongViecCaNhan;
