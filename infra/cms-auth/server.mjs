// 관리 화면(Sveltia CMS)의 GitHub 로그인 중계 서버
//
// 관리 화면은 공개된 정적 파일이라 GitHub OAuth App 의 비밀키를 넣을 수 없다.
// 이 서버가 비밀키를 들고 있다가, GitHub 가 돌려준 일회용 코드를 토큰으로 바꿔
// 관리 화면 창에 넘겨준다. 사이트 내용은 저장하지 않는다.
//
//   GET /auth      → GitHub 로그인 화면으로 보냄
//   GET /callback  → 코드를 토큰으로 바꿔 관리 화면에 전달
//   GET /health    → 상태 확인
//
// 외부 의존성 없이 Node 20 내장 기능만 쓴다.

import { createServer } from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';

const {
  GITHUB_CLIENT_ID = '',
  GITHUB_CLIENT_SECRET = '',
  // 로그인 결과(토큰)를 받을 수 있는 관리 화면 주소. 쉼표로 여러 개
  ALLOWED_ORIGINS = 'https://onjungwriter.github.io',
  // nginx 에서 이 서버로 넘겨주는 공개 주소 (GitHub OAuth App 의 callback URL 과 같아야 함)
  PUBLIC_URL = 'https://jhong.n-e.kr/onjung-auth',
  PORT = '8080',
} = process.env;

const allowedOrigins = ALLOWED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean);
const STATE_COOKIE = 'onjung_cms_state';

const html = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
  });
  res.end(body);
};

const readCookie = (req, name) =>
  (req.headers.cookie ?? '')
    .split(';')
    .map((c) => c.trim().split('='))
    .find(([k]) => k === name)?.[1] ?? '';

const sameString = (a, b) =>
  a.length > 0 && a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

// 관리 화면 창과 주고받는 방식은 Sveltia/Decap CMS 규약을 따른다.
// 1) 이 창이 'authorizing:github' 을 보냄  2) 관리 화면이 같은 말로 답함
// 3) 답한 곳이 허용된 주소일 때만 결과를 그 주소로 보냄
const resultPage = ({ token, error }) => {
  const status = token ? 'success' : 'error';
  const payload = token ? { provider: 'github', token } : { provider: 'github', error };
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>로그인 중</title></head>
<body><p>${token ? '로그인했어요. 이 창은 곧 닫혀요.' : '로그인하지 못했어요. 창을 닫고 다시 시도해 주세요.'}</p>
<script>
  const allowed = ${JSON.stringify(allowedOrigins)};
  const message = ${JSON.stringify(message)};
  window.addEventListener('message', (e) => {
    if (e.data !== 'authorizing:github' || !allowed.includes(e.origin)) return;
    window.opener && window.opener.postMessage(message, e.origin);
  });
  window.opener && window.opener.postMessage('authorizing:github', '*');
</script></body></html>`;
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET ? 'ok' : 'missing GitHub OAuth settings');
    return;
  }

  if (url.pathname === '/auth') {
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      html(res, 500, resultPage({ error: '로그인 서버에 GitHub 앱 정보가 설정되지 않았어요.' }));
      return;
    }
    const state = randomBytes(24).toString('hex');
    const authorize = new URL('https://github.com/login/oauth/authorize');
    authorize.searchParams.set('client_id', GITHUB_CLIENT_ID);
    authorize.searchParams.set('redirect_uri', `${PUBLIC_URL}/callback`);
    authorize.searchParams.set('scope', url.searchParams.get('scope') === 'public_repo' ? 'public_repo' : 'repo');
    authorize.searchParams.set('state', state);
    res.writeHead(302, {
      Location: authorize.toString(),
      'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/onjung-auth; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
      'Cache-Control': 'no-store',
    });
    res.end();
    return;
  }

  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code') ?? '';
    const state = url.searchParams.get('state') ?? '';
    const clearCookie = `${STATE_COOKIE}=; Path=/onjung-auth; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
    res.setHeader('Set-Cookie', clearCookie);

    if (!code || !sameString(state, readCookie(req, STATE_COOKIE))) {
      html(res, 400, resultPage({ error: '로그인 요청이 올바르지 않아요. 다시 시도해 주세요.' }));
      return;
    }

    try {
      const r = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${PUBLIC_URL}/callback`,
        }),
      });
      const data = await r.json();
      if (!data.access_token) throw new Error(data.error_description || data.error || 'no token');
      html(res, 200, resultPage({ token: data.access_token }));
    } catch (err) {
      console.error('token exchange failed:', err.message);
      html(res, 502, resultPage({ error: 'GitHub에서 로그인 정보를 받지 못했어요.' }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('not found');
});

server.listen(Number(PORT), () => {
  console.log(`cms-auth listening on ${PORT} (public: ${PUBLIC_URL}, allowed: ${allowedOrigins.join(', ')})`);
});
