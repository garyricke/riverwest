(function () {
  'use strict';

  const PASSWORD = 'nobodycares';
  const SESSION_KEY = 'rw-admin-unlocked';

  const PAGES = [
    { href: 'index.html', label: 'Home', tag: 'Public' },
    { href: 'college-break.html', label: 'College Break Landing', tag: 'Public' },
    { href: 'college-break-email.html', label: 'Email Template', tag: 'Internal' },
    { href: 'college-break-flyer.html', label: 'Print Flyer', tag: 'Internal' }
  ];

  const root = document.documentElement;
  const isProtected = root.hasAttribute('data-admin-protected');

  injectStyles();

  if (isProtected && sessionStorage.getItem(SESSION_KEY) !== '1') {
    onReady(renderGate);
  } else {
    onReady(mount);
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function mount() {
    mountBadge();
    mountMenu();
  }

  function mountBadge() {
    const badge = document.createElement('button');
    badge.type = 'button';
    badge.className = 'rw-admin-badge';
    badge.textContent = 'A';
    badge.setAttribute('aria-label', 'Open admin menu');
    badge.addEventListener('click', openMenu);

    const footer = document.querySelector('footer');
    if (footer) {
      if (getComputedStyle(footer).position === 'static') {
        footer.style.position = 'relative';
      }
      footer.appendChild(badge);
    } else {
      badge.classList.add('rw-admin-badge--floating');
      document.body.appendChild(badge);
    }
  }

  function mountMenu() {
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

    const links = PAGES.map(p => {
      const current = p.href.toLowerCase() === here ? ' is-current' : '';
      return `
        <a href="${p.href}" class="rw-admin-link${current}">
          <span class="rw-admin-link-label">${p.label}</span>
          <span class="rw-admin-link-tag">${p.tag}</span>
        </a>`;
    }).join('');

    const menu = document.createElement('div');
    menu.className = 'rw-admin-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', 'Admin menu');
    menu.innerHTML = `
      <div class="rw-admin-backdrop" data-admin-close></div>
      <aside class="rw-admin-panel">
        <header class="rw-admin-panel-head">
          <span class="rw-admin-eyebrow">Admin</span>
          <button type="button" class="rw-admin-close" data-admin-close aria-label="Close menu">&times;</button>
        </header>
        <nav class="rw-admin-nav">${links}</nav>
        <footer class="rw-admin-panel-foot">
          <button type="button" class="rw-admin-lock" data-admin-lock>Lock Session</button>
        </footer>
      </aside>
    `;
    document.body.appendChild(menu);

    menu.querySelectorAll('[data-admin-close]').forEach(el => {
      el.addEventListener('click', closeMenu);
    });

    menu.querySelector('[data-admin-lock]').addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      closeMenu();
      if (isProtected) location.reload();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.__rwAdminMenu = menu;
  }

  function openMenu() {
    if (window.__rwAdminMenu) window.__rwAdminMenu.classList.add('is-open');
  }

  function closeMenu() {
    if (window.__rwAdminMenu) window.__rwAdminMenu.classList.remove('is-open');
  }

  function renderGate() {
    const gate = document.createElement('div');
    gate.className = 'rw-admin-gate';
    gate.innerHTML = `
      <form class="rw-admin-gate-form" autocomplete="off">
        <span class="rw-admin-eyebrow">Internal</span>
        <h2 class="rw-admin-gate-title">This page is private.</h2>
        <input type="password" class="rw-admin-gate-input" placeholder="Password" autocomplete="current-password" required />
        <button type="submit" class="rw-admin-gate-btn">Unlock</button>
        <p class="rw-admin-gate-error" hidden>Incorrect password.</p>
      </form>
    `;
    document.body.appendChild(gate);

    const form = gate.querySelector('form');
    const input = form.querySelector('input');
    const err = gate.querySelector('.rw-admin-gate-error');
    input.focus();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value === PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, '1');
        gate.remove();
        mount();
      } else {
        err.hidden = false;
        input.value = '';
        input.focus();
      }
    });
  }

  function injectStyles() {
    const css = `
      .rw-admin-badge {
        position: absolute;
        bottom: 10px;
        right: 12px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.18);
        background: transparent;
        color: rgba(255,255,255,0.18);
        font: 600 11px/1 'Inter', Arial, sans-serif;
        cursor: pointer;
        padding: 0;
        z-index: 50;
        transition: color .2s, border-color .2s, background .2s;
      }
      .rw-admin-badge:hover { color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.6); background: rgba(0,0,0,0.2); }
      .rw-admin-badge:focus-visible { outline: 1px solid #C5A059; outline-offset: 2px; }
      .rw-admin-badge--floating { position: fixed; bottom: 14px; right: 14px; color: rgba(0,0,0,0.25); border-color: rgba(0,0,0,0.2); }
      .rw-admin-badge--floating:hover { color: #1A1A1B; border-color: #1A1A1B; background: rgba(255,255,255,0.4); }

      .rw-admin-menu { position: fixed; inset: 0; z-index: 9998; pointer-events: none; }
      .rw-admin-menu.is-open { pointer-events: auto; }

      .rw-admin-backdrop {
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.55);
        opacity: 0;
        transition: opacity .25s ease;
      }
      .rw-admin-menu.is-open .rw-admin-backdrop { opacity: 1; }

      .rw-admin-panel {
        position: absolute; top: 0; right: 0; bottom: 0;
        width: min(320px, 84vw);
        background: #111112;
        border-left: 1px solid rgba(255,255,255,0.08);
        transform: translateX(100%);
        transition: transform .3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex; flex-direction: column;
        font-family: 'Inter', Arial, sans-serif;
        color: #E5E5E5;
      }
      .rw-admin-menu.is-open .rw-admin-panel { transform: translateX(0); }

      .rw-admin-panel-head {
        display: flex; align-items: center; justify-content: space-between;
        padding: 22px 26px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .rw-admin-eyebrow {
        font-family: 'Montserrat', Arial, sans-serif;
        font-size: 11px; font-weight: 700; letter-spacing: 0.22em;
        text-transform: uppercase; color: #C5A059;
      }
      .rw-admin-close {
        background: none; border: none;
        color: rgba(229,229,229,0.55);
        font-size: 24px; line-height: 1;
        width: 28px; height: 28px;
        cursor: pointer; padding: 0;
      }
      .rw-admin-close:hover { color: #fff; }

      .rw-admin-nav { display: flex; flex-direction: column; padding: 12px 0; flex: 1; overflow-y: auto; }
      .rw-admin-link {
        display: flex; align-items: center; gap: 12px;
        padding: 14px 26px;
        color: #E5E5E5; text-decoration: none;
        font-size: 14px; font-weight: 500;
        border-left: 2px solid transparent;
        transition: background .15s, border-color .15s, color .15s;
      }
      .rw-admin-link:hover { background: rgba(197,160,89,0.08); border-left-color: #C5A059; color: #fff; }
      .rw-admin-link.is-current { color: #C5A059; border-left-color: #C5A059; background: rgba(197,160,89,0.05); }
      .rw-admin-link-label { flex: 1; }
      .rw-admin-link-tag {
        font-family: 'Montserrat', Arial, sans-serif;
        font-size: 9px; font-weight: 700; letter-spacing: 0.18em;
        text-transform: uppercase; color: rgba(229,229,229,0.35);
      }
      .rw-admin-link.is-current .rw-admin-link-tag { color: rgba(197,160,89,0.6); }

      .rw-admin-panel-foot {
        padding: 18px 26px;
        border-top: 1px solid rgba(255,255,255,0.06);
      }
      .rw-admin-lock {
        width: 100%;
        background: transparent;
        border: 1px solid rgba(255,255,255,0.15);
        color: rgba(229,229,229,0.65);
        padding: 11px;
        font-family: 'Montserrat', Arial, sans-serif;
        font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
        text-transform: uppercase; cursor: pointer;
        transition: color .15s, border-color .15s;
      }
      .rw-admin-lock:hover { color: #fff; border-color: rgba(255,255,255,0.4); }

      .rw-admin-gate {
        position: fixed; inset: 0; z-index: 9999;
        background: #0d0d0e;
        display: flex; align-items: center; justify-content: center;
        padding: 32px;
        font-family: 'Inter', Arial, sans-serif;
      }
      .rw-admin-gate-form {
        max-width: 360px; width: 100%;
        display: flex; flex-direction: column; gap: 14px;
      }
      .rw-admin-gate-title {
        margin: 0;
        color: #fff;
        font-family: 'Bebas Neue', Arial Black, sans-serif;
        font-weight: 400;
        font-size: 38px;
        line-height: 1;
        letter-spacing: 0.01em;
      }
      .rw-admin-gate-input {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.18);
        color: #fff;
        padding: 14px 16px;
        font-family: inherit;
        font-size: 15px;
      }
      .rw-admin-gate-input:focus { outline: none; border-color: #C5A059; }
      .rw-admin-gate-btn {
        background: #C5A059;
        border: none;
        color: #1A1A1B;
        padding: 14px;
        font-family: 'Montserrat', Arial, sans-serif;
        font-size: 12px; font-weight: 700; letter-spacing: 0.18em;
        text-transform: uppercase;
        cursor: pointer;
        transition: background .15s;
      }
      .rw-admin-gate-btn:hover { background: #fff; }
      .rw-admin-gate-error { margin: 0; color: #e57373; font-size: 13px; }

      @media print {
        .rw-admin-badge, .rw-admin-menu, .rw-admin-gate { display: none !important; }
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
})();
