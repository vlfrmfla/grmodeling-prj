# 스마트 온실 모델링 이론과 개발 · 프로젝트 갤러리

강의 수강생들이 학기 동안 구현한 스마트 온실 / 농업 서비스 프로젝트를
카드 형태로 모아 공유하는 플랫폼.

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Auth / DB / Storage**: Supabase (이메일+비번 / Google OAuth)
- **Hosting**: Vercel
- **Forms**: react-hook-form + zod

## 1. Supabase 설정

1. <https://supabase.com> 에서 새 프로젝트 생성
2. **SQL Editor** → `supabase/schema.sql` 내용을 붙여넣고 실행
   - `profiles`, `submissions` 테이블 + RLS 정책 + Storage 버킷(`thumbnails`)이 한 번에 만들어집니다.
3. **Authentication → Providers**
   - Email: 기본 활성화. (사내 테스트라면 *Confirm email*을 끄면 편합니다.)
   - Google: Provider on → Google Cloud Console에서 OAuth Client 발급해서 Client ID/Secret 입력
4. **Authentication → URL Configuration**
   - Site URL: `http://localhost:3000` (배포 후 Vercel URL 추가)
   - Redirect URLs: `http://localhost:3000/auth/callback`, `https://<your-vercel>.vercel.app/auth/callback`

## 2. 환경 변수

`.env.local.example`을 복사:

```bash
cp .env.local.example .env.local
```

Supabase 프로젝트 → **Settings → API**에서 값을 채워 넣습니다.

| 변수 | 설명 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |

## 3. 로컬 실행

```bash
npm install
npm run dev
```

<http://localhost:3000> 접속.

## 4. 페이지 구조

| 경로 | 설명 |
|---|---|
| `/` | 카드 갤러리 (공개). 카드 클릭 → 학생 서비스 새 탭 |
| `/login` | 이메일/비번 + Google 로그인 |
| `/submissions/new` | 과제 등록 폼 (로그인 필요) |
| `/submissions/[id]` | 과제 상세, 본인은 수정/삭제 가능 |
| `/submissions/[id]/edit` | 본인 과제 수정 |
| `/my` | 내가 등록한 카드 목록 |

보호 라우트(`/submissions/new`, `/my`, `/submissions/*/edit`)는 `middleware.ts`에서
미로그인 시 `/login?redirect=…`로 자동 리다이렉트합니다.

## 5. Vercel 배포

1. GitHub에 푸시
2. Vercel에서 **New Project → Import** → 이 저장소 선택
3. **Environment Variables**에 위 두 값 추가
4. 배포 후 Vercel URL을 Supabase **Site URL / Redirect URLs**에도 추가

## 6. 데이터 모델 (요약)

```text
profiles(id, name, student_id, department, ...)   -- auth.users 1:1
submissions(id, user_id, title, service_url, description,
            category, tech_stack[], thumbnail_url, ...)
storage: thumbnails/<user_id>/<uuid>.<ext>        -- public 버킷
```

RLS:
- `select`: 누구나
- `insert/update/delete`: 본인만 (`auth.uid() = user_id`)
