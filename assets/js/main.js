(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => n.toLocaleString('tr-TR');
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 13l4 4L19 7"/></svg>';

  /* ---------- Nav ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = $('#navToggle'), menu = $('#mobileMenu'), icon = $('#navIcon');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    icon.setAttribute('d', open ? 'M6 6l12 12M6 18L18 6' : 'M4 6h16M4 12h16M4 18h16');
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 70}ms`;
    io.observe(el);
  });

  /* ---------- Card spotlight ---------- */
  $$('.card').forEach(card => card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));

  /* ---------- Optional images: swap mockup for real image if file exists ---------- */
  function loadMedia(box) {
    const src = box.dataset.src;
    const old = $('img', box);
    if (old) old.remove();
    box.classList.remove('has-img');
    if (!src) return;
    const img = new Image();
    img.alt = box.dataset.alt || '';
    img.decoding = 'async';
    img.onload = () => { if (box.dataset.src === src) { box.prepend(img); box.classList.add('has-img'); } };
    img.src = src;
  }

  /* ---------- Hero: demo dashboard ---------- */
  const kPlayers = $('#kPlayers'), kSlips = $('#kSlips'), kTables = $('#kTables');
  let players = 1284, slips = 3920, tables = 48;

  const chart = $('#heroChart');
  const BARS = 22;
  const bars = Array.from({ length: BARS }, () => {
    const s = document.createElement('span');
    s.style.height = `${25 + Math.random() * 65}%`;
    chart.appendChild(s);
    return s;
  });

  const ICONS = {
    ok: CHECK,
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>',
    live: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M5.6 5.6a9 9 0 000 12.8M18.4 5.6a9 9 0 010 12.8"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/></svg>',
  };
  const EVENTS = [
    ['user', 'Yeni üye kaydı · SMS doğrulandı'],
    ['card', 'Yatırım onaylandı · ödeme entegrasyonu'],
    ['ok', 'Kupon onaylandı · 4\'lü kombine'],
    ['gift', 'Bonus tanımlandı · Hoş geldin'],
    ['live', 'Canlı rulet · yeni masa açıldı'],
    ['link', 'Affiliate kaydı · referans linki'],
    ['ok', 'Canlı bahis · oran güncellendi'],
    ['card', 'Çekim talebi işlendi'],
    ['user', 'Bayi paneli · alt bayi eklendi'],
    ['gift', 'Kazı kazan · ödül verildi'],
  ];
  const TOASTS = [
    ['Yatırım onaylandı', 'Ödeme entegrasyonu'],
    ['Yeni affiliate kaydı', 'Affiliate paneli'],
    ['Bonus kampanyası aktif', 'Bonus motoru'],
    ['Yeni üye doğrulandı', 'SMS doğrulama'],
  ];
  const feed = $('#heroFeed');
  const now = () => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  let evIdx = 0;
  function pushEvent() {
    const [ic, text] = EVENTS[evIdx++ % EVENTS.length];
    const li = document.createElement('li');
    li.innerHTML = `<span class="ic">${ICONS[ic]}</span><span class="t">${text}</span><time>${now()}</time>`;
    feed.prepend(li);
    while (feed.children.length > 5) feed.lastElementChild.remove();
  }
  for (let i = 0; i < 4; i++) pushEvent();

  const toast = $('#heroToast'), tTitle = $('#toastTitle'), tSub = $('#toastSub');
  let tIdx = 0;
  function showToast() {
    const [a, b] = TOASTS[tIdx++ % TOASTS.length];
    tTitle.textContent = a; tSub.textContent = b;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function tickDash() {
    players = Math.max(1100, players + Math.round((Math.random() - 0.45) * 18));
    slips += Math.round(Math.random() * 6);
    if (Math.random() < 0.15) tables = Math.min(60, Math.max(40, tables + (Math.random() < 0.5 ? -1 : 1)));
    kPlayers.textContent = fmt(players);
    kSlips.textContent = fmt(slips);
    kTables.textContent = tables;
  }
  function tickChart() {
    for (let i = 0; i < BARS - 1; i++) bars[i].style.height = bars[i + 1].style.height;
    bars[BARS - 1].style.height = `${25 + Math.random() * 70}%`;
  }

  if (!reduceMotion) {
    const hero = $('.hero');
    let timers = [];
    const start = () => {
      if (timers.length) return;
      timers = [
        setInterval(tickDash, 1400),
        setInterval(tickChart, 1600),
        setInterval(pushEvent, 2600),
        setInterval(showToast, 7000),
      ];
      setTimeout(showToast, 1800);
    };
    const stop = () => { timers.forEach(clearInterval); timers = []; };
    new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop())).observe(hero);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  }

  /* ---------- Tabs helper ---------- */
  function tabs(list, onSelect) {
    const btns = $$('[role="tab"]', list);
    const select = btn => {
      btns.forEach(b => {
        const on = b === btn;
        b.setAttribute('aria-selected', on);
        b.tabIndex = on ? 0 : -1;
      });
      onSelect(btn);
    };
    btns.forEach((b, i) => {
      b.tabIndex = i === 0 ? 0 : -1;
      b.addEventListener('click', () => select(b));
      b.addEventListener('keydown', e => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        const next = btns[(i + d + btns.length) % btns.length];
        next.focus(); select(next);
      });
    });
    return select;
  }

  /* ---------- Theme gallery ---------- */
  const mock = $('#mock'), themeMedia = $('#themeMedia');
  const SCREEN_ALT = { sport: 'Sportsbook arayüzü örneği', casino: 'Casino lobisi örneği', live: 'Canlı casino lobisi örneği' };
  tabs($('#screenTabs'), btn => {
    const s = btn.dataset.screen;
    $$('.m-screen', mock).forEach(el => el.classList.toggle('on', el.dataset.screen === s));
    mock.dataset.screen = s;
    themeMedia.dataset.src = `assets/img/ekran-${s}.webp`;
    themeMedia.dataset.alt = SCREEN_ALT[s];
    loadMedia(themeMedia);
  });
  $$('#swatches button').forEach(b => b.addEventListener('click', () => {
    $$('#swatches button').forEach(x => x.setAttribute('aria-pressed', x === b));
    mock.dataset.skin = b.dataset.skin;
  }));
  loadMedia(themeMedia);

  /* ---------- Operator tools ---------- */
  const OPS = {
    admin: {
      title: 'Genel bakış', badge: 'Admin',
      kpis: [['Yeni üye', '214'], ['Açık kupon', '3.920'], ['Bekleyen çekim', '12']],
      head: ['Kullanıcı', 'İşlem', 'Durum'],
      rows: [['u_10293', 'Yatırım', 'Onaylandı'], ['u_10288', 'Çekim', 'Bekliyor'], ['u_10271', 'Kupon', 'Onaylandı'], ['u_10265', 'Bonus', 'Onaylandı']],
      points: ['Kullanıcı ve bakiye yönetimi', 'Kupon, oyun ve finans takibi', 'Rol bazlı yetkilendirme'],
    },
    affiliate: {
      title: 'Affiliate performansı', badge: 'Affiliate',
      kpis: [['Tıklama', '8.412'], ['Kayıt', '326'], ['Aktif oyuncu', '141']],
      head: ['Kampanya', 'Kayıt', 'Durum'],
      rows: [['ref:AK42', '96', 'Aktif'], ['ref:SPOR10', '71', 'Aktif'], ['ref:CASINO', '58', 'Aktif'], ['ref:YAZ24', '23', 'Duraklatıldı']],
      points: ['Kişiye özel referans linkleri', 'Kayıt ve oyuncu takibi', 'Komisyon raporları'],
    },
    dealer: {
      title: 'Bayi ağı', badge: 'Bayi',
      kpis: [['Alt bayi', '18'], ['Bağlı oyuncu', '642'], ['Transfer', '57']],
      head: ['Bayi', 'Oyuncu', 'Durum'],
      rows: [['Bayi #014', '88', 'Aktif'], ['Bayi #009', '64', 'Aktif'], ['Bayi #021', '41', 'Aktif'], ['Bayi #027', '12', 'İncelemede']],
      points: ['Hiyerarşik alt bayi yapısı', 'Bakiye transferi ve limitler', 'Bayi bazlı raporlar'],
    },
    bonus: {
      title: 'Kampanyalar', badge: 'Bonus',
      kpis: [['Aktif kampanya', '6'], ['Kullanım', '1.208'], ['Kazı kazan', '340']],
      head: ['Kampanya', 'Tür', 'Durum'],
      rows: [['Hoş geldin', 'Yatırım', 'Aktif'], ['Hafta sonu', 'Kayıp iadesi', 'Aktif'], ['Kazı kazan', 'Oyun', 'Aktif'], ['Bülten', 'Toplu mail', 'Planlandı']],
      points: ['Esnek bonus kuralları', 'Kazı kazan (çark muadili)', 'Toplu mail paneli'],
    },
    report: {
      title: 'Raporlar', badge: 'Rapor',
      kpis: [['Yatırım', '↑ 12%'], ['Çekim', '↓ 4%'], ['Aktif oyuncu', '↑ 8%']],
      head: ['Rapor', 'Dönem', 'Durum'],
      rows: [['Finans özeti', 'Günlük', 'Hazır'], ['Oyun bazlı', 'Haftalık', 'Hazır'], ['Affiliate', 'Aylık', 'Hazır'], ['Bayi', 'Aylık', 'Hazırlanıyor']],
      points: ['Finans ve oyun raporları', 'Tarih ve filtre bazlı analiz', 'Dışa aktarma'],
    },
  };
  const pmock = $('#pmock'), opsPoints = $('#opsPoints'), opsMedia = $('#opsMedia'), opsPanel = $('#opsPanel');
  const WARN = /Bekliyor|Duraklatıldı|İncelemede|Planlandı|Hazırlanıyor/;
  function renderOp(key) {
    const d = OPS[key];
    pmock.innerHTML = `
      <div class="pmock-title"><b>${d.title}</b><span class="badge">${d.badge} · demo</span></div>
      <div class="pmock-kpis">${d.kpis.map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>
      <div class="pmock-table">
        <div>${d.head.map(h => `<span>${h}</span>`).join('')}</div>
        ${d.rows.map(([a, b, c]) => `<div><span>${a}</span><span>${b}</span><span class="st${WARN.test(c) ? ' w' : ''}">${c}</span></div>`).join('')}
      </div>`;
    opsPoints.innerHTML = d.points.map(p => `<li>${CHECK}<span>${p}</span></li>`).join('');
    [pmock, opsPoints].forEach(el => { el.classList.remove('fade-swap'); void el.offsetWidth; el.classList.add('fade-swap'); });
    opsMedia.dataset.src = `assets/img/panel-${key}.webp`;
    opsMedia.dataset.alt = `${d.badge} paneli ekranı`;
    loadMedia(opsMedia);
  }
  tabs($('#opsTabs'), btn => {
    renderOp(btn.dataset.op);
    opsPanel.setAttribute('aria-label', btn.querySelector('b').textContent);
  });
  renderOp('admin');

  /* ---------- Stats count-up ---------- */
  const countUp = el => {
    const target = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = pre + target + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(target * e) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    $$('[data-count]').forEach(countUp);
    obs.disconnect();
  }, { threshold: 0.4 }).observe($('#stats'));

  /* ---------- Code tabs + copy ---------- */
  const pres = $$('.code pre');
  tabs($('#codeTabs'), btn => pres.forEach(p => (p.hidden = p.dataset.lang !== btn.dataset.lang)));
  const copyBtn = $('#copyBtn'), copyLabel = $('span', copyBtn);
  copyBtn.addEventListener('click', async () => {
    const text = pres.find(p => !p.hidden).innerText;
    try {
      await navigator.clipboard.writeText(text);
      copyLabel.textContent = 'Kopyalandı';
    } catch {
      copyLabel.textContent = 'Kopyalanamadı';
    }
    setTimeout(() => (copyLabel.textContent = 'Kopyala'), 1800);
  });

  /* ---------- Timeline progress ---------- */
  const tl = $('#timeline');
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    tl.style.setProperty('--prog', '100%');
    $$('.step', tl).forEach((s, i) => setTimeout(() => s.classList.add('done'), reduceMotion ? 0 : 250 + i * 300));
  }, { threshold: 0.35 }).observe(tl);

  /* ---------- FAQ: one open at a time ---------- */
  const faqs = $$('.faq details');
  faqs.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) faqs.forEach(o => o !== d && (o.open = false));
  }));
})();
