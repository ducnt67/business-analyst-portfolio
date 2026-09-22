export const defaultTasks = [
  {
    id: 'T2026001',
    name: 'Biên soạn giáo trình Lập trình Web',
    description: 'Soạn thảo 15 chương giáo trình môn học Lập trình Web',
    startDate: '2026-05-01',
    endDate: '2026-08-30',
    status: 'Đang thực hiện',
    completionLevel: 70,
    note: 'Đã hoàn thành 10/15 chương',
    evidences: [{ name: 'Chuong_1_10.pdf', size: 1024000 }],
    createdBy: 'cbgv',
    createdAt: '2026-05-01',
    usedInPeriods: []
  },
  {
    id: 'T2026002',
    name: 'Hướng dẫn NCKH Sinh viên',
    description: 'Hướng dẫn nhóm 3 sinh viên làm đề tài cấp khoa',
    startDate: '2026-02-15',
    endDate: '2026-05-15',
    status: 'Hoàn thành',
    completionLevel: 100,
    note: 'Nghiệm thu đạt loại Tốt',
    evidences: [{ name: 'BienBanNghiemThu.pdf', size: 500000 }],
    createdBy: 'cbgv',
    createdAt: '2026-02-15',
    usedInPeriods: ['K20261']
  }
];
