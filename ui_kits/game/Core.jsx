// Core reusable components for BetterMonday Coffee Tycoon UI Kit
// Exports: Button, Chip, ElementBadge, ZodiacAvatar, SlimeIcon, CurrencyPill, Card, HUD, BottomNav, DialogueBubble

function Button({ children, variant = 'primary', size = 'md', onClick, disabled, full }) {
  const pad = size === 'sm' ? '8px 14px' : size === 'lg' ? '16px 28px' : '12px 20px';
  const fs = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;
  const radius = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
  const variants = {
    primary: { background: 'var(--roast)', color: 'var(--cream)', border: 'none', boxShadow: 'var(--sh-md)' },
    ghost:   { background: 'transparent', color: 'var(--roast)', border: '2px solid var(--roast)', boxShadow: 'none' },
    soft:    { background: 'var(--cream-warm)', color: 'var(--ink)', border: 'none', boxShadow: 'none' },
    fire:    { background: 'var(--el-fire)', color: '#fff', border: 'none', boxShadow: '0 4px 12px rgba(200,56,60,.25)' },
    disabled: { background: '#E8DFD0', color: '#A39A92', border: 'none', boxShadow: 'none' },
  };
  const v = disabled ? variants.disabled : variants[variant] || variants.primary;
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{ ...v, padding: pad, fontSize: fs, borderRadius: radius,
        fontWeight: 700, fontFamily: 'var(--font-sans)', cursor: disabled ? 'not-allowed' : 'pointer',
        width: full ? '100%' : undefined, transition: 'transform 120ms var(--ease-spring), filter 120ms' }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.96)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >{children}</button>
  );
}

const EL = {
  wood:  { bg: '#E3F3DA', fg: '#2E5A1E', glyph: '🌿', label: '목' },
  fire:  { bg: '#F8DEDF', fg: '#7A1F22', glyph: '🔥', label: '화' },
  earth: { bg: '#F0E4D3', fg: '#6B4A22', glyph: '⛰️', label: '토' },
  metal: { bg: '#F8EED2', fg: '#7A5E14', glyph: '🪙', label: '금' },
  water: { bg: '#DCEBF5', fg: '#2C5A82', glyph: '💧', label: '수' },
};

function ElementBadge({ element, size = 'md', showLabel = true }) {
  const e = EL[element] || EL.fire;
  const s = size === 'sm' ? { p: '4px 8px', fs: 11, icon: 12 } : size === 'lg' ? { p: '8px 14px', fs: 15, icon: 20 } : { p: '5px 10px', fs: 13, icon: 14 };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: s.p,
      borderRadius: 999, background: e.bg, color: e.fg, fontSize: s.fs, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
      <span style={{ fontSize: s.icon + 4, lineHeight: 1 }}>{e.glyph}</span>
      {showLabel && e.label}
    </span>
  );
}

const ZODIAC = { rat:'🐀', ox:'🐂', tiger:'🐅', rabbit:'🐇', dragon:'🐉', snake:'🐍',
  horse:'🐎', sheep:'🐏', monkey:'🐒', rooster:'🐓', dog:'🐕', pig:'🐗' };

function ZodiacAvatar({ zodiac = 'tiger', element, size = 52, selected, onClick }) {
  const e = element ? EL[element] : null;
  return (
    <div onClick={onClick} style={{ width: size, height: size, borderRadius: 999,
      background: e ? e.bg : 'var(--cream-warm)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.54, lineHeight: 1,
      border: `2px solid ${selected ? 'var(--roast)' : (e ? e.fg : 'var(--border-card)')}`,
      boxShadow: selected ? '0 0 0 3px rgba(107,63,42,0.22)' : 'none',
      flexShrink: 0, cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 120ms var(--ease-spring)' }}>
      {ZODIAC[zodiac] || '🐅'}
    </div>
  );
}

function SlimeIcon({ type = 'aroma', size = 48 }) {
  return <img src={`../../assets/slimes/${type}.svg`} width={size} height={size} style={{ display: 'block' }} />;
}

function CurrencyPill({ kind = 'coin', value }) {
  const src = `../../assets/currency/${kind}.svg`;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'var(--cream)', border: '1.5px solid var(--border-card)',
      padding: '5px 10px 5px 6px', borderRadius: 999, fontWeight: 800, fontSize: 12,
      fontFamily: 'var(--font-sans)', color: 'var(--ink)', boxShadow: 'var(--sh-sm)' }}>
      <img src={src} width={18} height={18} />
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </span>
  );
}

function Card({ children, style, onClick, accent }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--cream)', border: '2px solid var(--border-card)',
      borderRadius: 16, padding: 16, boxShadow: 'var(--sh-md)',
      borderLeft: accent ? `4px solid ${accent}` : undefined,
      cursor: onClick ? 'pointer' : 'default', ...style }}>{children}</div>
  );
}

function HUD({ lv = 12, exp = 0.42, energy = 98, energyMax = 200, coin = '1,240', gem = 24, onBack }) {
  return (
    <div style={{ height: 56, background: 'var(--cream)',
      borderBottom: '1.5px solid var(--border-card)',
      display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0 }}>
      {onBack ? (
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 999,
          border: 'none', background: 'var(--bg-sunken)', cursor: 'pointer', fontSize: 16 }}>‹</button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--roast)',
          color: 'var(--cream)', padding: '4px 10px', borderRadius: 999, fontWeight: 800, fontSize: 11 }}>
          LV <span style={{ fontVariantNumeric: 'tabular-nums' }}>{lv}</span></div>
      )}
      <div style={{ flex: 1, height: 6, background: 'var(--bg-sunken)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${exp * 100}%`, height: '100%', background: 'var(--roast)' }} />
      </div>
      <CurrencyPill kind="energy" value={`${energy}/${energyMax}`} />
      <CurrencyPill kind="coin" value={coin} />
      <CurrencyPill kind="gem" value={gem} />
    </div>
  );
}

function BottomNav({ active = 'shop', onNav }) {
  const items = [
    { k: 'shop',   label: '매장',   icon: '🏪' },
    { k: 'merge',  label: '작업실', icon: '🧪' },
    { k: 'dex',    label: '도감',   icon: '📚' },
    { k: 'menu',   label: '설정',   icon: '⚙' },
  ];
  return (
    <div style={{ height: 72, background: 'var(--cream)',
      borderTop: '1.5px solid var(--border-card)', display: 'flex', flexShrink: 0 }}>
      {items.map(it => {
        const a = active === it.k;
        return (
          <div key={it.k} onClick={() => onNav && onNav(it.k)} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3, cursor: 'pointer',
            color: a ? 'var(--roast)' : 'var(--fg-3)', fontWeight: a ? 800 : 700 }}>
            <div style={{ fontSize: 22 }}>{it.icon}</div>
            <div style={{ fontSize: 11 }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function DialogueBubble({ speaker = 'npc', avatar, children, accent }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      {avatar}
      <div style={{ background: accent ? '#FFF8E8' : '#fff',
        border: `2px solid ${accent || 'var(--border-card)'}`,
        borderRadius: 16, padding: '10px 14px',
        fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 15,
        letterSpacing: '-0.005em',
        color: accent ? '#5A3F10' : 'var(--ink)',
        boxShadow: 'var(--sh-sm)', lineHeight: 1.5, flex: 1 }}>{children}</div>
    </div>
  );
}

Object.assign(window, { Button, Chip: ElementBadge, ElementBadge, ZodiacAvatar, SlimeIcon,
  CurrencyPill, Card, HUD, BottomNav, DialogueBubble, EL, ZODIAC });
