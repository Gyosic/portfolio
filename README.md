# 🚀 Portfolio - Next.js 15 기반 개인 포트폴리오 웹사이트

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-316192?style=for-the-badge&logo=postgresql)

**현대적이고 반응형인 개인 포트폴리오 웹사이트**  
Next.js 15, TypeScript, Tailwind CSS를 기반으로 구축된 풀스택 웹 애플리케이션

[🌐 라이브 데모](https://gyolab.com) • [📖 문서](#-사용법) • [🐛 이슈 리포트](https://github.com/Gyosic/portfolio/issues)

</div>

---

## ✨ 주요 기능

### 🌐 **다국어 지원**
- 한국어/영어 완전 지원
- i18next 기반 동적 언어 전환
- URL 기반 언어 라우팅 (`/ko`, `/en`)

### 🎨 **반응형 디자인**
- 모바일부터 데스크톱까지 모든 디바이스 지원
- Tailwind CSS 4 기반 유틸리티 우선 스타일링
- 다크/라이트 테마 자동 감지 및 수동 전환

### 🔐 **고급 인증 시스템**
- NextAuth.js v5 기반 JWT 인증
- HMAC 암호화를 통한 보안 강화
- 관리자 전용 대시보드 접근 제어

### 📊 **관리자 대시보드**
- 프로젝트, 교육, 경력, 성과 관리
- 실시간 CRUD 작업 지원
- 파일 업로드 및 관리 기능

### 🤖 **AI 기반 기능**
- OpenAI GPT를 활용한 개인화된 운세 서비스
- 생년월일 기반 맞춤형 운세 제공
- JSON 구조화된 응답 시스템

### 💬 **AI 포트폴리오 챗봇**
- **RAG(Retrieval-Augmented Generation) 기반** 포트폴리오 전문 AI 비서
- 포트폴리오 데이터(프로젝트, 경력, 학력, 기술 스택 등)를 벡터 임베딩하여 정확한 답변 제공
- **Vercel AI SDK** 기반 실시간 스트리밍 응답
- HuggingFace `all-MiniLM-L6-v2` 모델로 384차원 벡터 임베딩 생성
- PostgreSQL **pgvector** 확장을 활용한 벡터 유사도 검색
- 한국어/영어 다국어 대화 지원
- IP 기반 시간당 60회 요청 제한 (Rate Limiting)
- 질문 이력 자동 저장 및 관리자 대시보드에서 조회 가능
- 홈페이지 인라인 채팅 + 전역 플로팅 채팅 버튼 제공
- 모바일 전용 CTA 버튼 및 반응형 UI

### 📈 **방문자 분석**
- 실시간 방문자 추적
- IP, User-Agent, Referer 정보 수집
- 관리자 로그인 시 추적 제외

### 🎭 **고급 애니메이션**
- Framer Motion 기반 부드러운 전환 효과
- 페이지 로드 및 스크롤 애니메이션
- 인터랙티브 UI 컴포넌트

---

## 🛠️ 기술 스택

### **Frontend**
| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 15.4.6 | React 기반 풀스택 프레임워크 |
| **TypeScript** | 5.x | 타입 안전성 및 개발 경험 향상 |
| **Tailwind CSS** | 4.x | 유틸리티 우선 CSS 프레임워크 |
| **Framer Motion** | 12.23.12 | 고급 애니메이션 라이브러리 |
| **React Hook Form** | 7.62.0 | 성능 최적화된 폼 관리 |
| **Zod** | 3.25.76 | 런타임 스키마 검증 |

### **Backend & Database**
| 기술 | 버전 | 용도 |
|------|------|------|
| **PostgreSQL** | 17+ | 메인 관계형 데이터베이스 |
| **Drizzle ORM** | 0.44.4 | 타입 안전한 데이터베이스 ORM |
| **NextAuth.js** | 5.0.0-beta.29 | 인증 및 세션 관리 |
| **Resend** | 6.0.1 | 이메일 전송 서비스 |
| **OpenAI** | 5.12.2 | AI 기반 운세 서비스 |
| **Vercel AI SDK** | 6.0+ | AI 챗봇 스트리밍 응답 |
| **HuggingFace Inference** | Latest | 벡터 임베딩 생성 (RAG) |
| **pgvector** | Latest | PostgreSQL 벡터 유사도 검색 |

### **UI Components**
| 기술 | 버전 | 용도 |
|------|------|------|
| **Radix UI** | Latest | 접근성 높은 헤드리스 UI 컴포넌트 |
| **Shadcn/ui** | Latest | 재사용 가능한 컴포넌트 라이브러리 |
| **Lucide React** | 0.539.0 | 일관된 아이콘 시스템 |
| **Zustand** | Latest | 챗봇 상태 관리 |
| **React Markdown** | Latest | 챗봇 메시지 마크다운 렌더링 |

### **개발 도구**
| 기술 | 버전 | 용도 |
|------|------|------|
| **Biome** | 2.1.4 | 빠른 코드 포맷팅 및 린팅 |
| **Knip** | 5.62.0 | 사용하지 않는 코드 감지 |
| **i18next** | 15.6.1 | 국제화 및 다국어 지원 |

---

## 📁 프로젝트 구조

```
portfolio/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 [lng]/             # 다국어 라우팅 (ko, en)
│   │   ├── 📁 about/         # 소개 페이지
│   │   ├── 📁 admin/         # 관리자 대시보드
│   │   │   └── 📁 chat-log/  # 챗봇 질문 이력 관리
│   │   ├── 📁 contact/       # 연락처 페이지
│   │   ├── 📁 education/     # 교육 페이지
│   │   ├── 📁 history/       # 경력 페이지
│   │   ├── 📁 project/       # 프로젝트 페이지
│   │   └── 📁 skill/         # 기술 페이지
│   ├── 📁 api/               # API 라우트
│   │   ├── 📁 [...nextauth]/ # NextAuth.js 인증
│   │   ├── 📁 achievements/  # 성과 관리 API
│   │   ├── 📁 chat/          # AI 챗봇 API (스트리밍)
│   │   ├── 📁 chat-logs/     # 챗봇 질문 이력 API
│   │   ├── 📁 educations/    # 교육 관리 API
│   │   ├── 📁 embeddings/    # RAG 임베딩 생성 API
│   │   ├── 📁 files/         # 파일 업로드 API
│   │   ├── 📁 fortunes/      # AI 운세 API
│   │   ├── 📁 histories/     # 경력 관리 API
│   │   ├── 📁 projects/      # 프로젝트 관리 API
│   │   ├── 📁 send/          # 이메일 전송 API
│   │   └── 📁 visits/        # 방문자 추적 API
│   └── 📁 languages/         # i18n 번역 파일
├── 📁 components/            # 재사용 가능한 컴포넌트
│   ├── 📁 animation/         # 애니메이션 컴포넌트
│   ├── 📁 shared/            # 공통 컴포넌트
│   │   └── 📁 ChatBot/       # AI 챗봇 컴포넌트
│   └── 📁 ui/                # UI 컴포넌트 (Shadcn/ui)
├── 📁 hooks/                 # 커스텀 훅
│   └── use-chat-store.ts     # Zustand 챗봇 상태 관리
├── 📁 lib/                   # 유틸리티 및 설정
│   ├── 📁 auth/              # 인증 설정
│   ├── 📁 i18n/              # 국제화 설정
│   ├── 📁 rag/               # RAG 파이프라인
│   │   ├── chunker.ts        # 포트폴리오 데이터 청킹
│   │   ├── embedding.ts      # HuggingFace 임베딩 생성
│   │   ├── prompt.ts         # 시스템 프롬프트 빌더
│   │   └── retrieval.ts      # 벡터 유사도 검색
│   ├── 📁 schema/            # 데이터베이스 스키마
│   ├── auth.ts               # NextAuth 설정
│   ├── fortuneai.ts          # AI 운세 서비스
│   ├── pg.ts                 # 데이터베이스 연결
│   └── utils.ts              # 유틸리티 함수
├── 📁 public/                # 정적 파일
├── 📁 scripts/               # 빌드 및 배포 스크립트
└── 📁 styles/                # 전역 스타일
```

> 💡 **설계 원칙**: 기능별 모듈화, 타입 안전성, 확장성, 유지보수성

---

## 🚀 시작하기

### 📋 필수 요구사항

- **Node.js** 18.0.0 이상
- **PostgreSQL** 13.0 이상 (권장: 17+)
- **npm** 또는 **yarn** 패키지 매니저

### 🐘 PostgreSQL 설치 가이드

<details>
<summary><strong>Ubuntu/Debian</strong></summary>

```bash
# PostgreSQL 설치
sudo apt update
sudo apt install postgresql postgresql-contrib

# 서비스 시작 및 자동 시작 설정
sudo systemctl start postgresql
sudo systemctl enable postgresql

# postgres 사용자로 전환
sudo -i -u postgres

# 데이터베이스 생성
createdb portfolio

# 사용자 생성 및 권한 부여
psql
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO your_username;
\q

# postgres 사용자에서 나가기
exit
```
</details>

<details>
<summary><strong>macOS (Homebrew)</strong></summary>

```bash
# PostgreSQL 설치
brew install postgresql@17

# 서비스 시작
brew services start postgresql@17

# 데이터베이스 생성
createdb portfolio

# 사용자 생성 및 권한 부여
psql postgres
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO your_username;
\q
```
</details>

<details>
<summary><strong>Windows</strong></summary>

1. [PostgreSQL 공식 다운로드 페이지](https://www.postgresql.org/download/windows/)에서 설치 파일 다운로드
2. 설치 마법사를 따라 PostgreSQL 설치
3. pgAdmin 또는 psql을 사용하여 데이터베이스 및 사용자 생성
</details>

<details>
<summary><strong>Docker (권장)</strong></summary>

```bash
# PostgreSQL 컨테이너 실행
docker run --name postgres-portfolio \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=portfolio \
  -e POSTGRES_USER=your_username \
  -p 5432:5432 \
  -d postgres:17

# 컨테이너 상태 확인
docker ps

# 연결 테스트
docker exec -it postgres-portfolio psql -U your_username -d portfolio
```
</details>

### ⚙️ 설치 및 설정

1. **저장소 클론**
```bash
git clone https://github.com/Gyosic/portfolio.git
cd portfolio
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
cp env.example .env
```

`.env` 파일을 편집하여 필요한 환경 변수를 설정하세요:

```env
# 사이트 기본 설정
SITE_TITLE="Your Portfolio"
SITE_DESCRIPTION="Your portfolio description"
SITE_BASEURL="http://localhost:3000"
API_BASEURL="http://localhost:3000"

# 데이터베이스 연결
PG_BASEURL="postgresql://username:password@localhost:5432/portfolio"

# 인증 설정
AUTH_SECRET="your-auth-secret"
SYSADMIN_USERNAME="admin"
SYSADMIN_PASSWORD="your-encrypted-password"
SYSADMIN_SALT="your-salt"

# 외부 서비스
OPENAI_API_KEY="your-openai-api-key"
RESEND_API_KEY="your-resend-api-key"

# 개인 정보 (자세한 설정은 env.example 참조)
PERSONAL_NAME="Your Name"
PERSONAL_EMAIL="your-email@example.com"
# ... 기타 개인 정보
```

4. **데이터베이스 마이그레이션**
```bash
# Drizzle 스키마 생성 및 데이터베이스 마이그레이션
npm run drizzle:generate
```

5. **개발 서버 실행**
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

---

## 🔧 문제 해결

### PostgreSQL 연결 오류

다음과 같은 오류가 발생하는 경우:

```
error: 호스트 "127.0.0.1", 사용자 "{username}", 데이터베이스 "portfolio", SSL 암호화 연결에 대한 설정이 pg_hba.conf 파일에 없습니다.
```

<details>
<summary><strong>해결 방법: pg_hba.conf 파일 수정</strong></summary>

**Ubuntu/Debian:**
```bash
# pg_hba.conf 파일 위치 확인
sudo -u postgres psql -c "SHOW hba_file;"

# 파일 편집
sudo nano /etc/postgresql/*/main/pg_hba.conf

# 다음 라인을 추가하거나 수정
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5

# PostgreSQL 재시작
sudo systemctl restart postgresql
```

**macOS (Homebrew):**
```bash
# pg_hba.conf 파일 위치 확인
brew --prefix postgresql@17
# 일반적으로: /opt/homebrew/var/postgresql@17/

# 파일 편집
nano /opt/homebrew/var/postgresql@17/pg_hba.conf

# 다음 라인 추가
local   all             all                                     trust
host    all             all             127.0.0.1/32            md5

# PostgreSQL 재시작
brew services restart postgresql@17
```
</details>

<details>
<summary><strong>Docker 사용 시 해결 방법</strong></summary>

```bash
# 기존 컨테이너 제거
docker rm -f postgres-portfolio

# SSL 비활성화로 새로 실행
docker run --name postgres-portfolio \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=portfolio \
  -e POSTGRES_USER=your_username \
  -p 5432:5432 \
  -d postgres:17

# 연결 테스트
docker exec -it postgres-portfolio psql -U your_username -d portfolio
```
</details>

---

## 📚 사용법

### 🔐 관리자 로그인

1. **관리자 계정 생성**
```bash
# 비밀번호 생성
npm run genpass -- <your_password>

# AUTH_SECRET 생성
npm run genpass -- secret

# 결과값을 .env 파일에 추가
SYSADMIN_SALT='생성된_salt_값'
SYSADMIN_PASSWORD='생성된_비밀번호_값'
AUTH_SECRET='생성된_시크릿_값'
SYSADMIN_USERNAME='your_username'
```

2. **관리자 대시보드 접근**
   - `/admin` 경로로 이동
   - 생성한 계정 정보로 로그인

### 📊 콘텐츠 관리

관리자 대시보드에서 다음 항목들을 관리할 수 있습니다:

- **📁 프로젝트**: 포트폴리오에 표시할 프로젝트 정보
- **🎓 교육**: 학력 및 자격증 정보  
- **💼 경력**: 직장 경험 및 활동 내역
- **🏆 성과**: 수상 내역 및 인증서

### 🌐 다국어 설정

`lib/i18n/languages/` 디렉토리에서 번역 파일을 수정하여 다국어 콘텐츠를 관리할 수 있습니다.

### 💬 AI 포트폴리오 챗봇

포트폴리오 방문자가 AI 비서를 통해 포트폴리오 소유자에 대해 질문할 수 있는 대화형 챗봇입니다.

**작동 방식 (RAG 파이프라인):**
```
포트폴리오 데이터 (DB + 설정 + 문서)
→ Chunker (의미 단위 청크 분할)
→ HuggingFace 임베딩 (384차원 벡터 생성)
→ PostgreSQL pgvector (벡터 저장)
→ 사용자 질문 시: 질문 임베딩 → 벡터 유사도 검색
→ 상위 관련 청크를 시스템 프롬프트에 포함
→ OpenAI가 데이터 기반 답변 생성 (스트리밍)
```

**임베딩 대상 데이터:**
- 프로젝트 정보 (제목, 설명, 기술 스택, 역할)
- 경력 사항 (회사, 직책, 부서)
- 학력 정보 (학교, 학위, 전공)
- 성과/수상 내역
- 개인 정보 (이름, 직함, 위치, 연락처)
- 기술 스택 (언어, 프레임워크, 도구)
- `/documents` 디렉토리의 PDF/Markdown 문서

**관리자 기능:**
- 관리자 로그인 후 임베딩 생성/갱신 실행 가능
- `/admin/chat-log` 에서 질문 이력 조회 (페이지네이션, 정렬 지원)

**API 엔드포인트:**
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| `POST` | `/api/chat` | 챗봇 대화 (스트리밍 응답) |
| `GET` | `/api/chat-logs` | 질문 이력 조회 (관리자 전용) |
| `POST` | `/api/embeddings` | 임베딩 생성/갱신 (관리자 전용) |

### 🤖 AI 운세 서비스

- OpenAI API 키 설정 후 `/api/fortunes` 엔드포인트 사용
- 생년월일, 성별, 이름 기반 개인화된 운세 제공
- JSON 구조화된 응답 (summary, tell, wealth, studies, business, employment)

---

## 🏗️ 빌드 및 배포

### 📦 프로덕션 빌드

```bash
npm run build
```

빌드 스크립트는 다음 작업을 수행합니다:
1. 기존 dist 폴더 삭제
2. Next.js 앱 빌드
3. standalone 모드로 배포 파일 구성
4. 압축 파일 생성 (`portfolio.tar.xz`)

### 🐳 Docker 배포

```bash
# Docker 이미지 빌드
docker build -t portfolio .

# 컨테이너 실행
docker run -p 3000:3000 \
  -e PG_BASEURL="postgresql://user:pass@host:5432/db" \
  -e AUTH_SECRET="your-secret" \
  portfolio
```

---

## 📊 성능 최적화

### ⚡ Next.js 최적화
- **App Router**: 최신 라우팅 시스템 사용
- **Standalone Output**: 독립 실행 가능한 빌드
- **Turbopack**: 개발 시 빠른 번들링
- **Image Optimization**: 자동 이미지 최적화

### 🗄️ 데이터베이스 최적화
- **Drizzle ORM**: 타입 안전한 쿼리
- **Connection Pooling**: 효율적인 DB 연결 관리
- **Indexing**: 쿼리 성능 최적화

### 🎨 프론트엔드 최적화
- **Code Splitting**: 자동 코드 분할
- **Lazy Loading**: 지연 로딩
- **Framer Motion**: 하드웨어 가속 애니메이션
- **Tailwind CSS**: 최적화된 CSS 번들

---

## 🔒 보안 기능

### 🛡️ 인증 및 권한
- **JWT 기반 인증**: 안전한 세션 관리
- **HMAC 암호화**: 비밀번호 보안 강화
- **IP 추적**: 로그인 시도 모니터링
- **세션 만료**: 자동 세션 관리

### 🔐 API 보안
- **인증 미들웨어**: API 엔드포인트 보호
- **입력 검증**: Zod 스키마 기반 검증
- **SQL 인젝션 방지**: Drizzle ORM 사용
- **CORS 설정**: 도메인 기반 접근 제어

### 📊 데이터 보호
- **환경 변수**: 민감한 정보 보호
- **파일 업로드 제한**: 안전한 파일 처리
- **방문자 추적**: 개인정보 보호 고려

---

## 🧪 개발 도구

### 📝 코드 품질
```bash
# 코드 포맷팅 및 린팅
npm run lint

# 사용하지 않는 코드 감지
npx knip

# 타입 체크
npx tsc --noEmit
```

### 🔄 데이터베이스 관리
```bash
# 스키마 생성 및 마이그레이션 실행
npm run drizzle:generate
```

### 🔑 보안 도구
```bash
# 비밀번호 생성
npm run genpass -- <your_password>

# AUTH_SECRET 생성
npm run genpass -- secret
```

---

## 🤝 기여하기

### 📋 커밋 규칙

[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

| Type | 의미 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | `feat(auth): add OAuth login` |
| `fix` | 버그 수정 | `fix(ui): button color issue` |
| `docs` | 문서 수정 | `docs: update README` |
| `style` | 코드 포맷/스타일 변경 | `style: format code` |
| `refactor` | 코드 리팩토링 | `refactor: optimize database queries` |
| `perf` | 성능 개선 | `perf: optimize image loading` |
| `test` | 테스트 관련 | `test: add unit tests` |
| `chore` | 빌드/패키지 매니저 | `chore: update dependencies` |

### 🔄 기여 프로세스

1. **Fork the Project**
2. **Add Remote Upstream**
   ```bash
   git remote add upstream https://github.com/Gyosic/portfolio.git
   ```
3. **Create Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
4. **Commit Changes**
   ```bash
   git commit -m 'feat: add AmazingFeature'
   ```
5. **Push to Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
6. **Open Pull Request**

---

## 🔧 환경 변수

### 📋 필수 환경 변수

| 변수명 | 설명 | 기본값 | 예시 |
|--------|------|--------|------|
| `SITE_TITLE` | 사이트 제목 | Portfolio | "My Portfolio" |
| `SITE_DESCRIPTION` | 사이트 설명 | - | "Personal portfolio website" |
| `PG_BASEURL` | PostgreSQL 연결 문자열 | postgresql://localhost:5432/portfolio | postgresql://user:pass@host:5432/db |
| `AUTH_SECRET` | NextAuth 시크릿 키 | - | "your-secret-key" |
| `SYSADMIN_USERNAME` | 관리자 사용자명 | admin | "admin" |
| `SYSADMIN_PASSWORD` | 관리자 비밀번호 (암호화) | - | "encrypted-password" |
| `SYSADMIN_SALT` | 비밀번호 암호화 솔트 | - | "encryption-salt" |

### 🔑 선택적 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `OPENAI_API_KEY` | OpenAI API 키 | - |
| `OPENAI_MODEL` | 챗봇 사용 모델 | gpt-4.1-mini |
| `HF_API_KEY` | HuggingFace API 키 (RAG 임베딩) | - |
| `RESEND_API_KEY` | Resend 이메일 API 키 | - |
| `PERSONAL_NAME` | 개인 이름 | - |
| `PERSONAL_EMAIL` | 개인 이메일 | - |
| `PERSONAL_PHONE` | 개인 전화번호 | - |
| `TIMEZONE` | 시간대 설정 | ko-KR |

> 💡 **보안 주의사항**: `.env` 파일은 절대 버전 관리에 포함하지 마세요.

---

## 📞 지원 및 연락처

### 🐛 버그 리포트
프로젝트에 대한 버그나 문제가 있으시면 [Issues](https://github.com/Gyosic/portfolio/issues)를 생성해 주세요.

### 💡 기능 제안
새로운 기능이나 개선 사항이 있으시면 [Discussions](https://github.com/Gyosic/portfolio/discussions)에서 제안해 주세요.

### 📧 직접 연락
- **GitHub**: [@Gyosic](https://github.com/Gyosic)

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받아 만들어졌습니다:

- [Next.js](https://nextjs.org/) - React 기반 풀스택 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크
- [Drizzle ORM](https://orm.drizzle.team/) - 타입 안전한 ORM
- [Shadcn/ui](https://ui.shadcn.com/) - 재사용 가능한 컴포넌트
- [Framer Motion](https://www.framer.com/motion/) - 애니메이션 라이브러리

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!**

[![GitHub stars](https://img.shields.io/github/stars/Gyosic/portfolio?style=social)](https://github.com/Gyosic/portfolio/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Gyosic/portfolio?style=social)](https://github.com/Gyosic/portfolio/network/members)

Made with ❤️ by [Gyosic](https://github.com/Gyosic)

</div>