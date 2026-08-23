// ─── Metrics ─────────────────────────────────────────────────────────────────

export const METRICS = [
  { label: "yrs production experience", value: 4, prefix: "", suffix: "+" },
  { label: "load-test errors @ 600 RPM", value: 0, prefix: "", suffix: "%" },
  { label: "locales shipped", value: 11, prefix: "", suffix: "" },
] as const;

// ─── Skills ──────────────────────────────────────────────────────────────────

export const SKILLS: Record<string, string[]> = {
  Languages: ["C#", "TypeScript", "JavaScript", "SQL", "Python"],
  Backend: [".NET 8", "ASP.NET Core", "Entity Framework Core", "REST APIs", "SignalR"],
  Frontend: ["React 19", "Next.js", "Tailwind CSS", "Three.js", "Framer Motion"],
  Architecture: ["Micro-frontends", "Multi-tenant SaaS", "Event-driven", "CQRS", "Clean Architecture"],
  Testing: ["xUnit", "JMeter", "Playwright", "Jest", "Storybook"],
  Security: ["XSS remediation", "JWT/OAuth2", "OWASP Top 10", "HTML escaping filters"],
  Databases: ["SQL Server", "PostgreSQL", "Redis", "Convex", "Firebase"],
  "Cloud & Tooling": ["Azure", "Cloudflare", "Docker", "GitHub Actions", "Vercel"],
};

// ─── Contact ─────────────────────────────────────────────────────────────────

export const CONTACT = {
  email: "arunkulkarni2000@gmail.com",
  github: "arunkumar-dot",
  linkedin: "arun-kumar-kulkarni",
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

// ─── Diff Data ────────────────────────────────────────────────────────────────

export const SECURITY_DIFF = {
  before: [
    "// ❌ Controller – raw object serialization",
    "public IActionResult GetClaimData(int claimId) {",
    "  var claim = _repo.GetClaim(claimId);",
    "  // Danger: user-controlled strings written directly",
    "  return Content(JsonConvert.SerializeObject(claim),",
    "    \"application/json\");",
    "}",
    "",
    "// ❌ No escaping – XSS vector open",
    "var html = $\"<div>{claim.Notes}</div>\";",
  ],
  after: [
    "// ✅ Centralized JSON serialization layer",
    "public IActionResult GetClaimData(int claimId) {",
    "  var claim = _repo.GetClaim(claimId);",
    "  // All output routed through SafeJsonResult",
    "  return new SafeJsonResult(claim, _serializerOptions);",
    "}",
    "",
    "// ✅ Response-capture filter + HTML escaping",
    "// SafeJsonResult internally calls HtmlEncoder.Default.Encode()",
    "// on every string property before writing response bytes.",
    "// Feature-flagged rollout: FF.IsEnabled(\"safe-json-v2\")",
  ],
};

export const CONFIG_MERGE_LEVELS = [
  { level: 1, name: "Global Defaults", color: "#22d3ee" },
  { level: 2, name: "Plan-Type Overrides", color: "#38bdf8" },
  { level: 3, name: "Employer Settings", color: "#818cf8" },
  { level: 4, name: "Member Preferences", color: "#a78bfa" },
  { level: 5, name: "Request-Time Params", color: "#f59e0b" },
];

export const JMETER_STATS = {
  samples: 4061,
  errors: "0.00%",
  p95: "3.3s",
  p99: "4.2s",
  throughput: "600 RPM",
  users: 75,
};
