import type { ResumeData } from './types'

export const enResumeData: ResumeData = {
  education: {
    degree: 'Bachelor of Computer Science',
    school: 'Handong Global University',
    major: 'AI · Computer Science',
    period: 'March 2014 ~ February 2022',
  },
  skillGroups: [
    { category: 'Languages', items: ['JavaScript', 'TypeScript', 'Go'] },
    { category: 'Frameworks', items: ['NestJS', 'TypeORM', 'Jest'] },
    {
      category: 'Databases & Infra',
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
      company: 'Dable Inc.',
      role: 'Manager · Backend Team',
      period: 'Dec 2025 ~ Apr 2026',
      highlights: [
        {
          text: 'Dable Marketing AI Agent Design & Development',
          children: [
            {
              text: 'Built RAG pipeline via vector embedding of [advertiser FAQ docs](https://ad-support.dable.io/home/kr) — established NestJS + LangChain agentic service foundation for the team',
            },
            {
              text: 'Chose in-memory Vector Store over external Vector DB to eliminate unnecessary budget overhead',
            },
            {
              text: 'Built automated email workflow (collect → AI response → review → send) via Gmail API — reduced response time by 95%',
            },
            {
              text: 'Built [back-office dashboard](https://marketing.dable.io/login?next_url=%2F) for AI reply review, centralizing advertiser inquiry management with logging',
            },
          ],
        },
      ],
    },
    {
      company: 'MerlotLab Inc.',
      role: 'Senior Researcher · Service Dev Team',
      period: 'Jan 2022 ~ Nov 2025',
      highlights: [
        {
          text: '"MEMS" Energy Monitoring System Development [2025]',
          children: [
            {
              text: 'Introduced InfluxDB & integrated into in-house solution — established 2-year power consumption trend data pipeline previously unrepresentable in MySQL',
            },
            {
              text: 'Built real-time AMI power metering & graph visualization dashboard — reduced dependency on external solutions and cut operating costs',
            },
            {
              text: 'Implemented on-demand CSV export (yearly/monthly/daily) — changed AWS S3 ingestion method and cut server costs',
            },
            {
              text: '40M-record HTTP GET response: 7.3s → 356ms; aggregation cron job: 15min → 21sec',
            },
          ],
        },
        {
          text: 'GRID 3.0 Responsive Web UI/UX Application [2024]',
          children: [
            {
              text: 'Led full source code refactoring and UI/UX overhaul (75% contribution)',
            },
            { text: 'Added i18n multilingual support' },
          ],
        },
        {
          text: '"Smart Building Solution" Development [2023–2024]',
          children: [
            {
              text: 'Contributed to Zigbee sensor MQTT spec design and optimized parallel processing 200ms → 40ms',
            },
            {
              text: 'Expanded "schedule" feature to sensor-based smart dimming & SMS alert "automation" with fine-grained condition settings',
            },
            {
              text: 'Developed IR appliance remote control feature for Samsung & LG air conditioners',
            },
            {
              text: 'Upgraded to simultaneous multi-device automation triggered by weather and power meter data',
            },
          ],
        },
        {
          text: '[GRID](https://www.etnews.com/20231215000093) B2B IoT Control System Optimization [2022–2025]',
          children: [
            {
              text: 'Scaled system from 10K to 100K and 1M+ device capacity via legacy refactoring and DB redesign',
            },
            {
              text: 'Go-based MQTT parallel processing app: 2,000-device sync time 948ms → 387ms',
            },
            {
              text: 'Led CRA → Vite 100% migration of GRID WEB — bundle loading 3x+ faster',
            },
            {
              text: 'Established DDD/TDD-based team development and maintenance culture',
            },
            {
              text: 'Developed GFDR frequency-following lighting control system (KEPCO) and passed certification ([article](https://n.news.naver.com/article/011/0004119451))',
            },
          ],
        },
        {
          text: 'System Infrastructure & Performance Optimization [2022–2025]',
          children: [
            {
              text: 'Participated in AWS EKS/ECR multi-cluster Kubernetes infrastructure build-out',
            },
            {
              text: 'Contributed to mono-repo management, zero-downtime deployment, CI/CD, and logging pipelines',
            },
            {
              text: 'Developed MQTT message encryption and authentication mechanism for security hardening',
            },
            {
              text: 'Contributed to MSA design integrating MongoDB, Redis, InfluxDB alongside MySQL',
            },
          ],
        },
      ],
    },
    {
      company: 'Kzone',
      role: 'Frontend Dev Intern · Development Team',
      period: 'Jul 2021 ~ Dec 2021',
      highlights: [
        {
          text: 'Global Startup Academy 2nd Cohort',
          children: [
            {
              text: 'Developed and launched "customfactoriz" e-commerce site using Shopify',
            },
          ],
        },
        { text: 'Developed Kzone homepage as a React web application' },
        { text: 'WordPress development and homepage migration' },
      ],
    },
  ],
  projects: [
    {
      id: 'dable-marketing-ai-agent',
      name: 'Dable Marketing AI Agent',
      company: 'Dable Inc.',
      period: 'Jan 2026 ~ Apr 2026',
      description:
        'Built RAG-based AI Agent (LangChain, Gemini). 95% of daily emails auto-answered; 40 emails processed within 20 seconds. Vector indexing completed within 1 minute.',
      tech: ['NestJS', 'LangChain', 'Gemini', 'HNSWLib', 'Gmail API'],
    },
    {
      id: 'mems-dashboard',
      name: 'MEMS Dashboard',
      company: 'MerlotLab Inc.',
      period: 'Feb 2025 ~ Nov 2025',
      description:
        'Introduced InfluxDB v2: HTTP response 7.3s → 356ms (20× faster), saving ₩6M/month. Stabilized 40M-record processing from OOMKilled to 21 seconds.',
      tech: ['NestJS', 'InfluxDB', 'AWS S3', 'Next.js'],
    },
    {
      id: 'grid-1m-device-scaling',
      name: 'GRID 1M Device Scaling',
      company: 'MerlotLab Inc.',
      period: 'Feb 2023 ~ Jan 2024',
      description:
        'Go-based MQTT service: 2,000-device status update 43,576ms → 181ms (240× faster). Broke single-server bottleneck — scaled from 100K to 1M+ device support.',
      tech: ['Go', 'MQTT', 'MySQL', 'MongoDB', 'Redis', 'Kubernetes'],
    },
    {
      id: 'smart-building-solution',
      name: 'Smart Building Solution',
      company: 'MerlotLab Inc.',
      period: 'Nov 2022 ~ Oct 2024',
      description:
        'Integrated 5 Zigbee sensor types & IR appliances into GRiD. Sensor payload 200ms → 40ms (5×). MQTT-to-SMS dispatch within 28ms.',
      tech: ['NestJS', 'MQTT', 'MongoDB', 'Redis', 'TypeORM'],
    },
    {
      id: 'grid-performance-optimization',
      name: 'GRID Performance Optimization',
      company: 'MerlotLab Inc.',
      period: 'Jan 2022 ~ Jan 2023',
      description:
        'Kafka async processing & MSA (11 servers, 12 CronJobs). 4.4MB download in 137ms without server restarts. Scaled from single server to 100K+ concurrent device control.',
      tech: ['NestJS', 'Apache Kafka', 'MongoDB', 'AWS S3', 'MySQL'],
    },
  ],
}
