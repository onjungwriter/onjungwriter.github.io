# 온정 작가 소개 페이지

작가 온정의 소개 페이지입니다. GitHub Pages로 배포하고, 나중에 블로그로 넓힐 예정입니다.

## 구조

```
index.html              소개 페이지
404.html                없는 주소로 들어왔을 때 보이는 페이지
assets/
  css/style.css         스타일 (색, 서체, 레이아웃)
  js/main.js            '데워지는 글' 효과, 모바일 표지 효과
  images/
    favicon.svg
    covers/             책 표지
_config.yml             GitHub Pages 설정 (design/ 등 배포 제외 목록)
design/                 디자인 시안 A, B, C (배포되지 않음)
```

빌드 과정이 없습니다. 파일을 고치고 올리면 그대로 반영됩니다.

## 로컬에서 미리 보기

```bash
python3 -m http.server 4174
```

브라우저에서 http://localhost:4174 을 엽니다.

## 배포하기 (GitHub Pages)

- GitHub 계정: `onjungwriter`
- 저장소: `onjungwriter/onjungwriter.github.io` (아직 만들기 전)
- 배포 주소: https://onjungwriter.github.io

이 폴더는 이미 git 저장소로 준비되어 있습니다. 이 폴더의 커밋 작성자는 `onjungwriter <onjung.writer@gmail.com>`로 설정되어 있고, 원격 주소(`origin`)도 등록되어 있습니다.

1. `onjungwriter` 계정으로 로그인한 뒤 GitHub에서 **`onjungwriter.github.io`** 이름으로 **Public** 저장소를 만듭니다.
   README, .gitignore, 라이선스는 추가하지 않고 빈 저장소로 만듭니다.
2. 이 폴더에서 올립니다.

   ```bash
   git push -u origin main
   ```

   원격 주소는 SSH 별칭 `github.com-onjungwriter`를 씁니다. `~/.ssh/config`에서 이 별칭이
   `~/.ssh/onjungwriter_ed25519` 키를 쓰도록 설정되어 있어, 이 컴퓨터의 다른 GitHub 계정과 섞이지 않습니다.
   이 키의 공개키(`~/.ssh/onjungwriter_ed25519.pub`)는 onjungwriter 계정의 Settings → SSH and GPG keys에 등록되어 있어야 합니다.
3. 저장소의 **Settings → Pages**에서 Source를 **Deploy from a branch**, Branch를 **main / (root)** 로 지정합니다.
   (`<계정>.github.io` 저장소는 보통 자동으로 켜져 있습니다.)
4. 1~2분 뒤 https://onjungwriter.github.io 에서 확인합니다.

### 개인 도메인을 쓸 때 (선택)

`CNAME` 파일에 도메인(예: `onjung.kr`)을 한 줄로 적어 올리고, 도메인 업체에서 DNS를 GitHub Pages로 연결합니다.
([GitHub 안내](https://docs.github.com/ko/pages/configuring-a-custom-domain-for-your-github-pages-site))

## 배포 전에 확인할 것

- [ ] 소개, 수상과 선정, 강의와 활동 내용 확인: 작가 블로그의 [이력 글](https://blog.naver.com/nayoon123_/223817509050)을 바탕으로 정리함
- [ ] 책 표지 사용: 표지 이미지의 권리는 출판사에 있으므로, 출판사(마누스, 월간토마토, 푸른길)에 사용을 확인하기

## 책이나 수상 이력을 더할 때

`index.html`의 `저서` 목록 맨 위에 `<li>` 한 줄을 복사해 추가합니다.
수상과 선정, 강의와 활동은 연도별 `<li>` 안의 `<ul>`에 한 줄씩 더합니다. 새 연도는 목록 맨 위에 추가합니다.
표지는 `assets/images/covers/book-연도-이름.jpg` 형식으로 넣습니다.

## 나중에 블로그로 넓힐 때

GitHub Pages는 Jekyll을 기본으로 지원합니다. 다음 순서로 넓히면 지금 구조를 그대로 쓸 수 있습니다.

1. `_layouts/`에 공통 머리/꼬리를 가진 레이아웃을 만들고 `index.html`에서 분리
2. `_posts/2026-10-01-제목.md` 형식으로 글 작성
3. 글 목록 페이지(`writing/index.html`)와 머리에 '글' 메뉴 추가
4. '데워지는 글' 효과는 `assets/js/main.js`를 글 페이지에도 불러오면 그대로 적용됩니다
