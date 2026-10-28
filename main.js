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
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// Accessible feature tabs: click, arrow keys, Home and End.
const featureTabs = $$('.feature-tabs [role="tab"]');
function activateTab(tab, focus = false) {
  featureTabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
  if (focus) tab.focus();
}
featureTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % featureTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + featureTabs.length) % featureTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = featureTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(featureTabs[next], true); }
  });
});

const dailyMeals = [
  ['Gà kho gừng', 'Canh rau cải · Cơm trắng'],
  ['Trứng sốt cà chua', 'Đậu phụ áp chảo · Cơm trắng'],
  ['Thịt kho tiêu', 'Canh bí đỏ · Cơm trắng'],
];
$$('[data-day]').forEach(button => button.addEventListener('click', () => {
  $$('[data-day]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const meal = dailyMeals[Number(button.dataset.day)];
  $('#daily-main').textContent = meal[0];
  $('#daily-side').textContent = meal[1];
}));

let billing = 'monthly';
$$('[data-billing]').forEach(button => button.addEventListener('click', () => {
  billing = button.dataset.billing;
  $$('[data-billing]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  $('#premium-price').textContent = billing === 'yearly' ? '299.000' : '39.000';
  $('#premium-period').textContent = billing === 'yearly' ? '/ năm' : '/ tháng';
}));

// The demo uses explicit sample data, deterministic recipes and memory-only state.
// It never sends data, charges a visitor, or impersonates the app's real Gemini service.
const sampleFoods = [
  { id: 'tomato', name: 'Cà chua', amount: 300, use: 200, unit: 'g', remaining: 'Còn 2 ngày', symbol: 'tomato', color: 'tomato' },
  { id: 'greens', name: 'Rau cải', amount: 200, use: 150, unit: 'g', remaining: 'Còn 1 ngày', symbol: 'leaf', color: 'greens' },
  { id: 'eggs', name: 'Trứng gà', amount: 4, use: 2, unit: 'quả', remaining: 'Còn 5 ngày', symbol: 'egg', color: 'eggs' },
];
const allMeals = [
  { main: 'Gà kho gừng', side: 'Canh rau cải · Cơm trắng', ingredients: { chicken: 300, ginger: 20, greens: 150 } },
  { main: 'Trứng sốt cà chua', side: 'Đậu phụ áp chảo · Cơm trắng', ingredients: { eggs: 2, tomato: 200, tofu: 200 } },
  { main: 'Thịt kho tiêu', side: 'Canh bí đỏ · Cơm trắng', ingredients: { pork: 300, pumpkin: 300 } },
  { main: 'Cá sốt cà chua', side: 'Rau cải xào · Cơm trắng', ingredients: { fish: 300, tomato: 200, greens: 150 } },
  { main: 'Gà xào nấm', side: 'Canh cà rốt · Cơm trắng', ingredients: { chicken: 300, mushroom: 150, carrot: 100 } },
  { main: 'Đậu phụ sốt cà chua', side: 'Trứng chiên · Cơm trắng', ingredients: { tofu: 300, tomato: 200, eggs: 2 } },
  { main: 'Thịt luộc', side: 'Canh rau cải · Cơm trắng', ingredients: { pork: 300, greens: 150 } },
];
const ingredientInfo = {
  chicken: { name: 'Thịt gà', unit: 'g', cold: true }, ginger: { name: 'Gừng', unit: 'g' },
  greens: { name: 'Rau cải', unit: 'g' }, eggs: { name: 'Trứng gà', unit: 'quả' },
  tomato: { name: 'Cà chua', unit: 'g' }, tofu: { name: 'Đậu phụ', unit: 'g' },
  pork: { name: 'Thịt heo', unit: 'g', cold: true }, pumpkin: { name: 'Bí đỏ', unit: 'g' },
  fish: { name: 'Cá', unit: 'g', cold: true }, mushroom: { name: 'Nấm', unit: 'g' }, carrot: { name: 'Cà rốt', unit: 'g' },
};
const demoDialog = $('#demo-dialog');
const infoDialog = $('#info-dialog');
const demoContent = $('#demo-content');
let demoState;
let modalTrigger;
function resetDemo() {
  demoState = { mode: 'pantry', selected: new Set(sampleFoods.map(food => food.id)), cooked: false, suggested: false, days: 3, step: 'plan', purchased: new Set(), storage: {} };
}
resetDemo();

function openDemo(mode = 'pantry', trigger) {
  modalTrigger = trigger || document.activeElement;
  closeMenu();
  resetDemo();
  demoState.mode = mode;
  renderDemo();
  demoDialog.showModal();
}
$$('[data-open-demo]').forEach(button => button.addEventListener('click', () => openDemo('pantry', button)));
$$('[data-open-planner]').forEach(button => button.addEventListener('click', () => openDemo('planner', button)));
$$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
[demoDialog, infoDialog].forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { if (modalTrigger?.isConnected) modalTrigger.focus(); });
});
$$('[data-demo-mode]').forEach(button => button.addEventListener('click', () => {
  demoState.mode = button.dataset.demoMode;
  renderDemo();
}));

function pantryDishNames() {
  const selected = demoState.selected;
  const dishes = [];
  if (selected.has('eggs') && selected.has('tomato')) dishes.push('Trứng sốt cà chua');
  else if (selected.has('eggs')) dishes.push('Trứng chiên');
  else if (selected.has('tomato')) dishes.push('Cà chua xào');
  if (selected.has('greens')) dishes.push('Canh rau cải');
  return dishes;
}

function renderPantry() {
  const foods = sampleFoods.map(food => {
    const selected = demoState.selected.has(food.id);
    const amount = demoState.cooked && selected ? food.amount - food.use : food.amount;
    return `<label class="demo-food"><input type="checkbox" data-food="${food.id}" ${selected ? 'checked' : ''} ${demoState.suggested ? 'disabled' : ''} aria-label="Chọn ${food.name}"/><span class="food-icon ${food.color}">${icon(food.symbol)}</span><span class="food-detail"><strong>${food.name}</strong><small>${amount} ${food.unit} · Ngăn mát</small></span><span class="expiry ${food.id === 'eggs' ? 'safe' : ''}">${food.remaining}</span></label>`;
  }).join('');
  let result = '';
  if (demoState.suggested) {
    const used = sampleFoods.filter(food => demoState.selected.has(food.id));
    result = `<div class="demo-result" role="region" aria-label="Kết quả minh họa"><p class="micro-label">MÂM CƠM MẪU CHO 2 NGƯỜI</p><h3>${pantryDishNames().join(' · ')}</h3><p>Ví dụ sử dụng nguyên liệu đã chọn. Gạo, nước và gia vị cơ bản được giả định có sẵn.</p><ul>${used.map(food => `<li>${food.name}: ${food.use} ${food.unit}</li>`).join('')}</ul>${demoState.cooked ? `<div class="demo-success">${icon('check')}<span>Đã cập nhật tủ mẫu. Chỉ lượng dùng trong bữa này được trừ; phần còn lại vẫn giữ trong tủ.</span></div>` : `<button class="button demo-action" data-cook>${icon('check')} Nấu xong, cập nhật tủ mẫu</button>`}</div>`;
  }
  return `<div class="demo-step-title"><span>${demoState.cooked ? 'Tủ mẫu sau khi nấu' : 'Chọn nguyên liệu muốn dùng'}</span><button class="demo-reset" data-reset>Thử lại</button></div><div class="demo-foods">${foods}</div>${demoState.suggested ? result : `<button class="button demo-action" data-suggest ${!demoState.selected.size ? 'disabled' : ''}>${icon('spark')} Xem gợi ý minh họa ${icon('arrow')}</button><p class="demo-caption">Chọn ít nhất một nguyên liệu để xem một gợi ý mẫu.</p>`}`;
}

function getShoppingList() {
  const total = {};
  allMeals.slice(0, demoState.days).forEach(meal => {
    Object.entries(meal.ingredients).forEach(([id, quantity]) => { total[id] = (total[id] || 0) + quantity; });
  });
  return Object.entries(total).map(([id, quantity]) => {
    const stock = sampleFoods.find(food => food.id === id)?.amount || 0;
    return { id, quantity: Math.max(0, quantity - stock), ...ingredientInfo[id] };
  }).filter(item => item.quantity > 0);
}

function renderPlanner() {
  const shopping = getShoppingList();
  if (demoState.step === 'shopping') {
    return `<div class="demo-step-title"><span>Danh sách đi chợ mẫu · ${demoState.days} ngày</span><button class="demo-reset" data-plan-back>Quay lại</button></div><p class="demo-caption demo-caption-left">Đã gộp nguyên liệu và trừ tủ mẫu: 300 g cà chua, 200 g rau cải, 4 quả trứng. Gạo và gia vị nền giả định đã có.</p><div class="shopping-list">${shopping.map(item => `<label class="shopping-item"><input type="checkbox" data-purchase="${item.id}" ${demoState.purchased.has(item.id) ? 'checked' : ''}/><span class="shopping-name">${item.name}</span><span>${item.quantity} ${item.unit}</span></label>`).join('')}</div><button class="button demo-action" data-start-store ${!demoState.purchased.size ? 'disabled' : ''}>Cất các món đã mua vào tủ ${icon('arrow')}</button><p class="demo-caption">Tick món đã mua. Món chưa mua được giữ lại trên danh sách mẫu.</p>`;
  }
  if (demoState.step === 'storage') {
    const bought = shopping.filter(item => demoState.purchased.has(item.id));
    const coldItems = bought.filter(item => item.cold);
    const ready = coldItems.every(item => demoState.storage[item.id]);
    return `<div class="demo-step-title"><span>Cất đồ vào tủ mẫu</span><button class="demo-reset" data-shopping-back>Quay lại</button></div><p class="demo-caption demo-caption-left">Chọn ngăn bảo quản cho thịt, cá trước khi cất tủ. Với món dùng sau 3 ngày, cân nhắc chia phần và cấp đông.</p><div class="storage-list">${bought.map(item => `<div class="storage-item"><div><strong>${item.name}</strong><small>${item.quantity} ${item.unit}</small></div>${item.cold ? `<label><span class="sr-only">Ngăn bảo quản ${item.name}</span><select data-storage="${item.id}" required><option value="">Chọn ngăn</option><option value="cool" ${demoState.storage[item.id] === 'cool' ? 'selected' : ''}>Ngăn mát</option><option value="frozen" ${demoState.storage[item.id] === 'frozen' ? 'selected' : ''}>Ngăn đông</option></select></label>` : '<span class="storage-note">Theo loại thực phẩm</span>'}</div>`).join('')}</div><button class="button demo-action" data-store ${!ready ? 'disabled' : ''}>${icon('fridge')} Xác nhận cất vào tủ mẫu</button>${!ready ? '<p class="demo-caption">Cần chọn ngăn mát hoặc đông cho tất cả thịt, cá đã mua.</p>' : ''}`;
  }
  if (demoState.step === 'done') {
    const bought = shopping.filter(item => demoState.purchased.has(item.id));
    const pending = shopping.filter(item => !demoState.purchased.has(item.id));
    return `<div class="demo-result"><p class="micro-label">HOÀN THÀNH MỘT VÒNG CHĂM BẾP</p><h3>Sẵn sàng cho bữa ngon.</h3><div class="demo-success">${icon('check')}<span>Các món đã mua được thêm vào tủ mẫu. Thịt, cá được lưu theo ngăn bạn vừa chọn.</span></div><ul>${bought.map(item => `<li>${item.name}: ${item.quantity} ${item.unit}${item.cold ? ` · ${demoState.storage[item.id] === 'frozen' ? 'Ngăn đông' : 'Ngăn mát'}` : ''}</li>`).join('')}</ul>${pending.length ? `<p>Còn chờ mua: ${pending.map(item => item.name.toLowerCase()).join(', ')}.</p>` : '<p>Bạn đã hoàn thành danh sách đi chợ mẫu.</p>'}<button class="button button-outline demo-action" data-reset>Khám phá lại từ đầu ${icon('arrow')}</button></div><p class="demo-caption">Đây là mô phỏng. Không có dữ liệu cá nhân nào được lưu hoặc gửi đi.</p>`;
  }
  return `<div class="demo-settings"><span>Kế hoạch bữa tối · 2 người</span><div class="day-options" role="group" aria-label="Số ngày thực đơn">${[3, 5, 7].map(days => `<button data-plan-days="${days}" aria-pressed="${days === demoState.days}">${days} ngày</button>`).join('')}</div></div><div class="demo-week-menu">${allMeals.slice(0, demoState.days).map((meal, i) => `<div class="demo-day"><span>NGÀY ${i + 1}</span><div><strong>${meal.main}</strong><p>${meal.side}</p></div></div>`).join('')}</div><button class="button demo-action" data-shopping>${icon('basket')} Tạo danh sách đi chợ mẫu ${icon('arrow')}</button><p class="demo-caption">Thực đơn mẫu cố định để minh họa cách tính nguyên liệu cần mua.</p>`;
}

function renderDemo({ focusResult = false } = {}) {
  $$('[data-demo-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.demoMode === demoState.mode)));
  demoContent.innerHTML = demoState.mode === 'pantry' ? renderPantry() : renderPlanner();
  if (focusResult) {
    const target = $('.demo-result, .demo-step-title, .demo-settings', demoContent);
    if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'nearest', behavior: 'instant' }); }
  }
}

demoContent.addEventListener('change', event => {
  const input = event.target;
  if (input.matches('[data-food]')) {
    if (input.checked) demoState.selected.add(input.dataset.food);
    else demoState.selected.delete(input.dataset.food);
    $('[data-suggest]', demoContent).disabled = !demoState.selected.size;
  }
  if (input.matches('[data-purchase]')) {
    if (input.checked) demoState.purchased.add(input.dataset.purchase);
    else demoState.purchased.delete(input.dataset.purchase);
    $('[data-start-store]', demoContent).disabled = !demoState.purchased.size;
  }
  if (input.matches('[data-storage]')) {
    demoState.storage[input.dataset.storage] = input.value;
    $('[data-store]', demoContent).disabled = !getShoppingList().filter(item => demoState.purchased.has(item.id) && item.cold).every(item => demoState.storage[item.id]);
  }
});
demoContent.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || button.disabled) return;
  if (button.hasAttribute('data-reset')) { const mode = demoState.mode; resetDemo(); demoState.mode = mode; }
  else if (button.hasAttribute('data-suggest')) demoState.suggested = true;
  else if (button.hasAttribute('data-cook') && !demoState.cooked) demoState.cooked = true;
  else if (button.hasAttribute('data-plan-days')) { demoState.days = Number(button.dataset.planDays); demoState.purchased.clear(); demoState.storage = {}; }
  else if (button.hasAttribute('data-shopping')) demoState.step = 'shopping';
  else if (button.hasAttribute('data-plan-back')) demoState.step = 'plan';
  else if (button.hasAttribute('data-shopping-back')) demoState.step = 'shopping';
  else if (button.hasAttribute('data-start-store')) demoState.step = 'storage';
  else if (button.hasAttribute('data-store')) demoState.step = 'done';
  else return;
  const selectedDays = button.dataset.planDays;
  renderDemo({ focusResult: !selectedDays });
  if (selectedDays) $(`[data-plan-days="${selectedDays}"]`, demoContent).focus();
});

function openInfo(type, trigger) {
  modalTrigger = trigger;
  if (type === 'premium') {
    $('#info-eyebrow').textContent = 'THÊM MỘT CHÚT THẢNH THƠI';
    $('#info-title').textContent = 'Premium cho bếp nhà.';
    $('#info-content').innerHTML = `<div class="info-copy"><p>Gói đang xem: <strong>${billing === 'yearly' ? '299.000đ/năm' : '39.000đ/tháng'}</strong>.</p><p>Không giới hạn món trong tủ, dọn tủ AI, quét hóa đơn, tạo thực đơn và đổi món bằng AI.</p><p>Đăng ký và thanh toán thực hiện trong ứng dụng qua QR ngân hàng với PayOS. Trang giới thiệu này không thu tiền hay yêu cầu thông tin thanh toán.</p><p>Ứng dụng đang được nhóm phát triển cho Android và iOS. Bạn có thể trải nghiệm luồng mẫu trong lúc chờ link tải chính thức.</p></div>`;
  } else {
    $('#info-eyebrow').textContent = 'TỪ NHỮNG BỮA CƠM QUEN THUỘC';
    $('#info-title').textContent = 'Người bạn nhỏ của bếp Việt.';
    $('#info-content').innerHTML = '<div class="info-copy"><p><strong>Eco-Pantry Helper</strong> là dự án ứng dụng di động của nhóm, hướng đến những gia đình Việt muốn quản lý thực phẩm tốt hơn và bớt áp lực lo bữa ăn mỗi ngày.</p><p>Hai luồng chính là dọn tủ lạnh bằng AI và lập thực đơn → đi chợ → cất tủ. Cả hai đều quay lại cập nhật tủ lạnh để bạn biết mình còn gì, cần dùng gì và nên mua thêm gì.</p><p>Ứng dụng đang được phát triển cho Android và iOS. Website này giới thiệu sản phẩm, các gói sử dụng và trải nghiệm minh họa.</p></div>';
  }
  infoDialog.showModal();
}
$$('[data-open-premium]').forEach(button => button.addEventListener('click', () => openInfo('premium', button)));
$$('[data-open-about]').forEach(button => button.addEventListener('click', () => openInfo('about', button)));
$('[data-info-demo]').addEventListener('click', () => { const trigger = modalTrigger; infoDialog.close(); openDemo('pantry', trigger); });

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
  $$('.section-heading, .center-heading, .price-card').forEach(element => {
    element.classList.add('reveal'); observer.observe(element);
  });
}

enhanceExperience({ openDemo });
