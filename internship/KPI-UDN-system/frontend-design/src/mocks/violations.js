export const mockStaff = [
  { id: 'CB001', name: 'Nguyễn Văn Hùng', department: 'Trung tâm Công nghệ thông tin và Học liệu số' },
  { id: 'CB002', name: 'Trần Thị Mai', department: 'Phòng Kế hoạch Tài chính' },
  { id: 'CB003', name: 'Lê Hoàng Long', department: 'Phòng Đào tạo' },
  { id: 'CB004', name: 'Phạm Thu Trang', department: 'Phòng Khảo thí và Đảm bảo chất lượng giáo dục' },
  { id: 'CB005', name: 'Vũ Đức Minh', department: 'Ban Tổ chức Cán bộ' },
  { id: 'CB006', name: 'Hoàng Hải Yến', department: 'Phòng Khoa học Công nghệ và Hợp tác Quốc tế' },
  { id: 'CB007', name: 'Ngô Hữu Phước', department: 'Trung tâm Công nghệ thông tin và Học liệu số' },
];

export const mockDepartments = [
  'Trung tâm Công nghệ thông tin và Học liệu số',
  'Phòng Kế hoạch Tài chính',
  'Phòng Đào tạo',
  'Phòng Khảo thí và Đảm bảo chất lượng giáo dục',
  'Ban Tổ chức Cán bộ',
  'Phòng Khoa học Công nghệ và Hợp tác Quốc tế',
];

export const violationTypes = {
  'Kỷ luật lao động': ['Đi muộn', 'Về sớm', 'Nghỉ không phép'],
  'Chuyên môn': ['Chậm nộp điểm', 'Sai sót nghiệp vụ', 'Chưa hoàn thành nhiệm vụ'],
  'Đạo đức, lối sống': ['Vi phạm nội quy cơ quan', 'Có thái độ không chuẩn mực'],
};

export const defaultViolations = [
  {
    id: 'VP001',
    staffId: 'CB001',
    staffName: 'Nguyễn Văn Hùng',
    department: 'Trung tâm Công nghệ thông tin và Học liệu số',
    violationType: 'Kỷ luật lao động',
    errorType: 'Đi muộn',
    date: '10/05/2026',
    description: 'Chấm công lúc 8h15',
    status: 'Chờ xác nhận',
    finalConclusion: '',
    explanation: '',
    createdBy: 'Ban TCCB',
    createdAt: '11/05/2026',
  },
  {
    id: 'VP002',
    staffId: 'CB003',
    staffName: 'Lê Hoàng Long',
    department: 'Phòng Đào tạo',
    violationType: 'Chuyên môn',
    errorType: 'Chậm nộp điểm',
    date: '15/05/2026',
    description: '',
    status: 'Đã xác nhận - Có vi phạm',
    finalConclusion: 'Có vi phạm',
    explanation: 'Sẽ khắc phục trong học kỳ tới',
    createdBy: 'Ban TCCB',
    createdAt: '16/05/2026',
  },
  {
    id: 'VP003',
    staffId: 'CB004',
    staffName: 'Phạm Thu Trang',
    department: 'Phòng Khảo thí và Đảm bảo chất lượng giáo dục',
    violationType: 'Chuyên môn',
    errorType: 'Sai sót nghiệp vụ',
    date: '20/05/2026',
    description: 'Nhập sai điểm thi',
    status: 'Lưu nháp xử lý',
    finalConclusion: 'Không vi phạm',
    explanation: 'Lỗi do hệ thống đồng bộ chậm',
    createdBy: 'Ban TCCB',
    createdAt: '21/05/2026',
  }
];
