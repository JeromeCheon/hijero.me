import type { ResumeData } from './types'

export const koResumeData: ResumeData = {
  education: {
    degree: '학사',
    school: '한동대학교 학사',
    major: 'AI · 컴퓨터공학',
    period: '2014.03 ~ 2022.02',
  },
  skillGroups: [
    { category: '언어', items: ['JavaScript', 'TypeScript', 'Go'] },
    {
      category: '프레임워크 & 라이브러리',
      items: ['NestJS', 'Express.js', 'TypeORM', 'Jest'],
    },
    {
      category: '데이터베이스 & 인프라',
      items: [
        'MQTT',
        'MySQL',
        'MongoDB',
        'InfluxDB',
        'AWS',
        'Apache Kafka',
        'Docker',
        'Kubernetes',
      ],
    },
  ],
  workExperiences: [
    {
      company: '(주)데이블',
      role: '매니저 · BE 팀',
      period: '2025.12 ~ 2026.04',
      highlights: [
        {
          text: '데이블 Marketing AI 에이전트 설계 및 개발',
          children: [
            {
              text: '광고주 대상 [FAQ Notion 문서](https://ad-support.dable.io/home/kr) 벡터 임베딩으로 RAG 파이프라인 구현 → NestJS + LangChain 에이전틱 서비스 토대 마련',
            },
            {
              text: '외부 Vector DB 대신 메모리 기반 Vector Store 채택으로 불필요한 예산 소모 방지',
            },
            {
              text: 'Gmail API 연계 메일 자동화 워크플로우(수집 → AI 생성 → 검수 → 발송) 구축 → 응대 소요 시간 95% 단축',
            },
            {
              text: 'AI 답변 검수용 [백오피스 대시보드](https://marketing.dable.io/login?next_url=%2F) 구성으로 문의 응대 창구 통합 및 로그 활성화',
            },
          ],
        },
      ],
    },
    {
      company: '메를로랩(주)',
      role: '주임연구원 · 서비스개발팀',
      period: '2022.01 ~ 2025.11',
      highlights: [
        {
          text: '메를로 에너지 모니터링 시스템 "MEMS" 개발 [25년]',
          children: [
            {
              text: 'InfluxDB 도입 및 자사 솔루션 통합으로 MySQL로는 표현이 어려웠던 2년 치 전력량 변화 데이터 수집 체계 마련',
            },
            {
              text: '실시간 AMI 소모전력량 원격 검침 및 그래프 시각화 대시보드 개발 → 외부 솔루션 의존도 및 영업 운영비 감축 기여',
            },
            {
              text: '연/월/일별 즉각 CSV 파일 변환 기능 구현으로 AWS S3 적재 방식 변화 및 서버 비용 절감 기여',
            },
            {
              text: '4,000만 건 데이터 기준 HTTP GET 응답 7.3s → 356ms, 집계 크론잡 연산 시간 15분 → 21초 단축',
            },
          ],
        },
        {
          text: 'GRID 3.0 반응형 웹 UI/UX 애플리케이션 개발 [24년]',
          children: [
            { text: '전체 소스코드 리팩터링 및 UI/UX 개편 주도 (75% 기여)' },
            { text: 'i18n 다국어 지원 기능 추가' },
          ],
        },
        {
          text: '메를로 "Smart Building Solution" 개발 [23년 ~ 24년]',
          children: [
            {
              text: '타사 Zigbee 통신 센서 연동 MQTT 스펙 설계 기여 및 병렬 처리 속도 200ms → 40ms 최적화',
            },
            {
              text: '"스케줄" 기능 → 센서 기반 스마트디밍, SMS 알림 등 세밀한 조건 설정 가능한 "자동화" 기능으로 확장 기여',
            },
            {
              text: 'S사, L사 에어컨 연동을 통한 IR 가전 기기 원격 제어 기능 개발',
            },
            {
              text: '날씨·전력량계 계측값에 따른 각종 기기 동시 제어 자동화로의 업그레이드로 다양한 고객사 현장 맞춤 지원',
            },
          ],
        },
        {
          text: 'Cloud 기반 B2B IoT 제어 시스템 [GRID](https://www.etnews.com/20231215000093) 최적화 및 고도화 [22년 ~ 25년]',
          children: [
            {
              text: '레거시 구조 개편 및 DB 재설계로 최대 1만 개 기기 수준 시스템을 10만 개, 100만 개 이상 처리 가능하도록 단계적 업그레이드',
            },
            {
              text: 'Go 기반 MQTT 메시지 다중 병렬 처리 앱 개발로 2,000개 기기 상태동기 시간 948ms → 387ms 단축',
            },
            {
              text: 'CRA 기반 GRID WEB → Vite 100% 마이그레이션 주도로 번들 로딩 성능 3배+ 개선',
            },
            { text: 'DDD · TDD 기반 팀 개발 및 유지보수 문화 정착 주도' },
            {
              text: 'GFDR 주파수 추종 조명 제어 시스템(한국전력거래소 주관) 개발 및 실증 시험 통과 ([관련 기사](https://n.news.naver.com/article/011/0004119451))',
            },
          ],
        },
        {
          text: '시스템 인프라 및 성능 최적화 [22년 ~ 25년]',
          children: [
            { text: 'AWS EKS · ECR 멀티클러스터 쿠버네티스 인프라 구축 참여' },
            {
              text: 'Git 모노레포 관리, 무중단 배포, CI/CD 연동 및 로깅 파이프라인 구현 기여',
            },
            { text: 'MQTT 메시지 암호화 및 인증 메커니즘 개발로 보안 강화' },
            {
              text: 'MySQL 단일 구조에서 MongoDB · Redis · InfluxDB 등 다양한 DBMS 통합 MSA 설계 기여',
            },
          ],
        },
      ],
    },
    {
      company: '(주)케이존',
      role: '프론트엔드 개발 인턴 · 개발팀',
      period: '2021.07 ~ 2021.12',
      highlights: [
        {
          text: '글로벌창업사관학교 2기 과정 참여',
          children: [{ text: 'Shopify 기반 "customfactoriz" 웹 개발 및 론칭' }],
        },
        { text: 'React 기반 케이존 홈페이지 웹 애플리케이션 개발' },
        { text: '케이존 홈페이지 WordPress 개발 및 migration 진행' },
      ],
    },
  ],
  projects: [
    {
      id: 'dable-marketing-ai-agent',
      name: '데이블 마케팅 AI Agent',
      company: '(주)데이블',
      period: '2026.01 ~ 2026.04',
      description:
        'LangChain · Gemini 기반 RAG AI Agent 구축. 일일 수신 메일 95% 자동 답변, 40건 처리 20초 이내 완료. 벡터 인덱싱 1분 이내 수행.',
      tech: ['NestJS', 'LangChain', 'Gemini', 'HNSWLib', 'Gmail API'],
    },
    {
      id: 'mems-dashboard',
      name: 'MEMS 대시보드',
      company: '메를로랩(주)',
      period: '2025.02 ~ 2025.11',
      description:
        'InfluxDB v2 시계열 DB 도입으로 HTTP 응답 7.3s → 356ms (20배 개선), 월 600만원 외부 솔루션 비용 절감. 4,000만 건 데이터 처리 OOMKilled → 21초 안정화.',
      tech: ['NestJS', 'InfluxDB', 'AWS S3', 'Next.js'],
    },
    {
      id: 'grid-1m-device-scaling',
      name: 'GRID 100만 기기 확장',
      company: '메를로랩(주)',
      period: '2023.02 ~ 2024.01',
      description:
        'Go 기반 MQTT 전담 서비스로 2,000개 조명 상태 업데이트 43,576ms → 181ms (240배). 단일 서버 한계 돌파 — 10만 → 100만+ 기기 안정적 처리.',
      tech: ['Go', 'MQTT', 'MySQL', 'MongoDB', 'Redis', 'Kubernetes'],
    },
    {
      id: 'smart-building-solution',
      name: 'Smart Building Solution',
      company: '메를로랩(주)',
      period: '2022.11 ~ 2024.10',
      description:
        'Zigbee 센서 5종 · IR 가전 GRiD 통합. 센서 페이로드 200ms → 40ms (5배), MQTT 수신 후 SMS 발송까지 28ms 이내 처리.',
      tech: ['NestJS', 'MQTT', 'MongoDB', 'Redis', 'TypeORM'],
    },
    {
      id: 'grid-performance-optimization',
      name: 'GRID 성능 최적화',
      company: '메를로랩(주)',
      period: '2022.01 ~ 2023.01',
      description:
        'Kafka 비동기 처리 · MSA(11개 서버, 12개 CronJob) 구축. 서버 재시작 없이 4.4MB 파일 다운로드 137ms 달성. 단일 서버 → 10만 기기 동시 처리 구조 확대.',
      tech: ['NestJS', 'Apache Kafka', 'MongoDB', 'AWS S3', 'MySQL'],
    },
  ],
}
