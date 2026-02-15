---
globs: ["apps/server/src/plugins/**/*.service.test.ts", "apps/server/src/plugins/**/*.service.ts"]
alwaysApply: false
---

# Service Test Conventions (Vitest + TDD)

Nila Server의 Service 계층 테스트는 반드시 **Vitest 기반 TDD**로 작성합니다.
이 문서는 Service 단위 테스트에만 적용됩니다.

## 1. 범위 (Scope)

- 대상: `src/plugins/*/*.service.ts`
- 테스트 파일: 같은 디렉토리의 `*.service.test.ts`
- 현재 단계에서는 Controller/Repository 통합 테스트를 작성하지 않습니다.

## 2. 절대 규칙 (Non-negotiable)

- **테스트가 구현보다 먼저** 작성되어야 합니다.
- 구현 파일 수정 전에 실패하는 테스트(Red)를 먼저 만듭니다.
- 테스트는 **블랙박스 방식**으로 작성합니다.
- 테스트는 내부 구현(내부 함수, private 분기, 호출 순서 세부사항)에 결합되면 안 됩니다.
- 최소 테스트 케이스로 **라인/분기 100% 커버리지**를 달성해야 합니다.
- 테스트 설계는 **경곗값 중심**으로 작성합니다.

## 3. TDD 사이클

모든 기능 변경은 아래 순서로 진행합니다.

1. Red: 신규/변경 요구사항을 실패 테스트로 먼저 작성
2. Green: 테스트를 통과하는 최소 구현 작성
3. Refactor: 테스트를 유지한 채 구현/중복 정리

한 PR 안에서 Red -> Green 흐름이 코드 히스토리에서 추적 가능해야 합니다.

## 4. 블랙박스 테스트 작성 규칙

- Service의 공개 메서드만 호출해서 검증합니다.
- 입력과 출력, 예외, 저장소 상태 변화(의존성 mock의 observable 결과)만 검증합니다.
- 내부 구현 세부사항을 고정시키는 단언은 금지합니다.
- 외부 의존성은 Factory 주입을 이용해 mock/stub으로 제어합니다.

## 5. 경곗값 우선 테스트 전략

각 Service 메서드마다 아래 케이스를 먼저 고려합니다.

- 성공 최소 입력 (필수 필드만)
- 성공 경계 입력 (nullable/optional, 빈 문자열, 최대 길이 직전 등)
- 실패 경계 입력 (필수 누락, 형식 오류, 만료 시점 직전/직후, 중복 직전/직후)
- 존재/비존재 경계 (`null`, 빈 결과, 첫 생성 vs 기존 데이터 존재)

## 6. 커버리지 원칙

- 목표: Service 테스트 기준 `lines/statements/branches/functions` 100%
- 같은 분기를 중복 검증하는 테스트는 제거하고, 분기를 추가로 여는 테스트만 유지합니다.
- 테스트 수를 늘리는 것보다 분기 밀도를 높여 최소 케이스로 완전 커버리지를 달성합니다.

## 7. Vitest 작성 패턴

- 테스트 그룹: `describe("createXService", ...)`, `describe("methodName", ...)`
- 케이스 명: 입력/상황/기대결과가 드러나는 문장형
- Mock 초기화: `beforeEach`에서 새 mock 생성
- 비동기 에러: `await expect(promise).rejects.toThrow(...)`

## 8. 금지 사항

- 구현 후 테스트를 덧붙이는 방식
- Repository/Prisma 실DB 호출이 포함된 Service 단위 테스트
- private 로직이나 내부 변수에 대한 직접 단언
- 의미 없는 snapshot 남발
- 커버리지 숫자만 맞추기 위한 중복 테스트

## 9. 타입/검증 위치 규칙

- HTTP 요청 타입의 SSoT는 `types/schemas/*.schema.ts`입니다.
- Service 테스트는 schema-exported request type 기준으로 시나리오를 구성합니다.
- 단순 `Static` 1:1 래핑 `request.dto.ts`에 의존한 테스트 작성은 금지합니다.
- 형식 검증(문자 패턴, 길이, nullable 등)은 schema에서 수행합니다.
- Service는 비즈니스 규칙(권한, 중복, 상태 전이, 경합/트랜잭션 에러 매핑)을 검증합니다.

