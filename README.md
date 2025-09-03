# 🚀 Portfolio - Next.js 기반 개인 포트폴리오 웹사이트

현대적이고 반응형인 개인 포트폴리오 웹사이트입니다. Next.js 15, TypeScript, Tailwind CSS를 기반으로 구축되었으며, 다국어 지원과 관리자 기능을 포함하고 있습니다.

## ✨ 주요 기능

- 🌐 **다국어 지원**: 한국어/영어 지원
- 🎨 **반응형 디자인**: 모바일부터 데스크톱까지 모든 디바이스 지원
- 🌙 **다크/라이트 테마**: 시스템 테마 자동 감지 및 수동 전환
- 🔐 **인증 시스템**: NextAuth.js를 통한 관리자 로그인
- 📊 **관리자 대시보드**: 프로젝트, 교육, 경력, 성과 관리
- 📁 **파일 업로드**: 이미지 및 문서 업로드 지원
- 📧 **연락처 폼**: 이메일 전송 기능
- 🎭 **애니메이션**: Framer Motion을 활용한 부드러운 애니메이션

## 🛠️ 기술 스택

### Frontend
- **Next.js 15** - React 기반 풀스택 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS 4** - 유틸리티 우선 CSS 프레임워크
- **Framer Motion** - 애니메이션 라이브러리
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증

### Backend & Database
- **PostgreSQL** - 메인 데이터베이스
- **Drizzle ORM** - 타입 안전한 데이터베이스 ORM
- **NextAuth.js** - 인증 시스템
- **Resend** - 이메일 서비스

### UI Components
- **Radix UI** - 접근성 높은 UI 컴포넌트
- **Shadcn/ui** - 재사용 가능한 컴포넌트 라이브러리
- **Lucide React** - 아이콘 라이브러리

### 개발 도구
- **Biome** - 코드 포맷팅 및 린팅
- **Knip** - 사용하지 않는 코드 감지
- **i18next** - 국제화

## 📁 프로젝트 구조

```
portfolio/
├── app/            # Next.js App Router 기반 라우팅
│   ├── [lng]/      # 다국어 라우팅
│   ├── api/        # API 라우트
│   └── languages/  # i18n 번역 파일
├── components/     # 재사용 가능한 컴포넌트
├── lib/            # 유틸리티 및 설정 (auth, schema, i18n 등)
├── public/         # 정적 파일
└── styles/         # 전역 스타일
```
👉 기능별로 모듈화하여 유지보수성과 확장성을 고려했습니다.
👉 i18n, Auth, DB Schema 등은 lib/에서 중앙 관리하도록 구조화했습니다.

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+ 
- PostgreSQL 13+
- npm 또는 yarn

### PostgreSQL 설치 가이드

#### Ubuntu/Debian
```bash
# PostgreSQL 설치
sudo apt update
sudo apt install postgresql postgresql-contrib

# 서비스 시작
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

#### macOS (Homebrew)
```bash
# PostgreSQL 설치
brew install postgresql

# 서비스 시작
brew services start postgresql

# 데이터베이스 생성
createdb portfolio

# 사용자 생성 및 권한 부여
psql postgres
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO your_username;
\q
```

#### Windows
1. [PostgreSQL 공식 다운로드 페이지](https://www.postgresql.org/download/windows/)에서 설치 파일 다운로드
2. 설치 마법사 따라하기
3. pgAdmin 또는 psql을 사용하여 데이터베이스 및 사용자 생성

#### Docker (권장)
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
```

## 🔧 문제 해결

### PostgreSQL 연결 오류

다음과 같은 오류가 발생하는 경우:

```
error: 호스트 "127.0.0.1", 사용자 "{username}", 데이터베이스 "portfolio", SSL 암호화 연결에 대한 설정이 pg_hba.conf 파일에 없습니다.
```

#### 해결 방법: pg_hba.conf 파일 수정

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
brew --prefix postgresql
# 일반적으로: /opt/homebrew/var/postgresql@17/

# 파일 편집
nano /opt/homebrew/var/postgresql@17/pg_hba.conf

# 다음 라인 추가
local   all             all                                     trust
host    all             all             127.0.0.1/32            md5

# PostgreSQL 재시작
brew services restart postgresql@17
```

#### 해결 방법: Docker 사용 시

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

### 설치

1. 저장소 클론
```bash
git clone <repository-url>
cd portfolio
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp env.example .env
```

개발 ENV .env.development
운영 ENV .env.production
`.env` 파일을 편집하여 필요한 환경 변수를 설정하세요:

```env
# 데이터베이스
PG_BASEURL="postgresql://username:password@localhost:5432/portfolio"

# 인증
AUTH_SECRET="your-secret-key"

# 이메일
RESEND_API_KEY="your-resend-api-key"

# 개인 정보
PERSONAL_NAME="Your Name"
PERSONAL_EMAIL="your-email@example.com"
# ... 기타 설정
```

4. 데이터베이스 설정
```bash
# Drizzle 스키마 생성 & 데이터베이스 마이그레이션
npm run drizzle:generate
```

5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 라이브 데모

배포된 포트폴리오를 확인해보세요: [https://gyolab.com](https://gyolab.com)

## 📚 사용법

### 관리자 로그인

1. 관리자 계정 생성
   - 비밀번호 생성: `npm run genpass -- {password}`
   - AUTH_SECRET 생성: `npm run genpass -- secret`
   - ex) 
        ```
        npm run genpass -- admin
        npm run genpass -- secret

        # 아래 결과값 .env에 추가
        SYSADMIN_SALT='RwBVkOdQLjmvKv3RKLA4gFuEn6vqSv/L+Lj4YWUZ0sTcRQDqUHLKKRVvRTZItLcpeW6KJw8TBBaR0G7ct6+6ww=='
        SYSADMIN_PASSWORD='xtRmUu6S+nu6wg/6l42rjUgGIAaKXkL4YcSiccnqG5wlA5vG2vkyipTGEpaMeFkDMqtBFSI8UVizVtCIgxCssw=='
        AUTH_SECRET='AwukqP5mU8YbLFa+NMbUQQRtKRHHfnYzoQVnqObcubnjYfympeOI5mZ8vAYTiWhz27yvDhfwUSMUrZh4KCJdLA=='

        # 원하는 로그인 ID .env에 추가
        SYSADMIN_USERNAME={username}
        ```
2. `/admin` 경로로 이동
3. 기본 계정 정보:
   - 사용자명: {username} (지정해주지 않았을 시 admin)
   - 비밀번호: {password} (지정해주지 않았을 시 admin)

### 콘텐츠 관리

관리자 대시보드에서 다음 항목들을 관리할 수 있습니다:

- **프로젝트**: 포트폴리오에 표시할 프로젝트 정보
- **교육**: 학력 및 자격증 정보
- **경력**: 직장 경험 및 활동 내역
- **성과**: 수상 내역 및 인증서

### 다국어 설정

`lib/i18n/languages/` 디렉토리에서 번역 파일을 수정하여 다국어 콘텐츠를 관리할 수 있습니다.

## 🏗️ 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

### Docker 배포

```bash
# Docker 이미지 빌드
docker build -t portfolio .

# 컨테이너 실행
docker run -p 3000:3000 portfolio
```

### 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - 코드 린팅

## 🤝 기여하기

1. Fork the Project
2. Add Remote Upstream (`git remote add upstream https://github.com/Gyosic/portfolio.git`)
3. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
4. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 🔧 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `SITE_TITLE` | 사이트 제목 | Portfolio |
| `SITE_DESCRIPTION` | 사이트 설명 | - |
| `PG_BASEURL` | PostgreSQL 연결 문자열 | postgresql://localhost:5432/portfolio |
| `AUTH_SECRET` | NextAuth 시크릿 키 | - |
| `RESEND_API_KEY` | Resend API 키 | - |
| `PERSONAL_NAME` | 개인 이름 | - |
| `PERSONAL_EMAIL` | 개인 이메일 | - |

## 📞 연락처

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요! 