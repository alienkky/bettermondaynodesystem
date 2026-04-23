// Prologue screen — sepia narration
function PrologueScreen({ onContinue }) {
  const [line, setLine] = React.useState(0);
  const lines = [
    '월요일 아침.',
    '출근길 사람들의 얼굴엔\n피로와 무기력이 가득했다.',
    "그때 한 사람이 생각했다.\n'커피 한 잔이 하루를 바꿀 수 있다면?'",
    '베러먼데이는 그렇게 시작되었다.\n단 하나의 매장에서.',
    '그리고 이제,\n그 이야기가 당신에게 이어집니다.',
  ];
  return (
    <div style={{ flex: 1, background: 'linear-gradient(180deg, #2C1F18 0%, #4A3426 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32, position: 'relative', overflow: 'hidden' }}>
      {/* paper grain vignette */}
      <div style={{ position: 'absolute', inset: 0, background:
        'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
      <div style={{ color: '#F0DFC4', textAlign: 'center', whiteSpace: 'pre-line',
        fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 19,
        letterSpacing: '-0.01em',
        lineHeight: 1.75, textShadow: '0 2px 4px rgba(0,0,0,0.4)', maxWidth: 300 }}>
        {lines[line]}
      </div>
      <button onClick={() => line < lines.length - 1 ? setLine(line + 1) : onContinue()}
        style={{ marginTop: 40, background: 'rgba(247,239,226,0.15)', color: '#F7EFE2',
          border: '1.5px solid rgba(247,239,226,0.4)', padding: '10px 22px',
          borderRadius: 999, fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-sans)',
          cursor: 'pointer' }}>
        {line < lines.length - 1 ? '다음 ›' : '시작하기'}
      </button>
      <button onClick={onContinue} style={{ position: 'absolute', bottom: 24, right: 20,
        background: 'transparent', border: 'none', color: 'rgba(240,223,196,0.6)',
        fontSize: 12, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>
        건너뛰기 ›
      </button>
      {/* progress dots */}
      <div style={{ position: 'absolute', top: 24, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 6 }}>
        {lines.map((_, i) => (
          <div key={i} style={{ width: i === line ? 18 : 6, height: 6, borderRadius: 3,
            background: i <= line ? '#F0DFC4' : 'rgba(240,223,196,0.25)',
            transition: 'width 240ms var(--ease-out)' }} />
        ))}
      </div>
    </div>
  );
}
window.PrologueScreen = PrologueScreen;
