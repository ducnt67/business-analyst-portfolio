import React, { useState, useEffect } from 'react';
import { Modal, Table, Input, Select, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTasks } from '../../../hooks/useTasks';
import { useAuth } from '../../../hooks/useAuth';

const { Option } = Select;
const ModalChonCongViec = ({ visible, onCancel, onSelectTasks, period, existingTaskIds }) => {
  const { tasks } = useTasks();
  const { user } = useAuth();
  
  // Get all tasks for this user
  const myTasks = Array.isArray(tasks) ? tasks.filter(t => t.createdBy === user?.username && t.status !== 'Hủy') : [];
  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (visible) {
      setSelectedRowKeys([]);
      setSearchText('');
      setStatusFilter('all');
    }
  }, [visible]);

  // Filter tasks based on period time (UC04.02)
  // Logic: Task start date <= Period end date && Task end date >= Period start date
  const validTasks = myTasks.filter(t => {
    if (!t.startDate || !period?.startDate || !period?.endDate) return false;
    
    const taskStart = dayjs(t.startDate);
    const taskEnd = t.endDate ? dayjs(t.endDate) : dayjs(); // if no end date, assume ongoing
    const periodStart = dayjs(period.startDate);
    const periodEnd = dayjs(period.endDate);
    
    // Check intersection
    return taskStart.isBefore(periodEnd.add(1, 'day')) && taskEnd.isAfter(periodStart.subtract(1, 'day'));
  });

  const filteredTasks = validTasks.filter(t => {
    const matchName = t.name.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchName && matchStatus;
  });

  const handleOk = () => {
    const selectedTasks = validTasks.filter(t => selectedRowKeys.includes(t.id));
    onSelectTasks(selectedTasks);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: existingTaskIds.includes(record.id), // Disable if already added
    }),
  };

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, record) => `${dayjs(record.startDate).format('DD/MM/YYYY')} - ${record.endDate ? dayjs(record.endDate).format('DD/MM/YYYY') : 'Đang tiếp diễn'}`,
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
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Mức độ',
      dataIndex: 'completionLevel',
      key: 'completionLevel',
      render: val => `${val}%`
    }
  ];

  return (
    <Modal
      title="CHỌN NHIỆM VỤ TỪ NHẬT KÝ CÔNG VIỆC"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={800}
      okText={`Thêm (${selectedRowKeys.length})`}
      cancelText="Hủy"
      okButtonProps={{ disabled: selectedRowKeys.length === 0 }}
    >
      <div style={{ marginBottom: 16 }}>
        Hệ thống tự động lọc các công việc có thời gian thực hiện giao với thời gian của kỳ đánh giá: 
        <strong style={{ marginLeft: 8 }}>{period ? `${dayjs(period.startDate).format('DD/MM/YYYY')} - ${dayjs(period.endDate).format('DD/MM/YYYY')}` : ''}</strong>
      </div>
      
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input
          placeholder="Tìm kiếm công việc..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          value={statusFilter}
          style={{ width: 150 }}
          onChange={val => setStatusFilter(val)}
        >
          <Option value="all">Tất cả</Option>
          <Option value="Đang thực hiện">Đang thực hiện</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
        </Select>
      </div>

      <Table 
        rowSelection={rowSelection}
        columns={columns} 
        dataSource={filteredTasks} 
        rowKey="id" 
        pagination={{ pageSize: 5 }}
        size="small"
        bordered
      />
    </Modal>
  );
};

export default ModalChonCongViec;
