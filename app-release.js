// Replace only officialGooglePlayUrl when the team's actual Play listing is ready.
// Until then, the generic store link is clearly identified as temporary in the UI.
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
    link.href = officialUrl || APP_RELEASE.previewGooglePlayUrl;
    link.setAttribute('aria-label', officialUrl ? 'Tải Eco-Pantry Helper trên Google Play' : 'Mở Google Play — liên kết thử nghiệm');
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
