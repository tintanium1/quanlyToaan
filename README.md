# HỆ THỐNG QUẢN LÝ ÁN & NGHIỆP VỤ TỐ TỤNG TÒA ÁN NHÂN DÂN
> Ứng dụng số hóa công tác thụ lý, theo dõi thời hạn chuẩn bị xét xử, phân công Thẩm phán, lịch phiên tòa và soạn thảo biểu mẫu theo quy định Bộ luật Tố tụng và Nghị quyết 05/2017/NQ-HĐTP.

---

## 🏛️ Giới thiệu chung

Hệ thống được thiết kế chuyên biệt phục vụ công tác nghiệp vụ tại Tòa án nhân dân, hỗ trợ quản lý xuyên suốt các giai đoạn tố tụng từ khi tiếp nhận đơn, thụ lý, phân công cán bộ, áp dụng biện pháp ngăn chặn, lên lịch xét xử đến ban hành bản án và lưu trữ.

---

## ✨ Tính năng nổi bật

1. **Phân quyền vai trò nghiệp vụ (RBAC):**
   - **Cán bộ Tổng hợp:** Tiếp nhận đơn, nhập thụ lý ban đầu, xuất báo cáo.
   - **Lãnh đạo Tòa án (Chánh án / Phó Chánh án):** Phân công Thẩm phán, Hội thẩm, ký gia hạn thời hạn chuẩn bị xét xử, phê duyệt chỉ tiêu.
   - **Thẩm phán chủ tọa:** Quản lý án được giao, ký Lệnh tạm giam (Điều 278 BLTTHS), ban hành Quyết định đưa vụ án ra xét xử, Bản án sơ thẩm.
   - **Thư ký Tòa án:** Quản lý tiến trình, lập biên bản, lên lịch phiên tòa, tống đạt giấy triệu tập.
   - **Quản trị viên (Admin):** Quản lý tài khoản, cấu hình đơn vị và sao lưu dữ liệu.

2. **Lịch xét xử & Phiên tòa (Trial Calendar):**
   - Xem lịch phiên tòa theo dạng **Lịch tháng trực quan** (Thứ 2 đến Chủ nhật).
   - Nhấp vào từng ngày để xem danh sách chi tiết phiên tòa, thành phần Hội đồng xét xử, phòng xử, kiểm sát viên và đương sự.
   - Tác vụ nhanh: In lịch xét xử tháng (chuẩn thể thức tư pháp), in Giấy triệu tập, cập nhật hoãn phiên tòa hoặc tuyên án.

3. **Soạn thảo Lệnh & Quyết định kiểu Word (WYSIWYG 100% không cần code):**
   - Soạn thảo và chỉnh sửa trực tiếp trên trang giấy A4 (căn lề chuẩn Nghị định 30/2020/NĐ-CP).
   - Thanh công cụ định dạng chữ đầy đủ như Microsoft Word: Phông chữ Times New Roman, cỡ chữ, căn đều 2 bên, thụt lề, bảng biểu, in đậm, in nghiêng...
   - Tương thích 2 chiều: Tải về file Word (`.doc`) hoặc nạp tệp Word (`.docx`) từ máy tính vào hệ thống.
   - Lưu trữ bản chỉnh sửa theo từng vụ án.

4. **Quản lý biểu mẫu tố tụng & Tải tệp Word (.docx):**
   - Tích hợp sẵn bộ 60 biểu mẫu hình sự chuẩn theo Nghị quyết 05/2017/NQ-HĐTP.
   - Hỗ trợ thêm biểu mẫu mới bằng cách tải trực tiếp tệp Word (`.docx`), tự động nhận diện tiêu đề, lĩnh vực và các thẻ biến động (`{{TEN_TOA_AN}}`, `{{SO_VU_AN}}`, `{{THAM_PHAN_CHU_TOA}}`...).

5. **Giám sát thời hạn & Cảnh báo âm thanh:**
   - Đếm ngược thời hạn chuẩn bị xét xử và thời hạn tạm giam theo thời gian thực.
   - Chuông và thông báo tự động khi án sắp hết hạn (< 15 ngày, < 7 ngày hoặc quá hạn).

6. **Trung tâm tùy chỉnh hệ thống:**
   - Tùy chỉnh tên Tòa án, Chánh án, địa chỉ, số điện thoại, con dấu.
   - Tùy chỉnh chỉ tiêu thi đua giải quyết án (Hình sự, Dân sự, HNGĐ, KDTM, Hành chính, Lao động).
   - Sao lưu (Export JSON) và Khôi phục (Import JSON) toàn bộ cơ sở dữ liệu.

---

## 🚀 Hướng dẫn cài đặt & Chạy trên máy tính (Local)

### Yêu cầu môi trường
- Đã cài đặt [Node.js](https://nodejs.org/) (Phiên bản 18 trở lên).
- Đã cài đặt Git.

### Các bước thực hiện:
```bash
# 1. Clone dự án về máy tính
git clone https://github.com/<tai-khoan-cua-ban>/<ten-repository>.git

# 2. Di chuyển vào thư mục dự án
cd <ten-repository>

# 3. Cài đặt các thư viện cần thiết
npm install

# 4. Chạy môi trường phát triển (Development)
npm run dev
```

Mở trình duyệt web và truy cập địa chỉ: `http://localhost:3000`

---

## 🌐 Triển khai (Deploy) để mọi người cùng truy cập Online

### Cách 1: Triển khai nhanh & miễn phí với Vercel (Khuyên dùng)
1. Đăng ký tài khoản miễn phí tại [Vercel](https://vercel.com) (đăng nhập bằng tài khoản GitHub).
2. Nhấp vào **"Add New..."** ➔ Chọn **"Project"**.
3. Chọn Repository dự án của bạn trên GitHub và nhấn **"Import"**.
4. Giữ nguyên các thông số mặc định (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).
5. Nhấn **"Deploy"**. Sau khoảng 1 phút, bạn sẽ nhận được đường link web (ví dụ: `https://quanlytoaan.vercel.app`) để gửi cho mọi người truy cập trên máy tính hoặc điện thoại.

### Cách 2: Triển khai với Netlify
1. Đăng ký tài khoản tại [Netlify](https://www.netlify.com).
2. Chọn **"Add new site"** ➔ **"Import an existing project"** ➔ Chọn **GitHub**.
3. Chọn repository và nhấn **"Deploy"**.

---

## 🛠️ Công nghệ sử dụng
- **Frontend:** React 19, TypeScript, Vite.
- **Giao diện:** Tailwind CSS, Lucide Icons, Motion.
- **Xử lý tài liệu:** Mammoth.js (xử lý file Word `.docx`), HTML-to-Word Converter.
- **Lưu trữ:** Web Storage API (LocalStorage) & JSON Export/Import.
