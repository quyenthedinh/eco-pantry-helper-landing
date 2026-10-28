// Presentation only: no tracking, storage, requests or added dependencies.
export function enhanceExperience({ openDemo }) {
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const header = document.querySelector('.site-header');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Về đầu trang');
  backToTop.innerHTML = icon('arrow');
  backToTop.hidden = true;
  backToTop.addEventListener('click', () => scrollTo({ top: 0, behavior: motionPreference.matches ? 'instant' : 'smooth' }));
  document.body.append(backToTop);

  const navigation = [...document.querySelectorAll('.desktop-nav a, .mobile-nav a')];
  const sections = [...new Set(navigation.map(link => document.querySelector(link.getAttribute('href'))))].filter(Boolean);
  let queued = false;
  function updateScroll() {
    queued = false;
    const y = window.scrollY;
    const height = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? Math.min(1, y / height) : 0})`;
    header.classList.toggle('is-scrolled', y > 28);
    backToTop.hidden = y < 650;
    let active;
    for (const section of sections) if (section.getBoundingClientRect().top <= Math.min(innerHeight * .35, 240)) active = section.id;
    for (const link of navigation) {
      const current = link.hash === `#${active}`;
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  function queueScroll() { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } }
  addEventListener('scroll', queueScroll, { passive: true });
  addEventListener('resize', queueScroll, { passive: true });
  updateScroll();

  // Existing content remains visible when JavaScript or motion is unavailable.
  if (!motionPreference.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const order = Number(entry.target.dataset.motionOrder || 0);
        entry.target.animate([
          { opacity: 0, translate: '0 22px' },
          { opacity: 1, translate: '0 0' },
        ], { duration: 650, delay: order * 85, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
        observer.unobserve(entry.target);
      }
    }, { threshold: .12 });
    for (const selector of ['.problem-grid article', '.little-grid article', '.journey article']) {
      document.querySelectorAll(selector).forEach((element, i) => { element.dataset.motionOrder = String(i % 3); observer.observe(element); });
    }
    document.querySelectorAll('.feature-panel, .feedback-card, .closing-card').forEach(element => observer.observe(element));
  }

  // Turn the three steps into a small, useful guided explanation.
  const journey = document.querySelector('.journey');
  const articles = [...journey.querySelectorAll('article')];
  const stories = [
    { title: 'Bắt đầu từ một góc tủ nhỏ.', text: 'Thêm thực phẩm bằng tay hoặc quét hóa đơn trong app. Theo dõi tên, lượng còn lại, ngăn bảo quản và hạn dùng ngay tại một nơi.', action: 'Khám phá tủ lạnh mẫu', mode: 'pantry' },
    { title: 'Một mâm cơm từ những gì đang có.', text: 'Ưu tiên nguyên liệu cần dùng sớm, cân nhắc khẩu vị gia đình. Khi nấu xong, chỉ lượng đã dùng được trừ khỏi tủ.', action: 'Thử gợi ý mâm cơm', mode: 'pantry' },
    { title: 'Ra chợ với một danh sách vừa đủ.', text: 'Thực đơn được gộp thành danh sách cần mua, trừ phần đã có. Mua xong, chọn ngăn bảo quản và cập nhật đồ mới vào tủ.', action: 'Thử lên kế hoạch đi chợ', mode: 'planner' },
  ];
  const detail = document.createElement('div');
  detail.className = 'journey-detail';
  detail.innerHTML = `<span class="journey-detail-icon">${icon('leaf')}</span><div class="journey-detail-copy" aria-live="polite"><strong></strong><p></p></div><button type="button" class="button button-outline"></button>`;
  journey.after(detail);
  let selectedStep = 0;
  const buttons = articles.map((article, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'journey-select';
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `<span>Khám phá bước ${String(i + 1).padStart(2, '0')}</span>${icon('arrow')}`;
    article.append(button);
    button.addEventListener('click', () => selectStep(i));
    return button;
  });
  function selectStep(index) {
    selectedStep = index;
    const story = stories[index];
    buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === index));
      articles[i].classList.toggle('is-active', i === index);
    });
    detail.querySelector('strong').textContent = story.title;
    detail.querySelector('p').textContent = story.text;
    detail.querySelector('button').innerHTML = `${story.action}${icon('arrow')}`;
    if (!motionPreference.matches) detail.querySelector('.journey-detail-copy').animate([{ opacity: 0, translate: '0 6px' }, { opacity: 1, translate: '0 0' }], { duration: 260, easing: 'ease-out' });
  }
  detail.querySelector('button').addEventListener('click', event => openDemo(stories[selectedStep].mode, event.currentTarget));
  selectStep(0);

  // Price changes have a small visual response; the values stay unchanged.
  document.querySelectorAll('[data-billing]').forEach(button => button.addEventListener('click', () => {
    if (motionPreference.matches) return;
    document.querySelector('.premium .price-amount').animate([{ opacity: .3, translate: '0 7px' }, { opacity: 1, translate: '0 0' }], { duration: 260, easing: 'ease-out' });
  }));

  // Single-open FAQ with native details semantics, including keyboard support.
  const questions = [...document.querySelectorAll('.faq-list details')];
  questions.forEach(question => question.addEventListener('toggle', () => {
    if (!question.open) return;
    questions.forEach(other => { if (other !== question && other.open) other.open = false; });
    if (!motionPreference.matches) question.querySelector('div').animate([{ opacity: 0, translate: '0 -5px' }, { opacity: 1, translate: '0 0' }], { duration: 240, easing: 'ease-out' });
  }));

  // Keep direct section links aligned after the display fonts have loaded.
  if (location.hash && document.fonts) {
    const originalHash = location.hash;
    let userMoved = false;
    const moved = () => { userMoved = true; };
    addEventListener('wheel', moved, { once: true, passive: true });
    addEventListener('touchstart', moved, { once: true, passive: true });
    addEventListener('keydown', moved, { once: true });
    document.fonts.ready.then(() => {
      removeEventListener('wheel', moved);
      removeEventListener('touchstart', moved);
      removeEventListener('keydown', moved);
      if (!userMoved && location.hash === originalHash) {
        const target = document.getElementById(originalHash.slice(1));
        target?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    });
  }
}
