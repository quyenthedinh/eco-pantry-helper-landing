# Eco-Pantry Helper — Landing page

Landing page tiếng Việt giới thiệu ứng dụng của nhóm, theo tài liệu tổng quan và tab DATA ngày 25/10/2026. Website chỉ dùng để giới thiệu và marketing cho ứng dụng di động, cho phép người xem tải bản APK dùng thử trên Android, trong khi app chưa phát hành trên CH Play. Không cung cấp phiên bản web hoặc luồng dùng thử app. Dashboard phân tích thuộc sản phẩm nội bộ, không triển khai trên website này.

## Mở và chạy trong VS Code

Yêu cầu: Node.js 20 trở lên và VS Code. Dự án dùng HTML, CSS, JavaScript và máy chủ Node.js có sẵn; không cần cài thư viện, không cần API key hay tài khoản dịch vụ để chạy localhost.

### Cách 1: Nhấn F5

1. Giải nén `eco-pantry-helper-local.zip` nếu dùng bản ZIP.
2. Trong VS Code, chọn **File → Open Folder…** rồi mở thư mục chứa `package.json` và `index.html`.
3. Nhấn **F5** hoặc mở **Run and Debug**. Chọn **Eco-Pantry: localhost (Edge)** hoặc **Eco-Pantry: localhost (Chrome)**, tùy trình duyệt có trên máy.
4. VS Code tự chạy máy chủ và mở **http://localhost:5173**.

Cấu hình đã có trong `.vscode/launch.json` và `.vscode/tasks.json`. Không cần cài extension Live Server. Giữ terminal của tác vụ `Eco-Pantry: localhost` mở trong lúc xem trang.

### Cách 2: Chạy bằng terminal

Trong VS Code, chọn **Terminal → New Terminal**. Trên Windows PowerShell, chạy:

```powershell
npm.cmd run dev
```

Trên macOS/Linux hoặc terminal khác có npm:

```sh
npm run dev
```

Mở **http://localhost:5173**. Nếu muốn chạy trực tiếp bằng Node.js, dùng `node scripts/serve.mjs`.

### Sửa nội dung và dừng chương trình

- Sửa file, nhấn **Ctrl+S**, rồi tải lại trình duyệt bằng **F5** hoặc **Ctrl+F5** để xem bản mới. Server đọc trực tiếp mã nguồn, không cần build mỗi lần sửa.
- Để dừng máy chủ, chọn terminal đang chạy server và nhấn **Ctrl+C**. Đóng cửa sổ trình duyệt hoặc dừng trình debug không tự dừng terminal của server.
- Không mở `index.html` trực tiếp bằng đường dẫn `file://`; các JavaScript module cần được phục vụ qua localhost.
- Khi F5 đã mở server ở cổng 5173, dùng luôn server đó để xem trang.

### Nếu cổng 5173 đang được sử dụng

Dừng server cũ trong terminal bằng **Ctrl+C**, hoặc chạy ở cổng khác:

```powershell
npm.cmd run dev -- --port 5174
```

Sau đó mở **http://localhost:5174**. Cấu hình F5 mặc định vẫn dùng cổng 5173. Nếu terminal chưa tìm thấy `node` hoặc `npm.cmd`, cài Node.js rồi mở lại VS Code.

### Kiểm tra mã nguồn và xuất bản tĩnh

```powershell
npm.cmd run check
npm.cmd run build
```

`dist/` chứa website tĩnh để đưa lên hosting khi cần. Chạy localhost không cần `dist/`, cấu hình `.openai/` hoặc kết nối với website đã xuất bản trước đó.

## Các phần đang có

- Bộ chọn giá tháng/năm dùng radio HTML và CSS, chuyển giữa 39.000đ/tháng và 299.000đ/năm ngay cả khi JavaScript chưa tải. Hộp thông tin Premium đọc gói đang chọn.
- Bộ chọn “Dọn tủ bằng AI / Thực đơn & đi chợ” cũng dùng radio HTML và CSS, hỗ trợ bấm, chạm và phím mũi tên.
- Phần `#quet-hoa-don` giới thiệu quét hóa đơn trong app: chụp bằng camera, chọn ảnh có sẵn hoặc nhập tay, xem lại trước khi thêm vào tủ. Miễn phí 3 lượt/tuần, Premium không giới hạn. Hóa đơn trên website là minh họa.
- Màu sắc, kiểu chữ và nội dung “Về dự án” giữ bản đã thống nhất.

## Cấu trúc

- `index.html`: nội dung, điều hướng, SVG icons, thông tin SEO.
- `styles.css`: hệ màu dự án, typography, responsive và reduced motion.
- `polish.css`: bố cục mềm hơn, menu nổi, thẻ lệch nhẹ, khung ảnh tự nhiên, hover và responsive; sử dụng lại bảng màu hiện có.
- `header.css`: header ba cụm logo/menu/CTA theo bố cục tham khảo WeDo; menu điện thoại có biểu tượng, mô tả, đóng bằng Escape hoặc bấm bên ngoài.
- `main.js`: menu và hộp thông tin dự án/Premium; bộ chọn tính năng và giá dùng radio HTML/CSS.
- `app-release.js`: cấu hình đường dẫn APK, dung lượng và link Google Play chính thức khi phát hành.
- `marketing.css`: bố cục phần tải app và giao diện minh họa tĩnh.
- `typography.css`: thu gọn khoảng cách chữ, giữ phông chữ cũ.
- `receipt.css`: phần giới thiệu quét hóa đơn.
- `refine.css`: lớp tinh chỉnh nạp cuối cùng — cỡ chữ đọc được (đoạn văn 15–16px), theme thanh cuộn/vùng chọn chữ, lớp vân giấy nhẹ, ticker dải lợi ích, ánh sáng theo con trỏ trên thẻ, trạng thái “Sắp ra mắt” của nút Google Play.
- `.vscode/`: tác vụ chạy localhost, build và cấu hình F5 cho Edge/Chrome.
- `motion.js`: hiệu ứng cuộn, đánh dấu mục đang đọc, nút về đầu trang, FAQ và phần khám phá từng bước. Màn mở đầu: tiêu đề hiện từng dòng, ảnh mâm cơm mở ra, điện thoại trượt lên; tiêu đề các mục hiện từng dòng khi cuộn tới; chiều sâu theo cuộn (ảnh, điện thoại, con dấu, ảnh cuối trang). Nội dung luôn hiển thị nếu script lỗi; tôn trọng tùy chọn giảm chuyển động.
- `feedback.js`: chọn 1–5 sao, kiểm tra nội dung, xem lại/sửa góp ý rồi gửi bằng ứng dụng email của người xem (mailto, điền sẵn nội dung) hoặc sao chép. Website không lưu hay gửi dữ liệu.
- `assets/bua-com-viet.webp`: ảnh bữa cơm Việt được tạo riêng bằng công cụ ImageGen tích hợp.
- `scripts/`: development server và build không có dependency.

## Phạm vi tương tác

- Giới thiệu Dọn tủ AI và thực đơn → đi chợ → cất tủ bằng nội dung và hình minh họa tĩnh.
- Các tab, FAQ và phần hướng dẫn tương tác chỉ phục vụ việc đọc thông tin trên landing page.
- Nút “Tải APK dùng thử” ở đầu trang và phần tải app tải file thật `assets/downloads/Eco-Pantry.apk`. Các CTA giới thiệu tính năng dẫn tới `#tai-ung-dung` để người xem đọc hướng dẫn cài đặt.
- App chưa phát hành trên CH Play; đã bỏ link cửa hàng chung và huy hiệu Google Play khỏi giao diện đang hiển thị.
- Hướng dẫn cài APK chỉ dành cho Android; người dùng máy tính được hướng dẫn mở trang trên điện thoại.
- Giá Premium là thông tin giới thiệu; đăng ký và thanh toán thực hiện trong ứng dụng di động.
- Mục góp ý không thu thập dữ liệu trên website: người xem gửi qua email của chính họ. Người đã dùng app góp ý trong app (Tài khoản → Góp ý & báo lỗi), dữ liệu lưu ở Supabase.

Không có chức năng chọn nguyên liệu, gợi ý món, lập thực đơn, đi chợ hoặc cập nhật tủ chạy trên website. Không gọi Gemini, Supabase hay PayOS.

## Fanpage dự án

Fanpage chính thức do nhóm cung cấp: https://www.facebook.com/profile.php?id=61595234126584. Liên kết nằm ở thẻ giới thiệu cộng đồng sau phần tải app và chân trang, mở tab mới. Đây là liên kết trực tiếp; không nhúng Facebook SDK hoặc pixel. Logo `assets/facebook-logo.png` là file Primary Logo nguyên gốc trong Facebook Brand Asset Pack tải từ https://www.meta.com/brand/resources/facebook/logo/; giữ nguyên màu xanh, chữ f trắng và tỉ lệ ảnh.

## Bản APK dùng thử

- APK nằm ở **GitHub Releases** của repo, không lưu trong thư mục web: https://github.com/quyenthedinh/eco-pantry-helper-landing/releases
- Nút “Tải APK dùng thử” trỏ tới `https://github.com/quyenthedinh/eco-pantry-helper-landing/releases/latest/download/Eco-Pantry.apk`, luôn là bản phát hành mới nhất.
- Phát hành APK mới: vào **Releases → Draft a new release**, đặt tag mới (ví dụ `v1.0.1`), đính kèm file **đúng tên `Eco-Pantry.apk`** rồi bấm **Publish release**. Không cần sửa code; chỉ cập nhật `APP_RELEASE.apkSizeBytes` nếu muốn hiện đúng dung lượng.
- Không commit file `.apk` vào repo: mỗi bản sẽ làm repo nặng thêm và Vercel phải tải lại cả file mỗi lần deploy.

## Cập nhật link Google Play khi phát hành

Mở `app-release.js`, gán link chính thức dạng `https://play.google.com/store/apps/details?id=...` vào `APP_RELEASE.officialGooglePlayUrl`. Chỉ dùng package ID thật do nhóm cung cấp. Khi cấu hình hợp lệ, website tự cập nhật trạng thái phát hành, nút Google Play và các CTA tải app. Để trống khi chưa có: trang dùng nút tải APK thật và hiện hướng dẫn cài Android. Khi có link Google Play hợp lệ, nút tải tự chuyển sang Google Play và ẩn hướng dẫn cài APK.

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
