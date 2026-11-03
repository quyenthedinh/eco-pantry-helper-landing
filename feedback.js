// Nothing is transmitted or stored by the website; the visitor sends the draft by email.
const form = document.getElementById('feedback-form');
const preview = document.getElementById('feedback-preview');
const message = document.getElementById('feedback-message');
const topic = document.getElementById('feedback-topic');
const radios = [...form.querySelectorAll('input[name="rating"]')];
radios.forEach(radio => radio.setAttribute('aria-describedby', 'rating-description rating-error'));
const labels = ['Rất chưa hài lòng', 'Chưa hài lòng', 'Tạm ổn', 'Hài lòng', 'Rất hài lòng'];
let draft;

function setFieldError(name, text = '') {
  const error = document.getElementById(`${name}-error`);
  error.textContent = text;
  error.hidden = !text;
  const fields = name === 'rating' ? radios : [form.elements.namedItem(name)];
  fields.forEach(field => {
    if (text) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  });
}
radios.forEach(radio => radio.addEventListener('change', () => {
  const score = Number(radio.value);
  radios.forEach(item => item.closest('label').classList.toggle('filled', Number(item.value) <= score));
  document.getElementById('rating-description').textContent = `${score}/5 — ${labels[score - 1]}`;
  setFieldError('rating');
}));
message.addEventListener('input', () => {
  document.getElementById('message-counter').textContent = `${message.value.length.toLocaleString('vi-VN')} / 2.000`;
  setFieldError('message');
});
topic.addEventListener('change', () => setFieldError('topic'));
form.addEventListener('submit', event => {
  event.preventDefault();
  const selected = radios.find(radio => radio.checked);
  let invalid;
  if (!selected) { setFieldError('rating', 'Bạn hãy chọn từ 1 đến 5 sao nhé.'); invalid = radios[0]; }
  if (!topic.value) { setFieldError('topic', 'Bạn hãy chọn phần muốn góp ý nhé.'); invalid ||= topic; }
  if (message.value.trim().length < 10 || message.value.length > 2000) { setFieldError('message', 'Bạn hãy chia sẻ từ 10 đến 2.000 ký tự nhé.'); invalid ||= message; }
  if (invalid) { invalid.focus(); return; }
  draft = { rating: Number(selected.value), topic: topic.selectedOptions[0].textContent, message: message.value.trim(), createdAt: new Date() };
  document.getElementById('feedback-review-rating').textContent = `${draft.rating}/5 — ${labels[draft.rating - 1]}`;
  document.getElementById('feedback-review-topic').textContent = draft.topic;
  document.getElementById('feedback-review-time').textContent = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(draft.createdAt) + ' (giờ Việt Nam)';
  // textContent keeps the user's feedback as text, including HTML-like input.
  document.getElementById('feedback-review-message').textContent = draft.message;
  form.hidden = true;
  preview.hidden = false;
  document.getElementById('feedback-preview-title').focus({ preventScroll: true });
  preview.scrollIntoView({ behavior: 'instant', block: 'nearest' });
});
document.getElementById('feedback-edit').addEventListener('click', () => {
  preview.hidden = true;
  form.hidden = false;
  message.focus({ preventScroll: true });
});
// Website keeps nothing: the visitor sends the draft from their own email app.
const TEAM_EMAIL = 'quyenthedinh@gmail.com';
function draftText() {
  return `Đánh giá: ${draft.rating}/5 — ${labels[draft.rating - 1]}
Nội dung: ${draft.topic}
Thời gian: ${document.getElementById('feedback-review-time').textContent}

${draft.message}
`;
}
function notify(text) {
  const toast = document.querySelector('.toast');
  if (!toast) return;
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => { toast.hidden = true; }, 3200);
}
document.getElementById('feedback-send').addEventListener('click', event => {
  if (!draft) { event.preventDefault(); return; }
  const subject = `Góp ý landing page Eco-Pantry (${draft.rating}/5)`;
  event.currentTarget.href = `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draftText())}`;
  notify('Đang mở ứng dụng email. Nếu không thấy, hãy dùng “Sao chép nội dung”.');
});
document.getElementById('feedback-copy').addEventListener('click', async () => {
  if (!draft) return;
  try {
    await navigator.clipboard.writeText(`Gửi tới: ${TEAM_EMAIL}

${draftText()}`);
    notify(`Đã sao chép. Dán vào email gửi tới ${TEAM_EMAIL}.`);
  } catch {
    notify(`Không sao chép được. Bạn có thể gửi góp ý tới ${TEAM_EMAIL}.`);
  }
});

// The website itself never collects feedback.
const footerLink = document.createElement('a');
footerLink.href = '#gop-y';
footerLink.textContent = 'Góp ý';
document.querySelector('.footer-top nav').prepend(footerLink);
form.inert = false;
