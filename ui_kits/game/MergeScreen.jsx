// Workshop (Merge Board) screen — 7×7 grid + order slots
function MergeScreen({ coins, onCoinsChange, energy, onEnergyChange }) {
  // Initial board: sparse slimes on unlocked cells
  const unlockedRows = [1, 2, 3, 4, 5];
  const unlockedCols = [0, 1, 2, 3, 4, 5, 6];
  const types = ['aroma', 'creamy', 'bubble', 'caramel', 'matcha'];
  const seed = [
    [1,0,'aroma',0,'creamy',0,0],
    [0,'aroma',0,0,0,'matcha',0],
    [0,0,'bubble','aroma',0,0,0],
    [0,0,0,0,'caramel',0,0],
    [0,'matcha',0,0,0,'bubble',0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
  ];
  const [board, setBoard] = React.useState(() =>
    seed.map(row => row.map(c => c === 0 || c === 1 ? null : { type: c, grade: 1 }))
  );
  const [dragging, setDragging] = React.useState(null); // {r,c}
  const [reaction, setReaction] = React.useState(null);

  const [orders] = React.useState([
    { zodiac: 'tiger', element: 'fire', drink: '에스프레소', need: 'aroma', timeLeft: 0.6 },
    { zodiac: 'ox',    element: 'earth', drink: '카페라떼', need: 'creamy', timeLeft: 0.85 },
    { zodiac: 'rabbit',element: 'wood',  drink: '레몬에이드', need: 'bubble', timeLeft: 0.4 },
  ]);

  function isLocked(r, c) { return !unlockedRows.includes(r) || !unlockedCols.includes(c); }

  function handleDrop(r, c) {
    if (!dragging || (dragging.r === r && dragging.c === c)) { setDragging(null); return; }
    const src = board[dragging.r][dragging.c];
    const dst = board[r][c];
    if (src && dst && src.type === dst.type && src.grade === dst.grade && src.grade < 5) {
      const next = board.map(row => row.slice());
      next[r][c] = { type: src.type, grade: src.grade + 1 };
      next[dragging.r][dragging.c] = null;
      setBoard(next);
      setReaction({ r, c, kind: 'merge' });
      setTimeout(() => setReaction(null), 500);
    } else if (src && !dst) {
      const next = board.map(row => row.slice());
      next[r][c] = src;
      next[dragging.r][dragging.c] = null;
      setBoard(next);
    }
    setDragging(null);
  }

  function handleSpawn() {
    if (energy < 1) return;
    // find empty cell
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      if (!isLocked(r, c) && !board[r][c]) {
        const next = board.map(row => row.slice());
        next[r][c] = { type: types[Math.floor(Math.random() * types.length)], grade: 1 };
        setBoard(next);
        onEnergyChange(energy - 1);
        return;
      }
    }
  }

  function handleDeliver(order) {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const cell = board[r][c];
      if (cell && cell.type === order.need) {
        const next = board.map(row => row.slice());
        next[r][c] = null;
        setBoard(next);
        onCoinsChange(coins + 8 * cell.grade);
        const kind = order.element === 'fire' ? 'resonance' : 'synergy';
        setReaction({ r: -1, c: -1, kind, orderIdx: orders.indexOf(order) });
        setTimeout(() => setReaction(null), 500);
        return;
      }
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
      background: 'var(--paper)', overflow: 'hidden' }}>
      {/* Order slots */}
      <div style={{ padding: 10, display: 'flex', gap: 8, background: 'var(--bg-sunken)' }}>
        {orders.map((o, i) => (
          <div key={i} onClick={() => handleDeliver(o)} style={{
            flex: 1, background: 'var(--cream)', border: '2px solid var(--border-card)',
            borderLeft: `4px solid ${EL[o.element].fg}`, borderRadius: 12, padding: 8,
            cursor: 'pointer', position: 'relative', boxShadow: 'var(--sh-sm)' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <ZodiacAvatar zodiac={o.zodiac} element={o.element} size={30} />
              <div style={{ fontWeight: 800, fontSize: 11, color: 'var(--ink)', lineHeight: 1.1 }}>{o.drink}</div>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 6 }}>
              <SlimeIcon type={o.need} size={20} />
              <div style={{ height: 3, background: 'var(--bg-sunken)', flex: 1, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${o.timeLeft * 100}%`, height: '100%', background: EL[o.element].fg }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Board */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 16,
        background: 'var(--paper)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4,
          background: 'var(--cream)', border: '2px solid var(--border-card)',
          borderRadius: 12, padding: 8, width: 302, boxShadow: 'var(--sh-md)' }}>
          {board.map((row, r) => row.map((cell, c) => {
            const locked = isLocked(r, c);
            const isDrag = dragging && dragging.r === r && dragging.c === c;
            const isMerge = reaction && reaction.r === r && reaction.c === c && reaction.kind === 'merge';
            return (
              <div key={`${r}-${c}`}
                onClick={() => cell ? setDragging(isDrag ? null : { r, c }) : dragging && handleDrop(r, c)}
                style={{
                  width: 38, height: 38,
                  background: locked ? 'var(--board-locked)' : 'var(--board-cell)',
                  borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: locked ? 'not-allowed' : 'pointer',
                  border: isDrag ? '2px solid var(--roast)' : 'none',
                  boxShadow: isMerge ? 'var(--ring-resonance)' : 'none',
                  transform: isDrag ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 120ms var(--ease-spring), box-shadow 240ms' }}>
                {cell && <div style={{ position: 'relative' }}>
                  <SlimeIcon type={cell.type} size={32} />
                  {cell.grade > 1 && <div style={{ position: 'absolute', top: -4, right: -4,
                    background: 'var(--coin)', color: '#4A2A1C', fontSize: 9, fontWeight: 800,
                    borderRadius: 999, width: 14, height: 14, display: 'flex',
                    alignItems: 'center', justifyContent: 'center' }}>{cell.grade}</div>}
                </div>}
              </div>
            );
          }))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 10 }}>
          탭해서 선택 · 다른 칸 탭해서 이동 · 같은 재료끼리 합성
        </div>
      </div>

      {/* Material box */}
      <div style={{ padding: 12, background: 'var(--paper)' }}>
        <Card onClick={handleSpawn} style={{ display: 'flex', gap: 12, alignItems: 'center',
          background: energy < 1 ? '#E8DFD0' : 'var(--cream)',
          cursor: energy < 1 ? 'not-allowed' : 'pointer' }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--roast)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>재료 상자</div>
            <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>탭해서 재료 꺼내기 · ⚡ 1 소모</div>
          </div>
          <CurrencyPill kind="energy" value={energy} />
        </Card>
      </div>
    </div>
  );
}
window.MergeScreen = MergeScreen;
