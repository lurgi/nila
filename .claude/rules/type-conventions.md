---
globs: ["apps/server/src/**/*.ts"]
alwaysApply: false
---

# Type Conventions (타입 규칙)

## 폴더 구조

```
apps/server/src/
├── types/
│   └── schemas/                    # Typebox 스키마 정의
│       ├── user.schema.ts
│       ├── auth.schema.ts
│       └── common.schema.ts        # 공통 스키마 (페이지네이션 등)
│
└── plugins/                        # 도메인 플러그인
    └── {domain}/
        ├── {domain}.repository.ts  # Prisma 타입 직접 사용
        ├── {domain}.service.ts
        └── {domain}.controller.ts
```

---

## 1. Schema (Typebox)

- **위치**: `src/types/schemas/{domain}.schema.ts`
- **용도**: Fastify 라우트 검증 + 타입 정의
- **라이브러리**: `@sinclair/typebox`

```typescript
// src/types/schemas/user.schema.ts
import { Type } from '@sinclair/typebox'

export const UpdateUserSchema = Type.Object({
  name: Type.Optional(Type.String()),
  profileImage: Type.Optional(Type.String()),
})

export const UserIdParamSchema = Type.Object({
  id: Type.String(),
})
```

---

## 2. Request Type SSoT

- **원칙**: HTTP 요청 타입의 SSoT는 `src/types/schemas/{domain}.schema.ts`입니다.
- **권장 방식**: 스키마 파일에서 `Schema`와 `Static<typeof Schema>` 타입을 함께 export합니다.

```typescript
// src/types/schemas/user.schema.ts
import { Type, type Static } from '@sinclair/typebox'

export const UpdateUserBodySchema = Type.Object({
  name: Type.Optional(Type.String()),
})

export type UpdateUserRequest = Static<typeof UpdateUserBodySchema>
```

- `src/dtos/*/request.dto.ts`는 기본적으로 생성하지 않습니다.
- 예외: 스키마 기반 타입에 추가 메타 타입 결합이 필요한 경우만 제한적으로 허용합니다.
- 단순 `Static` 래핑(1:1 별칭) 목적의 DTO 파일 생성은 금지합니다.

---

## 3. ResponseDTO (작성 금지)

- **원칙**: `src/dtos/{domain}/response.dto.ts` 파일은 **생성하지 않습니다**.
- **이유**: TypeBox Schema가 검증과 타입 정의를 동시에 수행하므로, 별도의 DTO 파일은 코드 중복을 초래합니다.
- **대체 방법**:
  - 모든 응답 타입은 `src/types/schemas/{domain}.schema.ts`에 정의된 Schema로부터 `Static`을 사용하여 추출합니다.
  - 데이터 가공(필드 제외, 변환 등)이 필요한 경우, 스키마 레벨에서 정의하거나 Controller 내부에서 처리합니다.

```typescript
// src/types/schemas/user.schema.ts
export const UserResponseSchema = UserSchema // 또는 Type.Omit(UserSchema, [...])

// src/plugins/user/user.controller.ts
import type { Static } from '@sinclair/typebox'
import type { UserResponseSchema } from '@/types/schemas/user.schema.js'

type UserResponse = Static<typeof UserResponseSchema>
```

---

## 4. Repository

- **DTO 사용 금지**: Prisma 타입 직접 사용
- **이유**: Repository는 DB 계층, DTO는 API 계층

```typescript
// src/plugins/user/user.repository.ts
import type { PrismaClient, Prisma } from '../../generated/prisma/client.js'

export const createUserRepository = (prisma: PrismaClient) => ({
  create: (data: Prisma.UserCreateInput) => prisma.user.create({ data }),
  update: (id: string, data: Prisma.UserUpdateInput) =>
    prisma.user.update({ where: { id }, data }),
})
```

---

## 타입 흐름

```
[Request] → Controller(Schema-exported Request Type) → Service → Repository(Prisma) → DB
[Response] ← Controller(ResponseDTO) ← Service ← Repository(Prisma Model) ← DB
```

---

## 5. Service Input Type Rule

- Service 입력 타입은 두 가지로 구분합니다.
- HTTP에서 직접 유입되는 입력: `schema.ts`에서 export한 request type 사용
- Service 간 내부 계약 입력: 도메인 타입/Prisma 파생 타입 사용 가능
- 금지: Controller 전용 HTTP 문맥 타입(`FastifyRequest`, `FastifyReply`)을 Service 시그니처에 사용

---

## Contract 필터링 예시

```typescript
// Controller에서 민감 필드 제거
const toUserResponse = (user: User): UserResponse => {
  const { providerId, ...rest } = user
  return rest
}
```
