/* =================================================================
   UDE. — shared site behavior. Loaded by every page.
   ================================================================= */

(function () {
  // ---------- Theme (persisted, defaults to dark) ----------
  const root = document.documentElement;
  const saved = localStorage.getItem('ude-theme');
  if (saved) root.setAttribute('data-theme', saved);

  function toggleTheme() {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ude-theme', next);
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // ---------- Mobile menu ----------
  const burger = document.querySelector('[data-burger]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ---------- Active nav link (based on current page) ----------
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ---------- Scroll reveal ----------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ---------- Contact form (auto-send via FormSubmit) ----------
  window.sendPortfolioMessage = async function () {
    const nameEl = document.getElementById('cf-name');
    const emailEl = document.getElementById('cf-email');
    const msgEl = document.getElementById('cf-message');
    const statusEl = document.getElementById('cf-status');
    const btn = document.getElementById('cf-submit');
    if (!nameEl || !emailEl || !msgEl) return;

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = msgEl.value.trim();

    if (!name || !email || !message) {
      statusEl.style.color = '#f87171';
      statusEl.textContent = 'Please fill in your name, email, and message first.';
      return;
    }

    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    statusEl.style.color = 'var(--text-dim)';
    statusEl.textContent = '';

    try {
      const res = await fetch('https://formsubmit.co/ajax/egereugochukwu@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name, email, message,
          _subject: `Portfolio inquiry from ${name}`,
          _template: 'table'
        })
      });
      if (!res.ok) throw new Error('Request failed');
      statusEl.style.color = '#4ade80';
      statusEl.textContent = "✔ Message sent — I'll get back to you within 24 hours.";
      nameEl.value = ''; emailEl.value = ''; msgEl.value = '';
    } catch (err) {
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:egereugochukwu@gmail.com?subject=${subject}&body=${body}`;
      statusEl.style.color = 'var(--text-dim)';
      statusEl.textContent = 'Opening your email app to send this instead...';
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  };
})();
