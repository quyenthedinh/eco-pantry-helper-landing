// Replace only officialGooglePlayUrl when the team's actual Play listing is ready.
// Until then, the store badges show a coming-soon state instead of opening the generic store.
export const APP_RELEASE = Object.freeze({
  officialGooglePlayUrl: '',
  previewGooglePlayUrl: 'https://play.google.com/store/apps',
});

export function configureDownloadLinks() {
  let officialUrl = null;
  try {
    const url = new URL(APP_RELEASE.officialGooglePlayUrl);
    if (url.protocol === 'https:' && url.hostname === 'play.google.com' && url.pathname === '/store/apps/details' && url.searchParams.get('id')) officialUrl = url.href;
  } catch { /* Keep the honest, explicitly temporary store link. */ }
  document.querySelectorAll('[data-store-link]').forEach(link => {
    if (officialUrl) {
      link.href = officialUrl;
      link.removeAttribute('data-coming-soon');
      link.setAttribute('aria-label', 'Tải Eco-Pantry Helper trên Google Play');
      return;
    }
    // Until the listing exists, the badge explains itself instead of opening the generic store.
    link.removeAttribute('href');
    link.removeAttribute('target');
    link.setAttribute('role', 'link');
    link.setAttribute('tabindex', '0');
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('data-coming-soon', '');
    link.setAttribute('aria-label', 'Google Play — Eco-Pantry Helper sắp ra mắt');
    const explain = event => {
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      const toast = document.querySelector('.toast');
      if (!toast) return;
      toast.textContent = 'Eco-Pantry Helper đang chờ phát hành trên Google Play. Nút này sẽ mở trang app ngay khi có.';
      toast.hidden = false;
      clearTimeout(explain.timer);
      explain.timer = setTimeout(() => { toast.hidden = true; }, 3600);
    };
    link.addEventListener('click', explain);
    link.addEventListener('keydown', explain);
  });
  if (!officialUrl) return;
  document.getElementById('release-status').textContent = 'Đã có trên Google Play';
  document.getElementById('release-description').textContent = 'Cài Eco-Pantry Helper từ Google Play để bắt đầu chăm chút bếp nhà ngay trên điện thoại Android.';
  document.getElementById('release-link-note').textContent = 'Bạn sẽ được chuyển đến trang Eco-Pantry Helper chính thức trên Google Play.';
  document.getElementById('faq-release-note').textContent = 'Liên kết tải chính thức trên Google Play đã được cập nhật tại mục này.';
  document.querySelectorAll('[data-release-caption]').forEach(element => { element.textContent = 'Dành cho Android · Tải từ Google Play'; });
  document.querySelectorAll('[data-download-cta]').forEach(link => {
    link.href = officialUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
}
