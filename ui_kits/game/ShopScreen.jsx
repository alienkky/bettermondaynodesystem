// Main shop screen — isometric aerial view + furniture card
function ShopScreen({ player, coins, onCoinsChange, furniture, onBuildFurniture }) {
  const list = [
    { k: 'counter',  name: '물약 계산대', cost: 10, energy: 5, icon: '☕' },
    { k: 'shelf',    name: '포션 진열대', cost: 15, energy: 5, icon: '🧋' },
    { k: 'oven',     name: '마법 오븐',  cost: 20, energy: 5, icon: '🔥' },
    { k: 'cauldron', name: '양조 솥',    cost: 30, energy: 10, icon: '🫕' },
    { k: 'bookshelf',name: '마법서 책장', cost: 45, energy: 10, icon: '📚' },
  ];
  const idx = Math.min(furniture, list.length - 1);
  const cur = list[idx];
  const done = furniture >= list.length;
  const totalBuilt = Math.min(furniture, 27);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--paper)', overflow: 'hidden' }}>
      {/* Isometric shop view */}
      <div style={{ flex: 1, position: 'relative',
        background: 'linear-gradient(180deg, #EFE3CC 0%, #DAC8A8 100%)',
        overflow: 'hidden' }}>
        {/* paper grain */}
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(107,63,42,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(107,63,42,0.06) 0%, transparent 50%)' }} />

        {/* Isometric floor grid */}
        <svg viewBox="0 0 350 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <pattern id="isogrid" width="40" height="23" patternTransform="skewX(-30)"
              patternUnits="userSpaceOnUse">
              <rect width="40" height="23" fill="none" stroke="rgba(107,63,42,0.14)" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <polygon points="40,210 310,210 270,100 80,100" fill="#E7D3A8" stroke="rgba(107,63,42,0.2)" strokeWidth="1.5"/>
          <polygon points="40,210 310,210 270,100 80,100" fill="url(#isogrid)"/>

          {/* Built furniture (stacks) */}
          {totalBuilt >= 1 && (
            <g transform="translate(90 150)">
              <rect x="0" y="10" width="44" height="26" fill="#6B3F2A" stroke="#4A2A1C" strokeWidth="1.5"/>
              <rect x="0" y="0" width="44" height="10" fill="#8B5D3F" stroke="#4A2A1C" strokeWidth="1.5"/>
              <text x="22" y="23" textAnchor="middle" fill="#F7EFE2" fontSize="10" fontWeight="800">카운터</text>
            </g>
          )}
          {totalBuilt >= 2 && (
            <g transform="translate(160 140)">
              <rect x="0" y="0" width="32" height="40" fill="#A67A5A" stroke="#4A2A1C" strokeWidth="1.5"/>
              <line x1="0" y1="13" x2="32" y2="13" stroke="#4A2A1C" strokeWidth="1"/>
              <line x1="0" y1="26" x2="32" y2="26" stroke="#4A2A1C" strokeWidth="1"/>
            </g>
          )}
          {totalBuilt >= 3 && (
            <g transform="translate(220 155)">
              <rect x="0" y="0" width="30" height="28" fill="#C8383C" stroke="#4A2A1C" strokeWidth="1.5"/>
              <circle cx="15" cy="14" r="6" fill="#FFD97A"/>
            </g>
          )}

          {/* Door at back */}
          <rect x="160" y="105" width="30" height="38" fill="#C8383C" stroke="#4A2A1C" strokeWidth="1.5"/>
          <rect x="160" y="105" width="30" height="6" fill="#D4A64A"/>
        </svg>

        {/* Progress badge */}
        <div style={{ position: 'absolute', top: 14, left: 14,
          background: 'var(--cream)', borderRadius: 999, padding: '6px 12px',
          border: '1.5px solid var(--border-card)', boxShadow: 'var(--sh-sm)',
          fontSize: 12, fontWeight: 800 }}>
          <span style={{ color: 'var(--fg-2)' }}>매장 </span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{totalBuilt}</span>
          <span style={{ color: 'var(--fg-2)' }}> / 27</span>
        </div>

        {/* Hint bubble */}
        <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14,
          background: 'rgba(247,239,226,0.95)', borderRadius: 12, padding: '10px 14px',
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, letterSpacing: '-0.005em',
          color: 'var(--roast-deep)', border: '1.5px solid var(--border-card)',
          boxShadow: 'var(--sh-sm)' }}>
          {done ? '🎉 매장이 완성됐어요!' : `${player.name}님, 가구를 배치해서 상점을 완성해볼까요?`}
        </div>
      </div>

      {/* Build card */}
      {!done && (
        <div style={{ padding: 12, background: 'var(--paper)' }}>
          <Card style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12,
              background: 'var(--cream-warm)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{cur.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{cur.name}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 1 }}>
                {idx + 1}번째 가구 · 탭하여 배치
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: 12, fontWeight: 700 }}>
                <span style={{ color: '#8A5408' }}>💰 {cur.cost}</span>
                <span style={{ color: 'var(--fg-3)' }}>→</span>
                <span style={{ color: '#B86A10' }}>⚡ +{cur.energy}</span>
              </div>
            </div>
            <Button disabled={coins < cur.cost} onClick={() => {
              if (coins >= cur.cost) { onCoinsChange(coins - cur.cost); onBuildFurniture(); }
            }}>배치</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
window.ShopScreen = ShopScreen;
