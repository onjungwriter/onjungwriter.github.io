# 관리 화면 로그인 중계 서버

관리 화면(`/admin`)의 **Sign In with GitHub** 버튼이 쓰는 작은 서버입니다.
GitHub OAuth App 의 비밀키를 들고 있다가, 로그인 후 받은 코드를 토큰으로 바꿔 관리 화면에 넘겨줍니다.

- 실행 위치: 172.30.1.33 `/Users/jisu/data-ext/docker/onjung-cms-auth/`
- 공개 주소: https://jhong.n-e.kr/onjung-auth/ (nginx 의 `jhong.n-e.kr` 블록에서 연결)
- 컨테이너: `onjung-cms-auth` (node:20-alpine, `proxy-net` 에만 연결, 포트 공개 없음)

## GitHub OAuth App

onjungwriter 계정 → Settings → Developer settings → OAuth Apps → New OAuth App

| 항목 | 값 |
|---|---|
| Application name | 온정 사이트 관리 |
| Homepage URL | https://onjungwriter.github.io |
| Authorization callback URL | https://jhong.n-e.kr/onjung-auth/callback |

만든 뒤 Client ID 와 새로 발급한 Client secret 을 서버의 `.env` 에 넣습니다. (`.env.example` 참고, `.env` 는 저장소에 올리지 않음)

## 운영

```bash
cd /Users/jisu/data-ext/docker/onjung-cms-auth
docker compose up -d          # 시작 / .env 바꾼 뒤 다시 적용
docker compose logs -f        # 로그
curl -s https://jhong.n-e.kr/onjung-auth/health   # ok 면 정상
```
