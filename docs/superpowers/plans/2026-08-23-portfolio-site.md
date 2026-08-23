# Interactive Developer Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page interactive developer portfolio (Next.js 15 + React 19 + TypeScript + Tailwind + @react-three/fiber) with a custom GLSL curl-noise GPU particle field, a Normal/600-RPM simulation toggle, 5 bento-grid case-study cards with diff tabs, and a terminal contact section with live GitHub data.

**Architecture:** A `SimulationModeProvider` React context holds the single `intensity` value (0→1) that drives the particle shader uniforms, bloom strength, and UI accent color together. All resume content lives in a typed `lib/content.ts` data module — no CMS, no placeholders. The only runtime network call is a client-side GitHub REST API fetch in the contact section, with a static fallback.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, @react-three/fiber, @react-three/drei, @react-three/postprocessing, framer-motion.

**Spec:** [docs/superpowers/specs/2026-08-23-portfolio-site-design.md](../specs/2026-08-23-portfolio-site-design.md)

## Global Constraints

- Real, runnable project — verified via `npm run dev` in an actual browser, not just type-checked.
- No placeholder/lorem-ipsum copy anywhere — all content comes from the resume or the GitHub API.
- No unit test framework (spec explicitly puts this out of scope) — each task is verified by build success + direct browser/visual check instead of automated tests.
- Particle count adaptive: ~25k desktop, ~8k mobile/`prefers-reduced-motion`; reduced-motion also disables curl-noise turbulence.
- WebGL-unavailable and GitHub-API-failure paths must degrade gracefully, never blank the page.
- GitHub handle: `arunkumar-dot`. Contact email: `arunkulkarni2000@gmail.com`.
- Case studies (5, in this order, all WEX Health/industry work, ranked above the Projects section): XSS remediation filter, EF Core DbContext concurrency fix, five-level config resolution, JMeter load test/SLA regression, multi-tenant isolation & typed-exception handling.

---

## File Structure

```
app/
  layout.tsx              — root layout, metadata, font, imports globals.css
  page.tsx                 — assembles all sections
  globals.css               — Tailwind directives + base terminal/console theme
lib/
  content.ts                — typed resume content: metrics, case studies (incl. diff lines), skills, projects, contact
  github.ts                  — client-side GitHub REST API fetch helper
  useReducedMotion.ts         — hook wrapping prefers-reduced-motion media query
components/
  simulation/
    SimulationModeProvider.tsx — context: mode, intensity (animated)
    SimulationToggle.tsx        — header segmented toggle UI
  three/
    shaders.ts                  — exported GLSL strings: curl noise, vertex, fragment
    ParticleField.tsx            — R3F points mesh, uniforms, mouse interaction
    Scene.tsx                     — Canvas wrapper, Bloom postprocessing, WebGL fallback
  layout/
    Header.tsx                    — fixed nav + SimulationToggle
  sections/
    Hero.tsx                       — Scene + headline + MetricsStrip
    MetricsStrip.tsx                — animated count-up metrics
    DiffViewer.tsx                   — generic before/after colored-line renderer
    CaseStudyCard.tsx                 — single bento card w/ Problem/Diff/Result tabs
    CaseStudyBento.tsx                 — bento grid of 5 CaseStudyCards
    Projects.tsx                        — HabitFlow project section
    Skills.tsx                           — grouped skill tag grid
    GithubCard.tsx                        — live GitHub profile/repo card
    Contact.tsx                            — terminal panel, copy button, GithubCard
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
- Produces: `metrics: Metric[]`, `caseStudies: CaseStudy[]`, `skillGroups: SkillGroup[]`, `project: ProjectInfo`, `contact: ContactInfo` — all typed exports consumed by later section components.

Diff snippets below are illustrative reconstructions written for portfolio presentation (the underlying employer codebase is proprietary and not reproduced) — they represent the described technical work, not literal copied source. A one-line comment at the top of the file states this.

- [ ] **Step 1: Write `lib/content.ts`**

```typescript
// Diff snippets are illustrative reconstructions of the described work,
// written for this portfolio — not reproductions of proprietary source.

export interface Metric {
  label: string;
  value: string;
}

export interface DiffLine {
  type: "add" | "remove" | "context";
  text: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  diffTitle: string;
  diff: DiffLine[];
  result: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ProjectInfo {
  name: string;
  description: string;
  url: string;
  stack: string[];
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

export const caseStudies: CaseStudy[] = [
  {
    id: "xss-remediation",
    title: "XSS Remediation Filter",
    tagline: "Critical pen-test finding, fixed across four legacy services",
    problem:
      "A third-party penetration test flagged a critical cross-site scripting finding spanning four legacy services, each serializing API responses independently with no centralized output encoding.",
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
    result:
      "Built a custom JSON serialization layer with HTML escaping, a response-capture filter, and pipeline hooks, consolidated into one shared library across all four services, shipped behind a feature flag for staged rollout and instant rollback.",
  },
  {
    id: "ef-core-concurrency",
    title: "EF Core Concurrency Fix",
    tagline: "Diagnosed DbContext thread-safety failures under parallel execution",
    problem:
      "Parallel eligibility checks sharing a single EF Core DbContext caused intermittent, hard-to-reproduce query corruption under load.",
    diffTitle: "Data access path",
    diff: [
      { type: "context", text: "var results = await Task.WhenAll(" },
      { type: "remove", text: "    _repo.GetPlanAsync(planId, ctx)," },
      { type: "remove", text: "    _repo.GetElectionsAsync(planId, ctx)" },
      { type: "remove", text: ");" },
      { type: "add", text: "    _repo.GetPlanAsync(planId)," },
      { type: "add", text: "    _repo.GetElectionsAsync(planId)" },
      { type: "add", text: ");" },
      { type: "add", text: "// each repository call now resolves its own scoped DbContext" },
      { type: "add", text: "// and reads are sequenced within that scope, not shared across Task.WhenAll" },
    ],
    result:
      "Restructured the data-access path so reads sequence safely per scope instead of sharing a DbContext across concurrent tasks, eliminating the race entirely.",
  },
  {
    id: "five-level-config",
    title: "Five-Level Config Resolution",
    tagline: "Per-setting merge semantics with legacy behavioral parity",
    problem:
      "Eligibility settings needed to resolve across five scopes — plan, employer, administrator, custodian, and global default — with per-setting merge semantics matching a legacy implementation bit-for-bit.",
    diffTitle: "Settings resolution",
    diff: [
      { type: "remove", text: "var value = planSettings.TryGetValue(key, out var v)" },
      { type: "remove", text: "    ? v" },
      { type: "remove", text: "    : GlobalDefaults[key];" },
      { type: "add", text: "var scopes = new[] { plan, employer, administrator, custodian, global };" },
      { type: "add", text: "var value = scopes" },
      { type: "add", text: "    .Select(s => s.Resolve(key))" },
      { type: "add", text: "    .FirstOrDefault(r => r.IsSet)" },
      { type: "add", text: "    ?? Setting.Default(key);" },
    ],
    result:
      "Achieved behavioral parity with the legacy implementation, and scoped 4 of 7 eligibility checks out of the migration after establishing they were business-data reads that would have broken the service's bounded context.",
  },
  {
    id: "jmeter-load-test",
    title: "JMeter Load Test / SLA Regression",
    tagline: "75 concurrent users, 600 RPM, root-caused to sequential iteration",
    problem:
      "A JMeter run at 75 concurrent users and 600 requests per minute measured p95 of 3.3s and p99 of 4.2s across 4,061 samples — 64% above the 2s QA SLA, though at 0% errors.",
    diffTitle: "Per-plan eligibility loop",
    diff: [
      { type: "remove", text: "foreach (var plan in plans)" },
      { type: "remove", text: "{" },
      { type: "remove", text: "    var eligibility = await CheckEligibilityAsync(plan);" },
      { type: "remove", text: "    results.Add(eligibility);" },
      { type: "remove", text: "}" },
      { type: "add", text: "var eligibilityTasks = plans.Select(CheckEligibilityAsync);" },
      { type: "add", text: "var results = await Task.WhenAll(eligibilityTasks);" },
      { type: "add", text: "// documented as the parallelisation path; caller-side batching shipped as an interim stopgap" },
    ],
    result:
      "Root-caused the regression to sequential per-plan iteration and documented both a parallelisation path and a caller-side stopgap.",
  },
  {
    id: "multi-tenant-isolation",
    title: "Multi-Tenant Isolation & Typed Exceptions",
    tagline: "Tenant-scoped queries with graceful per-plan degradation",
    problem:
      "Shared query paths risked cross-tenant data exposure, and a single missing upstream record for one plan could fail the entire response for a participant with multiple plans.",
    diffTitle: "Tenant scoping & error handling",
    diff: [
      { type: "remove", text: "var plans = await _db.Plans.ToListAsync();" },
      { type: "add", text: "var plans = await _db.Plans" },
      { type: "add", text: "    .Where(p => p.TenantId == _tenantContext.TenantId)" },
      { type: "add", text: "    .ToListAsync();" },
      { type: "context", text: "" },
      { type: "remove", text: "var upstream = await _upstream.GetRecordAsync(plan.Id);" },
      { type: "add", text: "try {" },
      { type: "add", text: "    var upstream = await _upstream.GetRecordAsync(plan.Id);" },
      { type: "add", text: "} catch (UpstreamRecordNotFoundException) {" },
      { type: "add", text: "    plan.MarkDegraded(); // only this plan is affected, not the whole response" },
      { type: "add", text: "}" },
    ],
    result:
      "Strengthened multi-tenant query scoping with regression tests covering tenant-isolation boundaries; a missing upstream record now degrades only the affected plan instead of failing the entire response.",
  },
];

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

export const project: ProjectInfo = {
  name: "HabitFlow",
  description:
    "Full-stack SaaS habit tracker built and deployed end to end — streak tracking, progress analytics, and real-time notifications, live on a custom domain with real users.",
  url: "https://tryhabitflow.com",
  stack: ["Next.js", "Convex", "Clerk", "Firebase", "Cloudflare", "Vercel"],
};

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
- Produces: `SimulationModeProvider` (wraps `app/layout.tsx` children), `useSimulationMode(): { mode: "normal" | "stress"; intensity: number; setMode(mode): void }`, `useReducedMotion(): boolean`. Later tasks (`SimulationToggle`, `ParticleField`, `Scene`) consume `useSimulationMode`; `ParticleField` consumes `useReducedMotion`.

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
- Produces: exported string constants `VERTEX_SHADER`, `FRAGMENT_SHADER`, consumed by `ParticleField` (Task 5) as `<shaderMaterial vertexShader={VERTEX_SHADER} fragmentShader={FRAGMENT_SHADER} .../>`. Vertex shader expects uniforms `uTime: float`, `uIntensity: float` (0..1), `uMouse: vec2` (NDC-ish), `uMouseActive: float`, and an `aSeed: float` per-vertex attribute.

- [ ] **Step 1: Write `components/three/shaders.ts`**

```typescript
// 3D simplex noise: Ian McEwan, Ashima Arts (MIT License), standard webgl-noise implementation.
const NOISE_GLSL = `
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

Expected: no errors referencing `components/three/shaders.ts` (this file only exports strings — GLSL syntax itself is validated visually once `ParticleField` renders in Task 5).

- [ ] **Step 3: Commit**

```bash
git add components/three/shaders.ts
git commit -m "Add curl-noise GPU particle shaders"
```

---

### Task 5: ParticleField component (GPU points + mouse interaction)

**Files:**
- Create: `components/three/ParticleField.tsx`

**Interfaces:**
- Consumes: `useSimulationMode()` from Task 3 (`intensity: number`), `useReducedMotion()` from Task 3, `VERTEX_SHADER`/`FRAGMENT_SHADER` from Task 4.
- Produces: `ParticleField` component, a `<points>` mesh meant to be rendered inside an `@react-three/fiber` `<Canvas>` — consumed by `Scene` in Task 6.

- [ ] **Step 1: Write `components/three/ParticleField.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "./shaders";
import { useSimulationMode } from "../simulation/SimulationModeProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function ParticleField() {
  const { intensity } = useSimulationMode();
  const reducedMotion = useReducedMotion();
  const { gl } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const pointerActive = useRef(0);
  const targetActive = useRef(0);

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

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;

    if (!reducedMotion) {
      u.uTime.value = state.clock.getElapsedTime();
    }
    u.uIntensity.value = intensity;
    u.uMouse.value.copy(pointer.current);
    pointerActive.current = THREE.MathUtils.lerp(pointerActive.current, targetActive.current, delta * 4);
    u.uMouseActive.value = pointerActive.current;
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

Expected: no errors referencing `components/three/ParticleField.tsx`. Full visual/behavioral verification happens in Task 6 once it's mounted inside a `Canvas`.

- [ ] **Step 3: Commit**

```bash
git add components/three/ParticleField.tsx
git commit -m "Add GPU particle field with curl-noise motion and mouse interaction"
```

---

### Task 6: Scene wrapper — Canvas, bloom postprocessing, WebGL fallback

**Files:**
- Create: `components/three/Scene.tsx`

**Interfaces:**
- Consumes: `ParticleField` (Task 5), `useSimulationMode()` (Task 3).
- Produces: `Scene` component — an absolutely-positioned full-bleed background, consumed by `Hero` in Task 8.

- [ ] **Step 1: Write `components/three/Scene.tsx`**

```tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { ParticleField } from "./ParticleField";
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
git commit -m "Add Scene wrapper with bloom postprocessing and WebGL fallback"
```

---

### Task 7: Header and simulation toggle UI

**Files:**
- Create: `components/simulation/SimulationToggle.tsx`
- Create: `components/layout/Header.tsx`

**Interfaces:**
- Consumes: `useSimulationMode()` (Task 3).
- Produces: `Header` component, consumed by `app/page.tsx` in Task 14.

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

Expected: no errors referencing either new file. Full visual/click verification happens in Task 14 once wired into `page.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/simulation/SimulationToggle.tsx components/layout/Header.tsx
git commit -m "Add header with normal/stress-test simulation toggle"
```

---

### Task 8: Hero section with animated metrics strip

**Files:**
- Create: `components/sections/MetricsStrip.tsx`
- Create: `components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `Scene` (Task 6), `metrics: Metric[]` from `lib/content.ts` (Task 2).
- Produces: `Hero` component, consumed by `app/page.tsx` in Task 14.

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
import { Scene } from "../three/Scene";
import { MetricsStrip } from "./MetricsStrip";
import { metrics } from "@/lib/content";

export function Hero() {
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
        <p className="mt-4 text-base text-white/60 sm:text-lg">
          .NET · React · API Engineering · Cloud — shipping production systems
          for a health, benefits, and claims platform.
        </p>
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

Expected: no errors referencing either new file. Full visual verification happens in Task 14.

- [ ] **Step 4: Commit**

```bash
git add components/sections/MetricsStrip.tsx components/sections/Hero.tsx
git commit -m "Add hero section with animated metrics strip"
```

---

### Task 9: Diff viewer component

**Files:**
- Create: `components/sections/DiffViewer.tsx`

**Interfaces:**
- Consumes: `DiffLine` type from `lib/content.ts` (Task 2).
- Produces: `DiffViewer({ title, lines })` component, consumed by `CaseStudyCard` in Task 10.

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
git commit -m "Add diff viewer component for case study code tabs"
```

---

### Task 10: Case study cards and bento grid

**Files:**
- Create: `components/sections/CaseStudyCard.tsx`
- Create: `components/sections/CaseStudyBento.tsx`

**Interfaces:**
- Consumes: `DiffViewer` (Task 9), `CaseStudy` type + `caseStudies: CaseStudy[]` from `lib/content.ts` (Task 2).
- Produces: `CaseStudyBento` component, consumed by `app/page.tsx` in Task 14.

- [ ] **Step 1: Write `components/sections/CaseStudyCard.tsx`**

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CaseStudy } from "@/lib/content";
import { DiffViewer } from "./DiffViewer";

const TABS = ["Problem", "Diff", "Result"] as const;
type Tab = (typeof TABS)[number];

export function CaseStudyCard({ study, className = "" }: { study: CaseStudy; className?: string }) {
  const [tab, setTab] = useState<Tab>("Problem");

  return (
    <div className={`flex flex-col rounded-xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm ${className}`}>
      <h3 className="text-lg font-semibold text-white">{study.title}</h3>
      <p className="mt-1 text-sm text-white/50">{study.tagline}</p>

      <div className="mt-4 flex gap-1 border-b border-white/10 font-mono text-xs uppercase tracking-wider">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 transition-colors ${
              tab === t ? "border-b-2 border-cyan-400 text-cyan-300" : "text-white/40 hover:text-white/70"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-[9rem] flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "Problem" && <p className="text-sm text-white/70">{study.problem}</p>}
            {tab === "Diff" && <DiffViewer title={study.diffTitle} lines={study.diff} />}
            {tab === "Result" && <p className="text-sm text-white/70">{study.result}</p>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `components/sections/CaseStudyBento.tsx`**

```tsx
import { caseStudies } from "@/lib/content";
import { CaseStudyCard } from "./CaseStudyCard";

export function CaseStudyBento() {
  return (
    <section id="case-studies" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">
        Case Studies
      </h2>
      <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
        Production fixes, from the WEX Health claims platform
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-6">
        <CaseStudyCard study={caseStudies[0]} className="md:col-span-4" />
        <CaseStudyCard study={caseStudies[1]} className="md:col-span-2" />
        <CaseStudyCard study={caseStudies[2]} className="md:col-span-2" />
        <CaseStudyCard study={caseStudies[3]} className="md:col-span-4" />
        <CaseStudyCard study={caseStudies[4]} className="md:col-span-6" />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing either new file. Full tab-click verification happens in Task 14.

- [ ] **Step 4: Commit**

```bash
git add components/sections/CaseStudyCard.tsx components/sections/CaseStudyBento.tsx
git commit -m "Add case study bento grid with Problem/Diff/Result tabs"
```

---

### Task 11: Projects section (HabitFlow)

**Files:**
- Create: `components/sections/Projects.tsx`

**Interfaces:**
- Consumes: `project: ProjectInfo` from `lib/content.ts` (Task 2).
- Produces: `Projects` component, consumed by `app/page.tsx` in Task 14, rendered below `CaseStudyBento` per the spec's industry-first ordering.

- [ ] **Step 1: Write `components/sections/Projects.tsx`**

```tsx
import { project } from "@/lib/content";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">
        Projects
      </h2>
      <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
        Independent work
      </p>

      <div className="mt-8 rounded-xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-wider text-cyan-300 hover:underline"
          >
            {project.url.replace("https://", "")} →
          </a>
        </div>
        <p className="mt-3 text-sm text-white/70">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-white/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `components/sections/Projects.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Projects.tsx
git commit -m "Add HabitFlow projects section"
```

---

### Task 12: Skills section

**Files:**
- Create: `components/sections/Skills.tsx`

**Interfaces:**
- Consumes: `skillGroups: SkillGroup[]` from `lib/content.ts` (Task 2).
- Produces: `Skills` component, consumed by `app/page.tsx` in Task 14.

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

### Task 13: GitHub fetch helper, live GitHub card, and terminal contact section

**Files:**
- Create: `lib/github.ts`
- Create: `components/sections/GithubCard.tsx`
- Create: `components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `contact: ContactInfo` from `lib/content.ts` (Task 2).
- Produces: `Contact` component, consumed by `app/page.tsx` in Task 14. `lib/github.ts` exports `fetchGithubProfile(username)` and `fetchGithubRepos(username, limit)`, each throwing on non-OK responses so `GithubCard` can catch and fall back.

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

Expected: no errors referencing any of the three new files. Full copy-button and live-data verification happens in Task 14.

- [ ] **Step 5: Commit**

```bash
git add lib/github.ts components/sections/GithubCard.tsx components/sections/Contact.tsx
git commit -m "Add live GitHub card and terminal contact section"
```

---

### Task 14: Assemble root layout and page, final browser verification

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `SimulationModeProvider` (Task 3), `Header` (Task 7), `Hero` (Task 8), `CaseStudyBento` (Task 10), `Projects` (Task 11), `Skills` (Task 12), `Contact` (Task 13).
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
import { CaseStudyBento } from "@/components/sections/CaseStudyBento";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CaseStudyBento />
        <Projects />
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

Open `http://localhost:3000` in a browser and verify, per the spec's Testing section:
- Hero renders with the particle field visible behind the headline and metrics strip (4+ yrs, 0%, 11 locales count up on load)
- Moving the mouse over the hero visibly perturbs nearby particles
- Clicking "600 RPM STRESS TEST" in the header speeds up particle motion, increases turbulence and bloom, and shifts particle color toward amber; clicking back to "NORMAL OPERATION" reverses it
- All 5 case-study bento cards open their Problem/Diff/Result tabs and the diff tab renders colored +/- lines
- The Projects section shows HabitFlow with a working link to tryhabitflow.com
- The Skills section renders all 9 category groups
- The contact email copy button copies `arunkulkarni2000@gmail.com` to the clipboard and shows "copied"
- The GitHub card loads live data for `arunkumar-dot` (or shows the graceful fallback link if the API call fails)

Stop the dev server once verified.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/page.tsx app/globals.css
git commit -m "Assemble portfolio page from all sections"
```
