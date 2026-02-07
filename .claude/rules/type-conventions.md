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
├── dtos/                           # DTO 정의 (도메인별)
│   ├── user/
│   │   ├── request.dto.ts          # RequestDTO
│   │   └── response.dto.ts         # ResponseDTO
│   └── auth/
│       ├── request.dto.ts
│       └── response.dto.ts
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

## 2. RequestDTO

- **위치**: `src/dtos/{domain}/request.dto.ts`
- **파생 방식**: Typebox `Static<typeof Schema>`

```typescript
// src/dtos/user/request.dto.ts
import type { Static } from '@sinclair/typebox'
import type { UpdateUserSchema } from '../../types/schemas/user.schema.js'

export type UpdateUserRequest = Static<typeof UpdateUserSchema>
```

---

## 3. ResponseDTO

- **위치**: `src/dtos/{domain}/response.dto.ts`
- **파생 방식**: 서비스 반환 타입 기반 + Contract 필터링

```typescript
// src/dtos/user/response.dto.ts
import type { UserService } from '../../plugins/user/user.service.js'

type ServiceReturnType = Awaited<ReturnType<UserService['getUserById']>>

// 민감 필드 제외 (Contract 필터링)
export type UserResponse = Omit<NonNullable<ServiceReturnType>, 'providerId'>
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
[Request] → Controller(RequestDTO) → Service → Repository(Prisma) → DB
[Response] ← Controller(ResponseDTO) ← Service ← Repository(Prisma Model) ← DB
```

---

## Contract 필터링 예시

```typescript
// Controller에서 민감 필드 제거
const toUserResponse = (user: User): UserResponse => {
  const { providerId, ...rest } = user
  return rest
}
```
