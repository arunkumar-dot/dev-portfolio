// ─── Project & Case Study Data Models ─────────────────────────────────────────

export interface CsMetric {
  label: string;
  value: string;
  sub?: string;
  color: string;
}

export interface CsArchStep {
  label: string;
  sub?: string;
  variant?: "primary" | "secondary" | "accent";
}

export interface CsDecision {
  heading: string;
  detail: string;
}

export interface CsDiff {
  before: string[];
  after: string[];
  legend?: string;
}

export interface CaseStudy {
  id: string;
  tileId: string;
  tag: string;
  title: string;
  subtitle: string;
  stack: string[];
  role?: string;
  recognition?: string;
  overview: {
    context: string;
    problem: string;
    solution: string;
    outcome: string;
  };
  arch: {
    title: string;
    steps: CsArchStep[];
    decisions: CsDecision[];
  };
  diff: CsDiff;
  metrics: CsMetric[];
  links?: { label: string; url: string }[];
}

// ─── Comprehensive Portfolio Data (Verified & Resume-Aligned) ────────────────

export const PROJECTS_DATA: CaseStudy[] = [
  // ── 1. RoutineIQ — Full-Stack Production App ────────────────────────────────
  {
    id: "habitflow",
    tileId: "habitflow",
    tag: "Live Production App · tryhabitflow.com",
    title: "RoutineIQ — Full-Stack App",
    subtitle:
      "Production habit-tracking app with reactive serverless database, multi-device sync, 3D visualisations & push notifications",
    stack: [
      "Next.js (App Router)",
      "TypeScript",
      "Convex (Reactive DB)",
      "Three.js",
      "Web Audio API",
      "PWA / Service Worker",
      "Clerk Auth",
      "Firebase FCM",
      "Cloudflare",
      "Vercel",
    ],
    overview: {
      context:
        "Independently designed, engineered, and launched a production web application on a custom domain (tryhabitflow.com) with active users tracking daily habits and routines.",
      problem:
        "Traditional habit trackers rely on local device storage or wasteful HTTP polling to synchronize streak states across tabs and devices, introducing stale data and unnecessary mobile battery drain.",
      solution:
        "Engineered a serverless reactive backend using Convex live query subscriptions and atomic mutations. Added Three.js 3D streak visualisations and Web Audio API feedback. Built a full PWA with offline service-worker caching. Integrated Clerk for seamless multi-device authentication and Firebase Cloud Messaging for scheduled push notification reminders. Deployed globally on Cloudflare and Vercel edge networks.",
      outcome:
        "Live production app running at tryhabitflow.com with sub-100ms real-time data sync, zero polling overhead, offline PWA capability, automated streak tracking analytics, and global edge delivery.",
    },
    arch: {
      title: "Serverless Reactive App Architecture",
      steps: [
        {
          label: "Next.js App Router",
          sub: "React Server Components + dynamic client UI",
          variant: "primary",
        },
        {
          label: "Clerk Multi-Session Auth",
          sub: "JWT validation & multi-device identity",
          variant: "secondary",
        },
        {
          label: "Convex Reactive Engine",
          sub: "Live query subscriptions & atomic mutations",
          variant: "accent",
        },
        {
          label: "Firebase Cloud Messaging",
          sub: "Background push notifications & streak reminders",
          variant: "secondary",
        },
        {
          label: "Cloudflare & Vercel Edge",
          sub: "Global edge CDN caching & low-latency routing",
          variant: "primary",
        },
      ],
      decisions: [
        {
          heading: "Convex Reactive Engine vs. REST Polling",
          detail:
            "Convex's WebTransport subscription model automatically pushes data diffs to all subscribed browser tabs on every mutation, completely eliminating periodic HTTP polling and complex socket room management.",
        },
        {
          heading: "Clerk Authentication & Session Sync",
          detail:
            "Implemented Clerk for robust JWT session issuance and multi-device revocation, allowing users to seamlessly transition between mobile browsers and desktop without losing habit tracking state.",
        },
        {
          heading: "FCM Push Notifications via Web Workers",
          detail:
            "Built a dedicated Service Worker integration for Firebase Cloud Messaging, delivering background reminder push notifications on mobile and desktop browsers without requiring native app store installations.",
        },
      ],
    },
    diff: {
      legend: "Convex live query subscription vs. traditional REST polling",
      before: [
        "// ❌ Traditional REST polling — stale data, bandwidth waste",
        "useEffect(() => {",
        "  const id = setInterval(async () => {",
        "    const res = await fetch('/api/habits');",
        "    setHabits(await res.json());",
        "  }, 5000); // 5s interval — always behind real-time",
        "  return () => clearInterval(id);",
        "}, []);",
      ],
      after: [
        "// ✅ Convex live query — real-time subscription with zero polling",
        "const habits = useQuery(api.habits.list, { userId });",
        "// Convex automatically pushes diffs over WebTransport on any mutation.",
        "// Delivers sub-100ms real-time sync across devices with zero client polling.",
      ],
    },
    metrics: [
      {
        label: "Live Sync",
        value: "Sub-100ms",
        sub: "real-time reactivity",
        color: "#00f5d4",
      },
      {
        label: "Polling Overhead",
        value: "0%",
        sub: "event-driven live queries",
        color: "#22c55e",
      },
      {
        label: "Auth Provider",
        value: "Clerk JWT",
        sub: "multi-device sessions",
        color: "#818cf8",
      },
      {
        label: "Production Status",
        value: "Live",
        sub: "tryhabitflow.com",
        color: "#f59e0b",
      },
    ],
    links: [
      { label: "Live App (tryhabitflow.com) ↗", url: "https://tryhabitflow.com" },
    ],
  },

  // ── 2. RAG Document Assistant (GitHub: rag-document-assistant) ───────────────
  {
    id: "rag-document-assistant",
    tileId: "rag-document-assistant",
    tag: "GitHub Project · github.com/arunkumar-dot/rag-document-assistant",
    title: "RAG Document Assistant",
    subtitle:
      "Document intelligence & retrieval-augmented generation engine with vector embeddings and grounded citations",
    stack: [
      "TypeScript",
      "Next.js",
      "LangChain",
      "Vector Embeddings (HNSW)",
      "LLM Synthesis",
    ],
    overview: {
      context:
        "Engineered an end-to-end Retrieval-Augmented Generation (RAG) pipeline enabling users to upload multi-format documents (PDF, DOCX, TXT), generate vector embeddings, and query information via LLMs with verifiable source citations.",
      problem:
        "Raw LLM prompts suffer from context window limits and hallucination when answering document-specific queries. Naive text splitting leads to lost cross-sentence context and fragmented chunks.",
      solution:
        "Implemented recursive character chunking with sliding overlaps (500 tokens / 50 overlap), vector similarity search over dense embeddings, and contextual prompt injection with confidence scoring.",
      outcome:
        "Reliable semantic retrieval across complex documentation, grounded answer synthesis with page-level citations, and fallback refusal on irrelevant queries.",
    },
    arch: {
      title: "RAG Ingestion & Query Synthesis Pipeline",
      steps: [
        {
          label: "Document Parser",
          sub: "Extracts text & structural metadata from PDFs/DOCX",
          variant: "secondary",
        },
        {
          label: "Recursive Semantic Chunking",
          sub: "Sliding window tokenization with context preservation",
          variant: "primary",
        },
        {
          label: "Embedding Generator",
          sub: "Dense vector creation (1536 dimensions)",
          variant: "accent",
        },
        {
          label: "Vector Database Index",
          sub: "Hierarchical Navigable Small World (HNSW) search",
          variant: "primary",
        },
        {
          label: "Contextual LLM Generator",
          sub: "Synthesizes answers with strict grounded citations",
          variant: "secondary",
        },
      ],
      decisions: [
        {
          heading: "Sliding-Window Chunking Strategy",
          detail:
            "Configured 500-token chunk windows with a 10% overlap to preserve semantic continuity across paragraph boundaries, preventing fragmented search results.",
        },
        {
          heading: "Cosine Similarity Threshold Filtering",
          detail:
            "Filtered out vector matches below confidence thresholds to prevent hallucination from irrelevant passages, returning a grounded refusal when no matching context exists.",
        },
        {
          heading: "Strict Citation Prompt Invariants",
          detail:
            "Engineered system prompts enforcing explicit citation brackets `[Page X]` and rejecting out-of-context speculation.",
        },
      ],
    },
    diff: {
      legend: "Naive full-text prompt stuffing vs. Vector RAG contextual synthesis",
      before: [
        "// ❌ Naive prompt stuffing — exceeds context limit & hallucinates",
        "async function queryDocument(docText: string, question: string) {",
        "  // Dumps raw document into prompt — token overflow on large PDFs!",
        "  const prompt = `Context: ${docText}\\n\\nQuestion: ${question}`;",
        "  return await llm.generate(prompt);",
        "}",
      ],
      after: [
        "// ✅ RAG pipeline: vector similarity search + grounded context synthesis",
        "async function queryDocumentRAG(vectorStore: VectorDB, question: string) {",
        "  const qEmbedding = await embedder.embedQuery(question);",
        "  const topChunks = await vectorStore.similaritySearch(qEmbedding, { k: 4, minScore: 0.72 });",
        "  const context = topChunks.map(c => `[P.${c.metadata.page}]: ${c.text}`).join('\\n\\n');",
        "  return await llm.generate(buildGroundedPrompt(context, question));",
        "}",
      ],
    },
    metrics: [
      {
        label: "Vector Indexing",
        value: "HNSW",
        sub: "dense vector embeddings",
        color: "#00f5d4",
      },
      {
        label: "Chunking Mode",
        value: "Recursive",
        sub: "sliding window overlap",
        color: "#22c55e",
      },
      {
        label: "Retrieval Mode",
        value: "Cosine Top-K",
        sub: "similarity filtering",
        color: "#818cf8",
      },
      {
        label: "Synthesis",
        value: "Grounded",
        sub: "page-level citations",
        color: "#f59e0b",
      },
    ],
    links: [
      {
        label: "Source Code (github.com/arunkumar-dot/rag-document-assistant) ↗",
        url: "https://github.com/arunkumar-dot/rag-document-assistant",
      },
    ],
  },

  // ── 3. Distributed Hacker News Scraper (GitHub: hn-scraper) ─────────────────
  {
    id: "hn-scraper",
    tileId: "hn-scraper",
    tag: "GitHub Project · github.com/arunkumar-dot/hn-scraper",
    title: "Distributed Hacker News Scraper",
    subtitle:
      "High-throughput distributed ingestion engine powered by Hono, BullMQ, Redis, and PostgreSQL",
    stack: [
      "TypeScript",
      "Node.js",
      "Hono",
      "BullMQ",
      "Redis",
      "PostgreSQL",
      "Prisma",
    ],
    overview: {
      context:
        "Built a resilient, distributed web scraping and ingestion service capable of streaming and indexing Hacker News items, top stories, and nested comment trees in near real-time.",
      problem:
        "Scraping deeply nested comment trees through recursive API requests quickly exhausts rate limits, starves the single-threaded Node.js event loop, and causes database connection saturation.",
      solution:
        "Engineered an asynchronous queue-driven architecture utilizing Hono for lightweight HTTP endpoints, BullMQ with Redis for job scheduling and worker pool isolation, and PostgreSQL connection pooling with batched upserts.",
      outcome:
        "Stable high-throughput multi-worker ingestion with automatic exponential backoff retries, rate-limit isolation, and resilient database connection management.",
    },
    arch: {
      title: "Distributed Queue & Ingestion Pipeline",
      steps: [
        {
          label: "Hono Ingestion Gateway",
          sub: "Lightweight edge-ready scheduler & webhook receiver",
          variant: "secondary",
        },
        {
          label: "BullMQ Job Queue",
          sub: "Redis-backed priority queues with rate-limiting",
          variant: "primary",
        },
        {
          label: "Distributed Worker Pool",
          sub: "Worker nodes executing rate-controlled batch fetches",
          variant: "accent",
        },
        {
          label: "Transformation & Deduplication",
          sub: "Validates schemas & computes item checksums",
          variant: "primary",
        },
        {
          label: "PostgreSQL Storage Layer",
          sub: "Upserts with connection pooling & transaction isolation",
          variant: "secondary",
        },
      ],
      decisions: [
        {
          heading: "Hono Framework Performance",
          detail:
            "Used Hono for sub-millisecond route handling and minimal memory footprint compared to standard Express runtimes.",
        },
        {
          heading: "BullMQ Rate Limiting & Isolation",
          detail:
            "Configured token bucket rate limiters in Redis (`limiter: { max: 50, duration: 1000 }`), preventing upstream IP throttling and rate-limit blocks.",
        },
        {
          heading: "Batched Bulk Upserts",
          detail:
            "Replaced single-record queries with `INSERT ... ON CONFLICT DO UPDATE` bulk statements to minimize database roundtrips.",
        },
      ],
    },
    diff: {
      legend: "Synchronous blocking recursive scrape vs. BullMQ distributed job queue",
      before: [
        "// ❌ Synchronous recursion — starves event loop and hits rate limits",
        "async function scrapeComments(commentIds: number[]) {",
        "  for (const id of commentIds) {",
        "    const item = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json());",
        "    await db.comments.create({ data: item }); // Sequential blocking write!",
        "    if (item.kids) await scrapeComments(item.kids);",
        "  }",
        "}",
      ],
      after: [
        "// ✅ BullMQ distributed job queue — rate-limited with worker concurrency",
        "async function enqueueCommentScrape(commentIds: number[]) {",
        "  const jobs = commentIds.map(id => ({",
        "    name: 'scrape-item',",
        "    data: { id },",
        "    opts: { attempts: 5, backoff: { type: 'exponential', delay: 1000 } }",
        "  }));",
        "  await scraperQueue.addBulk(jobs); // Dispatched across worker pool",
        "}",
      ],
    },
    metrics: [
      {
        label: "Queue Engine",
        value: "BullMQ",
        sub: "Redis priority queues",
        color: "#00f5d4",
      },
      {
        label: "Persistence",
        value: "PostgreSQL",
        sub: "Prisma batched upserts",
        color: "#22c55e",
      },
      {
        label: "Worker Model",
        value: "Concurrent",
        sub: "rate-controlled workers",
        color: "#f59e0b",
      },
      {
        label: "Resilience",
        value: "Exponential",
        sub: "backoff retry policy",
        color: "#818cf8",
      },
    ],
    links: [
      {
        label: "Source Code (github.com/arunkumar-dot/hn-scraper) ↗",
        url: "https://github.com/arunkumar-dot/hn-scraper",
      },
    ],
  },

  // ── 4. Distributed Ledger Engine (GitHub: distributed_ledger) ───────────────
  {
    id: "distributed-ledger",
    tileId: "distributed-ledger",
    tag: "GitHub Project · github.com/arunkumar-dot/distributed_ledger",
    title: "Distributed Ledger Engine",
    subtitle:
      "Cryptographically verifiable blockchain ledger with SHA-256 block hashing and peer gossip synchronization",
    stack: [
      "TypeScript",
      "Cryptography (SHA-256)",
      "P2P Gossip Protocol",
      "Merkle Trees",
      "Node.js",
    ],
    overview: {
      context:
        "Implemented a distributed immutable ledger exploring cryptographic chain integrity, Merkle tree transaction proofs, and peer-to-peer consensus reconciliation across distributed nodes.",
      problem:
        "Ensuring state consistency across independent nodes without centralized coordination requires tamper-evident transaction verification and deterministic consensus mechanisms.",
      solution:
        "Engineered an append-only cryptographic block structure using SHA-256 proof generation, dynamic difficulty adjustment, Merkle root verification, and peer gossip state reconciliation.",
      outcome:
        "Verified tamper-evident state verification, deterministic block validation, and peer chain reorganization.",
    },
    arch: {
      title: "Cryptographic Block & Consensus Pipeline",
      steps: [
        {
          label: "Transaction Mempool",
          sub: "Validates signatures & queues pending records",
          variant: "secondary",
        },
        {
          label: "Merkle Tree Generator",
          sub: "Computes binary hash tree root for block transactions",
          variant: "accent",
        },
        {
          label: "Proof Engine (SHA-256)",
          sub: "Deterministic hashing with difficulty target",
          variant: "primary",
        },
        {
          label: "Block Serialization & Chaining",
          sub: "Links previous hash with cryptographic immutability",
          variant: "primary",
        },
        {
          label: "P2P Gossip Synchronizer",
          sub: "Broadcasts new blocks and reconciles longest-chain fork",
          variant: "secondary",
        },
      ],
      decisions: [
        {
          heading: "Merkle Root Verification",
          detail:
            "Transaction lists are committed into a Merkle root hash, allowing O(log N) verification of transaction inclusion.",
        },
        {
          heading: "Immutable Block Validation",
          detail:
            "Every block validates `previousHash` integrity and recomputes the SHA-256 hash before accepting a peer chain broadcast.",
        },
        {
          heading: "Longest-Chain Consensus Rule",
          detail:
            "Implemented automatic chain reorganization (reorg) when a peer node broadcasts a valid longer verified chain.",
        },
      ],
    },
    diff: {
      legend: "Mutable array ledger vs. Cryptographic SHA-256 chained block verification",
      before: [
        "// ❌ Mutable array store — no tamper verification or proof-of-integrity",
        "class NaiveLedger {",
        "  private entries: any[] = [];",
        "  addEntry(data: any) {",
        "    this.entries.push({ data, timestamp: Date.now() }); // Can be mutated!",
        "  }",
        "}",
      ],
      after: [
        "// ✅ Immutable block with SHA-256 hash chaining and Merkle verification",
        "class Block {",
        "  public hash: string;",
        "  constructor(public index: number, public prevHash: string, public merkleRoot: string, public nonce: number) {",
        "    this.hash = this.calculateHash();",
        "  }",
        "  calculateHash(): string {",
        "    return crypto.createHash('sha256').update(`${this.index}${this.prevHash}${this.merkleRoot}${this.nonce}`).digest('hex');",
        "  }",
        "}",
      ],
    },
    metrics: [
      {
        label: "Cryptography",
        value: "SHA-256",
        sub: "block hash chaining",
        color: "#00f5d4",
      },
      {
        label: "Verification",
        value: "Merkle Tree",
        sub: "binary hash inclusion proofs",
        color: "#22c55e",
      },
      {
        label: "Data Model",
        value: "Append-Only",
        sub: "tamper-evident log",
        color: "#818cf8",
      },
      {
        label: "Consensus",
        value: "Longest-Chain",
        sub: "P2P fork resolution",
        color: "#f59e0b",
      },
    ],
    links: [
      {
        label: "Source Code (github.com/arunkumar-dot/distributed_ledger) ↗",
        url: "https://github.com/arunkumar-dot/distributed_ledger",
      },
    ],
  },

  // ── 5. Wallet Ledger Engine (GitHub: paytm-clone) ───────────────────────────
  {
    id: "paytm-clone",
    tileId: "paytm-clone",
    tag: "GitHub Project · github.com/arunkumar-dot/paytm-clone",
    title: "Wallet Ledger Engine (paytm-clone)",
    subtitle:
      "Atomic wallet transfers, double-entry ledger validation, and transactional isolation in PostgreSQL",
    stack: [
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "JWT Auth",
      "Tailwind CSS",
    ],
    overview: {
      context:
        "Architected a full-stack digital wallet and peer-to-peer payment service to demonstrate ACID-compliant balance transfers, concurrency control, and idempotency guarantees.",
      problem:
        "Financial transactions subject to simultaneous debit/credit requests suffer from race conditions, dirty reads, and overdraft bugs if balance updates are not isolated in database transactions.",
      solution:
        "Engineered transactional database locks (`SELECT ... FOR UPDATE` via Prisma interactive transactions), double-entry ledger bookkeeping, and client-generated idempotency keys.",
      outcome:
        "Zero balance discrepancies under concurrent simulated transfer tests and atomic state transitions in PostgreSQL.",
    },
    arch: {
      title: "Transactional Wallet Transfer Pipeline",
      steps: [
        {
          label: "API Gateway & JWT Auth",
          sub: "Validates user session & token payload",
          variant: "secondary",
        },
        {
          label: "Idempotency Filter",
          sub: "Deduplicates network retry submissions",
          variant: "accent",
        },
        {
          label: "Interactive DB Transaction",
          sub: "Locks sender & receiver balances atomically",
          variant: "primary",
        },
        {
          label: "Double-Entry Ledger Log",
          sub: "Records simultaneous debit & credit audit trails",
          variant: "primary",
        },
        {
          label: "Notification Dispatcher",
          sub: "Emits real-time balance update events",
          variant: "secondary",
        },
      ],
      decisions: [
        {
          heading: "Pessimistic Locking for Balance Updates",
          detail:
            "Acquired exclusive database row locks on wallet records during transfers to eliminate race condition overdrafts.",
        },
        {
          heading: "Double-Entry Bookkeeping",
          detail:
            "Every transfer generates balanced debit and credit entries in the ledger table, guaranteeing audit trail reconciliation.",
        },
        {
          heading: "Idempotency Key Enforcement",
          detail:
            "Ensured network retries and duplicate submissions never result in duplicate debit transactions.",
        },
      ],
    },
    diff: {
      legend: "Non-transactional balance update vs. Atomic interactive transaction with row locking",
      before: [
        "// ❌ Non-atomic balance updates — vulnerable to race conditions & overdrafts",
        "async function transferMoney(fromId: string, toId: string, amount: number) {",
        "  const fromWallet = await db.wallet.findUnique({ where: { userId: fromId } });",
        "  if (fromWallet.balance < amount) throw new Error('Insufficient funds');",
        "  // Race window: Another request can drain balance here!",
        "  await db.wallet.update({ where: { userId: fromId }, data: { balance: { decrement: amount } } });",
        "  await db.wallet.update({ where: { userId: toId }, data: { balance: { increment: amount } } });",
        "}",
      ],
      after: [
        "// ✅ Atomic interactive transaction with double-entry ledger integrity",
        "async function transferMoney(fromId: string, toId: string, amount: number) {",
        "  return await db.$transaction(async (tx) => {",
        "    const sender = await tx.wallet.update({",
        "      where: { userId: fromId, balance: { gte: amount } }, // Atomic check & lock",
        "      data: { balance: { decrement: amount } }",
        "    });",
        "    const receiver = await tx.wallet.update({",
        "      where: { userId: toId },",
        "      data: { balance: { increment: amount } }",
        "    });",
        "    await tx.ledgerEntry.createMany({ data: [",
        "      { walletId: sender.id, type: 'DEBIT', amount },",
        "      { walletId: receiver.id, type: 'CREDIT', amount }",
        "    ]});",
        "  });",
        "}",
      ],
    },
    metrics: [
      {
        label: "Concurrency",
        value: "Row Locking",
        sub: "pessimistic update guards",
        color: "#00f5d4",
      },
      {
        label: "Bookkeeping",
        value: "Double-Entry",
        sub: "debit/credit ledger entries",
        color: "#22c55e",
      },
      {
        label: "Database",
        value: "PostgreSQL",
        sub: "ACID interactive transactions",
        color: "#818cf8",
      },
      {
        label: "Idempotency",
        value: "Guaranteed",
        sub: "deduplicated payment retries",
        color: "#f59e0b",
      },
    ],
    links: [
      {
        label: "Source Code (github.com/arunkumar-dot/paytm-clone) ↗",
        url: "https://github.com/arunkumar-dot/paytm-clone",
      },
    ],
  },

  // ── 6. Courier & Express Logistics Platform (Wipro / FedEx Australia) ───────
  {
    id: "fedex-logistics",
    tileId: "fedex",
    tag: "Wipro / FedEx Australia · Mobile & Distributed Systems",
    title: "Courier & Express Logistics Platform",
    subtitle:
      "Cross-platform courier workflows, API contract architecture & SQLite persistence for FedEx Australia",
    stack: [
      "C#",
      ".NET",
      "Xamarin.Forms",
      ".NET MAUI",
      "MVVM Architecture",
      "SQLite",
      "HTTPS REST APIs",
    ],
    role: "Project Engineer (2020–2022)",
    recognition: "Panache Best Newcomer Award (2022)",
    overview: {
      context:
        "FedEx Australia couriers required reliable cross-platform mobile functionality to scan package barcodes, record proof-of-delivery signatures, and manage route stops across varying cellular coverage zones.",
      problem:
        "Native Android and iOS mobile engineering teams lacked unified API contract specifications, leading to duplicate integration logic, inconsistent status handling, and redundant database roundtrips.",
      solution:
        "Analysed and authored standardized REST API request/response contracts over HTTPS that served as the foundational specification for both Android and iOS native mobile teams. Built cross-platform courier features using Xamarin.Forms and .NET MAUI with MVVM architecture, and optimized local SQLite query execution to eliminate redundant database calls.",
      outcome:
        "Awarded the Panache Best Newcomer Award (2022) for engineering delivery. Successfully established the core API contract foundation used across native mobile teams and streamlined local persistence.",
    },
    arch: {
      title: "Cross-Platform Mobile & API Contract Architecture",
      steps: [
        {
          label: "Mobile Courier Client",
          sub: "Xamarin.Forms / .NET MAUI with MVVM data binding",
          variant: "primary",
        },
        {
          label: "Local Persistence Layer",
          sub: "SQLite caching to reduce redundant network roundtrips",
          variant: "accent",
        },
        {
          label: "Standardized REST API Spec",
          sub: "Documented contract specifications for Android & iOS teams",
          variant: "primary",
        },
        {
          label: "Enterprise Dispatch Core",
          sub: "FedEx parcel status, route manifests & delivery proofs",
          variant: "secondary",
        },
      ],
      decisions: [
        {
          heading: "API Contract Standardization for Native Mobile Teams",
          detail:
            "Authored and documented comprehensive REST API request/response specifications that served as the single source of truth for native Android and iOS mobile engineering teams.",
        },
        {
          heading: "MVVM Architecture & Local SQLite Caching",
          detail:
            "Structured cross-platform UI components with MVVM separation of concerns, utilizing local SQLite storage to cache delivery routes and eliminate unnecessary database queries.",
        },
        {
          heading: "Design-Flow Defect Remediation",
          detail:
            "Identified and resolved complex workflow bugs across the mobile delivery lifecycle, earning the Panache Award within two months of joining.",
        },
      ],
    },
    diff: {
      legend: "Unstandardized ad-hoc endpoints vs. Standardized REST API Contract Specification",
      before: [
        "// ❌ Unstandardized ad-hoc payload — divergent schemas between iOS & Android",
        "POST /api/package/updateStatus",
        "{",
        "  \"barcode\": \"FX-9281-AU\",",
        "  \"status\": \"DELIVERED\",",
        "  \"signer\": \"J. Doe\" // Missing schema validation & timestamp precision",
        "}",
      ],
      after: [
        "// ✅ Standardized REST API contract — unified specification for all mobile platforms",
        "POST /api/v1/deliveries/scans",
        "{",
        "  \"trackingNumber\": \"FX-9281-AU\",",
        "  \"statusCode\": \"DELIVERED\",",
        "  \"timestampUtc\": \"2022-08-23T14:32:00Z\",",
        "  \"idempotencyKey\": \"f81d4fae-7dec-11d0-a765-00a0c91e6bf6\",",
        "  \"signature\": { \"signerName\": \"J. Doe\", \"format\": \"SVG_BASE64\" }",
        "}",
      ],
    },
    metrics: [
      {
        label: "Engineering Recognition",
        value: "Panache 2022",
        sub: "Best Newcomer Award",
        color: "#f59e0b",
      },
      {
        label: "Platform Teams",
        value: "2 Teams",
        sub: "Android & iOS native built off specs",
        color: "#00f5d4",
      },
      {
        label: "Architecture",
        value: "MVVM + SQLite",
        sub: "local persistence & clean binding",
        color: "#22c55e",
      },
      {
        label: "Integration",
        value: "REST / HTTPS",
        sub: "standardized contract specifications",
        color: "#818cf8",
      },
    ],
    links: [
      {
        label: "LinkedIn Experience Verification ↗",
        url: "https://linkedin.com/in/arun-kulkarni226",
      },
    ],
  },

  // ── 7. Claims Web API & Bounded Context Migration ───────────────────────────
  {
    id: "claims",
    tileId: "claims",
    tag: "Health Benefits & Claims Platform · Altimetrik",
    title: "Claims Web API & Bounded Context Migration",
    subtitle:
      "Participant-facing eligibility engine for consumer-directed accounts (FSA/HSA/HRA) with 5-level config resolution",
    stack: [
      "C#",
      "ASP.NET Core",
      "MediatR (CQRS)",
      "Entity Framework Core",
      "SQL Server (Stored Procedures)",
      "JMeter",
    ],
    overview: {
      context:
        "Modernized the participant-facing claim filing eligibility check pipeline for consumer-directed accounts (FSA, HSA, HRA) on an enterprise health benefits platform.",
      problem:
        "Legacy eligibility checks coupled business rules directly into database stored procedures with side-effectful reads, 6 behavioral parity divergences from production, and DbContext concurrency exceptions under parallel task execution.",
      solution:
        "Engineered an ASP.NET Core → MediatR CQRS query handler → Orchestration service → pure Rules Engine → Stored-procedure settings repository pipeline. Implemented a 5-level configuration resolution hierarchy. Scoped 4 of 7 checks out to protect bounded context boundaries. Hardened EF Core with per-operation DbContext factory isolation.",
      outcome:
        "Evaluated via JMeter load testing at 75 concurrent users / 600 RPM across 4,061 samples with 0.00% error rate. Identified a p95 latency regression (3.3s) against the 2.0s SLA target and root-caused the issue to stored procedure hierarchy traversal. Caught 6 parity defects pre-PR.",
    },
    arch: {
      title: "ASP.NET Core MediatR CQRS Pipeline",
      steps: [
        {
          label: "HTTP Controller",
          sub: "Route validation & MediatR dispatch",
          variant: "secondary",
        },
        {
          label: "MediatR Query Handler",
          sub: "CQRS read-only pipeline execution",
          variant: "primary",
        },
        {
          label: "Orchestration Service",
          sub: "Context pre-fetching & rule sequencing",
          variant: "primary",
        },
        {
          label: "Stateless Rules Engine",
          sub: "Pure functional boolean eligibility predicates",
          variant: "accent",
        },
        {
          label: "Settings Repository",
          sub: "5-level config merge hierarchy via SQL SP",
          variant: "secondary",
        },
      ],
      decisions: [
        {
          heading: "Five-Level Configuration Resolution",
          detail:
            "Resolves from most-specific scope → … → global defaults, with per-setting merge semantics rather than first-match-wins. Each setting resolves independently across all five levels, holding behavioural parity with the legacy implementation.",
        },
        {
          heading: "Six Behavioural Divergences Fixed Pre-PR",
          detail:
            "Found and fixed six behavioural divergences from the legacy implementation before raising the PR — election-selection predicates, cancelled-transaction filtering, transaction-type eligibility, plan-year date clamping, and exception semantics — each locked in with regression tests.",
        },
        {
          heading: "EF Core DbContext Thread-Safety Diagnosis",
          detail:
            "Diagnosed EF Core DbContext thread-safety failures (InvalidOperationException) under parallel Task.WhenAll execution and restructured the data-access path to sequence reads safely using IDbContextFactory per-operation isolation.",
        },
        {
          heading: "Bounded Context Scoping",
          detail:
            "Scoped 4 of 7 eligibility checks out of the migration after establishing they were business-data reads that would have broken the service's bounded context. Ensured only pure eligibility predicates enter the rules engine.",
        },
      ],
    },
    diff: {
      legend: "Shared DbContext concurrency crash vs. per-operation factory isolation",
      before: [
        "// ❌ Shared scoped DbContext across parallel tasks — throws concurrency exception",
        "public async Task ProcessReceiptsAsync(int[] receiptIds) {",
        "  var tasks = receiptIds.Select(id =>",
        "    _context.Receipts",
        "      .Where(r => r.Id == id)",
        "      .FirstOrDefaultAsync()); // Concurrent access on single DbContext!",
        "  await Task.WhenAll(tasks); // Throws InvalidOperationException at runtime",
        "}",
      ],
      after: [
        "// ✅ Per-operation DbContext factory — thread-safe under parallelism",
        "public async Task ProcessReceiptsAsync(int[] receiptIds) {",
        "  var tasks = receiptIds.Select(async id => {",
        "    await using var ctx = _factory.CreateDbContext();",
        "    return await ctx.Receipts",
        "      .Where(r => r.Id == id)",
        "      .FirstOrDefaultAsync(); // Isolated context lifetime per task",
        "  });",
        "  await Task.WhenAll(tasks);",
        "}",
      ],
    },
    metrics: [
      {
        label: "Load Test Scale",
        value: "4,061 Samples",
        sub: "600 RPM / 75 virtual users",
        color: "#00f5d4",
      },
      {
        label: "Error Rate",
        value: "0.00%",
        sub: "zero failed requests",
        color: "#22c55e",
      },
      {
        label: "Latency SLA Analysis",
        value: "p95 3.3s",
        sub: "root-caused vs 2.0s target",
        color: "#f59e0b",
      },
      {
        label: "Parity Defects",
        value: "6 Caught",
        sub: "resolved pre-PR",
        color: "#818cf8",
      },
    ],
    links: [
      {
        label: "LinkedIn Experience Verification ↗",
        url: "https://linkedin.com/in/arun-kulkarni226",
      },
    ],
  },

  // ── 8. Consumer Claims Micro-Frontend ───────────────────────────────────────
  {
    id: "mfe",
    tileId: "mfe",
    tag: "Health Benefits & Claims Platform · Altimetrik",
    title: "Consumer Claims Micro-Frontend",
    subtitle:
      "React micro-frontend for reimbursement method selection with 11-locale internationalization",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Vitest",
      "React Testing Library",
      "Webpack Module Federation",
    ],
    overview: {
      context:
        "The consumer claims portal's reimbursement selection flow was a legacy 4-step wizard requiring multiple page transitions to choose between Direct Deposit and Check-by-Mail, causing high mobile abandonment.",
      problem:
        "Multi-step wizard UX increased drop-off rates on mobile devices; tight coupling to the monorepo shell prevented independent deployments; missing internationalization support across global participant bases.",
      solution:
        "Replaced the wizard with a unified review-stage payout selector dialog. Built the MFE with React, TypeScript, and Module Federation. Shipped internationalized copy across 11 locales.",
      outcome:
        "Reduced user click path from 8 to 2 steps. Shipped 11 localized languages with full Vitest test suite coverage and independent zero-downtime deployment capability.",
    },
    arch: {
      title: "Module Federation Micro-Frontend Architecture",
      steps: [
        {
          label: "Shell Host Application",
          sub: "Module Federation container shell",
          variant: "secondary",
        },
        {
          label: "Claims MFE Remote",
          sub: "Vite bundle with independent CI/CD pipeline",
          variant: "primary",
        },
        {
          label: "Unified Review Dialog",
          sub: "Single-screen payout method selector",
          variant: "primary",
        },
        {
          label: "i18n Localization Engine",
          sub: "11 locale string catalogs (en, es, fr, de, etc.)",
          variant: "accent",
        },
      ],
      decisions: [
        {
          heading: "Single-Stage Review Dialog",
          detail:
            "Replaced 4 wizard navigation pages with a modal dialog containing optimistic state transitions, eliminating back-button failures and reducing user interaction steps.",
        },
        {
          heading: "Module Federation Deployment Decoupling",
          detail:
            "Decoupled the micro-frontend from the monolith release cycle, enabling zero-downtime independent deployments and isolated dependency management.",
        },
        {
          heading: "11-Locale Runtime Internationalization",
          detail:
            "Structured key-based dictionary lookups enabling instant dynamic language switching across 11 global locales without full bundle reloads.",
        },
      ],
    },
    diff: {
      legend: "Multi-route wizard navigation vs. declarative single dialog state machine",
      before: [
        "// ❌ Multi-step wizard across 4 routes with mutable state store",
        "const wizard = useWizardStore();",
        "// /select-method -> /enter-bank-details -> /verify-micro-deposits -> /confirm",
        "// Full page reloads, back-button race conditions, 8 total clicks",
        "router.push('/transfer/select-method');",
      ],
      after: [
        "// ✅ Declarative review dialog — local state machine with zero route jumps",
        "const [step, setStep] = useState<'select' | 'review' | 'done'>('select');",
        "return (",
        "  <TransferDialog open={open} onClose={onClose}>",
        "    {step === 'select' && <MethodSelector onSelect={m => { setMethod(m); setStep('review'); }} />}",
        "    {step === 'review' && <ReviewConfirm method={method} onBack={() => setStep('select')} onConfirm={handleSubmit} />}",
        "  </TransferDialog>",
        ");",
      ],
    },
    metrics: [
      {
        label: "Locales Shipped",
        value: "11 Locales",
        sub: "global participant coverage",
        color: "#00f5d4",
      },
      {
        label: "Flow Simplification",
        value: "4 → 1 Step",
        sub: "unified review dialog",
        color: "#22c55e",
      },
      {
        label: "Interaction Path",
        value: "8 → 2 Clicks",
        sub: "reduced user friction",
        color: "#f59e0b",
      },
      {
        label: "Test Coverage",
        value: "Vitest + RTL",
        sub: "state transition testing",
        color: "#818cf8",
      },
    ],
    links: [
      {
        label: "LinkedIn Experience Verification ↗",
        url: "https://linkedin.com/in/arun-kulkarni226",
      },
    ],
  },

  // ── 9. Enterprise Security & XSS Remediation Layer ─────────────────────────
  {
    id: "xss",
    tileId: "security",
    tag: "Enterprise Security · Altimetrik",
    title: "Enterprise Security & XSS Remediation",
    subtitle:
      "Custom JSON serialization and HTML escaping framework across 4 legacy WCF backend services",
    stack: [
      "C#",
      "WCF (Windows Communication Foundation)",
      ".NET Framework",
      "Newtonsoft.Json",
      "IDispatchMessageInspector",
      "Feature Flags",
    ],
    overview: {
      context:
        "A third-party penetration test uncovered an XSS vulnerability across 4 legacy backend services where unencoded user strings were serialized into JSON responses.",
      problem:
        "Over 20 endpoints across 4 legacy WCF services returned unencoded HTML markup in JSON. Because the affected services were WCF on .NET Framework, standard ASP.NET Core encoders (System.Text.Encodings.Web) did not apply.",
      solution:
        "Engineered a custom Newtonsoft.Json serializer configured with HTML escaping (`StringEscapeHandling.EscapeHtml`), response-capture message inspectors, and pipeline hooks, consolidated into a single shared library and scoped strictly to `application/json` so XML/binary payloads remained untouched. Deployed behind feature flags for instant rollback.",
      outcome:
        "Completely remediated the XSS vulnerability across all 4 legacy WCF services with zero downtime and instant feature-flag rollback capability.",
    },
    arch: {
      title: "WCF Custom JSON Serialization & Escaping Pipeline",
      steps: [
        {
          label: "WCF Service Operation",
          sub: "Receives RPC call & retrieves entity payload",
          variant: "secondary",
        },
        {
          label: "Message Inspector Hook",
          sub: "IDispatchMessageInspector intercepts outgoing reply",
          variant: "accent",
        },
        {
          label: "Content-Type Filter",
          sub: "Scopes execution strictly to application/json",
          variant: "primary",
        },
        {
          label: "Custom Newtonsoft Serializer",
          sub: "StringEscapeHandling.EscapeHtml encodes <, >, &, ', \"",
          variant: "primary",
        },
        {
          label: "Feature Flag Gate",
          sub: "Enables instant zero-downtime rollback capability",
          variant: "accent",
        },
      ],
      decisions: [
        {
          heading: "Why Standard Encoders Did Not Apply",
          detail:
            "Because the affected services were built on legacy WCF / .NET Framework, ASP.NET Core encoders (System.Text.Encodings.Web) were unavailable. Used Newtonsoft.Json with `StringEscapeHandling.EscapeHtml` within custom formatters.",
        },
        {
          heading: "Strict application/json Scope Isolation",
          detail:
            "Scoped the custom serializer strictly to `application/json` responses, ensuring SOAP/XML and binary endpoints in the legacy WCF services were untouched.",
        },
        {
          heading: "Feature-Flagged Staged Rollout",
          detail:
            "Packaged the solution into a shared library and deployed behind feature flags, allowing incremental verification with immediate rollback safety.",
        },
      ],
    },
    diff: {
      legend: "Legacy WCF unescaped JSON vs. Custom SafeJsonMediaTypeFormatter with HTML escaping",
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
    },
    metrics: [
      {
        label: "Services Patched",
        value: "4 Services",
        sub: "legacy WCF repositories",
        color: "#00f5d4",
      },
      {
        label: "Endpoints Secured",
        value: "20+ Endpoints",
        sub: "protected via shared library",
        color: "#22c55e",
      },
      {
        label: "Serializer Engine",
        value: "Newtonsoft",
        sub: "StringEscapeHandling.EscapeHtml",
        color: "#f59e0b",
      },
      {
        label: "Rollout Safety",
        value: "Zero Downtime",
        sub: "protected by feature flags",
        color: "#818cf8",
      },
    ],
    links: [
      {
        label: "LinkedIn Experience Verification ↗",
        url: "https://linkedin.com/in/arun-kulkarni226",
      },
    ],
  },
];

// Re-export alias for compatibility
export const CASE_STUDIES = PROJECTS_DATA;
