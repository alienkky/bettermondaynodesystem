// ========================================================================
// MergeBoard — 드래그 머지 보드 (포인터 이벤트 기반)
// ========================================================================

function MergeBoard({ board, setBoard, onReward, rows = 7, cols = 6 }) {
  const [dragging, setDragging] = React.useState(null); // {r,c,x,y,offsetX,offsetY}
  const [pointer, setPointer] = React.useState({ x: 0, y: 0 });
  const [hoverCell, setHoverCell] = React.useState(null);
  const [mergeFlash, setMergeFlash] = React.useState(null);
  const boardRef = React.useRef(null);

  const cellSize = 44;
  const gap = 4;

  function getCellAt(clientX, clientY) {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const x = clientX - rect.left - 8;
    const y = clientY - rect.top - 8;
    const c = Math.floor(x / (cellSize + gap));
    const r = Math.floor(y / (cellSize + gap));
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    return { r, c };
  }

  function handlePointerDown(e, r, c) {
    const cell = board[r][c];
    if (!cell) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragging({
      r, c,
      offsetX: e.clientX - rect.left - cellSize / 2,
      offsetY: e.clientY - rect.top - cellSize / 2,
    });
    setPointer({ x: e.clientX, y: e.clientY });
  }

  React.useEffect(() => {
    if (!dragging) return;
    function onMove(e) {
      setPointer({ x: e.clientX, y: e.clientY });
      setHoverCell(getCellAt(e.clientX, e.clientY));
    }
    function onUp(e) {
      const target = getCellAt(e.clientX, e.clientY);
      if (target && (target.r !== dragging.r || target.c !== dragging.c)) {
        const src = board[dragging.r][dragging.c];
        const dst = board[target.r][target.c];
        const next = board.map(row => row.slice());
        if (dst && src && dst.chain === src.chain && dst.grade === src.grade && src.grade < 5) {
          // 머지!
          next[target.r][target.c] = { chain: src.chain, grade: src.grade + 1 };
          next[dragging.r][dragging.c] = null;
          setMergeFlash({ r: target.r, c: target.c, t: Date.now() });
          setTimeout(() => setMergeFlash(null), 600);
          const reward = window.ASSET_REGISTRY.chains[src.chain].stages[src.grade].reward;
          onReward && onReward({ chain: src.chain, grade: src.grade + 1, reward });
        } else if (!dst && src) {
          // 이동
          next[target.r][target.c] = src;
          next[dragging.r][dragging.c] = null;
        }
        setBoard(next);
      }
      setDragging(null);
      setHoverCell(null);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging, board]);

  const boardWidth = cols * cellSize + (cols - 1) * gap + 16;
  const boardHeight = rows * cellSize + (rows - 1) * gap + 16;

  return (
    <>
      <div ref={boardRef} style={{
        position: 'relative',
        width: boardWidth, height: boardHeight,
        background: 'linear-gradient(180deg, #F4E9D4 0%, #E8D9BE 100%)',
        border: '3px solid #6B3F2A', borderRadius: 14,
        padding: 8,
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15), 0 6px 14px rgba(0,0,0,0.2)',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridAutoRows: `${cellSize}px`,
        gap,
      }}>
        {board.map((row, r) => row.map((cell, c) => {
          const isSource = dragging && dragging.r === r && dragging.c === c;
          const isHover = hoverCell && hoverCell.r === r && hoverCell.c === c;
          const isFlash = mergeFlash && mergeFlash.r === r && mergeFlash.c === c;
          const canMerge = isHover && dragging && cell &&
            cell.chain === board[dragging.r][dragging.c]?.chain &&
            cell.grade === board[dragging.r][dragging.c]?.grade &&
            cell.grade < 5;
          return (
            <div key={`${r}-${c}`} style={{
              width: cellSize, height: cellSize,
              background: canMerge ? 'rgba(200,56,60,0.25)' : 'rgba(255,255,255,0.4)',
              border: canMerge ? '2px solid #C8383C' : '1.5px solid rgba(107,63,42,0.25)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isFlash ? '0 0 0 4px #F9D548, 0 0 20px 8px rgba(249,213,72,0.5)' : 'inset 0 1px 2px rgba(0,0,0,0.05)',
              transition: 'box-shadow 300ms, background 150ms',
            }}>
              {cell && !isSource && (
                <MergeItem chain={cell.chain} grade={cell.grade}
                  onPointerDown={e => handlePointerDown(e, r, c)} />
              )}
              {isFlash && (
                <div style={{ position: 'absolute', pointerEvents: 'none',
                  fontSize: 14, color: '#C8383C', fontWeight: 900,
                  animation: 'floatUp 600ms ease-out forwards' }}>
                  +MERGE!
                </div>
              )}
            </div>
          );
        }))}
      </div>

      {/* 드래그 중 포인터 따라다니는 아이템 */}
      {dragging && (
        <div style={{
          position: 'fixed', left: pointer.x - cellSize / 2, top: pointer.y - cellSize / 2,
          width: cellSize, height: cellSize, pointerEvents: 'none', zIndex: 1000,
        }}>
          <MergeItem chain={board[dragging.r][dragging.c].chain}
            grade={board[dragging.r][dragging.c].grade} dragging />
        </div>
      )}

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-24px); opacity: 0; }
        }
      `}</style>
    </>
  );
}

window.MergeBoard = MergeBoard;
