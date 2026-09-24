# 온정 작가 소개 페이지

작가 온정의 소개 페이지입니다. https://onjungwriter.github.io

GitHub Pages(Jekyll)로 배포하고, 내용은 관리 화면에서 고칩니다. 나중에 블로그로 넓힐 예정입니다.

## 내용 고치기 (관리 화면)

https://onjungwriter.github.io/admin

1. **Sign In with GitHub**을 누르고, onjungwriter 계정으로 GitHub에 로그인합니다. 처음 한 번은 '온정 사이트 관리' 앱에 저장소 접근을 허락합니다.
2. (다른 방법) **Sign In Using Access Token**으로 GitHub 토큰을 붙여넣어도 됩니다.
3. 왼쪽 메뉴에서 고칠 곳을 고릅니다.
   - **소개 페이지:** 첫 화면, 소개, 연락, 검색·공유 설정
   - **저서:** 책 목록 (위에 있는 책이 먼저 보임)
   - **이력:** 수상과 선정, 강의와 활동 (연도별)
4. 고친 뒤 오른쪽 위 **Save**를 누르면 GitHub에 저장되고, 1~2분 뒤 사이트에 반영됩니다.

> **Sign In with GitHub** 버튼은 로그인 중계 서버(`infra/cms-auth/`)를 거칩니다. 172.30.1.33 의 nginx 뒤 `https://jhong.n-e.kr/onjung-auth/` 에서 돌고, 그 Mac이 꺼져 있으면 GitHub 로그인만 안 됩니다(사이트는 그대로 뜸). 이때는 토큰으로 로그인하면 됩니다. 운영 방법은 [infra/cms-auth/README.md](infra/cms-auth/README.md).

관리 화면은 [Sveltia CMS](https://github.com/sveltia/sveltia-cms)를 쓰고, 설정은 `admin/config.yml`에 있습니다.

## 구조

```
_data/                  페이지 내용 (관리 화면이 고치는 파일)
  hero.yml              첫 화면 카피, 보조 문구
  about.yml             프로필 사진, 이름, 한 줄 소개, 소개 글
  books.yml             저서
  awards.yml            수상과 선정
  activities.yml        강의와 활동
  contact.yml           이메일, 링크
  seo.yml               페이지 제목, 검색·공유용 설명, 공유 이미지, 검색엔진 소유 확인 코드
_layouts/default.html   공통 머리/꼬리 (meta 태그, 글꼴, 스크립트)
_includes/history.html  연도별 이력 목록
index.html              소개 페이지 틀 (내용은 _data/에서 읽음)
404.html                없는 주소로 들어왔을 때 보이는 페이지
admin/                  관리 화면 (Sveltia CMS)
assets/
  css/style.css         스타일
  js/main.js            '데워지는 글' 효과, 모바일 표지 효과
  images/               사진, 표지, 파비콘
_includes/structured-data.html  검색엔진용 작가·저서 정보 (JSON-LD)
robots.txt              검색엔진 수집 규칙 (관리 화면 제외)
_config.yml             사이트 이름, 주소, 사이트맵 플러그인, 배포 제외 목록
infra/cms-auth/         관리 화면 GitHub 로그인 중계 서버 (배포되지 않음)
design/                 디자인 시안 A, B, C, 공유 이미지 원본 (배포되지 않음)
```

## 로컬에서 미리 보기

GitHub Pages와 같은 버전의 Jekyll(`github-pages` gem)로 빌드합니다. Ruby 3.x가 필요합니다.

```bash
bundle install
bundle exec jekyll serve
```

http://localhost:4000 에서 확인합니다.

Ruby가 없으면 Docker로 빌드할 수 있습니다.

```bash
docker run --rm -v "$PWD":/srv/site -v onjung-bundle:/usr/local/bundle -w /srv/site ruby:3.3 \
  bash -c "bundle install --quiet && bundle exec jekyll build"
```

결과물은 `_site/`에 생깁니다.

## 배포

- GitHub 계정: `onjungwriter`
- 저장소: `onjungwriter/onjungwriter.github.io`
- `main` 브랜치에 올리면 GitHub Pages가 Jekyll로 빌드해 1~2분 뒤 반영됩니다.

이 폴더의 커밋 작성자는 `onjungwriter <onjung.writer@gmail.com>`로 설정되어 있습니다.
push는 SSH 별칭 `github.com-onjungwriter`(`~/.ssh/onjungwriter_ed25519` 키)로 합니다.

```bash
git push
```

### 개인 도메인을 쓸 때 (선택)

`CNAME` 파일에 도메인(예: `onjung.kr`)을 한 줄로 적어 올리고, 도메인 업체에서 DNS를 GitHub Pages로 연결합니다.
([GitHub 안내](https://docs.github.com/ko/pages/configuring-a-custom-domain-for-your-github-pages-site))

## 확인할 것

- [ ] 소개, 수상과 선정, 강의와 활동 내용 확인: 작가 블로그의 [이력 글](https://blog.naver.com/nayoon123_/223817509050)을 바탕으로 정리함
- [ ] 책 표지 사용: 표지 이미지의 권리는 출판사에 있으므로, 출판사(마누스, 월간토마토, 푸른길)에 사용을 확인하기

## 나중에 블로그로 넓힐 때

1. `_posts/2026-10-01-제목.md` 형식으로 글을 쓰고, 글 페이지 레이아웃(`_layouts/post.html`)을 만듭니다.
2. 글 목록 페이지(`writing/index.html`)를 만들고, 머리에 '글' 메뉴를 추가합니다.
3. `admin/config.yml`에 글 컬렉션(`folder: _posts`)을 추가하면 관리 화면에서 글을 쓰고 발행할 수 있습니다.
4. '데워지는 글' 효과는 `assets/js/main.js`를 글 페이지에도 불러오면 그대로 적용됩니다.
