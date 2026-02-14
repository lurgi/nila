# Nila Server

Fastify 백엔드 서버 (Prisma + Supabase)

## 아키텍처
- **Plugin-Based Layered Architecture**: 도메인별 플러그인 캡슐화
- **계층**: Controller → Service → Repository
- **ORM**: Prisma (Supabase PostgreSQL)

## 기본 규칙
- **Assertion 절대 금지**: `as` 키워드, `!` (non-null assertion) 사용 금지. 타입 가드나 proper null 체크 사용
- **Yarn Workspace 사용**: `yarn workspace @nila/server <command>` 형식으로 실행. npm/pnpm 사용 금지
- **주석 최소화**: 코드로 의도를 표현. 복잡한 비즈니스 로직이나 workaround가 아니면 주석 금지

## 상세 규칙
- **백엔드 개발 규칙**: `.claude/rules/backend-conventions.md` (필독!)
  - 계층별 책임 및 구현 순서 정의 (DB -> Schema -> Repository -> Service -> Controller)
- **타입 규칙**: `.claude/rules/type-conventions.md`
- **서비스 테스트 규칙**: `.claude/rules/service-test-conventions.md`
  - Service 계층은 Vitest 기반 TDD(테스트 선작성) + 블랙박스 + 경곗값 중심 + 최소 케이스 100% 커버리지
