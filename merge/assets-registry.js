// ========================================================================
// ASSET REGISTRY — itch.io 에셋 교체 포인트
// ========================================================================
// 이 파일이 게임의 "에셋 매니페스트"입니다.
// itch.io에서 에셋을 다운받으면, 아래 경로만 바꾸면 바로 교체됩니다.
//
// 권장 itch.io 검색어:
//   • "coffee pixel art"        — 커피 아이콘/스프라이트
//   • "kawaii food sprites"     — 귀여운 음료/디저트
//   • "cozy cafe asset pack"    — 카페 배경/가구
//   • "potion merge"            — 머지 UI 레퍼런스
//   • "Kenney food"             — CC0 무료 음식 아이콘
// ========================================================================

window.ASSET_REGISTRY = {
  // 머지 체인 — 원두 → 분쇄 → 추출 → 음료 → 시그니처
  // 각 체인은 5단계. 같은 단계 2개가 만나면 다음 단계로.
  chains: {
    espresso: {
      name: '에스프레소 라인',
      element: 'fire',
      accent: '#C8383C',
      stages: [
        { grade: 1, name: '원두',     emoji: '🫘', sprite: null, reward: 2 },
        { grade: 2, name: '분쇄 원두', emoji: '☕', sprite: null, reward: 5 },
        { grade: 3, name: '에스프레소', emoji: '🥃', sprite: null, reward: 12 },
        { grade: 4, name: '아메리카노', emoji: '☕', sprite: null, reward: 28 },
        { grade: 5, name: '시그니처 블렌드', emoji: '🏆', sprite: null, reward: 70 },
      ],
    },
    latte: {
      name: '라떼 라인',
      element: 'earth',
      accent: '#A0754A',
      stages: [
        { grade: 1, name: '우유',       emoji: '🥛', sprite: null, reward: 2 },
        { grade: 2, name: '스팀 우유',   emoji: '🍼', sprite: null, reward: 5 },
        { grade: 3, name: '라떼',       emoji: '🧋', sprite: null, reward: 12 },
        { grade: 4, name: '카푸치노',   emoji: '☕', sprite: null, reward: 28 },
        { grade: 5, name: '시그니처 라떼', emoji: '🏆', sprite: null, reward: 70 },
      ],
    },
    tea: {
      name: '차 라인',
      element: 'wood',
      accent: '#2E5A1E',
      stages: [
        { grade: 1, name: '찻잎',       emoji: '🍃', sprite: null, reward: 2 },
        { grade: 2, name: '말린 찻잎',   emoji: '🌿', sprite: null, reward: 5 },
        { grade: 3, name: '녹차',       emoji: '🍵', sprite: null, reward: 12 },
        { grade: 4, name: '말차 라떼',   emoji: '🍵', sprite: null, reward: 28 },
        { grade: 5, name: '시그니처 말차', emoji: '🏆', sprite: null, reward: 70 },
      ],
    },
    soda: {
      name: '에이드 라인',
      element: 'water',
      accent: '#3F7CA8',
      stages: [
        { grade: 1, name: '레몬',       emoji: '🍋', sprite: null, reward: 2 },
        { grade: 2, name: '레몬즙',     emoji: '🧃', sprite: null, reward: 5 },
        { grade: 3, name: '레몬 에이드', emoji: '🥤', sprite: null, reward: 12 },
        { grade: 4, name: '스파클링',   emoji: '🍹', sprite: null, reward: 28 },
        { grade: 5, name: '시그니처 에이드', emoji: '🏆', sprite: null, reward: 70 },
      ],
    },
    dessert: {
      name: '디저트 라인',
      element: 'metal',
      accent: '#C89A3A',
      stages: [
        { grade: 1, name: '밀가루',     emoji: '🌾', sprite: null, reward: 3 },
        { grade: 2, name: '반죽',       emoji: '🥖', sprite: null, reward: 6 },
        { grade: 3, name: '쿠키',       emoji: '🍪', sprite: null, reward: 14 },
        { grade: 4, name: '케이크',     emoji: '🍰', sprite: null, reward: 32 },
        { grade: 5, name: '시그니처 디저트', emoji: '🎂', sprite: null, reward: 80 },
      ],
    },
  },

  // 손님 (12지신 기반)
  customers: {
    tiger:   { name: '호랑', element: 'fire',  emoji: '🐅', prefer: 'espresso' },
    ox:      { name: '소담', element: 'earth', emoji: '🐂', prefer: 'latte' },
    rabbit:  { name: '토리', element: 'wood',  emoji: '🐇', prefer: 'tea' },
    dragon:  { name: '용지', element: 'water', emoji: '🐉', prefer: 'soda' },
    rooster: { name: '달래', element: 'metal', emoji: '🐓', prefer: 'dessert' },
    cat:     { name: '나비', element: 'earth', emoji: '🐈', prefer: 'latte' },
    fox:     { name: '여우', element: 'fire',  emoji: '🦊', prefer: 'espresso' },
    panda:   { name: '반달', element: 'wood',  emoji: '🐼', prefer: 'tea' },
  },

  // 카페 배경 / 가구
  // itch.io: "cozy cafe interior" 검색
  cafe: {
    wall: null,      // assets/cafe/wall.png 자리
    floor: null,     // assets/cafe/floor.png
    counter: null,   // assets/cafe/counter.png
    window: null,    // assets/cafe/window.png
  },
};

// 에셋 상태 확인 (개발용)
window.ASSET_STATUS = function () {
  const r = window.ASSET_REGISTRY;
  let total = 0, filled = 0;
  Object.values(r.chains).forEach(c => c.stages.forEach(s => {
    total++; if (s.sprite) filled++;
  }));
  Object.values(r.cafe).forEach(v => { total++; if (v) filled++; });
  return { total, filled, pct: Math.round(filled / total * 100) };
};
