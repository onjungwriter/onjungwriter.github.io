// 데워지는 글: 제목, 문단, 목록 한 줄 단위로 화면에 들어오면 따뜻한 잉크색으로
const blocks = [...document.querySelectorAll('.hero h1, .hero p, section h2, section > p, .profile, .timeline > li, .links')];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

blocks.forEach(el => el.classList.add('blk'));

// 같은 목록 안에서는 한 줄씩 조금 늦게
document.querySelectorAll('.timeline').forEach(list =>
  [...list.children].forEach((li, i) => li.style.setProperty('--d', (i * 0.12) + 's')));

if (reduceMotion) {
  blocks.forEach(el => el.classList.add('on'));
} else {
  const warmIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('on'); warmIO.unobserve(e.target); }
    });
  }, { threshold: .6, rootMargin: '0px 0px -12% 0px' });
  blocks.forEach(el => warmIO.observe(el));
}

// 모바일(마우스 없음): 화면 위에서 35% 지점(시선이 머무는 곳)에 걸친 책 한 권만 표지를 원래 색으로
if (matchMedia('(hover: none)').matches) {
  const coverIO = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle('in-view', e.isIntersecting));
  }, { rootMargin: '-34% 0px -64% 0px' });
  document.querySelectorAll('.cover').forEach(c => coverIO.observe(c.parentElement));
}
