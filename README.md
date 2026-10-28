# Eco-Pantry Helper — Landing page

Landing page tiếng Việt giới thiệu ứng dụng của nhóm, theo tài liệu tổng quan và tab DATA ngày 25/10/2026. Bản này tập trung vào người dùng gia đình; dashboard phân tích là phần quản trị nội bộ, không đưa vào luồng công khai.

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
- `main.js`: menu di động, tab tính năng, chu kỳ giá, thực đơn mẫu và các modal.
- `feedback.js`: chọn 1–5 sao, kiểm tra nội dung, xem lại/sửa/tải bản nháp góp ý. Chưa gửi hoặc lưu phản hồi trực tuyến.
- `assets/bua-com-viet.webp`: ảnh bữa cơm Việt được tạo riêng bằng công cụ ImageGen tích hợp.
- `scripts/`: development server và build không có dependency.

## Phạm vi tương tác

- Dọn tủ minh họa: chọn nguyên liệu, xem công thức mẫu phù hợp lựa chọn, nấu xong và trừ đúng lượng dùng trong tủ mẫu. Có thể đặt lại.
- Thực đơn minh họa: chọn 3/5/7 ngày, cộng nguyên liệu và trừ tồn kho mẫu, tick món đã mua, bắt buộc chọn ngăn cho thịt/cá, rồi cất các món đã chọn. Món chưa mua được giữ trên danh sách mẫu.
- Bảng giá: 39.000đ/tháng hoặc 299.000đ/năm; giảm khoảng 36% so với 12 tháng mua riêng.
- FAQ và thông tin Premium/dự án.
- Mục góp ý `#gop-y`, lối vào từ menu và bản trải nghiệm. Bản hiện tại chỉ xem trước/tải bản nháp trên thiết bị, không thu thập phản hồi lên máy chủ. Hướng dẫn hoàn tất tiêu chí nằm ở `docs/G1.3-feedback-evidence.md`.

Các trải nghiệm được ghi rõ là dữ liệu mẫu, chỉ nằm trong bộ nhớ. Không gọi Gemini, Supabase hoặc PayOS; không thu dữ liệu khách, không xử lý thanh toán. Chưa có link tải thật được cung cấp, nên CTA dẫn đến trải nghiệm mẫu thay vì dựng link App Store hoặc Google Play giả.

## Nội dung cần thay khi ra mắt

- Thay giao diện minh họa bằng ảnh chụp app thực tế khi sẵn sàng.
- Thêm link tải Android/iOS chính thức và chính sách của nhóm trước khi phát hành.
- Kiểm tra lại giá/hạn mức nếu chính sách sản phẩm thay đổi.
- Google Fonts tải Newsreader và Be Vietnam Pro; nếu ngoại tuyến, trang dùng font hệ thống dự phòng.

## Tham khảo bố cục và cách kể câu chuyện

- https://www.grab.com/vn/ — định vị lợi ích và giới thiệu nhóm dịch vụ.
- https://samsungfood.com/ — kết nối lập thực đơn, nguyên liệu và đi chợ.
- https://kitchenpalapp.com/en/ — quản lý thực phẩm, hạn dùng và gợi ý món.

Không sử dụng lời chứng thực, lượt tải, đánh giá, số liệu tiết kiệm hoặc logo đối tác chưa được nhóm xác nhận.

## Ảnh của dự án

Tạo bằng công cụ ImageGen tích hợp (không dùng CLI/API key). Prompt: “Premium editorial overhead photograph of an authentic Vietnamese family dinner on warm ivory linen: braised chicken, vegetable and tofu soup, stir-fried morning glory, rice bowls, wooden chopsticks and fresh herbs. Natural afternoon light, warm cream and forest green palette, realistic food styling, no text, no logos, no people, no UI.”
