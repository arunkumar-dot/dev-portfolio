// ─── Metrics ─────────────────────────────────────────────────────────────────

export const METRICS = [
  { label: "yrs production experience", value: 4, prefix: "", suffix: "" },
  { label: "load-test error rate @ 600 RPM", value: 0, prefix: "", suffix: "%" },
  { label: "locales shipped", value: 11, prefix: "", suffix: "" },
] as const;

// ─── Skills (Aligned 100% with Resume & Genuine Work) ────────────────────────

export const SKILLS: Record<string, string[]> = {
  "Languages & Core": [
    "C#",
    "TypeScript",
    "JavaScript",
    "SQL (T-SQL)",
    "Python (in progress)",
  ],
  "Backend & APIs": [
    "ASP.NET Core",
    ".NET Framework / WCF",
    "RESTful APIs",
    "MediatR (CQRS)",
    "Entity Framework Core",
    "Microservices",
  ],
  "Frontend & UI": [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Webpack Module Federation",
    "HTML5 / Modern CSS",
  ],
  "Databases & Caching": [
    "SQL Server (Stored Procedures)",
    "PostgreSQL",
    "Redis",
    "Convex",
    "SQLite",
  ],
  "Architecture & Design": [
    "CQRS Pattern",
    "Micro-Frontends",
    "Multi-Tenant Systems",
    "BullMQ Job Queues",
    "MVVM Architecture",
    "Feature Flags",
  ],
  "Testing & Quality": [
    "xUnit",
    "Moq",
    "Vitest",
    "React Testing Library",
    "JMeter (Load Testing)",
  ],
  "Security & Delivery": [
    "XSS Remediation",
    "HTML Serialization Escaping",
    "JWT & Session Auth",
    "Vercel Edge",
    "Cloudflare",
  ],
};

// ─── Contact ─────────────────────────────────────────────────────────────────

export const CONTACT = {
  email: "arunkulkarni2000@gmail.com",
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
