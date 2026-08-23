# Interactive Developer Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page interactive developer portfolio (Next.js 15 + React 19 + TypeScript + Tailwind + @react-three/fiber) with a curl-noise GPU particle field, a WebGL throughput ribbon, a Normal/600-RPM simulation toggle, a typewriter hero rotator, and a 4-module spatial bento gallery of glass tiles with 3D cursor-follow tilt.

**Architecture:** A `SimulationModeProvider` React context holds the single `intensity` value (0→1) that drives the particle shader, the ribbon shader, and bloom together. A shared `usePointerNDC` hook centralizes mouse-tracking for both WebGL meshes. All resume content lives in a typed `lib/content.ts` data module — no CMS, no placeholders. The only runtime network call is a client-side GitHub REST API fetch in the contact section, with a static fallback.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, @react-three/fiber, @react-three/drei, @react-three/postprocessing, framer-motion.

**Spec:** [docs/superpowers/specs/2026-08-23-portfolio-site-design.md](../specs/2026-08-23-portfolio-site-design.md) (including the 2026-08-23 amendment)

## Global Constraints

- Real, runnable project — verified via `npm run dev` in an actual browser, not just type-checked.
- No placeholder/lorem-ipsum copy anywhere — content comes from the resume, or is clearly-marked illustrative reconstruction (diff snippets, locale translations) consistent with the spec.
- No unit test framework (spec explicitly puts this out of scope) — each task is verified by build success + direct browser/visual check instead of automated tests.
- Particle count adaptive: ~25k desktop, ~8k mobile/`prefers-reduced-motion`; reduced-motion also disables curl-noise turbulence (both `ParticleField` and `ThroughputRibbon`).
- WebGL-unavailable and GitHub-API-failure paths must degrade gracefully, never blank the page.
- Tile rendering is CSS 3D tilt + cursor light (`GlassTile`), not per-card WebGL glass — confirmed decision, do not substitute `MeshTransmissionMaterial`.
- GitHub handle: `arunkumar-dot`. Contact email: `arunkulkarni2000@gmail.com`.
- The bento gallery has exactly 4 modules (Claims Web API, Consumer Claims Micro-Frontend, Enterprise Security, HabitFlow) — there is no separate standalone Projects section.

---

## File Structure

```
app/
  layout.tsx              — root layout, metadata, font, imports globals.css
  page.tsx                 — assembles all sections
  globals.css               — Tailwind directives + base terminal/console theme
lib/
  content.ts                — typed resume content: metrics, hero phrases, 4 bento modules, skills, contact
  github.ts                  — client-side GitHub REST API fetch helper
  useReducedMotion.ts         — hook wrapping prefers-reduced-motion media query
  usePointerNDC.ts              — shared R3F pointer-tracking hook (NDC position + activity lerp)
components/
  simulation/
    SimulationModeProvider.tsx — context: mode, intensity (animated)
    SimulationToggle.tsx        — header segmented toggle UI
  three/
    shaders.ts                  — exported GLSL: NOISE_GLSL (curl noise), particle VERTEX/FRAGMENT_SHADER
    ribbonShaders.ts              — exported GLSL: ribbon RIBBON_VERTEX/FRAGMENT_SHADER (reuses NOISE_GLSL)
    ParticleField.tsx              — R3F points mesh, uniforms, mouse interaction
    ThroughputRibbon.tsx            — R3F displaced plane mesh, curl + ripple, mouse interaction
    Scene.tsx                        — Canvas wrapper: ParticleField + ThroughputRibbon + Bloom + WebGL fallback
  layout/
    Header.tsx                        — fixed nav + SimulationToggle
  sections/
    HeroTextRotator.tsx                 — typewriter base-text + rotating-phrase component
    Hero.tsx                             — Scene + headline + HeroTextRotator + stress telemetry banner + MetricsStrip
    MetricsStrip.tsx                      — animated count-up metrics
    DiffViewer.tsx                         — generic before/after colored-line renderer
    GlassTile.tsx                           — CSS 3D tilt + cursor-follow light wrapper
    SpatialBento.tsx                         — 4-module bento gallery (Claims API, Microfrontend, Security, HabitFlow)
    Skills.tsx                                — grouped skill tag grid
    GithubCard.tsx                             — live GitHub profile/repo card
    Contact.tsx                                — terminal panel, copy button, GithubCard
```

---

### Task 1: Scaffold Next.js project and install dependencies

**Files:**
- Create: entire scaffold (`app/`, `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`)

**Interfaces:**
- Produces: a runnable `npm run dev` project on `http://localhost:3000` with Tailwind working, that later tasks add files into.

- [ ] **Step 1: Scaffold with create-next-app**

```bash
cd "/Users/arun_kumar_kulkarni/Downloads/DEV/Gem-Port"
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint --use-npm
```

Answer prompts if any appear (accept defaults). This scaffolds into the current directory (already git-initialized).

- [ ] **Step 2: Install 3D and animation dependencies**

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing framer-motion
npm install -D @types/three
```

- [ ] **Step 3: Verify dev server runs**

```bash
npm run dev &
DEV_PID=$!
sleep 3
curl -sf http://localhost:3000 > /dev/null && echo "OK: server responding"
kill "$DEV_PID"
```

Expected: `OK: server responding`, and the default Next.js starter page reachable.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js project with 3D/animation dependencies"
```

---

### Task 2: Resume content data module

**Files:**
- Create: `lib/content.ts`

**Interfaces:**
- Produces: `metrics: Metric[]`, `heroBaseText: string`, `heroPhrases: string[]`, `claimsApiModule: ClaimsApiModule`, `microfrontendModule: MicrofrontendModule`, `securityModule: SecurityModule`, `habitflowModule: HabitflowModule`, `skillGroups: SkillGroup[]`, `contact: ContactInfo` — all typed exports consumed by later section components. `DiffLine` is consumed by `DiffViewer` (Task 13) and `securityModule.diff`.

Diff snippets and locale translations below are illustrative reconstructions written for portfolio presentation (the underlying employer codebase and the exact shipped locale copy are not reproduced) — a comment at the top of the file states this.

- [ ] **Step 1: Write `lib/content.ts`**

```typescript
// Diff snippets and locale translations are illustrative reconstructions
// written for this portfolio — not reproductions of proprietary source
// or literal shipped copy.

export interface Metric {
  label: string;
  value: string;
}

export interface DiffLine {
  type: "add" | "remove" | "context";
  text: string;
}

export interface ConfigLevel {
  scope: string;
  description: string;
}

export interface JmeterStats {
  users: number;
  rpm: number;
  samples: number;
  errorRate: string;
  p95: string;
  p99: string;
}

export interface ClaimsApiModule {
  title: string;
  tagline: string;
  configHierarchy: ConfigLevel[];
  shardingSteps: string[];
  jmeter: JmeterStats;
}

export interface LocaleEntry {
  code: string;
  label: string;
  directDeposit: string;
  checkByMail: string;
  continueLabel: string;
}

export interface MicrofrontendModule {
  title: string;
  tagline: string;
  locales: LocaleEntry[];
}

export interface SecurityModule {
  title: string;
  tagline: string;
  diffTitle: string;
  diff: DiffLine[];
}

export interface HabitflowModule {
  title: string;
  tagline: string;
  description: string;
  url: string;
  stack: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ContactInfo {
  email: string;
  githubUser: string;
  githubUrl: string;
}

export const metrics: Metric[] = [
  { label: "Production experience", value: "4+ yrs" },
  { label: "Load-test errors @ 600 RPM", value: "0%" },
  { label: "Locales shipped", value: "11" },
];

export const heroBaseText =
  "I'm Arun Kumar Kulkarni, a senior software engineer building ";

export const heroPhrases: string[] = [
  "production-grade backend APIs.",
  "multi-tenant cloud systems.",
  "resilient micro-frontends.",
  "full-stack SaaS products.",
];

export const claimsApiModule: ClaimsApiModule = {
  title: "Claims Web API",
  tagline: "Five-level config resolution, multi-tenant sharding, validated under load",
  configHierarchy: [
    { scope: "Plan", description: "Most specific override — checked first." },
    { scope: "Employer", description: "Falls back here when no plan-level setting is defined." },
    { scope: "Administrator", description: "Third-party administrator defaults for the employer group." },
    { scope: "Custodian", description: "Custodian-wide defaults when no administrator setting applies." },
    { scope: "Global Default", description: "Final fallback, applied when no more specific scope resolves." },
  ],
  shardingSteps: [
    "Resolve tenant context from the authenticated request",
    "Route the query to the tenant's database shard",
    "Scope every repository call to that shard before execution",
    "Propagate the same tenant context through receipt-download and claim-filing paths",
  ],
  jmeter: { users: 75, rpm: 600, samples: 4061, errorRate: "0%", p95: "3.3s", p99: "4.2s" },
};

export const microfrontendModule: MicrofrontendModule = {
  title: "Consumer Claims Micro-Frontend",
  tagline: "Direct deposit vs. check by mail, shipped in 11 locales",
  locales: [
    { code: "en-US", label: "English (US)", directDeposit: "Direct Deposit", checkByMail: "Check by Mail", continueLabel: "Continue" },
    { code: "es-ES", label: "Español", directDeposit: "Depósito Directo", checkByMail: "Cheque por Correo", continueLabel: "Continuar" },
    { code: "fr-FR", label: "Français", directDeposit: "Dépôt Direct", checkByMail: "Chèque par Courrier", continueLabel: "Continuer" },
    { code: "de-DE", label: "Deutsch", directDeposit: "Direkteinzahlung", checkByMail: "Scheck per Post", continueLabel: "Weiter" },
    { code: "pt-BR", label: "Português (BR)", directDeposit: "Depósito Direto", checkByMail: "Cheque pelo Correio", continueLabel: "Continuar" },
    { code: "hi-IN", label: "हिन्दी", directDeposit: "सीधा जमा", checkByMail: "डाक द्वारा चेक", continueLabel: "जारी रखें" },
    { code: "zh-CN", label: "中文（简体）", directDeposit: "直接存款", checkByMail: "邮寄支票", continueLabel: "继续" },
    { code: "ja-JP", label: "日本語", directDeposit: "口座振込", checkByMail: "郵送小切手", continueLabel: "続ける" },
    { code: "ko-KR", label: "한국어", directDeposit: "계좌 이체", checkByMail: "우편 수표", continueLabel: "계속" },
    { code: "it-IT", label: "Italiano", directDeposit: "Deposito Diretto", checkByMail: "Assegno per Posta", continueLabel: "Continua" },
    { code: "nl-NL", label: "Nederlands", directDeposit: "Directe Storting", checkByMail: "Cheque per Post", continueLabel: "Doorgaan" },
  ],
};

export const securityModule: SecurityModule = {
  title: "Enterprise Security",
  tagline: "Critical XSS finding, remediated across four legacy services",
  diffTitle: "Response serialization path",
  diff: [
    { type: "context", text: "public IActionResult GetClaim(int id)" },
    { type: "context", text: "{" },
    { type: "remove", text: "    var json = JsonSerializer.Serialize(claim);" },
    { type: "remove", text: "    return Content(json, \"application/json\");" },
    { type: "add", text: "    var json = _htmlSafeSerializer.Serialize(claim);" },
    { type: "add", text: "    return _responseCaptureFilter.Wrap(Content(json, \"application/json\"));" },
    { type: "context", text: "}" },
  ],
};

export const habitflowModule: HabitflowModule = {
  title: "HabitFlow",
  tagline: "Full-stack SaaS habit tracker, live with real users",
  description:
    "Streak tracking, progress analytics, and real-time notifications — built and deployed end to end, live on a custom domain.",
  url: "https://tryhabitflow.com",
  stack: ["Next.js", "Convex", "Clerk", "Firebase", "Cloudflare", "Vercel"],
};

export const skillGroups: SkillGroup[] = [
  { category: "Languages", items: ["C#", "TypeScript", "JavaScript", "SQL (T-SQL)", "Python"] },
  { category: "Backend", items: ["ASP.NET Core", ".NET Framework", "Web API", "WCF", "Entity Framework Core", "ADO.NET", "GraphQL", "Node.js/Express"] },
  { category: "Frontend", items: ["React 19", "Vite", "Micro-Frontends", "Next.js", "Design Systems", "i18n", "Figma-to-Production"] },
  { category: "Architecture", items: ["Microservices", "Clean Architecture", "CQRS / MediatR", "REST API Design", "BFF & Strangler Fig Patterns", "Multi-Tenant Data Isolation"] },
  { category: "Testing", items: ["xUnit", "Moq", "Vitest", "React Testing Library", "Contract Testing (Pact)", "Load Testing (JMeter)", "ReadyAPI", "Regression Testing"] },
  { category: "Security", items: ["OAuth 2.0 / OIDC + PKCE", "JWT", "XSS Remediation", "OWASP", "Penetration Test Response"] },
  { category: "Databases", items: ["SQL Server", "Stored Procedures", "Query Optimization", "Sharded / Multi-Tenant Contexts", "SQLite", "Convex"] },
  { category: "Cloud & Tooling", items: ["Microsoft Azure", "Azure DevOps", "Git", "Visual Studio", "OpenAPI/NSwag", "Splunk", "pnpm"] },
  { category: "Mobile", items: ["Xamarin.Forms", ".NET MAUI", "MVVM", "Firebase"] },
];

export const contact: ContactInfo = {
  email: "arunkulkarni2000@gmail.com",
  githubUser: "arunkumar-dot",
  githubUrl: "https://github.com/arunkumar-dot",
};
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `lib/content.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/content.ts
git commit -m "Add typed resume content data module"
```

---

### Task 3: Simulation mode context and reduced-motion hook

**Files:**
- Create: `components/simulation/SimulationModeProvider.tsx`
- Create: `lib/useReducedMotion.ts`

**Interfaces:**
- Produces: `SimulationModeProvider` (wraps `app/layout.tsx` children), `useSimulationMode(): { mode: "normal" | "stress"; intensity: number; setMode(mode): void }`, `useReducedMotion(): boolean`. Later tasks (`SimulationToggle`, `ParticleField`, `ThroughputRibbon`, `Scene`, `Hero`) consume `useSimulationMode`; `ParticleField`/`ThroughputRibbon` consume `useReducedMotion`.

- [ ] **Step 1: Write `components/simulation/SimulationModeProvider.tsx`**

```typescript
"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type SimulationMode = "normal" | "stress";

interface SimulationContextValue {
  mode: SimulationMode;
  intensity: number;
  setMode: (mode: SimulationMode) => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

const LERP_SPEED = 2.5;

export function SimulationModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SimulationMode>("normal");
  const [intensity, setIntensity] = useState(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    targetRef.current = mode === "stress" ? 1 : 0;
  }, [mode]);

  useEffect(() => {
    let last = performance.now();
    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      setIntensity((prev) => {
        const target = targetRef.current;
        const diff = target - prev;
        if (Math.abs(diff) < 0.001) return target;
        return prev + diff * Math.min(1, LERP_SPEED * dt);
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <SimulationContext.Provider value={{ mode, intensity, setMode }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulationMode() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulationMode must be used within SimulationModeProvider");
  return ctx;
}
```

- [ ] **Step 2: Write `lib/useReducedMotion.ts`**

```typescript
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 3: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing either new file.

- [ ] **Step 4: Commit**

```bash
git add components/simulation/SimulationModeProvider.tsx lib/useReducedMotion.ts
git commit -m "Add simulation mode context and reduced-motion hook"
```

---

### Task 4: GLSL curl-noise particle shaders

**Files:**
- Create: `components/three/shaders.ts`

**Interfaces:**
- Produces: exported string constants `NOISE_GLSL` (curl-noise function, reused by `ThroughputRibbon` in Task 7), `VERTEX_SHADER`, `FRAGMENT_SHADER`, consumed by `ParticleField` (Task 6) as `<shaderMaterial vertexShader={VERTEX_SHADER} fragmentShader={FRAGMENT_SHADER} .../>`. Vertex shader expects uniforms `uTime: float`, `uIntensity: float` (0..1), `uMouse: vec2`, `uMouseActive: float`, and an `aSeed: float` per-vertex attribute.

- [ ] **Step 1: Write `components/three/shaders.ts`**

```typescript
// 3D simplex noise: Ian McEwan, Ashima Arts (MIT License), standard webgl-noise implementation.
export const NOISE_GLSL = `
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

vec3 snoiseVec3(vec3 x) {
  float s  = snoise(x);
  float s1 = snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2));
  float s2 = snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4));
  return vec3(s, s1, s2);
}

// Curl of the vector potential (s, s1, s2) via central differences.
vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 p_x0 = snoiseVec3(p - dx);
  vec3 p_x1 = snoiseVec3(p + dx);
  vec3 p_y0 = snoiseVec3(p - dy);
  vec3 p_y1 = snoiseVec3(p + dy);
  vec3 p_z0 = snoiseVec3(p - dz);
  vec3 p_z1 = snoiseVec3(p + dz);

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / (2.0 * e);
  return normalize(vec3(x, y, z) * divisor + 0.0001);
}
`;

export const VERTEX_SHADER = `
uniform float uTime;
uniform float uIntensity;
uniform vec2 uMouse;
uniform float uMouseActive;

attribute float aSeed;

varying float vSeed;
varying float vDistanceFromMouse;

${NOISE_GLSL}

void main() {
  vSeed = aSeed;

  float speed = mix(0.15, 0.9, uIntensity);
  float noiseFreq = mix(0.35, 1.1, uIntensity);
  float noiseAmp = mix(0.4, 2.2, uIntensity);

  vec3 pos = position;
  vec3 flow = curlNoise(pos * noiseFreq + aSeed * 10.0 + uTime * speed);
  pos += flow * noiseAmp;

  vec4 viewPos = modelViewMatrix * vec4(pos, 1.0);
  vec2 screenPos = viewPos.xy / -viewPos.z;
  float distToMouse = distance(screenPos, uMouse);
  float falloff = smoothstep(0.6, 0.0, distToMouse) * uMouseActive;
  vec2 pushDir = normalize(screenPos - uMouse + 0.0001);
  viewPos.xy += pushDir * falloff * 0.6;

  vDistanceFromMouse = falloff;

  gl_Position = projectionMatrix * viewPos;
  gl_PointSize = mix(2.0, 4.5, uIntensity) * (300.0 / -viewPos.z);
}
`;

export const FRAGMENT_SHADER = `
uniform float uIntensity;
varying float vSeed;
varying float vDistanceFromMouse;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  float alpha = smoothstep(0.5, 0.0, dist);
  if (alpha < 0.01) discard;

  vec3 cyan = vec3(0.13, 0.83, 0.93);
  vec3 amber = vec3(1.0, 0.55, 0.1);
  vec3 color = mix(cyan, amber, uIntensity);
  color += vDistanceFromMouse * 0.6;

  gl_FragColor = vec4(color, alpha * (0.4 + 0.6 * vSeed));
}
`;
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `components/three/shaders.ts` (this file only exports strings — GLSL syntax itself is validated visually once `ParticleField` renders in Task 6).

- [ ] **Step 3: Commit**

```bash
git add components/three/shaders.ts
git commit -m "Add curl-noise GPU particle shaders"
```

---

### Task 5: Shared pointer-tracking hook

**Files:**
- Create: `lib/usePointerNDC.ts`

**Interfaces:**
- Produces: `usePointerNDC(): { pointer: React.RefObject<THREE.Vector2>; active: React.RefObject<number>; update(delta: number): void }`, consumed by both `ParticleField` (Task 6) and `ThroughputRibbon` (Task 7) so pointer-tracking logic (native `pointermove`/`pointerleave` listeners on the canvas, NDC conversion, activity lerp) exists in exactly one place. Must be called from inside a component rendered within an `@react-three/fiber` `<Canvas>` (it calls `useThree`).

- [ ] **Step 1: Write `lib/usePointerNDC.ts`**

```typescript
"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export function usePointerNDC() {
  const { gl } = useThree();
  const pointer = useRef(new THREE.Vector2(0, 0));
  const active = useRef(0);
  const targetActive = useRef(0);

  useEffect(() => {
    const canvas = gl.domElement;
    function handleMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetActive.current = 1;
    }
    function handleLeave() {
      targetActive.current = 0;
    }
    canvas.addEventListener("pointermove", handleMove);
    canvas.addEventListener("pointerleave", handleLeave);
    return () => {
      canvas.removeEventListener("pointermove", handleMove);
      canvas.removeEventListener("pointerleave", handleLeave);
    };
  }, [gl]);

  function update(delta: number) {
    active.current = THREE.MathUtils.lerp(active.current, targetActive.current, delta * 4);
  }

  return { pointer, active, update };
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `lib/usePointerNDC.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/usePointerNDC.ts
git commit -m "Add shared pointer-tracking hook for R3F meshes"
```

---

### Task 6: ParticleField component (GPU points + mouse interaction)

**Files:**
- Create: `components/three/ParticleField.tsx`

**Interfaces:**
- Consumes: `useSimulationMode()` from Task 3 (`intensity: number`), `useReducedMotion()` from Task 3, `VERTEX_SHADER`/`FRAGMENT_SHADER` from Task 4, `usePointerNDC()` from Task 5.
- Produces: `ParticleField` component, a `<points>` mesh meant to be rendered inside an `@react-three/fiber` `<Canvas>` — consumed by `Scene` in Task 8.

- [ ] **Step 1: Write `components/three/ParticleField.tsx`**

```tsx
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "./shaders";
import { useSimulationMode } from "../simulation/SimulationModeProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { usePointerNDC } from "@/lib/usePointerNDC";

export function ParticleField() {
  const { intensity } = useSimulationMode();
  const reducedMotion = useReducedMotion();
  const { pointer, active, update } = usePointerNDC();
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const particleCount = useMemo(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    return reducedMotion || isMobile ? 8000 : 25000;
  }, [reducedMotion]);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const seeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      seeds[i] = Math.random();
    }
    return { positions, seeds };
  }, [particleCount]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseActive: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;

    if (!reducedMotion) {
      u.uTime.value = state.clock.getElapsedTime();
    }
    u.uIntensity.value = intensity;
    update(delta);
    u.uMouse.value.copy(pointer.current);
    u.uMouseActive.value = active.current;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSeed" count={particleCount} array={seeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `components/three/ParticleField.tsx`. Full visual/behavioral verification happens in Task 8 once it's mounted inside a `Canvas`.

- [ ] **Step 3: Commit**

```bash
git add components/three/ParticleField.tsx
git commit -m "Add GPU particle field with curl-noise motion and mouse interaction"
```

---

### Task 7: ThroughputRibbon component (WebGL fluid ribbon)

**Files:**
- Create: `components/three/ribbonShaders.ts`
- Create: `components/three/ThroughputRibbon.tsx`

**Interfaces:**
- Consumes: `NOISE_GLSL` from Task 4, `useSimulationMode()`/`useReducedMotion()` from Task 3, `usePointerNDC()` from Task 5.
- Produces: `RIBBON_VERTEX_SHADER`, `RIBBON_FRAGMENT_SHADER` (exported for reference/tuning), and `ThroughputRibbon` component — a displaced plane mesh meant to be rendered inside the same `<Canvas>` as `ParticleField` — consumed by `Scene` in Task 8.

- [ ] **Step 1: Write `components/three/ribbonShaders.ts`**

```typescript
import { NOISE_GLSL } from "./shaders";

export const RIBBON_VERTEX_SHADER = `
uniform float uTime;
uniform float uIntensity;
uniform vec2 uMouse;
uniform float uMouseActive;

varying float vElevation;
varying vec2 vUv;

${NOISE_GLSL}

void main() {
  vUv = uv;

  float speed = mix(0.2, 1.1, uIntensity);
  float freq = mix(0.6, 1.8, uIntensity);
  float ampCurl = mix(0.12, 0.5, uIntensity);

  vec3 pos = position;

  vec3 flow = curlNoise(vec3(pos.xy * freq, uTime * speed));
  float elevation = flow.z * ampCurl;

  float dist = distance(pos.xy, uMouse * 2.0);
  float rippleSpeed = mix(2.0, 6.0, uIntensity);
  float ripple = sin(dist * 8.0 - uTime * rippleSpeed) * exp(-dist * 2.5) * uMouseActive;
  elevation += ripple * 0.4;

  pos.z += elevation;
  vElevation = elevation;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const RIBBON_FRAGMENT_SHADER = `
uniform float uIntensity;
varying float vElevation;
varying vec2 vUv;

void main() {
  vec3 cyan = vec3(0.0, 0.96, 0.83);
  vec3 amber = vec3(1.0, 0.55, 0.1);
  vec3 base = mix(cyan, amber, uIntensity);

  float glow = smoothstep(-0.3, 0.6, vElevation);
  vec3 color = mix(base * 0.35, base, glow);

  float edgeFade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
  float alpha = (0.25 + glow * 0.5) * edgeFade;

  gl_FragColor = vec4(color, alpha);
}
`;
```

- [ ] **Step 2: Write `components/three/ThroughputRibbon.tsx`**

```tsx
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RIBBON_VERTEX_SHADER, RIBBON_FRAGMENT_SHADER } from "./ribbonShaders";
import { useSimulationMode } from "../simulation/SimulationModeProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { usePointerNDC } from "@/lib/usePointerNDC";

export function ThroughputRibbon() {
  const { intensity } = useSimulationMode();
  const reducedMotion = useReducedMotion();
  const { pointer, active, update } = usePointerNDC();
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const geometry = useMemo(() => new THREE.PlaneGeometry(6, 1.4, 180, 40), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseActive: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    if (!reducedMotion) {
      u.uTime.value = state.clock.getElapsedTime();
    }
    u.uIntensity.value = intensity;
    update(delta);
    u.uMouse.value.copy(pointer.current);
    u.uMouseActive.value = active.current;
  });

  return (
    <mesh geometry={geometry} rotation={[-0.35, 0, 0]} position={[0, -0.6, -0.5]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={RIBBON_VERTEX_SHADER}
        fragmentShader={RIBBON_FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
```

- [ ] **Step 3: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing either new file. Full visual verification happens in Task 8 once mounted inside a `Canvas`.

- [ ] **Step 4: Commit**

```bash
git add components/three/ribbonShaders.ts components/three/ThroughputRibbon.tsx
git commit -m "Add WebGL throughput ribbon with curl-noise and mouse ripple"
```

---

### Task 8: Scene wrapper — Canvas, both meshes, bloom, WebGL fallback

**Files:**
- Create: `components/three/Scene.tsx`

**Interfaces:**
- Consumes: `ParticleField` (Task 6), `ThroughputRibbon` (Task 7), `useSimulationMode()` (Task 3).
- Produces: `Scene` component — an absolutely-positioned full-bleed background, consumed by `Hero` in Task 11.

- [ ] **Step 1: Write `components/three/Scene.tsx`**

```tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { ParticleField } from "./ParticleField";
import { ThroughputRibbon } from "./ThroughputRibbon";
import { useSimulationMode } from "../simulation/SimulationModeProvider";

function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function BloomLayer() {
  const { intensity } = useSimulationMode();
  return (
    <EffectComposer>
      <Bloom
        intensity={0.4 + intensity * 1.6}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  );
}

export function Scene() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  if (webglSupported === false) {
    return (
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(34,211,238,0.15), transparent 60%), #05050a",
        }}
      />
    );
  }

  if (webglSupported === null) {
    return <div className="absolute inset-0 -z-10 bg-[#05050a]" />;
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 4], fov: 55 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ParticleField />
          <ThroughputRibbon />
          <BloomLayer />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
npx tsc --noEmit
npm run build
```

Expected: both succeed with no errors.

- [ ] **Step 3: Commit**

```bash
git add components/three/Scene.tsx
git commit -m "Add Scene wrapper rendering particle field + ribbon with bloom and WebGL fallback"
```

---

### Task 9: Header and simulation toggle UI

**Files:**
- Create: `components/simulation/SimulationToggle.tsx`
- Create: `components/layout/Header.tsx`

**Interfaces:**
- Consumes: `useSimulationMode()` (Task 3).
- Produces: `Header` component, consumed by `app/page.tsx` in Task 17.

- [ ] **Step 1: Write `components/simulation/SimulationToggle.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useSimulationMode, type SimulationMode } from "./SimulationModeProvider";

const OPTIONS: { mode: SimulationMode; label: string }[] = [
  { mode: "normal", label: "NORMAL OPERATION" },
  { mode: "stress", label: "600 RPM STRESS TEST" },
];

export function SimulationToggle() {
  const { mode, setMode } = useSimulationMode();

  return (
    <div className="relative flex rounded-full border border-white/10 bg-black/40 p-1 font-mono text-xs">
      {OPTIONS.map((option) => {
        const active = option.mode === mode;
        return (
          <button
            key={option.mode}
            onClick={() => setMode(option.mode)}
            className={`relative z-10 px-3 py-1.5 uppercase tracking-wider transition-colors ${
              active ? "text-black" : "text-white/60 hover:text-white"
            }`}
          >
            {active && (
              <motion.span
                layoutId="simulation-toggle-pill"
                className={`absolute inset-0 -z-10 rounded-full ${
                  option.mode === "stress" ? "bg-amber-400" : "bg-cyan-400"
                }`}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Write `components/layout/Header.tsx`**

```tsx
import { SimulationToggle } from "../simulation/SimulationToggle";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/30 px-6 py-4 backdrop-blur-md">
      <span className="font-mono text-sm uppercase tracking-widest text-white/80">
        Arun Kumar Kulkarni
      </span>
      <SimulationToggle />
    </header>
  );
}
```

- [ ] **Step 3: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing either new file. Full visual/click verification happens in Task 17 once wired into `page.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/simulation/SimulationToggle.tsx components/layout/Header.tsx
git commit -m "Add header with normal/stress-test simulation toggle"
```

---

### Task 10: Hero typewriter rotator

**Files:**
- Create: `components/sections/HeroTextRotator.tsx`

**Interfaces:**
- Produces: `HeroTextRotator` component (no props), consumed by `Hero` in Task 11.

- [ ] **Step 1: Write `components/sections/HeroTextRotator.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

const BASE_TEXT = "I'm Arun Kumar Kulkarni, a senior software engineer building ";
const PHRASES = [
  "production-grade backend APIs.",
  "multi-tenant cloud systems.",
  "resilient micro-frontends.",
  "full-stack SaaS products.",
];

const TYPE_SPEED = 45;
const DELETE_SPEED = 25;
const HOLD_MS = 1600;

export function HeroTextRotator() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), TYPE_SPEED);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), HOLD_MS);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), DELETE_SPEED);
    } else {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, phraseIndex]);

  const longestPhrase = PHRASES.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <p className="relative mt-4 text-base text-white/70 sm:text-lg">
      <span className="invisible" aria-hidden="true">
        {BASE_TEXT}
        {longestPhrase}
      </span>
      <span className="absolute inset-0">
        {BASE_TEXT}
        <span className="text-cyan-300">{displayed}</span>
        <span
          className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse"
          style={{ backgroundColor: "#00F5D4" }}
          aria-hidden="true"
        />
      </span>
    </p>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `components/sections/HeroTextRotator.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/sections/HeroTextRotator.tsx
git commit -m "Add hero typewriter phrase rotator with CLS-safe layout"
```

---

### Task 11: Hero section with typewriter, telemetry banner, and animated metrics

**Files:**
- Create: `components/sections/MetricsStrip.tsx`
- Create: `components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `Scene` (Task 8), `HeroTextRotator` (Task 10), `useSimulationMode()` (Task 3), `metrics: Metric[]` from `lib/content.ts` (Task 2).
- Produces: `Hero` component, consumed by `app/page.tsx` in Task 17.

- [ ] **Step 1: Write `components/sections/MetricsStrip.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Metric } from "@/lib/content";

function parseMetric(value: string): { number: number; suffix: string } {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { number: 0, suffix: value };
  return { number: parseFloat(match[1]), suffix: match[2] };
}

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * progress * 100) / 100);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export function MetricsStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {metrics.map((metric, i) => {
        const { number, suffix } = parseMetric(metric.value);
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="rounded-lg border border-white/10 bg-black/30 p-4 text-center backdrop-blur-sm"
          >
            <div className="font-mono text-3xl font-semibold text-cyan-300">
              <CountUp target={number} suffix={suffix} />
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-white/50">
              {metric.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Write `components/sections/Hero.tsx`**

```tsx
"use client";

import { Scene } from "../three/Scene";
import { MetricsStrip } from "./MetricsStrip";
import { HeroTextRotator } from "./HeroTextRotator";
import { metrics } from "@/lib/content";
import { useSimulationMode } from "../simulation/SimulationModeProvider";

export function Hero() {
  const { mode } = useSimulationMode();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center">
      <Scene />
      <div className="relative z-10 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          Senior Software Engineer — Backend &amp; Full-Stack
        </p>
        <h1 className="mt-4 text-4xl font-bold text-white sm:text-6xl">
          Arun Kumar Kulkarni
        </h1>
        <HeroTextRotator />
        {mode === "stress" && (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-amber-300/90">
            [SIMULATING CONCURRENCY: 75 VIRTUAL USERS | 600 REQ/MIN | 0.00% ERRORS]
          </p>
        )}
        <div className="mt-10">
          <MetricsStrip metrics={metrics} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing either new file. Full visual verification happens in Task 17.

- [ ] **Step 4: Commit**

```bash
git add components/sections/MetricsStrip.tsx components/sections/Hero.tsx
git commit -m "Add hero section with typewriter rotator, telemetry banner, and metrics strip"
```

---

### Task 12: GlassTile — CSS 3D tilt + cursor-follow light

**Files:**
- Create: `components/sections/GlassTile.tsx`

**Interfaces:**
- Produces: `GlassTile({ children, className })` component, consumed by `SpatialBento` in Task 14 — wraps each module's content in a tilting glass-look card.

- [ ] **Step 1: Write `components/sections/GlassTile.tsx`**

```tsx
"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

export function GlassTile({ children, className = "" }: { children: ReactNode; className?: string }) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  const lightBackground = useTransform([mouseX, mouseY], (values) => {
    const [xv, yv] = values as number[];
    return `radial-gradient(circle at ${xv * 100}% ${yv * 100}%, rgba(34,211,238,0.18), transparent 60%)`;
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: lightBackground }}
      />
      <div className="relative z-10 p-5">{children}</div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `components/sections/GlassTile.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/sections/GlassTile.tsx
git commit -m "Add glass tile with CSS 3D tilt and cursor-follow light"
```

---

### Task 13: Diff viewer component

**Files:**
- Create: `components/sections/DiffViewer.tsx`

**Interfaces:**
- Consumes: `DiffLine` type from `lib/content.ts` (Task 2).
- Produces: `DiffViewer({ title, lines })` component, consumed by `SpatialBento`'s security module in Task 14.

- [ ] **Step 1: Write `components/sections/DiffViewer.tsx`**

```tsx
import type { DiffLine } from "@/lib/content";

export function DiffViewer({ title, lines }: { title: string; lines: DiffLine[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-white/10 bg-black/50 font-mono text-xs">
      <div className="border-b border-white/10 px-3 py-1.5 text-white/40">{title}</div>
      <pre className="p-3 leading-relaxed">
        {lines.map((line, i) => {
          const prefix = line.type === "add" ? "+" : line.type === "remove" ? "-" : " ";
          const color =
            line.type === "add"
              ? "text-emerald-400 bg-emerald-500/10"
              : line.type === "remove"
              ? "text-red-400 bg-red-500/10"
              : "text-white/60";
          return (
            <div key={i} className={`block px-2 ${color}`}>
              <span className="select-none text-white/30">{prefix} </span>
              {line.text}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `components/sections/DiffViewer.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/sections/DiffViewer.tsx
git commit -m "Add diff viewer component for the security module"
```

---

### Task 14: Spatial bento gallery (4 modules)

**Files:**
- Create: `components/sections/SpatialBento.tsx`

**Interfaces:**
- Consumes: `GlassTile` (Task 12), `DiffViewer` (Task 13), `claimsApiModule`, `microfrontendModule`, `securityModule`, `habitflowModule` and their types from `lib/content.ts` (Task 2).
- Produces: `SpatialBento` component, consumed by `app/page.tsx` in Task 17. This is the sole case-study/projects section — there is no separate Projects component.

- [ ] **Step 1: Write `components/sections/SpatialBento.tsx`**

```tsx
"use client";

import { useState } from "react";
import {
  claimsApiModule,
  microfrontendModule,
  securityModule,
  habitflowModule,
  type ClaimsApiModule,
  type MicrofrontendModule,
  type SecurityModule,
  type HabitflowModule,
} from "@/lib/content";
import { GlassTile } from "./GlassTile";
import { DiffViewer } from "./DiffViewer";

function ClaimsApiTile({ module }: { module: ClaimsApiModule }) {
  return (
    <>
      <h3 className="text-lg font-semibold text-white">{module.title}</h3>
      <p className="mt-1 text-sm text-white/50">{module.tagline}</p>

      <div className="mt-4 space-y-1.5">
        {module.configHierarchy.map((level, i) => (
          <div key={level.scope} className="flex items-center gap-2 text-xs">
            <span className="font-mono text-cyan-300/70">{i + 1}</span>
            <span className="font-mono text-white/70">{level.scope}</span>
            <span className="text-white/40">→ {level.description}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1 rounded-md border border-white/10 bg-black/40 p-3 font-mono text-xs text-white/50">
        {module.shardingSteps.map((step, i) => (
          <div key={i}>
            #{i + 1} {step}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 font-mono text-xs text-emerald-300/90">
        <span className="rounded-full border border-emerald-400/30 px-2.5 py-1">
          {module.jmeter.samples.toLocaleString()} samples
        </span>
        <span className="rounded-full border border-emerald-400/30 px-2.5 py-1">
          {module.jmeter.errorRate} errors
        </span>
        <span className="rounded-full border border-emerald-400/30 px-2.5 py-1">
          p95 {module.jmeter.p95} · p99 {module.jmeter.p99}
        </span>
      </div>
    </>
  );
}

function MicrofrontendTile({ module }: { module: MicrofrontendModule }) {
  const [localeIndex, setLocaleIndex] = useState(0);
  const [method, setMethod] = useState<"directDeposit" | "checkByMail">("directDeposit");
  const locale = module.locales[localeIndex];

  return (
    <>
      <h3 className="text-lg font-semibold text-white">{module.title}</h3>
      <p className="mt-1 text-sm text-white/50">{module.tagline}</p>

      <select
        value={localeIndex}
        onChange={(e) => setLocaleIndex(Number(e.target.value))}
        className="mt-4 w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 font-mono text-xs text-white/70"
      >
        {module.locales.map((l, i) => (
          <option key={l.code} value={i}>
            {l.code} — {l.label}
          </option>
        ))}
      </select>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setMethod("directDeposit")}
          className={`flex-1 rounded-md border px-3 py-2 text-sm ${
            method === "directDeposit" ? "border-cyan-400/60 text-cyan-300" : "border-white/10 text-white/50"
          }`}
        >
          {locale.directDeposit}
        </button>
        <button
          onClick={() => setMethod("checkByMail")}
          className={`flex-1 rounded-md border px-3 py-2 text-sm ${
            method === "checkByMail" ? "border-cyan-400/60 text-cyan-300" : "border-white/10 text-white/50"
          }`}
        >
          {locale.checkByMail}
        </button>
      </div>

      <button className="mt-3 w-full rounded-md bg-cyan-400/90 px-3 py-2 text-sm font-medium text-black">
        {locale.continueLabel}
      </button>
    </>
  );
}

function SecurityTile({ module }: { module: SecurityModule }) {
  return (
    <>
      <h3 className="text-lg font-semibold text-white">{module.title}</h3>
      <p className="mt-1 text-sm text-white/50">{module.tagline}</p>
      <div className="mt-4">
        <DiffViewer title={module.diffTitle} lines={module.diff} />
      </div>
    </>
  );
}

function HabitflowTile({ module }: { module: HabitflowModule }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{module.title}</h3>
          <p className="mt-1 text-sm text-white/50">{module.tagline}</p>
        </div>
        <span className="shrink-0 rounded-full border border-emerald-400/30 px-2.5 py-1 font-mono text-[11px] text-emerald-300">
          LIVE
        </span>
      </div>
      <p className="mt-3 text-sm text-white/70">{module.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {module.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-white/50"
          >
            {tech}
          </span>
        ))}
      </div>
      <a
        href={module.url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block rounded-md bg-cyan-400/90 px-4 py-2 text-sm font-medium text-black"
      >
        Launch tryhabitflow.com →
      </a>
    </>
  );
}

export function SpatialBento() {
  return (
    <section id="case-studies" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">
        Engineering Deep-Dives
      </h2>
      <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
        Production systems, from the WEX Health claims platform
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-6">
        <GlassTile className="md:col-span-4">
          <ClaimsApiTile module={claimsApiModule} />
        </GlassTile>
        <GlassTile className="md:col-span-2">
          <MicrofrontendTile module={microfrontendModule} />
        </GlassTile>
        <GlassTile className="md:col-span-3">
          <SecurityTile module={securityModule} />
        </GlassTile>
        <GlassTile className="md:col-span-3">
          <HabitflowTile module={habitflowModule} />
        </GlassTile>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `components/sections/SpatialBento.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/sections/SpatialBento.tsx
git commit -m "Add 4-module spatial bento gallery replacing case-study cards and Projects section"
```

---

### Task 15: Skills section

**Files:**
- Create: `components/sections/Skills.tsx`

**Interfaces:**
- Consumes: `skillGroups: SkillGroup[]` from `lib/content.ts` (Task 2).
- Produces: `Skills` component, consumed by `app/page.tsx` in Task 17.

- [ ] **Step 1: Write `components/sections/Skills.tsx`**

```tsx
import { skillGroups } from "@/lib/content";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">
        Technical Skills
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <div key={group.category} className="rounded-lg border border-white/10 bg-black/30 p-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/50">
              {group.category}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `components/sections/Skills.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Skills.tsx
git commit -m "Add technical skills section"
```

---

### Task 16: GitHub fetch helper, live GitHub card, and terminal contact section

**Files:**
- Create: `lib/github.ts`
- Create: `components/sections/GithubCard.tsx`
- Create: `components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `contact: ContactInfo` from `lib/content.ts` (Task 2).
- Produces: `Contact` component, consumed by `app/page.tsx` in Task 17. `lib/github.ts` exports `fetchGithubProfile(username)` and `fetchGithubRepos(username, limit)`, each throwing on non-OK responses so `GithubCard` can catch and fall back.

- [ ] **Step 1: Write `lib/github.ts`**

```typescript
export interface GithubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  publicRepos: number;
  followers: number;
  htmlUrl: string;
}

export interface GithubRepo {
  name: string;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stargazersCount: number;
  updatedAt: string;
}

export async function fetchGithubProfile(username: string): Promise<GithubProfile> {
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (!res.ok) throw new Error(`GitHub profile fetch failed: ${res.status}`);
  const data = await res.json();
  return {
    login: data.login,
    name: data.name,
    bio: data.bio,
    publicRepos: data.public_repos,
    followers: data.followers,
    htmlUrl: data.html_url,
  };
}

export async function fetchGithubRepos(username: string, limit = 4): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`
  );
  if (!res.ok) throw new Error(`GitHub repos fetch failed: ${res.status}`);
  const data: unknown[] = await res.json();
  return (data as Record<string, unknown>[]).map((r) => ({
    name: r.name as string,
    htmlUrl: r.html_url as string,
    description: (r.description as string | null) ?? null,
    language: (r.language as string | null) ?? null,
    stargazersCount: r.stargazers_count as number,
    updatedAt: r.updated_at as string,
  }));
}
```

- [ ] **Step 2: Write `components/sections/GithubCard.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { fetchGithubProfile, fetchGithubRepos, type GithubProfile, type GithubRepo } from "@/lib/github";
import { contact } from "@/lib/content";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "loaded"; profile: GithubProfile; repos: GithubRepo[] };

export function GithubCard() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [profile, repos] = await Promise.all([
          fetchGithubProfile(contact.githubUser),
          fetchGithubRepos(contact.githubUser, 4),
        ]);
        if (!cancelled) setState({ status: "loaded", profile, repos });
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="rounded-lg border border-white/10 bg-black/40 p-4 font-mono text-xs text-white/40">
        fetching github://{contact.githubUser} ...
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-lg border border-white/10 bg-black/40 p-4 font-mono text-xs text-white/50">
        github api unavailable —{" "}
        <a href={contact.githubUrl} target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">
          view on GitHub →
        </a>
      </div>
    );
  }

  const { profile, repos } = state;

  return (
    <div className="rounded-lg border border-white/10 bg-black/40 p-4 font-mono text-xs">
      <div className="flex items-center justify-between text-white/50">
        <span>github://{profile.login}</span>
        <span>
          {profile.publicRepos} repos · {profile.followers} followers
        </span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {repos.map((repo) => (
          <li key={repo.name} className="flex items-center justify-between gap-2 text-white/70">
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="truncate hover:text-cyan-300 hover:underline"
            >
              {repo.name}
            </a>
            <span className="shrink-0 text-white/30">{repo.language ?? "—"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Write `components/sections/Contact.tsx`**

```tsx
"use client";

import { useState } from "react";
import { contact } from "@/lib/content";
import { GithubCard } from "./GithubCard";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — no-op, the email is still visible as text
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-24">
      <div className="rounded-xl border border-white/10 bg-black/50 p-6 font-mono text-sm">
        <div className="flex items-center gap-2 text-white/30">
          <span className="h-3 w-3 rounded-full bg-red-500/60" />
          <span className="h-3 w-3 rounded-full bg-amber-500/60" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
          <span className="ml-2">contact.sh</span>
        </div>

        <div className="mt-4 text-white/70">
          <span className="text-cyan-300">$</span> contact --email
        </div>
        <button
          onClick={handleCopy}
          className="mt-2 flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-white/80 transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
        >
          {contact.email}
          <span className="text-xs text-white/40">{copied ? "copied" : "click to copy"}</span>
        </button>

        <div className="mt-6 text-white/70">
          <span className="text-cyan-300">$</span> contact --github
        </div>
        <div className="mt-2">
          <GithubCard />
        </div>

        <div className="mt-6 flex items-center gap-1 text-white/50">
          <span className="text-cyan-300">$</span>
          <span className="inline-block h-4 w-2 animate-pulse bg-cyan-300/70" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing any of the three new files. Full copy-button and live-data verification happens in Task 17.

- [ ] **Step 5: Commit**

```bash
git add lib/github.ts components/sections/GithubCard.tsx components/sections/Contact.tsx
git commit -m "Add live GitHub card and terminal contact section"
```

---

### Task 17: Assemble root layout and page, final browser verification

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `SimulationModeProvider` (Task 3), `Header` (Task 9), `Hero` (Task 11), `SpatialBento` (Task 14), `Skills` (Task 15), `Contact` (Task 16).
- Produces: the fully assembled site at `/`.

- [ ] **Step 1: Write `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SimulationModeProvider } from "@/components/simulation/SimulationModeProvider";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Arun Kumar Kulkarni — Senior Software Engineer",
  description:
    "Interactive developer portfolio for Arun Kumar Kulkarni — backend & full-stack engineer, .NET / React / API engineering / cloud.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`}>
      <body className="bg-[#05050a] font-sans text-white antialiased">
        <SimulationModeProvider>{children}</SimulationModeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Write `app/page.tsx`**

```tsx
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { SpatialBento } from "@/components/sections/SpatialBento";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SpatialBento />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Update `app/globals.css`**

Replace its contents with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-mono: var(--font-mono, ui-monospace, monospace);
  --font-sans: var(--font-sans, ui-sans-serif, sans-serif);
}

body {
  font-family: var(--font-sans);
}

.font-mono {
  font-family: var(--font-mono);
}
```

- [ ] **Step 4: Verify the production build succeeds**

```bash
npx tsc --noEmit
npm run build
```

Expected: both succeed with no errors or warnings about the new files.

- [ ] **Step 5: Start the dev server and verify in a real browser**

```bash
npm run dev
```

Open `http://localhost:3000` in a browser and verify, per the spec's Testing section and the amendment:
- Hero renders with the particle field and the throughput ribbon both visible behind the headline
- The base headline text is fixed, and the rotating phrase types and deletes in a loop with a pulsing cyan caret, without shifting any surrounding layout (badges/metrics stay put) as phrase length changes
- Moving the mouse over the hero visibly perturbs nearby particles and ripples the ribbon
- Clicking "600 RPM STRESS TEST" in the header speeds up particle motion and ribbon wave velocity, increases turbulence and bloom, shifts color toward amber, and reveals the `[SIMULATING CONCURRENCY: ...]` telemetry line; clicking back to "NORMAL OPERATION" reverses all of it
- All 4 bento modules render with 3D tilt following the cursor and a cursor-tracked highlight: Claims Web API shows the 5-level hierarchy, sharding steps, and JMeter badge; the Micro-Frontend module's locale dropdown switches all 11 locales and the direct-deposit/check-by-mail toggle updates; the Security module's diff renders colored +/- lines; the HabitFlow module's launch link opens tryhabitflow.com
- The Skills section renders all 9 category groups
- The contact email copy button copies `arunkulkarni2000@gmail.com` to the clipboard and shows "copied"
- The GitHub card loads live data for `arunkumar-dot` (or shows the graceful fallback link if the API call fails)

Stop the dev server once verified.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/page.tsx app/globals.css
git commit -m "Assemble portfolio page with hero rotator, WebGL ribbon, and spatial bento gallery"
```
