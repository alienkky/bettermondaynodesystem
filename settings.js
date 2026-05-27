/* =========================================================================
   settings.js — UI preferences (density, hint visibility) with persistence.
   Adds a small gear button to the toolbar that opens a popover.
   ========================================================================= */
(function () {
  'use strict';

  const PREF_KEY = 'bm-ui-prefs';
  const DEFAULTS = { density: 'normal', showHint: true, theme: 'dark' };

  let prefs = Object.assign({}, DEFAULTS);

  function load() {
    try {
      const raw = localStorage.getItem(PREF_KEY);
      if (raw) prefs = Object.assign({}, DEFAULTS, JSON.parse(raw));
    } catch (e) { /* ignore */ }
  }
  function persist() {
    try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) {}
  }
  function apply() {
    document.body.classList.remove('dens-compact', 'dens-normal', 'dens-comfy');
    document.body.classList.add('dens-' + prefs.density);
    document.body.classList.toggle('hide-hint', !prefs.showHint);
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add('theme-' + prefs.theme);
  }

  function injectButton() {
    const bar = document.querySelector('.bar');
    if (!bar) return;
    if (document.getElementById('settingsBtn')) return;

    const gear = document.createElement('button');
    gear.className = 'btn';
    gear.id = 'settingsBtn';
    gear.title = '설정';
    gear.textContent = '⚙';
    gear.style.fontSize = '14px';
    gear.style.minWidth = '32px';

    // Insert just before the flex spacer (right-aligned hint area)
    const spacer = bar.querySelector('div[style*="flex:1"]');
    const hint = bar.querySelector('.hint');
    if (spacer) {
      bar.insertBefore(gear, spacer);
    } else if (hint) {
      bar.insertBefore(gear, hint);
    } else {
      bar.appendChild(gear);
    }

    gear.addEventListener('click', togglePanel);
  }

  let panelEl = null;

  function togglePanel() {
    if (panelEl) { closePanel(); return; }
    openPanel();
  }

  function openPanel() {
    panelEl = document.createElement('div');
    panelEl.className = 'settings-panel';
    panelEl.innerHTML = `
      <div class="settings-header">설정</div>
      <div class="settings-row">
        <label>테마</label>
        <div class="settings-segmented" data-group="theme">
          <button data-value="light" class="${prefs.theme==='light'?'on':''}">일반모드</button>
          <button data-value="dark"  class="${prefs.theme==='dark' ?'on':''}">다크모드</button>
        </div>
      </div>
      <div class="settings-row">
        <label>UI 크기</label>
        <div class="settings-segmented" data-group="density">
          <button data-value="compact" class="${prefs.density==='compact'?'on':''}">작게</button>
          <button data-value="normal"  class="${prefs.density==='normal' ?'on':''}">보통</button>
          <button data-value="comfy"   class="${prefs.density==='comfy'  ?'on':''}">크게</button>
        </div>
      </div>
      <div class="settings-row">
        <label class="settings-checkrow">
          <input type="checkbox" id="setShowHint" ${prefs.showHint ? 'checked' : ''}>
          <span>툴바 도움말 표시</span>
        </label>
      </div>
      <div class="settings-row">
        <button class="btn settings-reset" id="settingsReset">기본값으로 되돌리기</button>
      </div>
    `;
    document.body.appendChild(panelEl);

    const gear = document.getElementById('settingsBtn');
    const r = gear.getBoundingClientRect();
    panelEl.style.top = (r.bottom + 8) + 'px';
    const right = Math.max(8, window.innerWidth - r.right);
    panelEl.style.right = right + 'px';

    panelEl.querySelectorAll('[data-group="density"] button').forEach((btn) => {
      btn.addEventListener('click', () => {
        prefs.density = btn.dataset.value;
        persist(); apply();
        panelEl.querySelectorAll('[data-group="density"] button').forEach((b) =>
          b.classList.toggle('on', b.dataset.value === prefs.density)
        );
      });
    });

    panelEl.querySelectorAll('[data-group="theme"] button').forEach((btn) => {
      btn.addEventListener('click', () => {
        prefs.theme = btn.dataset.value;
        persist(); apply();
        panelEl.querySelectorAll('[data-group="theme"] button').forEach((b) =>
          b.classList.toggle('on', b.dataset.value === prefs.theme)
        );
      });
    });

    panelEl.querySelector('#setShowHint').addEventListener('change', (ev) => {
      prefs.showHint = ev.target.checked;
      persist(); apply();
    });

    panelEl.querySelector('#settingsReset').addEventListener('click', () => {
      prefs = Object.assign({}, DEFAULTS);
      persist(); apply();
      closePanel(); openPanel();
    });

    setTimeout(() => {
      document.addEventListener('pointerdown', maybeClose, true);
      document.addEventListener('keydown', escClose);
    }, 0);

    function maybeClose(e) {
      if (!panelEl) return;
      if (panelEl.contains(e.target)) return;
      if (gear.contains(e.target)) return;
      closePanel();
    }
    function escClose(e) { if (e.key === 'Escape') closePanel(); }

    panelEl._cleanup = () => {
      document.removeEventListener('pointerdown', maybeClose, true);
      document.removeEventListener('keydown', escClose);
    };
  }

  function closePanel() {
    if (!panelEl) return;
    if (panelEl._cleanup) panelEl._cleanup();
    panelEl.remove();
    panelEl = null;
  }

  function init() {
    load();
    apply();
    injectButton();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
