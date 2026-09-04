// ─── Metrics ─────────────────────────────────────────────────────────────────

export const METRICS = [
  { label: "yrs production experience", value: 4, prefix: "", suffix: "" },
  { label: "requests, zero failures @ 600 RPM", value: 4061, prefix: "", suffix: "" },
  { label: "locales shipped", value: 11, prefix: "", suffix: "" },
] as const;

// ─── Skills (Aligned 100% with Resume & Genuine Work) ────────────────────────

export const SKILLS: Record<string, string[]> = {
  "Languages": [
    "C#",
    "TypeScript",
    "JavaScript",
    "SQL (T-SQL)",
    "Python (learning)",
  ],
  "Backend": [
    "ASP.NET Core",
    ".NET Framework",
    "Web API",
    "WCF",
    "Entity Framework Core",
    "ADO.NET",
    "GraphQL",
    "Node.js",
    "Hono",
  ],
  "Frontend": [
    "React 19",
    "Vite",
    "Micro-Frontends",
    "Next.js",
    "Design Systems",
    "i18n",
    "Figma-to-Production",
  ],
  "Architecture": [
    "Microservices",
    "Clean Architecture",
    "CQRS / MediatR",
    "REST API Design",
    "BFF & Strangler Fig Patterns",
    "Multi-Tenant Data Isolation",
  ],
  "Testing": [
    "xUnit",
    "Moq",
    "Vitest",
    "React Testing Library",
    "Contract Testing (Pact)",
    "Load Testing (JMeter)",
    "ReadyAPI",
    "Regression Testing",
  ],
  "Security": [
    "OAuth 2.0 / OIDC + PKCE",
    "JWT",
    "XSS Remediation",
    "OWASP",
    "Penetration Test Response",
  ],
  "Databases": [
    "SQL Server",
    "Stored Procedures",
    "Query Optimization",
    "Sharded / Multi-Tenant Contexts",
    "PostgreSQL",
    "Redis",
    "pgvector",
    "SQLite",
    "Convex",
  ],
  "Cloud & Tooling": [
    "Microsoft Azure",
    "Azure DevOps",
    "Git",
    "Visual Studio",
    "OpenAPI/NSwag",
    "Splunk",
    "Docker Compose",
    "pnpm",
  ],
  "Mobile": [
    "Xamarin.Forms",
    ".NET MAUI",
    "MVVM",
    "Firebase",
  ],
  "Practices": [
    "Agile/Scrum",
    "Feature Flags",
    "Load & Performance Analysis",
    "Production Debugging",
    "AI-assisted Development (Cursor, Augment)",
  ],
};

// ─── Experience ──────────────────────────────────────────────────────────────

export interface ExperienceEntry {
  title: string;
  company: string;
  client: string;
  dates: string;
  location: string;
  lines: string[];
}

export const EXPERIENCE_DATA: ExperienceEntry[] = [
  {
    title: "Senior Software Engineer",
    company: "Altimetrik India (Contractor — WEX Health)",
    client: "Modern Benefits Platform | Claims Web API & Consumer Claims Micro-Frontend | FSA/HSA/HRA Consumer-Directed Accounts",
    dates: "Apr 2025 – Present",
    location: "Bengaluru, India",
    lines: [
      "Designed and shipped a participant-facing claim filing-eligibility API to production spanning controller, CQRS query handler, orchestration service, side-effect-free rules engine, and stored-procedure settings repository with OpenAPI client.",
      "Implemented five-level configuration resolution with per-setting merge semantics falling back from specific scope to global defaults; scoped 4 of 7 checks out to preserve bounded contexts.",
      "Diagnosed EF Core DbContext thread-safety failures under parallel execution; fixed 6 behavioral divergences from legacy pre-PR and locked in with regression tests.",
      "Strengthened multi-tenant query scoping, tenant-isolation boundaries, and hardened database shard resolution across receipt-download and claim-filing paths.",
      "Authored JMeter load tests at 75 concurrent users and 600 RPM: measured p95 of 3.3s and p99 of 4.2s across 4,061 samples at 0% errors against a 2s QA SLA.",
      "Delivered Consumer Claims transfer-method MFE (React 19, TypeScript, Vite) replacing wizard step with review dialog across 11 locales with Vitest & RTL test suite.",
      "Remediated critical XSS vulnerability across 4 legacy WCF services with custom JSON serialization HTML escaping and feature flag rollout.",
      "Delivered HSA investment onboarding custom text end to end across legacy .NET Framework strangler service and .NET Core BFF fronting it; validated in ReadyAPI.",
    ],
  },
  {
    title: "Project Engineer",
    company: "Wipro Ltd (Client: FedEx Australia)",
    client: "Cross-Platform Mobile Engineer | Courier Express Platform",
    dates: "Jul 2022 – Apr 2025",
    location: "Bengaluru, India",
    lines: [
      "Developed and maintained cross-platform mobile features for courier and express logistics application using C#, .NET, Xamarin.Forms, and .NET MAUI with MVVM architecture and SQLite local persistence.",
      "Integrated RESTful APIs over HTTPS and analysed request/response contracts and application flows across the codebase to support feature delivery and defect investigation.",
      "Wrote and optimized SQL queries for data retrieval and reporting, reducing redundant database calls and improving application responsiveness.",
      "Performed unit testing and debugging across multiple app modules in an Agile/Scrum environment, resolving defects ahead of release.",
      "Recognized with the Panache Best Newcomer Award for independently resolving complex design-flow issues within two months of joining.",
    ],
  },
];

// ─── Education & Certifications ──────────────────────────────────────────────

export interface EducationEntry {
  icon: string;
  title: string;
  institution: string;
  year: string;
  type: "degree" | "cert" | "award";
}

export const EDUCATION_DATA: EducationEntry[] = [
  {
    icon: "🎓",
    title: "B.Tech — Electronics and Communication Engineering",
    institution: "PES University",
    year: "2019 – 2022",
    type: "degree",
  },
  {
    icon: "🏅",
    title: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    institution: "Microsoft",
    year: "",
    type: "cert",
  },
  {
    icon: "🏆",
    title: "Panache Best Newcomer Award",
    institution: "Wipro",
    year: "2022",
    type: "award",
  },
  {
    icon: "🎖️",
    title: "Scouts & Guides Rashtrapati (President's) & Rajyapuraskar (Governor's) Awards",
    institution: "The Bharat Scouts and Guides",
    year: "",
    type: "award",
  },
];

// ─── Contact ─────────────────────────────────────────────────────────────────

export const CONTACT = {
  email: "arunkulkarni2000@gmail.com",
  phone: "+91 8152807847",
  location: "Bengaluru, Karnataka, India",
  github: "arunkumar-dot",
  linkedin: "arun-kulkarni226",
};

// ─── Locale Labels (illustrative) ────────────────────────────────────────────

export const LOCALE_LABELS: Record<string, { submit: string; amount: string; status: string }> = {
  "en-US": { submit: "Submit Claim", amount: "Amount", status: "Status" },
  "en-GB": { submit: "Submit Claim", amount: "Amount", status: "Status" },
  "es-ES": { submit: "Enviar Reclamación", amount: "Importe", status: "Estado" },
  "fr-FR": { submit: "Soumettre la Demande", amount: "Montant", status: "Statut" },
  "de-DE": { submit: "Antrag Einreichen", amount: "Betrag", status: "Status" },
  "pt-BR": { submit: "Enviar Solicitação", amount: "Valor", status: "Status" },
  "ja-JP": { submit: "申請を提出", amount: "金額", status: "ステータス" },
  "zh-CN": { submit: "提交申请", amount: "金额", status: "状态" },
  "ko-KR": { submit: "청구 제출", amount: "금액", status: "상태" },
  "nl-NL": { submit: "Claim Indienen", amount: "Bedrag", status: "Status" },
  "sv-SE": { submit: "Skicka Anspråk", amount: "Belopp", status: "Status" },
};

// ─── Diff Data (Honest WCF .NET Framework Implementation) ────────────────────

export const SECURITY_DIFF = {
  before: [
    "// ❌ Legacy WCF Service – raw unescaped JSON response serializer",
    "[WebGet(ResponseFormat = WebMessageFormat.Json)]",
    "public Stream GetParticipantClaim(string claimId) {",
    "  var claim = _claimsRepo.Fetch(claimId);",
    "  // Unencoded user-controlled markup returned directly in JSON response",
    "  string json = JsonConvert.SerializeObject(claim);",
    "  return new MemoryStream(Encoding.UTF8.GetBytes(json));",
    "}",
  ],
  after: [
    "// ✅ WCF Custom JsonMediaTypeFormatter with HTML Escaping & Feature Flag",
    "public class SafeJsonMediaTypeFormatter : JsonMediaTypeFormatter {",
    "  public SafeJsonMediaTypeFormatter() {",
    "    // StringEscapeHandling.EscapeHtml safely encodes <, >, &, ', \" in JSON strings",
    "    SerializerSettings.StringEscapeHandling = StringEscapeHandling.EscapeHtml;",
    "  }",
    "}",
    "// Scoped strictly to application/json via IDispatchMessageInspector hook",
    "// Shipped behind feature flag for instant zero-downtime rollback capability.",
  ],
};

export const CONFIG_MERGE_LEVELS = [
  { level: 1, name: "Offering / Plan Scope", color: "#22d3ee" },
  { level: 2, name: "Employer Settings", color: "#38bdf8" },
  { level: 3, name: "Administrator Config", color: "#818cf8" },
  { level: 4, name: "Business Unit Hierarchy", color: "#a78bfa" },
  { level: 5, name: "Global System Defaults", color: "#f59e0b" },
];

export const JMETER_STATS = {
  samples: 4061,
  errors: "0.00%",
  p95: "3.3s",
  p99: "4.2s",
  slaTarget: "2.0s",
  throughput: "600 RPM",
  users: 75,
};
