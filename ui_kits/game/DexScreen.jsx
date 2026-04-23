// Collection (Dex) screen — slimes + element affinities
function DexScreen({ player }) {
  const slimes = [
    { k: 'aroma',  name: '아로마',  material: '스페셜티 원두', buff: '품질 +10%', found: true },
    { k: 'creamy', name: '크리미',  material: '우유 / 오트밀크', buff: '만족도 +15%', found: true },
    { k: 'bubble', name: '버블',    material: '탄산수', buff: '속도 +25%', found: true },
    { k: 'caramel',name: '카라멜',  material: '카라멜 시럽', buff: '재방문 +20%', found: false },
    { k: 'matcha', name: '말차',    material: '말차 파우더', buff: '체류 +10%', found: false },
  ];
  const affinities = [
    { pl: 'fire', cus: 'fire',  result: '공명',  mul: '×1.5', color: '#8A6A10' },
    { pl: 'fire', cus: 'earth', result: '상생',  mul: '×1.3', color: '#2E5A1E' },
    { pl: 'fire', cus: 'metal', result: '상극',  mul: '×0.7', color: '#7A1F22' },
    { pl: 'fire', cus: 'water', result: '상극',  mul: '×0.7', color: '#7A1F22' },
    { pl: 'fire', cus: 'wood',  result: '상생',  mul: '×1.3', color: '#2E5A1E' },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
      background: 'var(--paper)', overflow: 'auto', padding: '16px 16px 20px' }}>
      <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)' }}>도감</div>
      <div style={{ color: 'var(--fg-2)', fontSize: 13, marginTop: 2 }}>
        {slimes.filter(s => s.found).length} / {slimes.length} 수집됨
      </div>

      {/* Slimes */}
      <div style={{ marginTop: 18, fontWeight: 700, fontSize: 13 }}>슬라임</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
        {slimes.map(s => (
          <Card key={s.k} style={{ padding: 12, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4, opacity: s.found ? 1 : 0.35,
            filter: s.found ? 'none' : 'grayscale(1)' }}>
            <SlimeIcon type={s.k} size={54} />
            <div style={{ fontWeight: 800, fontSize: 13, marginTop: 2 }}>{s.found ? s.name : '? ? ?'}</div>
            {s.found && <div style={{ fontSize: 10, color: 'var(--fg-2)', textAlign: 'center' }}>{s.material}</div>}
            {s.found && <div style={{ fontSize: 10, color: 'var(--success)', fontWeight: 700 }}>{s.buff}</div>}
          </Card>
        ))}
      </div>

      {/* Element affinities */}
      <div style={{ marginTop: 22, fontWeight: 700, fontSize: 13 }}>
        오행 상성 · 내 원소 {EL[player.element].glyph} {EL[player.element].label}
      </div>
      <Card style={{ marginTop: 10, padding: 0, overflow: 'hidden' }}>
        {affinities.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px',
            borderBottom: i < affinities.length - 1 ? '1px solid var(--border-hair)' : 'none' }}>
            <ElementBadge element={a.pl} size="sm" showLabel={false} />
            <span style={{ color: 'var(--fg-3)' }}>→</span>
            <ElementBadge element={a.cus} size="sm" />
            <div style={{ flex: 1 }} />
            <div style={{ fontWeight: 800, fontSize: 13, color: a.color }}>{a.result}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums',
              fontWeight: 700, minWidth: 36, textAlign: 'right' }}>{a.mul}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
window.DexScreen = DexScreen;
