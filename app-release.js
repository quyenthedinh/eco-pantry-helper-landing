// Keep the team's APK available until its official Google Play listing is ready.
export const APP_RELEASE = Object.freeze({
  officialGooglePlayUrl: '',
  apkUrl: 'assets/downloads/Eco-Pantry.apk',
  apkFileName: 'Eco-Pantry.apk',
  apkSizeBytes: 60383747,
});

export function configureDownloadLinks() {
  let officialUrl = null;
  try {
    const url = new URL(APP_RELEASE.officialGooglePlayUrl);
    if (url.protocol === 'https:' && url.hostname === 'play.google.com' && url.pathname === '/store/apps/details' && url.searchParams.get('id')) officialUrl = url.href;
  } catch { /* Use the team's actual APK while the Play listing is unavailable. */ }
  document.querySelectorAll('[data-app-download]').forEach(link => {
    link.href = officialUrl || APP_RELEASE.apkUrl;
    link.setAttribute('aria-label', officialUrl ? 'Tải Eco-Pantry Helper trên Google Play' : 'Tải APK dùng thử Eco-Pantry Helper cho Android');
    link.querySelector('[data-download-label]').textContent = officialUrl ? 'Tải trên Google Play' : 'Tải APK dùng thử';
    if (officialUrl) {
      link.removeAttribute('download');
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.download = APP_RELEASE.apkFileName;
      link.removeAttribute('target');
      link.removeAttribute('rel');
    }
  });
  document.querySelectorAll('[data-apk-size]').forEach(element => {
    element.textContent = `${(APP_RELEASE.apkSizeBytes / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} MB`;
  });
  document.getElementById('apk-install-guide').hidden = Boolean(officialUrl);
  if (!officialUrl) return;
  document.getElementById('release-status').textContent = 'Đã có trên Google Play';
  document.getElementById('release-description').textContent = 'Cài Eco-Pantry Helper từ Google Play để bắt đầu chăm chút bếp nhà ngay trên điện thoại Android.';
  document.getElementById('release-link-note').textContent = 'Bạn sẽ được chuyển đến trang Eco-Pantry Helper chính thức trên Google Play.';
  document.getElementById('faq-release-note').textContent = 'Liên kết tải chính thức trên Google Play đã được cập nhật tại mục này.';
  document.querySelectorAll('[data-release-caption]').forEach(element => { element.textContent = 'Dành cho Android · Tải từ Google Play'; });
}
