export const mockHighLevelStaff = {
  directors: [
    { id: 'GD001', name: 'Lê Minh Tuấn', role: 'Giám đốc' }
  ],
  viceDirectors: [
    { id: 'PGD001', name: 'Trần Thanh Hải', role: 'Phó Giám đốc', charge: 'Phụ trách Hành chính - Tổ chức' },
    { id: 'PGD002', name: 'Nguyễn Thị Bích Hồng', role: 'Phó Giám đốc', charge: 'Phụ trách Đào tạo' },
    { id: 'PGD003', name: 'Phạm Quang Dũng', role: 'Phó Giám đốc', charge: 'Phụ trách Khoa học - Công nghệ' }
  ]
};

export const defaultPeriods = [
  {
    id: 'K2026Q2',
    name: 'Đánh giá thi đua Quý II năm 2026',
    departments: ['Trung tâm Công nghệ thông tin và Học liệu số', 'Phòng Đào tạo'],
    evaluationType: 'Đánh giá hàng quý',
    template: 'Mẫu đánh giá CBGV Quý',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    violationStartDate: '2026-04-01',
    violationEndDate: '2026-06-30',
    status: 'Chờ duyệt tổng thể',
    progress: 'Khởi tạo',
    createdBy: 'admin',
    createdAt: '2026-05-15',
    staffs: [
      { staffId: 'cbgv', name: 'Lê Hữu Lập', department: 'Trung tâm Công nghệ thông tin và Học liệu số', title: 'Chuyên viên', reviewer: 'Nguyễn Tiến Đức', isMainReviewer: true, status: 'Chưa nộp' },
      { 
        staffId: 'NV002', 
        name: 'Trần Thị B', 
        department: 'Trung tâm Công nghệ thông tin và Học liệu số', 
        title: 'Chuyên viên', 
        reviewer: 'Nguyễn Tiến Đức', 
        isMainReviewer: true, 
        status: 'Đã nộp',
        selfAssessmentLevel: 'Hoàn thành tốt nhiệm vụ',
        selfAssessmentNote: 'Đã nỗ lực hoàn thành các KPI được giao phó trong quý.',
        selfAssessmentTasks: [
          { id: 1, name: 'Bảo trì hệ thống máy chủ', completionRate: 100, description: 'Hệ thống hoạt động ổn định 99.9%' }
        ]
      },
      { 
        staffId: 'NV003', 
        name: 'Lê Văn C', 
        department: 'Trung tâm Công nghệ thông tin và Học liệu số', 
        title: 'Chuyên viên', 
        reviewer: 'Nguyễn Tiến Đức', 
        isMainReviewer: true, 
        status: 'Đã duyệt',
        selfAssessmentLevel: 'Hoàn thành xuất sắc nhiệm vụ',
        selfAssessmentNote: 'Vượt tiến độ 2 tuần.',
        selfAssessmentTasks: [
          { id: 1, name: 'Triển khai phần mềm Quản lý nhân sự', completionRate: 120, description: 'Triển khai trước hạn, được biểu dương.' }
        ],
        leaderAssessmentLevel: 'Hoàn thành xuất sắc nhiệm vụ',
        leaderAssessmentNote: 'Đồng ý với tự đánh giá. Hiệu suất làm việc rất tốt.'
      }
    ],
    leaders: [
      { leaderId: 'LD001', name: 'Nguyễn Tiến Đức', department: 'Trung tâm Công nghệ thông tin và Học liệu số', title: 'Giám đốc Trung tâm', managerLevel: 'Phó Giám đốc', managerId: 'PGD001', status: 'Chưa nộp' }
    ],
    files: []
  }
];
