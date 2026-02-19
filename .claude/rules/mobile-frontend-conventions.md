---
globs: ["apps/mobile/src/**/*.ts", "apps/mobile/src/**/*.tsx"]
alwaysApply: false
---

# Mobile Frontend Conventions

React Native(Expo) 모바일 앱 개발 규칙입니다.

## 1. 폴더 구조

모바일 앱 코드는 `apps/mobile/src` 기준으로 아래 구조를 사용합니다.

```txt
src/
  components/   # 재사용 UI (primitive + 조합)
  screens/      # 화면 단위 조립 계층
  navigation/   # 화면 흐름/라우팅 정의
  theme/        # 디자인 토큰
  hooks/        # use-* 훅 (화면 로직)
```

## 2. 구현 순서 (View First)

모든 기능은 아래 순서로 구현합니다.

1. `components`에 View를 먼저 구현
2. `hooks/use-*`에 화면 로직 구현
3. `screens`에서 hook 결과를 View에 주입

`View`와 `로직`을 한 파일에서 동시에 작성하지 않습니다.

## 3. 로직 배치 규칙

- `hooks/use-*`: 상태, 이벤트 핸들러, API 호출, 비즈니스 규칙
- `screens`: hook 호출 및 주입(조립)
- `components`: 순수 UI만 담당

`components`에서는 아래 항목을 금지합니다.

- 비즈니스 로직
- API 호출
- 데이터 패칭
- 도메인 검증
- 네비게이션 처리

## 4. Hook 사용 제한

- hook(`use-*`) 사용 가능 위치: `screens`, `hooks`
- hook 사용 금지 위치: `components`, `theme`, `navigation`(라우팅 선언 외 로직 금지)

## 5. 의존 방향

- `screens` -> `components`, `hooks`, `navigation`
- `components` -> `theme` (허용)
- `components` -> `screens` (금지)
- `hooks` -> `components` (금지)

순환 참조를 만들지 않습니다.

## 6. 테스트 규칙

테스트는 `hook 테스트`와 `component 테스트`를 작성합니다.

### 6-1. Hook 테스트

- 대상: `src/hooks/use-*.ts(x)`
- 원칙: Vitest 기반 TDD (Red -> Green -> Refactor)
- 방식: 블랙박스 테스트 (입력/출력/상태 변화 중심)

### 6-2. Component 테스트

- 대상: `src/components/**/*.tsx`
- 목적: UI 계약 검증 (렌더 결과, props 반영, 사용자 상호작용 결과)
- 원칙: 구현 세부사항이 아닌 사용자 관찰 가능 결과를 검증
- 권장: 접근성 쿼리(`role`, `label`, 텍스트) 우선 사용

Component 테스트에서 검증할 항목:

- 주어진 props가 올바르게 렌더링되는지
- 이벤트 콜백(`onPress` 등)이 호출되는지
- disabled/loading 등 상태별 UI가 올바르게 바뀌는지
- theme 토큰 적용에 따라 기대 스타일 계약이 유지되는지

Component 테스트 금지사항:

- 내부 구현 디테일(내부 state 변수명, 내부 함수 직접 호출) 검증
- 네트워크/API 호출 포함
- 비즈니스 로직 검증(해당 검증은 hook 테스트에서 수행)

## 7. 네이밍 규칙

- hook 파일: `use-<feature>.ts`
- screen 파일: `<feature>-screen.tsx`
- component 파일: `<feature>-view.tsx` 또는 역할 기반 이름
- import는 경로 별칭을 우선 사용해 깊은 상대경로를 피합니다.

## 8. Theme 규칙

`src/theme`는 디자인 토큰의 단일 출처(SSoT)입니다.

- color, spacing, radius, typography를 토큰으로 관리
- `components`는 토큰을 통해 스타일을 적용
- 매직 넘버/매직 컬러 하드코딩을 지양

## 9. Animation 규칙

애니메이션의 최종 책임(언제/어떤 모션을 적용할지 결정)은 `screens`가 가집니다.

### 9-1. 선언 위치

- `src/theme/motion.ts`: 전역 모션 토큰(duration, easing, spring preset)
- `src/animations/presets/*.ts`: 재사용 애니메이션 프리셋
- `src/hooks/use-*-motion.ts`: 화면별 애니메이션 상태/스타일 계산

### 9-2. 계층 책임

- `screens`: 모션 시나리오 결정 및 주입
- `hooks/use-*-motion`: 애니메이션 값/스타일 계산
- `components`: 주입받은 animated props를 렌더링에만 사용

### 9-3. 금지 사항

- `components`에서 화면 오케스트레이션 애니메이션 로직 작성 금지
- `components`에서 비즈니스 상태와 애니메이션 상태를 직접 결합 금지
- duration/easing/spring 값 하드코딩(토큰 사용)

### 9-4. 예외 허용

- `components` 내부의 단순 인터랙션 반응(press feedback, hover 유사 효과)은 허용
- 단, 도메인 로직/API/네비게이션과 결합하지 않습니다.

## 10. Navigation 규칙 (Expo Router)

- 라우트 옵션(`headerShown`, presentation 등)은 해당 그룹의 `app/**/_layout.tsx`에서 선언합니다.
- 전역 `app/_layout.tsx`는 Theme/Font/Splash 및 전역 Stack 설정만 담당합니다.
- 화면별 옵션 맵(`ROOT_STACK_OPTIONS` 같은 중앙 매핑)은 사용하지 않습니다.
- `src/navigation`은 경로 상수와 화면 흐름 정의까지만 담당합니다.
- 실제 화면 파일(`index.tsx`, `login.tsx` 등)은 `screens`를 렌더링하는 엔트리 역할만 가집니다.

## 11. Form 규칙 (RHF + TypeBox Contract)

Form은 `react-hook-form`을 표준으로 사용하며, 서버(Fastify)와 동일한 schema 계약을 공유합니다.

### 11-1. Contract SSoT

- Form contract의 단일 출처는 공유 schema 패키지입니다. (예: `packages/contracts`)
- 모바일과 서버는 같은 TypeBox schema를 import해 사용합니다.
- 모바일 전용으로 서버 요청 타입을 다시 정의하지 않습니다.

### 11-2. 타입 생성 규칙

- Form 값 타입은 schema 파일이 export한 타입 별칭을 우선 사용합니다.
- 예: `NicknameFormRequest` (schema 파일 내부에서 `Static<typeof ...>`로 생성된 타입)
- 모바일 코드에서 동일 타입을 다시 `Static<typeof ...>`로 재생성하지 않습니다.
- 수동 타입 선언(`type NicknameInput = {...}`)으로 중복 정의하지 않습니다.

### 11-3. RHF 사용 규칙

- 모든 Form은 `useForm<T>()`를 사용합니다.
- `T`는 schema-exported 타입만 허용합니다.
- 검증은 resolver 기반으로 통일하며, schema와 불일치하는 ad-hoc 검증 로직을 금지합니다.

### 11-4. 레이어 책임

- `components`: 입력 UI/에러 렌더링만 담당 (로직 금지)
- `hooks/use-*-form`: RHF 초기화, resolver, submit 핸들러, 서버 에러 매핑
- `screens`: form hook 주입 및 화면 조립

Form 로직은 `hooks`에만 둡니다.

### 11-5. 서버 에러 매핑

- 서버 필드 에러는 RHF `setError`로 매핑합니다.
- 매핑 규칙은 훅 내부 유틸 함수로 표준화합니다.
- 컴포넌트에서 서버 에러 코드를 직접 해석하지 않습니다.

### 11-6. 금지 사항

- schema와 별개로 모바일에서 request 타입 재정의
- component 내부에서 RHF 초기화/submit 처리
- screen 내부에서 비표준 form 검증 로직 작성
