/* ============================================================================
   canvas-interact.js — shared pan/zoom + multi-select + smart-align module
   for BetterMonday flow surfaces (Editor, Dashboard, Diagrams).

   Usage:
     const ci = CanvasInteract.attach({
       wrap:   document.getElementById('wrap'),        // viewport / scroll element
       canvas: document.getElementById('canvas'),      // transformed surface
       nodeSelector: '.gnode',                         // draggable node class
       getNodePos: (el) => ({ x: parseFloat(el.style.left)||0,
                              y: parseFloat(el.style.top)||0 }),
       setNodePos: (el, x, y) => { el.style.left = x+'px'; el.style.top = y+'px'; },
       onChange:   () => renderEdges(),                // called while dragging
       onCommit:   () => save(),                       // called at mouseup
       onSelect:   (els) => updateInspector(els),      // selection set changed
       onDelete:   (els) => deleteNodes(els),          // Del/Backspace pressed
       onDuplicate:(els) => duplicateNodes(els),       // Cmd/Ctrl+D pressed
       transform:  true,     // whether to apply pan/zoom transforms (false for Dashboard that uses scroll)
       zoomRange:  [0.3, 2],
       grid:       8,        // snap grid when not holding Alt
     });

   Interactions added to every surface:
     - drag a node → move it (arrow-key nudges also work)
     - Shift + click node → add/remove from selection
     - drag empty canvas → marquee-select
     - drag any selected node → all selected nodes move together
     - hold Shift while dragging → axis-lock (X or Y)
     - snap lines appear when a dragged edge/center aligns within 6px of another node
     - Space + drag → pan (transform mode); middle-mouse drag → pan
     - wheel → zoom toward cursor (transform mode)
     - Del / Backspace → onDelete(selection)
     - Cmd/Ctrl + D → onDuplicate(selection)
     - Cmd/Ctrl + A → select all
     - Esc → deselect all
   ============================================================================ */
(function () {
  const SNAP_THRESHOLD = 6;     // px in canvas space
  const ALIGN_COLOR = 'rgba(200, 56, 60, 0.9)';

  function attach(opts) {
    const wrap   = opts.wrap;
    const canvas = opts.canvas;
    const nodeSelector = opts.nodeSelector || '.gnode';
    const getPos = opts.getNodePos || ((el) => ({
      x: parseFloat(el.style.left) || 0,
      y: parseFloat(el.style.top)  || 0,
    }));
    const setPos = opts.setNodePos || ((el, x, y) => {
      el.style.left = x + 'px';
      el.style.top  = y + 'px';
    });
    const onChange    = opts.onChange    || (() => {});
    const onCommit    = opts.onCommit    || (() => {});
    const onSelect    = opts.onSelect    || (() => {});
    const onDelete    = opts.onDelete    || (() => {});
    const onDuplicate = opts.onDuplicate || (() => {});
    const useTransform = opts.transform !== false;
    const [ZMIN, ZMAX] = opts.zoomRange || [0.3, 2];
    const GRID = opts.grid || 8;

    const state = {
      selection: new Set(),   // HTMLElements
      zoom: 1,
      pan: { x: 0, y: 0 },
      space: false,
      panning: false,
    };

    // ── overlay layer (marquee + snap guides) ─────────────────────────────
    const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    overlay.setAttribute('class', 'ci-overlay');
    overlay.style.cssText = 'position:absolute;left:0;top:0;width:1px;height:1px;pointer-events:none;z-index:50;overflow:visible;';
    canvas.appendChild(overlay);

    const marquee = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    marquee.setAttribute('fill', 'rgba(200,56,60,0.08)');
    marquee.setAttribute('stroke', 'rgba(200,56,60,0.7)');
    marquee.setAttribute('stroke-width', '1');
    marquee.setAttribute('stroke-dasharray', '4 3');
    marquee.style.display = 'none';
    overlay.appendChild(marquee);

    function clearGuides() {
      overlay.querySelectorAll('.ci-guide').forEach(n => n.remove());
    }
    function drawGuide(x1, y1, x2, y2) {
      const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      ln.setAttribute('class', 'ci-guide');
      ln.setAttribute('x1', x1); ln.setAttribute('y1', y1);
      ln.setAttribute('x2', x2); ln.setAttribute('y2', y2);
      ln.setAttribute('stroke', ALIGN_COLOR);
      ln.setAttribute('stroke-width', '1');
      ln.setAttribute('stroke-dasharray', '3 3');
      overlay.appendChild(ln);
    }

    // ── transform ────────────────────────────────────────────────────────
    function applyTransform() {
      if (!useTransform) return;
      canvas.style.transformOrigin = '0 0';
      canvas.style.transform = `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`;
      if (opts.onTransform) opts.onTransform(state);
    }

    // ── selection ────────────────────────────────────────────────────────
    function setSelection(els, additive = false) {
      if (!additive) state.selection.clear();
      for (const el of els) state.selection.add(el);
      refreshSelectionClass();
      onSelect([...state.selection]);
    }
    function toggleSelect(el) {
      if (state.selection.has(el)) state.selection.delete(el);
      else state.selection.add(el);
      refreshSelectionClass();
      onSelect([...state.selection]);
    }
    function clearSelection() {
      state.selection.clear();
      refreshSelectionClass();
      onSelect([]);
    }
    function refreshSelectionClass() {
      canvas.querySelectorAll(nodeSelector).forEach(el => {
        el.classList.toggle('ci-selected', state.selection.has(el));
      });
    }

    // ── helpers ──────────────────────────────────────────────────────────
    function clientToCanvas(cx, cy) {
      const rect = canvas.getBoundingClientRect();
      // rect already includes transform, so this yields canvas-space coords
      return { x: (cx - rect.left) / state.zoom,
               y: (cy - rect.top)  / state.zoom };
    }
    function nodeBounds(el) {
      const p = getPos(el);
      return { x: p.x, y: p.y, w: el.offsetWidth, h: el.offsetHeight,
               l: p.x, r: p.x + el.offsetWidth,
               t: p.y, b: p.y + el.offsetHeight,
               cx: p.x + el.offsetWidth / 2,
               cy: p.y + el.offsetHeight / 2 };
    }
    function snapToGrid(v) { return Math.round(v / GRID) * GRID; }

    // ── drag a node (or the whole selection) ─────────────────────────────
    function startNodeDrag(e, el) {
      e.preventDefault();
      // if node isn't in selection, select it (unless shift)
      if (!state.selection.has(el)) {
        if (e.shiftKey) { state.selection.add(el); refreshSelectionClass(); onSelect([...state.selection]); }
        else setSelection([el]);
      }
      const movers = [...state.selection];
      const start = clientToCanvas(e.clientX, e.clientY);
      const origin = movers.map(m => ({ el: m, ...getPos(m) }));
      const others = [...canvas.querySelectorAll(nodeSelector)].filter(x => !state.selection.has(x));
      const otherBounds = others.map(nodeBounds);

      let axisLock = null;   // null | 'x' | 'y'

      const onMove = ev => {
        const now = clientToCanvas(ev.clientX, ev.clientY);
        let dx = now.x - start.x;
        let dy = now.y - start.y;
        if (ev.shiftKey) {
          if (axisLock == null) axisLock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
          if (axisLock === 'x') dy = 0; else dx = 0;
        } else {
          axisLock = null;
        }
        // compute raw positions
        const moved = origin.map(o => ({ el: o.el, x: o.x + dx, y: o.y + dy }));
        // SMART ALIGN: nudge against nearest other node (use bounding box of moving group)
        clearGuides();
        if (!ev.altKey) {
          const groupL = Math.min(...moved.map(m => m.x));
          const groupT = Math.min(...moved.map(m => m.y));
          const groupR = Math.max(...moved.map(m => m.x + m.el.offsetWidth));
          const groupB = Math.max(...moved.map(m => m.y + m.el.offsetHeight));
          const groupCX = (groupL + groupR) / 2;
          const groupCY = (groupT + groupB) / 2;
          let snapDX = 0, snapDY = 0, snapXLines = [], snapYLines = [];
          for (const ob of otherBounds) {
            // vertical alignments (x snaps)
            [['l', ob.l], ['cx', ob.cx], ['r', ob.r]].forEach(([tag, ox]) => {
              [['l', groupL], ['cx', groupCX], ['r', groupR]].forEach(([gtag, gx]) => {
                const d = ox - gx;
                if (Math.abs(d) <= SNAP_THRESHOLD && (snapDX === 0 || Math.abs(d) < Math.abs(snapDX))) {
                  snapDX = d;
                }
                if (Math.abs(ox - gx) <= SNAP_THRESHOLD) snapXLines.push({ x: ox, yA: Math.min(ob.t, groupT), yB: Math.max(ob.b, groupB) });
              });
            });
            // horizontal alignments (y snaps)
            [['t', ob.t], ['cy', ob.cy], ['b', ob.b]].forEach(([tag, oy]) => {
              [['t', groupT], ['cy', groupCY], ['b', groupB]].forEach(([gtag, gy]) => {
                const d = oy - gy;
                if (Math.abs(d) <= SNAP_THRESHOLD && (snapDY === 0 || Math.abs(d) < Math.abs(snapDY))) {
                  snapDY = d;
                }
                if (Math.abs(oy - gy) <= SNAP_THRESHOLD) snapYLines.push({ y: oy, xA: Math.min(ob.l, groupL), xB: Math.max(ob.r, groupR) });
              });
            });
          }
          if (snapDX !== 0) moved.forEach(m => m.x += snapDX);
          if (snapDY !== 0) moved.forEach(m => m.y += snapDY);
          snapXLines.forEach(g => drawGuide(g.x, g.yA - 20, g.x, g.yB + 20));
          snapYLines.forEach(g => drawGuide(g.xA - 20, g.y, g.xB + 20, g.y));
        } else {
          // Alt held: snap to grid instead
          moved.forEach(m => { m.x = snapToGrid(m.x); m.y = snapToGrid(m.y); });
        }
        // apply
        moved.forEach(m => setPos(m.el, Math.round(m.x), Math.round(m.y)));
        onChange();
      };
      const onUp = () => {
        removeEventListener('mousemove', onMove);
        removeEventListener('mouseup', onUp);
        clearGuides();
        onCommit();
      };
      addEventListener('mousemove', onMove);
      addEventListener('mouseup', onUp);
    }

    // ── marquee select ───────────────────────────────────────────────────
    function startMarquee(e) {
      const start = clientToCanvas(e.clientX, e.clientY);
      marquee.style.display = '';
      const initial = e.shiftKey ? new Set(state.selection) : new Set();
      const onMove = ev => {
        const now = clientToCanvas(ev.clientX, ev.clientY);
        const x = Math.min(start.x, now.x), y = Math.min(start.y, now.y);
        const w = Math.abs(now.x - start.x), h = Math.abs(now.y - start.y);
        marquee.setAttribute('x', x); marquee.setAttribute('y', y);
        marquee.setAttribute('width', w); marquee.setAttribute('height', h);
        // hit-test
        const hit = new Set(initial);
        canvas.querySelectorAll(nodeSelector).forEach(el => {
          const b = nodeBounds(el);
          if (b.r >= x && b.l <= x + w && b.b >= y && b.t <= y + h) hit.add(el);
        });
        setSelection([...hit]);
      };
      const onUp = () => {
        removeEventListener('mousemove', onMove);
        removeEventListener('mouseup', onUp);
        marquee.style.display = 'none';
      };
      addEventListener('mousemove', onMove);
      addEventListener('mouseup', onUp);
    }

    // ── pan ──────────────────────────────────────────────────────────────
    function startPan(e) {
      state.panning = true;
      wrap.style.cursor = 'grabbing';
      const sx = e.clientX, sy = e.clientY, opx = state.pan.x, opy = state.pan.y;
      const onMove = ev => {
        state.pan.x = opx + (ev.clientX - sx);
        state.pan.y = opy + (ev.clientY - sy);
        applyTransform();
      };
      const onUp = () => {
        removeEventListener('mousemove', onMove);
        removeEventListener('mouseup', onUp);
        state.panning = false;
        wrap.style.cursor = state.space ? 'grab' : '';
      };
      addEventListener('mousemove', onMove);
      addEventListener('mouseup', onUp);
    }

    // ── event wiring ─────────────────────────────────────────────────────
    wrap.addEventListener('mousedown', e => {
      // ignore if inside a port, delete button, contentEditable, or UI chrome
      if (e.target.closest('.port, .del, input, textarea, [contenteditable="true"], button')) return;
      const node = e.target.closest(nodeSelector);
      if (node) {
        if (e.shiftKey) { toggleSelect(node); e.preventDefault(); return; }
        startNodeDrag(e, node);
        return;
      }
      // background
      if (e.button === 1 || (state.space && useTransform)) { startPan(e); return; }
      // marquee
      if (e.button === 0) {
        if (!e.shiftKey) clearSelection();
        startMarquee(e);
      }
    });

    // Keyboard
    addEventListener('keydown', e => {
      const tgt = e.target;
      if (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable) return;
      if (e.code === 'Space' && useTransform) { state.space = true; wrap.style.cursor = 'grab'; }
      if (e.key === 'Escape') { clearSelection(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selection.size) {
        onDelete([...state.selection]);
        state.selection.clear();
        onSelect([]);
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && state.selection.size) {
        e.preventDefault();
        onDuplicate([...state.selection]);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelection([...canvas.querySelectorAll(nodeSelector)]);
      }
      // arrow-key nudge
      const arrows = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (arrows[e.key] && state.selection.size) {
        e.preventDefault();
        const [dx, dy] = arrows[e.key];
        const step = e.shiftKey ? 10 : 1;
        state.selection.forEach(el => {
          const p = getPos(el);
          setPos(el, p.x + dx * step, p.y + dy * step);
        });
        onChange();
        onCommit();
      }
    });
    addEventListener('keyup', e => {
      if (e.code === 'Space') { state.space = false; wrap.style.cursor = ''; }
    });

    // Wheel zoom
    if (useTransform) {
      wrap.addEventListener('wheel', e => {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        const newZoom = Math.min(ZMAX, Math.max(ZMIN, state.zoom * (1 + delta)));
        const rect = wrap.getBoundingClientRect();
        const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
        state.pan.x = cx - (cx - state.pan.x) * (newZoom / state.zoom);
        state.pan.y = cy - (cy - state.pan.y) * (newZoom / state.zoom);
        state.zoom = newZoom;
        applyTransform();
      }, { passive: false });
    }

    // ── public API ──────────────────────────────────────────────────────
    return {
      state,
      setSelection,
      clearSelection,
      toggleSelect,
      applyTransform,
      refreshSelectionClass,
      fit(pad = 80) {
        const nodes = [...canvas.querySelectorAll(nodeSelector)];
        if (!nodes.length) { state.zoom = 1; state.pan = { x: 0, y: 0 }; applyTransform(); return; }
        const bs = nodes.map(nodeBounds);
        const minX = Math.min(...bs.map(b => b.l)) - pad;
        const minY = Math.min(...bs.map(b => b.t)) - pad;
        const maxX = Math.max(...bs.map(b => b.r)) + pad;
        const maxY = Math.max(...bs.map(b => b.b)) + pad;
        const w = maxX - minX, h = maxY - minY;
        const rect = wrap.getBoundingClientRect();
        state.zoom = Math.min(rect.width / w, rect.height / h, 1.2);
        state.pan.x = -minX * state.zoom + (rect.width  - w * state.zoom) / 2;
        state.pan.y = -minY * state.zoom + (rect.height - h * state.zoom) / 2;
        applyTransform();
      },
      zoomBy(factor) {
        state.zoom = Math.min(ZMAX, Math.max(ZMIN, state.zoom * factor));
        applyTransform();
      },
    };
  }

  window.CanvasInteract = { attach };
})();
