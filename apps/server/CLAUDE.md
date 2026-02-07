# Nila Server

Fastify 백엔드 서버 (Prisma + Supabase)

## 아키텍처
- **Plugin-Based Layered Architecture**: 도메인별 플러그인 캡슐화
- **계층**: Controller → Service → Repository
- **ORM**: Prisma (Supabase PostgreSQL)

## 상세 규칙
- 타입 규칙: `.claude/rules/type-conventions.md`
