// ========================================================================
// MergeItem — 머지 보드의 아이템 한 칸
// ========================================================================

function MergeItem({ chain, grade, size = 48, dragging, onPointerDown }) {
  const reg = window.ASSET_REGISTRY.chains[chain];
  if (!reg) return null;
  const stage = reg.stages[grade - 1];
  if (!stage) return null;

  // 우선순위: sprite (itch.io 에셋) > emoji (플레이스홀더)
  const useSprite = !!stage.sprite;

  return (
    <div
      onPointerDown={onPointerDown}
      style={{
        width: size, height: size,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        cursor: 'grab',
        transform: dragging ? 'scale(1.15)' : 'scale(1)',
        transition: 'transform 120ms var(--ease-spring)',
        filter: dragging ? 'drop-shadow(0 8px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* 등급 배경 원 */}
      <div style={{
        position: 'absolute', inset: 2, borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${tintForGrade(reg.accent, grade)}, ${reg.accent})`,
        opacity: 0.9,
        boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3)',
      }} />

      {/* 아이콘 */}
      {useSprite ? (
        <img src={stage.sprite} width={size * 0.7} height={size * 0.7}
          style={{ position: 'relative', imageRendering: 'pixelated' }} />
      ) : (
        <div style={{ fontSize: size * 0.55, position: 'relative', lineHeight: 1, filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.5))' }}>
          {stage.emoji}
        </div>
      )}

      {/* 등급 별 */}
      <div style={{
        position: 'absolute', bottom: -2, right: -2,
        width: 18, height: 18, borderRadius: '50%',
        background: 'var(--cream)', border: `2px solid ${reg.accent}`,
        color: reg.accent, fontWeight: 900, fontSize: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
      }}>
        {grade}
      </div>
    </div>
  );
}

// grade에 따라 색 밝기 조절
function tintForGrade(baseHex, grade) {
  // grade 1 = 밝게, grade 5 = 원색
  const t = 1 - (grade - 1) * 0.15;
  const r = parseInt(baseHex.slice(1, 3), 16);
  const g = parseInt(baseHex.slice(3, 5), 16);
  const b = parseInt(baseHex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * t * 0.4);
  const lg = Math.round(g + (255 - g) * t * 0.4);
  const lb = Math.round(b + (255 - b) * t * 0.4);
  return `rgb(${lr}, ${lg}, ${lb})`;
}

window.MergeItem = MergeItem;
