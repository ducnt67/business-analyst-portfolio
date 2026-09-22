# Hệ thống đánh giá KPI tại Đại học Đà Nẵng

## 1. Bối cảnh

Trong kỳ thực tập hè tại Trung tâm Công nghệ thông tin và Học liệu số - Đại học Đà Nẵng, mình tham gia dự án phân tích và thiết kế hệ thống đánh giá KPI, xếp loại mức độ hoàn thành nhiệm vụ và xét thi đua.

Quy trình có nhiều cấp tham gia: cán bộ/giảng viên, lãnh đạo đơn vị, Phó Giám đốc, Ban Tổ chức Cán bộ và Giám đốc Đại học Đà Nẵng. Dữ liệu cần liên kết gồm kỳ đánh giá, công việc cá nhân, phiếu tự đánh giá, vi phạm, kết quả xét duyệt và quyết định cuối cùng.

## 2. Vai trò và phạm vi trực tiếp thực hiện

**Vai trò:** Business Analyst.

Đây là dự án cá nhân trong kỳ thực tập. Các công việc từ khảo sát, phân tích nghiệp vụ, đặc tả yêu cầu đến thiết kế hệ thống và frontend demo.

Trực tiếp thực hiện:

- Phỏng vấn/trao đổi để thu thập và làm rõ yêu cầu.
- Phân tích quy trình và trách nhiệm của từng actor.
- Xây dựng quy trình TO-BE.
- Mô hình hóa BPMN.
- Thiết kế Use Case Diagram và đặc tả các use case trọng tâm.
- Xác định business rules và yêu cầu phi chức năng.
- Thiết kế ERD tổng quát, phân nhóm thực thể và dữ liệu.
- Thiết kế frontend theo vai trò và luồng xử lý.

Phần thiết kế cơ sở dữ liệu mới dừng ở mức cơ bản, đủ để định hình các thực thể và quan hệ chính phục vụ hệ thống; chưa đi sâu đến thiết kế cơ sở dữ liệu cho môi trường vận hành thật.

## 3. Bài toán nghiệp vụ

Quy trình đánh giá thi đua khen thưởng cần quản lý tập trung nhiều loại dữ liệu và nhiều cấp phê duyệt. Khi xử lý thủ công bằng văn bản và biểu mẫu rời rạc, thời gian luân chuyển hồ sơ kéo dài, việc theo dõi tiến độ khó khăn và minh chứng cho kết quả đánh giá chưa được tập hợp thống nhất.

Nhóm người dùng trọng tâm gồm Phòng Tổ chức Cán bộ, cán bộ/giảng viên, trưởng đơn vị và các cấp lãnh đạo tham gia xét duyệt. Giải pháp cần vừa bảo đảm đúng thẩm quyền, vừa dễ sử dụng với những người chưa phổ cập nhiều về công nghệ thông tin.

Giải pháp được phân tích theo hướng số hóa toàn bộ chu trình:

`Tạo kỳ đánh giá → Cấu hình đối tượng → Ghi nhận công việc/minh chứng → Tự đánh giá → Xác nhận vi phạm → Xét duyệt cấp đơn vị → Đề xuất cấp Phó Giám đốc → Duyệt tổng thể → Báo cáo`

## 4. Khai thác yêu cầu và thiết kế quy trình

Mình đã phỏng vấn cán bộ/giảng viên và các trưởng ban để hiểu quy trình đang vận hành, các khó khăn khi xử lý thủ công và trách nhiệm của từng cấp. Từ thông tin thu thập được, mình phân tích quy trình hiện tại, xác định điểm cần tối ưu và đề xuất quy trình mới được hỗ trợ bởi hệ thống.

Trọng tâm của quy trình mới là:

- Rút ngắn thời gian xử lý văn bản và hồ sơ qua từng cấp.
- Tập trung minh chứng liên quan đến công việc và kết quả đánh giá.
- Bảo đảm mỗi cấp chỉ nhìn thấy và xử lý đúng phần việc thuộc thẩm quyền.
- Giảm thao tác phức tạp cho CBGV, trưởng đơn vị và người dùng ít sử dụng công nghệ.
- Giữ nguyên logic cốt lõi của quy trình đánh giá của Đại học Đà Nẵng, đồng thời số hóa các bước thủ công.

## 5. Các nhóm chức năng đã phân tích

- Xác thực người dùng.
- Quản lý kỳ đánh giá.
- Quản lý công việc cá nhân.
- Lập và gửi phiếu tự đánh giá.
- Quản lý và xác nhận vi phạm KPI.
- Xét duyệt kết quả CBGV.
- Đề xuất mức thi đua lãnh đạo đơn vị.
- Duyệt tổng thể kết quả đánh giá.
- Báo cáo và thống kê.

Hai nhóm chức năng nghiệp vụ trung tâm là:

- **Phòng Tổ chức Cán bộ:** cấu hình kỳ đánh giá, quản lý đối tượng, theo dõi tiến độ, quản lý vi phạm và trình kết quả.
- **Cán bộ/giảng viên và trưởng đơn vị:** CBGV tự đánh giá, cập nhật công việc/minh chứng; trưởng đơn vị xác nhận vi phạm và đề xuất đánh giá CBGV thuộc đơn vị.

## 6. Quy tắc nghiệp vụ trọng tâm

Quy tắc quan trọng nhất là bảo đảm đúng chức năng và thẩm quyền của từng cấp trong quá trình xét duyệt, đồng thời tối ưu luồng xử lý để người dùng có thể hoàn thành công việc dễ dàng.

Một số nguyên tắc thể hiện trong thiết kế:

- CBGV chỉ được thao tác trên dữ liệu cá nhân của mình.
- Lãnh đạo đơn vị chỉ xem và xử lý CBGV thuộc phạm vi quản lý.
- Ban Tổ chức Cán bộ quản lý kỳ, đối tượng tham gia, vi phạm và trình kết quả.
- Lãnh đạo thuộc phạm vi Phó Giám đốc đi qua bước đề xuất của Phó Giám đốc.
- Lãnh đạo thuộc phạm vi Giám đốc được xử lý trực tiếp ở bước quyết định tổng thể.
- Sau khi xác nhận một số kết quả quan trọng, dữ liệu bị khóa để bảo đảm tính nhất quán và truy vết.

## 7. Artefact đã thực hiện

- Quy trình TO-BE tổng quan.
- Quy trình cập nhật công việc và lập phiếu tự đánh giá.
- Quy trình xử lý vi phạm, xét duyệt và phê duyệt nhiều cấp.
- Use Case Diagram tổng quát và theo vai trò.
- Đặc tả use case với main flow, alternative flow, exception flow và business rules.
- Yêu cầu phi chức năng.
- ERD tổng quát và phân nhóm dữ liệu.
- Mô tả màn hình, điều hướng và frontend theo vai trò.

## 8. Kết quả và giới hạn

Mình đã hoàn thành gần đầy đủ bộ nội dung SRS/phân tích thiết kế cho hệ thống, bao gồm quy trình, yêu cầu, use case, business rules, giao diện và mô hình dữ liệu ở mức cơ bản. Dự án tập trung vào tối ưu một quy trình nghiệp vụ cốt lõi đã có sẵn, không phải xây dựng lại quy trình từ đầu.

Vì quy trình nghiệp vụ đã được Đại học Đà Nẵng sử dụng và có tính cốt lõi, trọng tâm của dự án không phải xử lý một hệ thống nhiều lỗi phát sinh. Giá trị chính nằm ở việc số hóa thao tác thủ công, rút ngắn thời gian luân chuyển, tăng khả năng truy vết minh chứng và bảo đảm đúng quyền hạn của từng cấp.

Mình không đưa ra phần trăm hoặc số phút tiết kiệm vì mình phụ trách phân tích và thiết kế SRS, không trực tiếp vận hành hệ thống với người dùng trong một kỳ đánh giá thực tế. Các lợi ích trên là **mục tiêu thiết kế và giá trị kỳ vọng**, không phải số liệu đo lường sau triển khai.

## 9. Minh chứng trực tiếp

Các artefact dưới đây là bằng chứng trực tiếp cho phần phân tích và mô hình hóa do mình thực hiện:

### BPMN To-Be tổng quan

![BPMN To-Be tổng quan](<bpmn-ucd/DanhgiaKPI-BPMN TO-BE.drawio.png>)

### BPMN cập nhật công việc và tự đánh giá

![BPMN cập nhật công việc và tự đánh giá](<DanhgiaKPI-TO-BE - Quy trình CBGV cập nhật công việc và lập phiếu tự đánh giá.drawio.png>)

### BPMN xử lý vi phạm và xét duyệt nhiều cấp

![BPMN xử lý vi phạm và xét duyệt nhiều cấp](<DanhgiaKPI-TO-BE - Quy trình Xử lý vi phạm, xét duyệt và phê duyệt qua các cấp.drawio.png>)

### Use Case Diagram tổng quan

![Use Case Diagram tổng quan](<DanhgiaKPI-UCD-tổng quan.drawio.png>)

### Use Case Diagram phân rã

![Use Case Diagram phân rã](<DanhgiaKPI-UCD-Phân rã.drawio.png>)

## 10. Tài liệu tham khảo của dự án

- [Tóm tắt nội dung phỏng vấn](https://docs.google.com/document/d/1FzZFnxQRdgAdb1zrFqjLVWcLoKyA2e8N7n9FZzLNr1Q/edit?usp=sharing)
- [Video demo frontend](https://youtu.be/xeyxYQ3XScs)
- [Báo cáo thực tập](internship-report/internship-report.docx)

## 11. Công nghệ và sản phẩm liên quan

Frontend demo được tổ chức bằng React, Vite, Ant Design và JavaScript, sử dụng dữ liệu mock để mô phỏng các vai trò và luồng nghiệp vụ. Source code được chia theo module: cá nhân, kỳ đánh giá, trưởng đơn vị, Phó Giám đốc, Giám đốc, vi phạm và báo cáo.

Xem thêm: [Frontend README](frontend-design/README.md) · [Báo cáo thực tập](internship-report/internship-report.docx)

## 12. Bài học BA

Qua dự án này, mình hiểu rõ rằng một yêu cầu không chỉ là một màn hình hoặc một nút chức năng. Cần làm rõ actor, phạm vi dữ liệu, điều kiện chuyển trạng thái, quyền thao tác, ngoại lệ, tính dễ sử dụng và khả năng truy vết để một quy trình nhiều cấp có thể vận hành nhất quán.
