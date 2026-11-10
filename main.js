import { configureDownloadLinks } from './app-release.js';
import { enhanceExperience } from './motion.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;

// Navigation works without a framework; content stays readable without JavaScript.
const menuButton = $('.menu-button');
const mobileNav = $('#mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Mở menu');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
});
$$('a', mobileNav).forEach(link => link.addEventListener('click', closeMenu));
$$('[data-close-mobile]', mobileNav).forEach(button => button.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); }
});
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
window.matchMedia('(min-width: 1041px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// Informational dialogs only: application features run in the mobile app.
const infoDialog = $('#info-dialog');
let infoTrigger;
function openInfo(type, trigger) {
  infoTrigger = trigger;
  closeMenu();
  if (type === 'premium') {
    const billing = $('[name="billing"]:checked').value;
    $('#info-eyebrow').textContent = 'THÊM MỘT CHÚT THẢNH THƠI';
    $('#info-title').textContent = 'Premium trong ứng dụng.';
    $('#info-content').innerHTML = `<div class="info-copy"><p>Gói đang xem: <strong>${billing === 'yearly' ? '299.000đ/năm' : '39.000đ/tháng'}</strong>.</p><p>Không giới hạn món trong tủ, dọn tủ AI, quét hóa đơn, tạo thực đơn và đổi món bằng AI.</p><p>Đăng ký gói và thanh toán được thực hiện trong ứng dụng di động qua QR ngân hàng với PayOS.</p><p>Xem thông tin tải app bên dưới để cài Pantrio trên Android.</p></div>`;
  } else {
    $('#info-eyebrow').textContent = 'TỪ SỰ QUAN TÂM DÀNH CHO BẾP NHÀ';
    $('#info-title').textContent = 'Cùng bạn chăm chút bữa cơm nhà.';
    $('#info-content').innerHTML = '<div class="info-copy"><p>Đằng sau một bữa cơm là bao điều phải nghĩ: hôm nay nấu gì, tủ còn những gì, đi chợ mua thêm bao nhiêu cho vừa. Giữa những ngày bận rộn, ai lo bữa ăn cho cả nhà cũng cần một người san sẻ.</p><p><strong>Pantrio</strong> là người bạn nhỏ mà nhóm chúng mình đang xây dựng để đồng hành cùng bạn. Từ việc nhớ những món còn trong tủ, gợi ý bữa ngon từ nguyên liệu sẵn có đến chuẩn bị danh sách đi chợ vừa đủ — app giúp việc chăm bếp nhẹ nhàng hơn từng chút.</p><p>Chúng mình mong những mớ rau được dùng khi còn tươi, những món ngon được nấu từ đồ đang có, và bạn có thêm thời gian cho người thân bên mâm cơm. <strong>Bớt bỏ phí một chút, thêm yêu bếp nhà một chút.</strong></p></div>';
  }
  infoDialog.showModal();
}
$$('[data-open-premium]').forEach(button => button.addEventListener('click', () => openInfo('premium', button)));
$$('[data-open-about]').forEach(button => button.addEventListener('click', () => openInfo('about', button)));
$$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => infoDialog.close()));
infoDialog.addEventListener('close', () => { if (infoTrigger?.isConnected) infoTrigger.focus(); });
infoDialog.addEventListener('click', event => {
  if (event.target !== infoDialog) return;
  const rect = infoDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) infoDialog.close();
});
$('[data-info-download]').addEventListener('click', () => infoDialog.close());

$('#copyright-year').textContent = new Date().getFullYear();
// Decorative icons inherit the accessible name of their surrounding control.
$$('svg:not(.icon-library)').forEach(svg => svg.setAttribute('aria-hidden', 'true'));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  // Headings rise line by line in motion.js; only the plan cards fade in here.
  $$('.price-card').forEach(element => {
    element.classList.add('reveal'); observer.observe(element);
  });
}

enhanceExperience();
configureDownloadLinks();
