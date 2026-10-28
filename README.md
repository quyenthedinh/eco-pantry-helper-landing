# Eco-Pantry Helper — Landing page

Landing page tiếng Việt giới thiệu ứng dụng của nhóm, theo tài liệu tổng quan và tab DATA ngày 25/10/2026. Website chỉ dùng để giới thiệu và marketing cho ứng dụng di động, hướng người xem sang Google Play. Không cung cấp phiên bản web hoặc luồng dùng thử app. Dashboard phân tích thuộc sản phẩm nội bộ, không triển khai trên website này.

## Chạy dự án

Cần Node.js 20 trở lên. Không cần cài thư viện bên ngoài.

```sh
npm run dev
```

Mở http://localhost:5173. Có thể đổi cổng bằng biến môi trường `PORT`.

```sh
npm run check
npm run build
```

`dist/` chứa website tĩnh để triển khai. Server local chỉ phục vụ HTML, CSS, JavaScript và thư mục assets, không phục vụ file cấu hình.

## Cấu trúc

- `index.html`: nội dung, điều hướng, SVG icons, thông tin SEO.
- `styles.css`: hệ màu dự án, typography, responsive và reduced motion.
- `polish.css`: bố cục mềm hơn, menu nổi, thẻ lệch nhẹ, khung ảnh tự nhiên, hover và responsive; sử dụng lại bảng màu hiện có.
- `header.css`: header ba cụm logo/menu/CTA theo bố cục tham khảo WeDo; menu điện thoại có biểu tượng, mô tả, đóng bằng Escape hoặc bấm bên ngoài.
- `main.js`: menu, tab thông tin tính năng, bảng giá, hộp thông tin dự án/Premium.
- `app-release.js`: cấu hình link Google Play chính thức và link cửa hàng thử nghiệm.
- `marketing.css`: bố cục phần tải app và giao diện minh họa tĩnh.
- `motion.js`: hiệu ứng cuộn, đánh dấu mục đang đọc, nút về đầu trang, FAQ và phần khám phá từng bước; tôn trọng tùy chọn giảm chuyển động của thiết bị.
- `feedback.js`: chọn 1–5 sao, kiểm tra nội dung, xem lại/sửa/tải bản nháp góp ý. Chưa gửi hoặc lưu phản hồi trực tuyến.
- `assets/bua-com-viet.webp`: ảnh bữa cơm Việt được tạo riêng bằng công cụ ImageGen tích hợp.
- `scripts/`: development server và build không có dependency.

## Phạm vi tương tác

- Giới thiệu Dọn tủ AI và thực đơn → đi chợ → cất tủ bằng nội dung và hình minh họa tĩnh.
- Các tab, FAQ và phần hướng dẫn tương tác chỉ phục vụ việc đọc thông tin trên landing page.
- Các CTA tải app dẫn tới `#tai-ung-dung` khi chưa có link app chính thức.
- Google Play đang dùng link tạm `https://play.google.com/store/apps`, được ghi rõ là cửa hàng chung, chưa phải trang app.
- Giá Premium là thông tin giới thiệu; đăng ký và thanh toán thực hiện trong ứng dụng di động.
- Mục góp ý vẫn là giao diện xem lại/tải bản nháp trên thiết bị, chưa thu thập dữ liệu như người dùng đã chọn.

Không có chức năng chọn nguyên liệu, gợi ý món, lập thực đơn, đi chợ hoặc cập nhật tủ chạy trên website. Không gọi Gemini, Supabase hay PayOS.

## Cập nhật link Google Play khi phát hành

Mở `app-release.js`, gán link chính thức dạng `https://play.google.com/store/apps/details?id=...` vào `APP_RELEASE.officialGooglePlayUrl`. Chỉ dùng package ID thật do nhóm cung cấp. Khi cấu hình hợp lệ, website tự cập nhật trạng thái phát hành, nút Google Play và các CTA tải app. Để trống khi chưa có: trang giữ nhãn “Sắp có trên Google Play” và thông báo liên kết thử nghiệm.

## Nội dung cần thay khi ra mắt

- Thay giao diện minh họa bằng ảnh chụp app thực tế khi sẵn sàng.
- Thêm link Google Play chính thức và chính sách của nhóm trước khi phát hành; không tự tạo package ID hoặc gắn link ứng dụng khác.
- Kiểm tra lại giá/hạn mức nếu chính sách sản phẩm thay đổi.
- Google Fonts tải Newsreader và Be Vietnam Pro; nếu ngoại tuyến, trang dùng font hệ thống dự phòng.

## Tham khảo bố cục và cách kể câu chuyện

- Ảnh WEDO do nhóm cung cấp — bố cục tải ứng dụng căn giữa, tiêu đề lớn và huy hiệu cửa hàng. Eco-Pantry chỉ giới thiệu bản Android trên Google Play.
- Huy hiệu Google Play tiếng Việt: `assets/google-play-badge-vi.png`, tải từ `https://play.google.com/intl/en_us/badges/static/images/badges/vi_badge_web_generic.png`; giữ nguyên hình ảnh, tỉ lệ và khoảng trống của huy hiệu.
- https://www.grab.com/vn/ — định vị lợi ích và giới thiệu nhóm dịch vụ.
- https://samsungfood.com/ — kết nối lập thực đơn, nguyên liệu và đi chợ.
- https://kitchenpalapp.com/en/ — quản lý thực phẩm, hạn dùng và gợi ý món.

Không sử dụng lời chứng thực, lượt tải, đánh giá, số liệu tiết kiệm hoặc logo đối tác chưa được nhóm xác nhận.

## Ảnh của dự án

Tạo bằng công cụ ImageGen tích hợp (không dùng CLI/API key). Prompt: “Premium editorial overhead photograph of an authentic Vietnamese family dinner on warm ivory linen: braised chicken, vegetable and tofu soup, stir-fried morning glory, rice bowls, wooden chopsticks and fresh herbs. Natural afternoon light, warm cream and forest green palette, realistic food styling, no text, no logos, no people, no UI.”
