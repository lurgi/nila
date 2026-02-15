# Server Coding Quickstart

빠르게 팀 규칙을 적용하기 위한 요약입니다.

## 1) 계층 순서

`DB -> Schema -> Repository -> Service Test -> Service -> Controller -> Plugin`

## 2) 타입 SSoT

- HTTP 요청 타입의 SSoT는 `schemas/*.schema.ts`입니다.
- 스키마 파일에서 `Schema`와 `Static<typeof Schema>` 타입을 함께 export합니다.
- 단순 `request.dto.ts` 1:1 래핑은 만들지 않습니다.

## 3) 계층별 타입 규칙

- Controller: schema-exported request type 사용
- Service: HTTP 문맥 타입 금지, 도메인 규칙/오케스트레이션 담당
- Repository: Prisma 타입 직접 사용, DB CRUD만 수행

## 4) 검증 책임 분리

- 형식 검증(패턴/길이/nullable): schema
- 비즈니스 검증(권한/중복/상태 전이/경합 에러 매핑): service

## 5) 테스트 원칙

- Service 테스트는 Vitest TDD로 작성
- Red -> Green -> Refactor 순서 고정
- 서비스 파일 기준 `lines/statements/branches/functions` 100% 목표
- 경곗값/경합(`P2002`) 케이스 포함

## 6) 실행 체크

1. `yarn workspace @nila/server test <service-test-file>`
2. `yarn workspace @nila/server test:coverage <service-test-file>`
3. `yarn workspace @nila/server build`
