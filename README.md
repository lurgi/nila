# Nila

Nila 서비스를 소개하는 독립적인 Astro 정적 사이트입니다.
서비스 앱 코드는 별도 `oriol` 프로젝트에서 관리합니다.

## 개발 환경

- Node.js 24.22.1 (`.nvmrc`, `.node-version`)
- pnpm 9.15.4 (`packageManager`)

```sh
nvm install
nvm use
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install --frozen-lockfile
pnpm dev
```

개발 서버 기본 주소는 `http://localhost:4321`입니다.

| 명령 | 용도 |
| --- | --- |
| `pnpm dev` | 개발 서버 |
| `pnpm check` | Astro 및 TypeScript 진단 |
| `pnpm build` | 검사 후 정적 파일을 `dist/`에 생성 |
| `pnpm preview` | 빌드 결과 로컬 확인 |

## 구조

- `src/pages/index.astro`: 기본 페이지. 이후 랜딩페이지 구현의 시작점
- `src/layouts/BaseLayout.astro`: 한국어 문서 및 제목·설명 메타데이터
- `src/styles/global.css`: 최소 전역 스타일

정적 출력만 사용하며 React, SSR 어댑터, Pages Functions는 사용하지 않습니다.
실제 도메인이 정해지면 Astro `site`, canonical URL, 사이트맵을 설정합니다.

## Cloudflare Pages

이 프로젝트를 독립적인 Git 저장소에 올린 뒤 Cloudflare의 **Workers & Pages →
Create application → Pages**에서 Git 저장소를 연결합니다.

| 항목 | 값 |
| --- | --- |
| Framework preset | Astro |
| Root directory | 저장소 루트 (별도 지정하지 않음) |
| Production branch | 연결할 저장소의 기본 브랜치 |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Environment variable: `NODE_VERSION` | `24.22.1` |
| Environment variable: `PNPM_VERSION` | `9.15.4` |

Production과 Preview 환경에 동일한 버전을 설정합니다. 의존성 설치는 Pages의
자동 설치 단계를 사용합니다. 별도의 배포 명령, Wrangler 설정, API 토큰은 필요하지 않습니다.
Git 연동 후 운영 브랜치 푸시에는 운영 배포, 다른 브랜치와 PR에는 Pages 미리보기
배포를 사용할 수 있습니다. 이 초기 세팅에서는 원격 저장소나 Pages 프로젝트를 만들지 않습니다.

Node.js 24.22.1은 2026-10-21 보안 릴리스입니다. 이후 24.x 보안 패치가 나오면
버전 파일과 Pages의 `NODE_VERSION`을 함께 갱신하고 검사·빌드를 다시 실행합니다.
런타임 자체의 보안 공지는 `pnpm audit`와 별도로 확인해야 합니다.

- [Cloudflare Pages Astro 배포 가이드](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Cloudflare Pages 빌드 환경](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Node.js 24.22.1 보안 릴리스](https://nodejs.org/en/blog/release/v24.22.1)
