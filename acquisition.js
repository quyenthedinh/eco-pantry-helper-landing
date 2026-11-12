// Outcome 3 – G3.3: ghi nhận khách đến từ kênh nào.
// App cài từ APK nên không đọc được dữ liệu trình duyệt: trang giữ UTM đầu tiên (first-touch, 30 ngày)
// rồi chuyển sang app qua link pantrio://open?utm_... khi khách bấm "Mở app để đăng ký".
const KEY = 'pantrio_utm';
const TTL = 30 * 24 * 3600 * 1000;
const FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && Date.now() - saved.at < TTL) return saved;
    localStorage.removeItem(KEY);
  } catch { /* Trình duyệt chặn lưu trữ: vẫn dùng UTM của lần mở này */ }
  return null;
}

export function captureAcquisition() {
  const params = new URLSearchParams(location.search);
  const current = {};
  for (const field of FIELDS) {
    const value = params.get(field)?.trim().toLowerCase().slice(0, 100);
    if (value) current[field] = value;
  }
  let utm = read();
  if (!utm && current.utm_source) {
    utm = { ...current, at: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(utm)); } catch { /* bỏ qua */ }
  }
  const query = new URLSearchParams();
  for (const field of FIELDS) if (utm?.[field]) query.set(field, utm[field]);
  const href = `pantrio://open${query.size ? `?${query}` : ''}`;
  document.querySelectorAll('[data-open-app]').forEach(link => { link.href = href; });
}
