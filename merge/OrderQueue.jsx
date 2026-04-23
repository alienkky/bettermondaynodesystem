// ========================================================================
// OrderQueue — 손님 주문 큐
// ========================================================================

function OrderQueue({ orders, onDeliver, board }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '10px 12px', overflowX: 'auto',
      background: 'rgba(255,255,255,0.5)', borderBottom: '2px solid rgba(107,63,42,0.2)' }}>
      {orders.map((o, i) => {
        const reg = window.ASSET_REGISTRY.chains[o.chain];
        const stage = reg.stages[o.grade - 1];
        const canDeliver = findInBoard(board, o.chain, o.grade) !== null;
        return (
          <div key={o.id} onClick={() => canDeliver && onDeliver(i)}
            style={{
              flex: '0 0 auto', minWidth: 110,
              background: 'var(--cream)',
              border: `2px solid ${canDeliver ? reg.accent : 'rgba(107,63,42,0.2)'}`,
              borderRadius: 12, padding: 8,
              cursor: canDeliver ? 'pointer' : 'default',
              boxShadow: canDeliver ? `0 0 0 3px ${reg.accent}33, 0 3px 6px rgba(0,0,0,0.1)` : 'none',
              opacity: canDeliver ? 1 : 0.7,
              transition: 'all 150ms',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 24, lineHeight: 1 }}>{o.customer.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: 'var(--fg-2)', fontWeight: 700 }}>{o.customer.name}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: reg.accent }}>{stage.name}</div>
              </div>
            </div>
            {/* 미니 아이콘 */}
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 18 }}>{stage.emoji}</div>
              <div style={{ flex: 1, height: 4, background: 'rgba(107,63,42,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${o.timeLeft * 100}%`, height: '100%',
                  background: o.timeLeft > 0.3 ? reg.accent : '#C8383C',
                  transition: 'width 200ms linear' }} />
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, color: reg.accent }}>+{stage.reward}</div>
            </div>
          </div>
        );
      })}
      {orders.length === 0 && (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--fg-3)', fontSize: 12, flex: 1 }}>
          손님을 기다리는 중...
        </div>
      )}
    </div>
  );
}

function findInBoard(board, chain, grade) {
  for (let r = 0; r < board.length; r++)
    for (let c = 0; c < board[0].length; c++)
      if (board[r][c]?.chain === chain && board[r][c]?.grade === grade)
        return { r, c };
  return null;
}

window.OrderQueue = OrderQueue;
window.findInBoard = findInBoard;
