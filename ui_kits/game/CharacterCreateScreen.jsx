// Character Create screen — name + zodiac + element
function CharacterCreateScreen({ onDone }) {
  const [name, setName] = React.useState('김점주');
  const [zodiac, setZodiac] = React.useState('tiger');
  const [element, setElement] = React.useState('fire');
  const zodiacs = ['rat','ox','tiger','rabbit','dragon','snake','horse','sheep','monkey','rooster','dog','pig'];
  const elements = [
    { k: 'wood',  title: '성장형', desc: '사람을 키우는 점주', stat: '친화력 ★★★★' },
    { k: 'fire',  title: '열정형', desc: '최고의 음료를 빚는 점주', stat: '손재주 ★★★★' },
    { k: 'earth', title: '안정형', desc: '흔들리지 않는 점주', stat: '균형감 ★★★★' },
    { k: 'metal', title: '결실형', desc: '수익을 거두는 점주', stat: '장사수완 ★★★★' },
    { k: 'water', title: '지혜형', desc: '흐름을 읽는 점주', stat: '꾸준함 ★★★★' },
  ];
  const cur = elements.find(e => e.k === element);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
      background: 'var(--paper)', overflow: 'auto', padding: '20px 20px 32px' }}>
      <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
        점주를 만들어볼까요?
      </div>
      <div style={{ color: 'var(--fg-2)', fontSize: 13, marginTop: 4 }}>
        이 매장을 이끌어갈 사람이에요
      </div>

      {/* Name */}
      <div style={{ marginTop: 22, fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>이름</div>
      <input value={name} onChange={e => setName(e.target.value)} style={{
        marginTop: 8, width: '100%', padding: '12px 14px',
        border: '2px solid var(--border-card)', borderRadius: 12,
        background: 'var(--cream)', fontFamily: 'var(--font-sans)',
        fontSize: 15, fontWeight: 500, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }} />

      {/* Zodiac */}
      <div style={{ marginTop: 22, fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>12지신 얼굴</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginTop: 10 }}>
        {zodiacs.map(z => (
          <ZodiacAvatar key={z} zodiac={z} size={46} selected={z === zodiac} onClick={() => setZodiac(z)} />
        ))}
      </div>

      {/* Element */}
      <div style={{ marginTop: 22, fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>경영 스타일 (오행)</div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10, background: 'var(--bg-sunken)',
        borderRadius: 12, padding: 4 }}>
        {elements.map(e => (
          <button key={e.k} onClick={() => setElement(e.k)} style={{
            flex: 1, border: 'none', padding: '8px 0', borderRadius: 9, fontWeight: 800,
            fontSize: 14, fontFamily: 'var(--font-sans)', cursor: 'pointer',
            background: element === e.k ? 'var(--roast)' : 'transparent',
            color: element === e.k ? 'var(--cream)' : 'var(--fg-2)' }}>
            {EL[e.k].glyph}
          </button>
        ))}
      </div>
      <Card style={{ marginTop: 10, padding: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>{EL[element].glyph} {cur.title}</div>
        <div style={{ color: 'var(--fg-2)', fontSize: 13, marginTop: 2 }}>{cur.desc}</div>
        <div style={{ color: EL[element].fg, fontSize: 13, marginTop: 6, fontWeight: 700 }}>{cur.stat}</div>
      </Card>

      <div style={{ flex: 1 }} />
      <Button full size="lg" onClick={() => onDone({ name, zodiac, element })}>
        {name}님의 베러먼데이 시작하기
      </Button>
    </div>
  );
}
window.CharacterCreateScreen = CharacterCreateScreen;
