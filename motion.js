// Presentation only: no tracking, storage, requests or added dependencies.
export function enhanceExperience() {
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
    { title: 'Bắt đầu từ một góc tủ nhỏ.', text: 'Thêm thực phẩm bằng tay hoặc quét hóa đơn trong app. Theo dõi tên, lượng còn lại, ngăn bảo quản và hạn dùng ngay tại một nơi.', action: 'Tìm hiểu Dọn tủ AI', tab: 'tab-pantry' },
    { title: 'Một mâm cơm từ những gì đang có.', text: 'Ưu tiên nguyên liệu cần dùng sớm, cân nhắc khẩu vị gia đình. Khi nấu xong, chỉ lượng đã dùng được trừ khỏi tủ.', action: 'Tìm hiểu Dọn tủ AI', tab: 'tab-pantry' },
    { title: 'Ra chợ với một danh sách vừa đủ.', text: 'Thực đơn được gộp thành danh sách cần mua, trừ phần đã có. Mua xong, chọn ngăn bảo quản và cập nhật đồ mới vào tủ.', action: 'Tìm hiểu thực đơn tuần', tab: 'tab-planning' },
  ];
  const detail = document.createElement('div');
  detail.className = 'journey-detail';
  detail.innerHTML = `<span class="journey-detail-icon">${icon('leaf')}</span><div class="journey-detail-copy" aria-live="polite"><strong></strong><p></p></div><a href="#tinh-nang" class="button button-outline"></a>`;
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
    detail.querySelector('.button').innerHTML = `${story.action}${icon('arrow')}`;
    if (!motionPreference.matches) detail.querySelector('.journey-detail-copy').animate([{ opacity: 0, translate: '0 6px' }, { opacity: 1, translate: '0 0' }], { duration: 260, easing: 'ease-out' });
  }
  detail.querySelector('.button').addEventListener('click', () => document.getElementById(stories[selectedStep].tab).click());
  selectStep(0);

  // Price changes have a small visual response; the values stay unchanged.
  document.querySelectorAll('[data-billing]').forEach(input => input.addEventListener('change', () => {
    if (motionPreference.matches) return;
    document.querySelector('.premium .price-amount').animate([{ opacity: 0, translate: '0 14px', filter: 'blur(6px)' }, { opacity: 1, translate: '0 0', filter: 'blur(0)' }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
  }));

  // Single-open FAQ with native details semantics, including keyboard support.
  const questions = [...document.querySelectorAll('.faq-list details')];
  questions.forEach(question => question.addEventListener('toggle', () => {
    if (!question.open) return;
    questions.forEach(other => { if (other !== question && other.open) other.open = false; });
    if (!motionPreference.matches) question.querySelector('div').animate([{ opacity: 0, translate: '0 -5px' }, { opacity: 1, translate: '0 0' }], { duration: 240, easing: 'ease-out' });
  }));

  authorMotion(motionPreference.matches);

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

const EASE = 'cubic-bezier(.16,1,.3,1)';

// Wrap each <br>-separated line of a heading in a clipping mask so it can rise into place.
// The text stays in the DOM exactly once, so reading order and copy are unchanged.
function splitLines(heading) {
  if (heading.dataset.split) return [...heading.querySelectorAll(':scope > .line-mask > .line-inner')];
  const groups = [[]];
  for (const node of [...heading.childNodes]) {
    if (node.nodeName === 'BR') groups.push([]);
    else groups[groups.length - 1].push(node);
  }
  heading.textContent = '';
  const inners = groups.filter(nodes => nodes.some(node => node.textContent.trim())).map(nodes => {
    const mask = document.createElement('span');
    const inner = document.createElement('span');
    mask.className = 'line-mask';
    inner.className = 'line-inner';
    inner.append(...nodes);
    mask.append(inner);
    heading.append(mask);
    return inner;
  });
  heading.dataset.split = 'true';
  return inners;
}

function riseLines(lines, delay = 0) {
  lines.forEach((line, i) => line.animate(
    [{ transform: 'translateY(108%)' }, { transform: 'none' }],
    { duration: 950, delay: delay + i * 110, easing: EASE, fill: 'backwards' },
  ));
}

// Presentation only. Every element is visible by default; animations use fill: 'backwards'
// so a failed or skipped script never leaves content hidden.
function authorMotion(reduced) {
  if (reduced) return;

  // 1. The authored moment: the kitchen table arrives, then the fridge on the phone.
  const hero = document.querySelector('.hero');
  const h1 = hero?.querySelector('h1');
  if (h1) riseLines(splitLines(h1), 80);
  const fadeUp = (element, delay, distance = 18) => element?.animate(
    [{ opacity: 0, transform: `translateY(${distance}px)` }, { opacity: 1, transform: 'none' }],
    { duration: 800, delay, easing: EASE, fill: 'backwards' },
  );
  fadeUp(hero?.querySelector('.hero-description'), 420);
  fadeUp(hero?.querySelector('.hero-actions'), 540);
  hero?.querySelectorAll('.hero-note, .hero-release-note').forEach(note => fadeUp(note, 640, 10));
  hero?.querySelector('.photo-frame')?.animate(
    [{ clipPath: 'inset(100% 0 0 0 round 180px 180px 20px 20px)' }, { clipPath: 'inset(0 0 0 0 round 180px 180px 20px 20px)' }],
    { duration: 1200, delay: 120, easing: EASE, fill: 'backwards' },
  );
  hero?.querySelector('.hero-food')?.animate([{ scale: '1.18' }, { scale: '1' }], { duration: 1600, delay: 120, easing: EASE, fill: 'backwards' });
  fadeUp(hero?.querySelector('.phone-mockup'), 620, 46);
  hero?.querySelectorAll('.food-row').forEach((row, i) => row.animate(
    [{ opacity: 0, transform: 'translateX(-10px)' }, { opacity: 1, transform: 'none' }],
    { duration: 600, delay: 760 + i * 90, easing: EASE, fill: 'backwards' },
  ));
  hero?.querySelectorAll('.floating-note, .round-seal').forEach((element, i) => element.animate(
    [{ opacity: 0, scale: '.86' }, { opacity: 1, scale: '1' }],
    { duration: 700, delay: 820 + i * 140, easing: EASE, fill: 'backwards' },
  ));

  if ('IntersectionObserver' in window) {
    // 2. Section headings rise line by line the first time they enter the viewport.
    const headingObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        riseLines(splitLines(entry.target));
        headingObserver.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('main section h2').forEach(heading => {
      if (!heading.closest('.hero, .phone-content, .feedback-preview')) headingObserver.observe(heading);
    });

    // 3. How it works: the arrows between steps draw themselves once.
    const journey = document.querySelector('.journey');
    if (journey) {
      journey.classList.add('motion-ready');
      const journeyObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        journey.classList.add('is-drawn');
        journeyObserver.disconnect();
      }, { threshold: .45 });
      journeyObserver.observe(journey);
    }
  }

  // 4. Benefit band becomes a slow ticker; clones are hidden from assistive tech.
  const ticker = document.querySelector('.benefit-band');
  const band = ticker?.querySelector('.benefit-inner');
  if (band) {
    for (const child of [...band.children]) {
      const clone = child.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      band.append(clone);
    }
    ticker.classList.add('is-ticker');
  }

  // 5. Scroll-linked depth: the photo drifts slower than the phone, the seal turns,
  //    the closing photo pushes in as the download scene passes.
  const food = document.querySelector('.hero-food');
  const phone = document.querySelector('.phone-mockup');
  const seal = document.querySelector('.round-seal');
  const scene = document.querySelector('.download-scene');
  const backdrop = scene?.querySelector('.download-backdrop');
  let frameQueued = false;
  function onScroll() {
    frameQueued = false;
    const y = scrollY;
    if (y < innerHeight * 1.3) {
      if (food) food.style.translate = `0 ${(y * .07).toFixed(1)}px`;
      if (phone) phone.style.translate = `0 ${(-y * .06).toFixed(1)}px`;
      seal?.style.setProperty('--seal-rotate', `${(12 + y * .06).toFixed(1)}deg`);
    }
    if (scene && backdrop) {
      const box = scene.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight - box.top) / (innerHeight + box.height)));
      backdrop.style.setProperty('--push', (1.14 - progress * .14).toFixed(4));
    }
  }
  addEventListener('scroll', () => { if (!frameQueued) { frameQueued = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // 6. Fine pointers: a soft light follows the cursor on cards; the main CTAs lean toward it.
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.price-card, .feature-panel, .journey article, .little-grid article, .problem-grid article').forEach(card => {
    card.addEventListener('pointermove', event => {
      const box = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - box.left}px`);
      card.style.setProperty('--my', `${event.clientY - box.top}px`);
      card.classList.add('has-spotlight');
    });
    card.addEventListener('pointerleave', () => card.classList.remove('has-spotlight'));
  });
  document.querySelectorAll('.header-cta, .hero-play-link, .download-play-link').forEach(target => {
    target.addEventListener('pointermove', event => {
      const box = target.getBoundingClientRect();
      const dx = (event.clientX - box.left - box.width / 2) * .18;
      const dy = (event.clientY - box.top - box.height / 2) * .22;
      target.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    });
    target.addEventListener('pointerleave', () => {
      target.animate([{ translate: target.style.translate || '0 0' }, { translate: '0 0' }], { duration: 450, easing: EASE });
      target.style.translate = '0 0';
    });
  });
}
