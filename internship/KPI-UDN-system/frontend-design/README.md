# KPI MIS UDN — Frontend

Đây là frontend demo của hệ thống quản lý và đánh giá KPI — Đại học Đà Nẵng. Ứng dụng được xây dựng bằng React, Vite và Ant Design, hiện đang chạy với dữ liệu mock để đội ngũ có thể tiếp tục phát triển giao diện, luồng nghiệp vụ và tích hợp API.

## Bắt đầu trong vài phút

### Yêu cầu môi trường

- Node.js 20 trở lên (workspace này đã được kiểm tra với Node.js 22).
- npm 10 trở lên.

### Cài đặt và chạy local

```bash
npm ci
npm run dev
```

Mở địa chỉ Vite in trong terminal, thông thường là `http://localhost:5173`.

Trên Windows PowerShell nếu chính sách thực thi chặn `npm.ps1`, dùng các lệnh tương đương sau:

```powershell
npm.cmd ci
npm.cmd run dev
```

### Các lệnh thường dùng

| Lệnh | Mục đích |
| --- | --- |
| `npm run dev` | Chạy server phát triển với HMR |
| `npm run build` | Tạo bản build production trong `dist/` |
| `npm run preview` | Chạy thử bản build production |
| `npm run lint` | Kiểm tra mã nguồn trong `src/` bằng Oxlint |
| `npm run check` | Chạy lint và build liên tiếp trước khi bàn giao |

## Tài khoản demo

Frontend hiện dùng mock authentication trong `src/contexts/AuthContext.jsx`. Tài khoản và mật khẩu giống nhau:

| Tài khoản | Mật khẩu | Vai trò | Màn hình mặc định |
| --- | --- | --- | --- |
| `admin` | `admin` | Quản trị viên | Dashboard hệ thống |
| `leader` | `leader` | Lãnh đạo đơn vị | Danh sách duyệt CBGV |
| `ld01` | `ld01` | Lãnh đạo đơn vị | Danh sách duyệt CBGV |
| `pgd` | `pgd` | Phó Giám đốc | Đánh giá lãnh đạo |
| `gd` | `gd` | Giám đốc | Duyệt tổng thể |
| `cbgv` | `cbgv` | Cán bộ, giảng viên | Tự đánh giá cá nhân |

Đây chỉ là tài khoản phục vụ demo, không dùng cho môi trường thật. Trạng thái đăng nhập được lưu ở `localStorage` cùng với dữ liệu mock của kỳ đánh giá và nhiệm vụ cá nhân. Nếu cần đưa demo về trạng thái ban đầu, hãy đăng xuất rồi xóa các key `token`, `role`, `userInfo`, `mock_periods_v8` và `mock_tasks` trong localStorage của trình duyệt.

## Các route chính

Sau khi đăng nhập, có thể mở trực tiếp các route dưới đây để kiểm tra từng nhóm màn hình:

| Nhóm | Route tiêu biểu |
| --- | --- |
| Dashboard và kỳ đánh giá | `/trang-chu`, `/ky-danh-gia`, `/ky-danh-gia/K2026Q2` |
| Vi phạm và báo cáo | `/vi-pham`, `/bao-cao`, `/bao-cao/K2026Q2/summary` |
| Cán bộ, giảng viên | `/cong-viec-ca-nhan`, `/tu-danh-gia`, `/tu-danh-gia/K2026Q2` |
| Lãnh đạo đơn vị | `/duyet-cbgv`, `/duyet-cbgv/K2026Q2`, `/duyet-cbgv/K2026Q2/summary` |
| Phó Giám đốc | `/danh-gia-lanh-dao`, `/danh-gia-lanh-dao/K2026Q2` |
| Giám đốc | `/duyet-tong-the`, `/duyet-tong-the/K2026Q2` |

## Bố cục source code

```text
Dev_FE/
├── src/
│   ├── components/          # Component dùng chung và layout chính
│   ├── contexts/            # Auth, kỳ đánh giá, nhiệm vụ và vi phạm
│   ├── modules/              # Tính năng nghiệp vụ, chia theo vai trò
│   │   ├── BaoCao/           # Báo cáo thống kê
│   │   ├── CaNhan/           # Công việc và tự đánh giá cá nhân
│   │   ├── GiamDoc/          # Duyệt tổng thể
│   │   ├── KyDanhGia/        # Quản lý kỳ đánh giá
│   │   ├── PhoGiamDoc/       # Đánh giá lãnh đạo
│   │   ├── TrangChu/         # Dashboard
│   │   ├── TruongDonVi/      # Duyệt kết quả CBGV
│   │   ├── ViPham/           # Quản lý vi phạm KPI
│   │   └── XacThuc/          # Đăng nhập
│   ├── mocks/                # Dữ liệu người dùng phục vụ demo
│   ├── assets/               # Logo, hình ảnh và biểu mẫu dùng bởi ứng dụng
│   ├── App.jsx               # Router và phân quyền route
│   └── main.jsx              # Điểm khởi động React và theme Ant Design
├── public/                   # File public phục vụ trực tiếp
├── dist/                     # Bản build hiện tại, được tạo lại bằng npm run build
├── docs/                     # Tài liệu, QA và tooling; không tham gia runtime
├── package.json              # Script và dependency
└── vite.config.js            # Cấu hình Vite
```

## Điểm nên đọc trước khi bắt đầu phát triển

- `src/App.jsx`: toàn bộ route, route guard và điều hướng mặc định theo role.
- `src/contexts/AuthContext.jsx`: điểm thay thế mock login bằng API xác thực thật.
- `src/contexts/PeriodContext.jsx`: dữ liệu và thao tác kỳ đánh giá.
- `src/contexts/TaskContext.jsx`: dữ liệu nhiệm vụ/công việc cá nhân.
- `src/contexts/ViolationContext.jsx`: dữ liệu và thao tác vi phạm KPI.
- `src/components/layout/`: khung giao diện chung, sidebar và header.
- `src/styles/variables.css`, `src/index.css`, `src/App.css`: token màu và style nền tảng.

Khi tích hợp backend, nên giữ nguyên route và contract của các context trước, sau đó thay phần mock bằng service/API riêng. Không đưa token, URL môi trường hoặc thông tin nhạy cảm trực tiếp vào component; dùng `.env.local` và không commit file này.

## Quy ước khi thêm tính năng

1. Tạo module nghiệp vụ trong `src/modules/<TenTinhNang>/`, tách `pages/` và `components/` khi cần.
2. Component dùng cho nhiều module đặt trong `src/components/`.
3. State dùng xuyên nhiều màn hình đặt trong context tương ứng; state chỉ phục vụ một màn hình nên giữ ở page/component đó.
4. Asset cần cho demo phải để trong `src/assets/` hoặc `public/`. Không import file từ `docs/` vào runtime.
5. Sau mỗi thay đổi lớn chạy `npm run check` và kiểm tra ít nhất một route của role bị ảnh hưởng.
