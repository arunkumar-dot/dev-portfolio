# Interactive Developer Portfolio — Design Spec

Date: 2026-08-23
Status: Approved for implementation

## Purpose

A single-page interactive developer portfolio for Arun Kumar Kulkarni, built to
demonstrate front-end/3D craft (custom GLSL shaders, GPU particle simulation)
while surfacing real resume content — no placeholder copy. Industry
experience (WEX Health / Altimetrik work) is the primary content; the
HabitFlow side project is secondary.

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS for layout/typography
- `@react-three/fiber` + `@react-three/drei` for the 3D canvas
- `@react-three/postprocessing` for bloom
- `framer-motion` for UI transitions (header toggle, bento card tab switches,
  metric counters)
- No diff library dependency — a small custom before/after diff renderer
  (static string arrays, colored line prefixes) for the case-study code tabs

This is a real, runnable project scaffolded with `create-next-app` in the
current (empty) directory, not a code-only deliverable. Verified in a real
browser via dev server before being called done.

## Visual direction

Dark industrial diagnostics console:
- Near-black background (`#0a0a0f` range), monospace/terminal type for
  labels, metrics, and the contact section
- Cyan accent (`#22d3ee`-ish) in "Normal Operation"
- Shifts toward amber/red as the "600 RPM Stress Test" intensity ramps
- The particle field and bloom visibly "run hotter" under stress mode —
  this is the site's core visual thesis, not decoration

## Components

### `SimulationModeProvider` (React context)
Holds `mode: 'normal' | 'stress'` and a derived `intensity` value (0→1,
animated via `framer-motion`'s `useSpring` or a rAF lerp) that everything
else reads. Single source of truth so the header toggle, particle shader
uniforms, and bloom pass all stay in sync.

### `ParticleField` (`@react-three/fiber` Canvas child)
- `BufferGeometry` of points, particle count adaptive: ~25k desktop, ~8k
  mobile / `prefers-reduced-motion` (which also disables the curl-noise
  turbulence entirely, holding particles in a gentle static drift).
- Per-particle attributes: seed, base velocity.
- Custom vertex shader: inlined curl-noise GLSL (3D simplex gradient noise →
  curl via analytic partial derivatives) drives organic drift. A `uIntensity`
  uniform (fed from `SimulationModeProvider`) scales noise frequency,
  amplitude, and particle speed.
- Mouse interaction: mouse NDC position passed as a `uMouse` uniform;
  particles within a falloff radius get a displacement force computed
  per-vertex (no CPU-side raycasting per particle).
- Fragment shader: soft circular sprite via `smoothstep` on `gl_PointCoord`,
  additive blending, color `mix(cyan, amber, uIntensity)`.
- Bloom (`@react-three/postprocessing` `Bloom`) intensity also lerps with
  `uIntensity`.

### `Header`
Fixed nav: name/title on the left, segmented toggle on the right —
"NORMAL OPERATION" / "600 RPM STRESS TEST" — writing to
`SimulationModeProvider`. Framer Motion handles the toggle's slide/glow.

### `Hero`
Full-viewport `Canvas` (`ParticleField` inside) behind the headline.
Overlaid metrics strip with animated count-up numbers:
- **4+ yrs** production experience
- **0%** load-test errors @ 600 RPM
- **11** locales shipped

Sourced directly from the resume summary and JMeter bullet.

### `CaseStudyBento`
Bento grid, asymmetric cell sizing, 5 cards — all drawn from the WEX Health
role (industry work), ranked above the Projects section:

1. **XSS remediation filter** — custom JSON serialization layer with HTML
   escaping, response-capture filter, feature-flagged rollout
2. **EF Core DbContext concurrency fix** — diagnosed thread-safety failure
   under parallel execution, restructured data-access path
3. **Five-level config resolution** — per-setting merge semantics, scope
   fallback, behavioral parity with legacy
4. **JMeter load test / SLA regression** — 75 users, 600 RPM, p95 3.3s / p99
   4.2s, root-caused to sequential per-plan iteration (ties back to the
   header's "600 RPM" framing)
5. **Multi-tenant isolation & typed-exception handling** — tenant-scoping
   regression tests, graceful per-plan degradation on missing upstream data

Each card: Problem / Diff / Result tabs (Framer Motion crossfade). Diff tab
uses the custom before/after renderer — static string arrays per card,
rendered as colored (+/-) lines, monospace.

### `Projects`
Secondary section, lighter treatment than the bento grid: HabitFlow
(Next.js/Convex/Clerk/Firebase SaaS habit tracker), linking to
tryhabitflow.com and the GitHub repo.

### `Skills`
Condensed tag grid from the resume's Technical Skills block, grouped by
category (Languages, Backend, Frontend, Architecture, Testing, Security,
Databases, Cloud & Tooling).

### `Contact`
Terminal-styled panel:
- Shell-prompt aesthetic (`$ contact --email`), blinking cursor
- Click-to-copy button for `arunkulkarni2000@gmail.com`
- Live GitHub card: client-side fetch against the public GitHub REST API for
  `github.com/arunkumar-dot` (profile + recent repo activity), cached,
  degrades gracefully (static fallback) if the API call fails or is
  rate-limited

## Data flow

Resume content (metrics, case-study text/diffs, skills, contact info) lives
in typed local data modules (e.g. `lib/content.ts`), not fetched — it's
static personal data. The only runtime fetch is the GitHub API call in
`Contact`. `SimulationModeProvider`'s `intensity` value is the only piece of
cross-cutting runtime state, consumed by the particle shader uniforms and
the bloom pass.

## Error handling

- GitHub API fetch: try/catch, falls back to a static "view on GitHub" link
  if the request fails or is rate-limited — never blocks page render.
- `prefers-reduced-motion`: disables curl-noise turbulence and reduces
  particle count; the toggle and bloom shift still work but with less
  motion.
- WebGL unsupported/unavailable: `ParticleField`'s Canvas wrapped so a
  missing WebGL context doesn't blank the hero — falls back to a static
  gradient background behind the headline/metrics.

## Testing / verification

- `npm run build` and `npm run dev`; manually verify in a real browser:
  hero renders with particles, mouse interaction visibly perturbs them,
  header toggle changes speed/turbulence/bloom/color, all 5 bento cards
  open their diff tabs, contact copy button works, GitHub card loads (or
  falls back cleanly).
- No unit test framework required for a static portfolio site of this size;
  correctness is verified by direct browser interaction per the golden-path
  rule for UI work.

## Out of scope

- Deployment/hosting (Vercel, custom domain) — not requested
- CMS/backend for content — all content is static, resume-sourced
- Automated test suite — not warranted for a single-page static portfolio

---

## Amendment (2026-08-23): WebGL physics, spatial bento, hero rotator

Supersedes the Hero and Case Studies sections above. Header, metrics strip,
Skills, and Contact are unaffected.

### Hero: typewriter rotator

`HeroTextRotator` cycles a fixed base string — "I'm Arun Kumar Kulkarni, a
senior software engineer building " — through four rotating phrases
("production-grade backend APIs.", "multi-tenant cloud systems.",
"resilient micro-frontends.", "full-stack SaaS products.") via a
character-by-character type/delete loop. A `#00F5D4` caret pulses via CSS
animation. CLS prevention: an invisible copy of the longest phrase reserves
the container's box in normal layout flow; the visible animated text is
absolutely positioned on top of it, so the footprint never changes as
phrases cycle.

### Hero: ThroughputRibbon (WebGL)

`ThroughputRibbon` renders alongside the existing `ParticleField` in the
same `Canvas` (additive, not a replacement) — a high-segment-count plane
displaced by the shared curl-noise function (now exported from
`shaders.ts` as `NOISE_GLSL` for reuse) plus a mouse-centered expanding
ripple term. `uIntensity` from `SimulationModeProvider` scales wave
velocity, curl turbulence, and bloom — the same single source of truth the
particle field already uses. In stress mode, an HTML overlay (not
in-canvas text, for crispness) renders:
`[SIMULATING CONCURRENCY: 75 VIRTUAL USERS | 600 REQ/MIN | 0.00% ERRORS]`.

### Case studies → Spatial Bento Gallery

The previous 5 flat diff-tab cards and the standalone Projects section are
replaced by a 4-module spatial bento gallery. HabitFlow moves into the
gallery as its own module; the EF Core concurrency and multi-tenant
isolation content folds into the Claims Web API module's visual breakdown
rather than remaining separate cards.

Tile rendering: CSS 3D tilt + cursor-follow light, not per-card WebGL glass
(`GlassTile` — Framer Motion spring `rotateX`/`rotateY` driven by pointer
position, plus a pointer-tracked radial-gradient sheen for the glass look).
Chosen over true `MeshTransmissionMaterial` per-card WebGL because it keeps
each tile's interactive DOM content (locale dropdown, diff view) as
ordinary HTML instead of requiring a Canvas + environment map per card,
and stays responsive/light on mobile.

The four modules:

1. **Claims Web API** (Altimetrik / WEX Health) — visual breakdown of the
   five-level config merge hierarchy, the multi-tenant sharding path, and a
   JMeter badge (4,061 samples, 0% errors, p95/p99).
2. **Consumer Claims Micro-Frontend** (React 19) — interactive preview
   toggling Direct Deposit vs. Check by Mail, with an 11-locale switcher.
   The resume doesn't enumerate actual shipped locale strings, so the
   switcher's translations are a small illustrative dictionary (2-3 UI
   labels × 11 locale codes) written for this portfolio — same
   "illustrative, not literal shipped copy" treatment as the case-study
   diff snippets elsewhere in this spec.
3. **Enterprise Security** — side-by-side diff tab, legacy raw
   serialization vs. the centralized JSON serialization + HTML escaping
   filter layer (reuses the existing `DiffViewer`/`DiffLine` machinery).
4. **HabitFlow** — live product badge (Next.js, Convex, Clerk, Cloudflare)
   with a direct launch action to tryhabitflow.com.
