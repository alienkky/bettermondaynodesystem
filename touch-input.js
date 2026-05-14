/* =========================================================================
   touch-input.js — Pen / Touch input bridge for the canvas tools.
   Loaded by every canvas. Adds three behaviors on top of the
   existing pointer-event-based code:

   1) Palette drag (HTML5 drag-and-drop fails on iOS touch) — re-implemented
      with pointer events. Synthetic 'drop' is dispatched on .canvas-wrap
      with a real DataTransfer so the existing handler "just works".

   2) Two-finger pinch zoom — translates the gesture into wheel events
      with ctrlKey:true (the same shape Trackpad pinch generates), so the
      canvas's existing wheel-zoom handler picks it up untouched.

   3) Two-finger pan — translates two-finger drag into Space-style pan
      by emitting synthetic pointerdown/move/up on .canvas-wrap with a
      'space' flag the canvas reads via window.__touchPanActive.

   Only touch + pen pointers trigger this shim; mouse pointers fall
   through to the native code path (HTML5 DnD + wheel zoom).
   ========================================================================= */
(function () {
  'use strict';

  const log = () => {};  // swap for console.log when debugging

  /* --------- 1) PALETTE POINTER-DRAG --------- */
  function setupPaletteDrag() {
    const items = document.querySelectorAll('.pitem[draggable], .pitem[data-kind]');
    items.forEach((item) => {
      item.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse') return;          // native DnD handles mouse
        if (e.button !== 0 && e.button !== undefined && e.button !== -1) return;

        const kind = item.dataset.kind;
        const glyph = item.dataset.glyph || '';
        if (!kind) return;

        // Ghost element following the pointer
        const ghost = item.cloneNode(true);
        ghost.classList.add('dragging-ghost');
        document.body.appendChild(ghost);
        positionGhost(ghost, e.clientX, e.clientY);

        let moved = false;

        const onMove = (ev) => {
          moved = true;
          positionGhost(ghost, ev.clientX, ev.clientY);
          ev.preventDefault();
        };
        const finish = (ev) => {
          document.removeEventListener('pointermove', onMove, true);
          document.removeEventListener('pointerup', onUp, true);
          document.removeEventListener('pointercancel', onCancel, true);
          ghost.remove();
        };
        const onUp = (ev) => {
          finish(ev);
          if (!moved) return;                            // simple tap, ignore
          dispatchSyntheticDrop(ev.clientX, ev.clientY, kind, glyph);
        };
        const onCancel = (ev) => finish(ev);

        document.addEventListener('pointermove', onMove, true);
        document.addEventListener('pointerup', onUp, true);
        document.addEventListener('pointercancel', onCancel, true);

        e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
    });
  }
  function positionGhost(ghost, x, y) {
    ghost.style.left = (x - 60) + 'px';
    ghost.style.top  = (y - 18) + 'px';
  }
  function dispatchSyntheticDrop(clientX, clientY, kind, glyph) {
    const wrap = document.querySelector('.canvas-wrap');
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right ||
        clientY < rect.top  || clientY > rect.bottom) return;

    let dt;
    try {
      dt = new DataTransfer();
      dt.setData('kind', kind);
      if (glyph) dt.setData('glyph', glyph);
    } catch (err) {
      // Fallback: build a fake dataTransfer object the existing handler can read.
      const store = { kind, glyph };
      dt = {
        files: [],
        types: glyph ? ['kind', 'glyph'] : ['kind'],
        effectAllowed: 'copy',
        dropEffect: 'copy',
        getData: (k) => store[k] || '',
        setData: (k, v) => { store[k] = v; },
      };
    }

    const drop = new DragEvent('drop', {
      clientX, clientY,
      dataTransfer: dt,
      bubbles: true, cancelable: true,
    });

    // Some engines won't attach dataTransfer through the constructor;
    // re-define it as a non-enumerable property to be safe.
    if (drop.dataTransfer !== dt) {
      Object.defineProperty(drop, 'dataTransfer', { value: dt, writable: false, configurable: true });
    }
    wrap.dispatchEvent(drop);
  }

  /* --------- 2) PINCH ZOOM + 3) TWO-FINGER PAN --------- */
  function setupTwoFingerGestures() {
    const wrap = document.querySelector('.canvas-wrap');
    if (!wrap) return;

    const pts = new Map();   // pointerId -> {x,y}
    let prevDist = 0;
    let prevCenter = null;

    function getCenter() {
      const arr = [...pts.values()];
      return { x: (arr[0].x + arr[1].x) / 2, y: (arr[0].y + arr[1].y) / 2 };
    }
    function getDist() {
      const arr = [...pts.values()];
      return Math.hypot(arr[0].x - arr[1].x, arr[0].y - arr[1].y);
    }

    wrap.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        prevDist = getDist();
        prevCenter = getCenter();
        window.__touchPanActive = true;  // hint for canvas
      }
    }, true);

    wrap.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'mouse') return;
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size !== 2) return;

      const dist = getDist();
      const center = getCenter();

      // Zoom — emit a wheel event the existing handler already understands.
      if (prevDist > 0) {
        const scale = dist / prevDist;
        if (Math.abs(scale - 1) > 0.003) {
          const deltaY = (1 - scale) * 220;  // larger = faster zoom
          const we = new WheelEvent('wheel', {
            deltaY,
            deltaMode: 0,
            clientX: center.x,
            clientY: center.y,
            ctrlKey: true,       // ctrl+wheel = zoom (trackpad pinch convention)
            bubbles: true,
            cancelable: true,
          });
          wrap.dispatchEvent(we);
        }
      }

      // Pan — adjust the canvas pan directly by mutating the canvas transform if
      // a global pan helper is exposed by the host page. Otherwise dispatch a
      // pointermove-like event with shiftKey flag the canvas may interpret.
      if (prevCenter && typeof window.__panBy === 'function') {
        const dx = center.x - prevCenter.x;
        const dy = center.y - prevCenter.y;
        if (dx || dy) window.__panBy(dx, dy);
      } else if (prevCenter) {
        // No host hook — fall back to translating the canvas element directly.
        const dx = center.x - prevCenter.x;
        const dy = center.y - prevCenter.y;
        applyFallbackPan(dx, dy);
      }

      prevDist = dist;
      prevCenter = center;
      e.preventDefault();
    }, true);

    const endPointer = (e) => {
      if (e.pointerType === 'mouse') return;
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pts.size < 2) {
        prevDist = 0;
        prevCenter = null;
        window.__touchPanActive = false;
      }
    };
    wrap.addEventListener('pointerup', endPointer, true);
    wrap.addEventListener('pointercancel', endPointer, true);
    wrap.addEventListener('pointerleave', endPointer, true);
  }

  // Fallback pan: read/write the canvas's CSS transform if it uses translate(x,y) scale(z).
  function applyFallbackPan(dx, dy) {
    const canvas = document.querySelector('.canvas-wrap .canvas');
    if (!canvas) return;
    const m = canvas.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([-\d.]+)\)/);
    if (!m) return;
    const tx = parseFloat(m[1]) + dx;
    const ty = parseFloat(m[2]) + dy;
    const sc = parseFloat(m[3]);
    canvas.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`;
  }

  /* --------- 4) BLOCK iOS DOUBLE-TAP ZOOM ON BUTTONS --------- */
  // iOS Safari may interpret quick double-taps as zoom even with touch-action.
  // For toolbar buttons we suppress this by handling click locally.
  function suppressIosDoubleTap() {
    document.addEventListener('gesturestart', (e) => e.preventDefault());
  }

  /* --------- INIT --------- */
  function init() {
    setupPaletteDrag();
    setupTwoFingerGestures();
    suppressIosDoubleTap();
    log('touch-input.js ready');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
