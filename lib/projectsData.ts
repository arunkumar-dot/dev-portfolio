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

// ─── Comprehensive Portfolio Data (GitHub Projects & Work Experiences) ───────

export const PROJECTS_DATA: CaseStudy[] = [
  // ── 1. HabitFlow — Full-Stack SaaS Habit Tracker ────────────────────────────
  {
    id: "habitflow",
    tileId: "habitflow",
    tag: "Featured SaaS · github.com/arunkumar-dot/habit-tracker",
    title: "HabitFlow — Full-Stack SaaS",
    subtitle:
      "Production SaaS habit tracker with reactive serverless database, multi-device sync & push notifications",
    stack: [
      "Next.js 14 (App Router)",
      "TypeScript",
      "Convex (Reactive DB)",
      "Clerk Auth",
      "Firebase FCM",
      "Cloudflare",
      "Vercel",
    ],
    overview: {
      context:
        "Independently designed, engineered, and launched a production SaaS web application on a custom domain (tryhabitflow.com) with real active users tracking daily habits and routines.",
      problem:
        "Traditional habit trackers rely on local device storage or wasteful HTTP polling to synchronize streak states across tabs and devices, introducing stale data and unnecessary mobile battery drain.",
      solution:
        "Engineered a serverless reactive backend using Convex live query subscriptions and atomic mutations. Integrated Clerk for seamless multi-device authentication and Firebase Cloud Messaging for scheduled push notification reminders. Deployed globally on Cloudflare and Vercel edge networks.",
      outcome:
        "Live production SaaS application at tryhabitflow.com. Sub-100ms real-time data sync with zero polling overhead, automated streak tracking analytics, and global edge delivery.",
    },
    arch: {
      title: "Serverless Reactive SaaS Architecture",
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
            "Convex's WebTransport subscription model automatically pushes data diffs to all subscribed browser tabs on every mutation, completely eliminating the need for periodic HTTP polling or complex WebSocket socket room management.",
        },
        {
          heading: "Clerk Authentication & Session Sync",
          detail:
            "Implemented Clerk for robust JWT session issuance and multi-device revocation, allowing users to seamlessly transition between mobile browsers and desktop without losing habit tracking state.",
        },
        {
          heading: "FCM Push Notifications via Web Workers",
          detail:
            "Built a dedicated Service Worker integration for Firebase Cloud Messaging, delivering background reminder push notifications on mobile and desktop browsers without requiring native mobile app store installations.",
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
        label: "Live Sync Latency",
        value: "<100ms",
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
      {
        label: "Source Code (github.com/arunkumar-dot/habit-tracker) ↗",
        url: "https://github.com/arunkumar-dot/habit-tracker",
      },
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
      "Next.js 14",
      "LangChain",
      "Vector DB (HNSW)",
      "Embeddings API",
      "LLM Synthesis",
    ],
    overview: {
      context:
        "Engineered an end-to-end Retrieval-Augmented Generation (RAG) assistant enabling users to upload multi-format documents (PDF, DOCX, TXT), compute dense vector embeddings, and query information via LLMs with verifiable source citations.",
      problem:
        "Raw LLM prompts suffer from context window limits and hallucination when answering document-specific queries. Naive text splitting leads to lost cross-sentence context and fragmented chunks.",
      solution:
        "Implemented recursive chunking with sliding character overlaps (500 tokens / 50 overlap), cosine similarity search over normalized embeddings, and contextual prompt injection with confidence scoring.",
      outcome:
        "Sub-250ms vector retrieval latency, 95%+ retrieval precision across complex technical documentation, and grounded answer synthesis with page-level citations.",
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
            "Filtered out vector matches with cosine similarity below 0.72 to prevent hallucination from irrelevant passages, returning a grounded refusal when no matching context exists.",
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
        label: "Retrieval Speed",
        value: "<250ms",
        sub: "HNSW vector search",
        color: "#00f5d4",
      },
      {
        label: "Answer Precision",
        value: "95%+",
        sub: "grounded citations",
        color: "#22c55e",
      },
      {
        label: "Context Filter",
        value: "0.72 Score",
        sub: "anti-hallucination threshold",
        color: "#818cf8",
      },
      {
        label: "Format Support",
        value: "PDF / DOCX",
        sub: "streaming text extraction",
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
      "Hono",
      "BullMQ",
      "Redis",
      "PostgreSQL",
      "Prisma",
      "Docker",
    ],
    overview: {
      context:
        "Built a resilient, distributed web scraping and analytics service capable of streaming and indexing Hacker News items, top stories, and nested comment trees in near real-time.",
      problem:
        "Scraping deeply nested comment trees through recursive API requests quickly exhausts rate limits, starves the single-threaded Node.js event loop, and causes database connection saturation.",
      solution:
        "Engineered an asynchronous queue-driven architecture utilizing Hono for ultra-lightweight REST endpoints, BullMQ with Redis for job scheduling and worker pool isolation, and PostgreSQL connection pooling.",
      outcome:
        "Capable of processing 5,000+ items/minute with automatic exponential backoff retries, zero rate-limit bans, and concurrent worker scaling.",
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
            "Used Hono for sub-millisecond route handling and minimal memory footprint (<45MB) compared to standard Express runtimes.",
        },
        {
          heading: "BullMQ Rate Limiting & Isolation",
          detail:
            "Configured token bucket rate limiters in Redis (`limiter: { max: 50, duration: 1000 }`), preventing upstream IP throttling and rate-limit blocks.",
        },
        {
          heading: "Batched Bulk Upserts",
          detail:
            "Replaced single-record queries with `INSERT ... ON CONFLICT DO UPDATE` bulk statements, reducing database roundtrips by 85%.",
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
        label: "Throughput",
        value: "5,000+ Items/min",
        sub: "distributed worker pool",
        color: "#00f5d4",
      },
      {
        label: "Error Rate",
        value: "<0.01%",
        sub: "exponential backoff",
        color: "#22c55e",
      },
      {
        label: "DB Latency",
        value: "-85% Roundtrips",
        sub: "bulk batch upserts",
        color: "#f59e0b",
      },
      {
        label: "Memory Footprint",
        value: "<45MB",
        sub: "Hono edge runtime",
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

  // ── 4. Distributed Ledger & Consensus (GitHub: distributed_ledger) ──────────
  {
    id: "distributed-ledger",
    tileId: "distributed-ledger",
    tag: "GitHub Project · github.com/arunkumar-dot/distributed_ledger",
    title: "Distributed Ledger & Consensus Engine",
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
        "Implemented a distributed immutable ledger to explore cryptographic chain integrity, Merkle tree transaction proofs, and peer-to-peer consensus reconciliation across distributed nodes.",
      problem:
        "Ensuring state consistency across independent nodes without centralized coordination requires tamper-evident transaction verification and deterministic consensus mechanisms.",
      solution:
        "Engineered an append-only cryptographic block structure using SHA-256 proof generation, dynamic difficulty adjustment, Merkle root verification, and peer gossip state reconciliation.",
      outcome:
        "Verified zero-tamper integrity with instant state verification, sub-second block validation, and deterministic chain resolution.",
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
        label: "Hash Verification",
        value: "<1ms",
        sub: "SHA-256 block digest",
        color: "#00f5d4",
      },
      {
        label: "Tamper Resistance",
        value: "100%",
        sub: "cryptographic immutability",
        color: "#22c55e",
      },
      {
        label: "State Proofs",
        value: "O(log N)",
        sub: "Merkle tree verification",
        color: "#818cf8",
      },
      {
        label: "P2P Consensus",
        value: "Longest-Chain",
        sub: "deterministic resolution",
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

  // ── 5. Paytm Wallet & Payments Clone (GitHub: paytm-clone) ──────────────────
  {
    id: "paytm-clone",
    tileId: "paytm-clone",
    tag: "GitHub Project · github.com/arunkumar-dot/paytm-clone",
    title: "Fintech Payment & Wallet Engine",
    subtitle:
      "Atomic wallet transfers, double-entry ledger validation, and transactional isolation for payment gateways",
    stack: [
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "JWT Auth",
      "Tailwind CSS",
    ],
    overview: {
      context:
        "Architected a full-stack digital wallet and peer-to-peer payment simulation to demonstrate ACID-compliant balance transfers, concurrency control, and idempotency guarantees.",
      problem:
        "Financial transactions subject to simultaneous debit/credit requests suffer from race conditions, dirty reads, and overdraft bugs if balance updates are not isolated in database transactions.",
      solution:
        "Engineered transactional database locks (`SELECT ... FOR UPDATE` via Prisma interactive transactions), double-entry ledger bookkeeping, and client-generated idempotency keys.",
      outcome:
        "Zero balance discrepancies under concurrent simulated transfer tests, sub-50ms transaction commit time, and secure JWT-authenticated wallet endpoints.",
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
            "Cached transaction IDs in Redis to ensure network retries never result in duplicate debit transactions.",
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
        label: "Concurrency Safety",
        value: "100% ACID",
        sub: "atomic interactive transactions",
        color: "#00f5d4",
      },
      {
        label: "Transfer Latency",
        value: "<50ms",
        sub: "optimized DB indices",
        color: "#22c55e",
      },
      {
        label: "Audit Integrity",
        value: "Double-Entry",
        sub: "zero ledger discrepancies",
        color: "#818cf8",
      },
      {
        label: "Overdraft Guard",
        value: "Row Lock",
        sub: "guaranteed non-negative balance",
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
      "Offline-first mobile courier operations and high-throughput package dispatch engine for FedEx Australia",
    stack: [
      "C#",
      ".NET",
      "Xamarin.Forms",
      ".NET MAUI",
      "MVVM Architecture",
      "SQLite",
      "HTTPS REST APIs",
    ],
    role: "Project Engineer — Cross-Platform Mobile Engineer",
    recognition: "Panache Best Newcomer Award (2022)",
    overview: {
      context:
        "FedEx Australia couriers required a rugged, fault-tolerant cross-platform mobile application to scan package barcodes, record proof-of-delivery signatures, and execute route workflows under variable and remote cellular connectivity conditions.",
      problem:
        "Couriers delivering in basement loading docks and rural zones experienced network dropouts. Direct API calls stalled UI responsiveness, caused failed delivery submissions, and led to duplicate package updates during reconnection.",
      solution:
        "Architected an offline-first SQLite persistence layer with write-ahead logging (WAL) and an automated transaction sync queue. Streamlined HTTPS REST API request/response contracts and optimized local SQL indexing to eliminate redundant network roundtrips.",
      outcome:
        "Awarded the Panache Best Newcomer Award (2022) within two months of joining for resolving complex design-flow defects. Achieved 100% offline operational resilience with zero UI blocking during package scans.",
    },
    arch: {
      title: "Offline-First Mobile Courier Architecture",
      steps: [
        {
          label: "Mobile Courier App",
          sub: "Xamarin.Forms / .NET MAUI with MVVM data binding",
          variant: "primary",
        },
        {
          label: "Offline Sync Orchestrator",
          sub: "Transaction queue with exponential backoff retry",
          variant: "accent",
        },
        {
          label: "SQLite Local-First Cache",
          sub: "Encrypted write-ahead logging (WAL) & indexed storage",
          variant: "primary",
        },
        {
          label: "HTTPS REST API Gateway",
          sub: "Streamlined contracts with idempotency keys",
          variant: "secondary",
        },
        {
          label: "FedEx Enterprise Core",
          sub: "Central dispatch, tracking, and proof-of-delivery",
          variant: "secondary",
        },
      ],
      decisions: [
        {
          heading: "Local-First SQLite Persistence Layer",
          detail:
            "Every barcode scan, timestamp, and signature capture is committed locally to SQLite first before enqueuing for background dispatch. This guarantees zero UI freezing even in dead cellular zones.",
        },
        {
          heading: "Optimized Composite Query Indexing",
          detail:
            "Added specialized composite SQLite indexes on tracking identifiers and delivery stop sequences, reducing local query execution time by 65% on rugged handheld terminals.",
        },
        {
          heading: "REST Contract Streamlining & Idempotency",
          detail:
            "Refactored JSON payload structures to minimize cellular data consumption and introduced client-generated idempotency keys, eliminating duplicate package status transitions during network reconnection.",
        },
      ],
    },
    diff: {
      legend: "Direct blocking HTTP scan vs. offline-first transactional queue",
      before: [
        "// ❌ Direct HTTP call on barcode scan — blocks UI during network dropouts",
        "public async Task<bool> RecordDeliveryScanAsync(DeliveryScan scan) {",
        "  try {",
        "    var response = await _httpClient.PostAsJsonAsync(\"/api/v1/scans\", scan);",
        "    return response.IsSuccessStatusCode; // Fails immediately if offline!",
        "  } catch (HttpRequestException ex) {",
        "    _logger.LogError(ex, \"Failed to submit delivery scan\");",
        "    return false; // Scan dropped; courier forced to rescan later",
        "  }",
        "}",
      ],
      after: [
        "// ✅ Offline-first SQLite persistence with transactional sync queue",
        "public async Task RecordDeliveryScanAsync(DeliveryScan scan) {",
        "  await _db.RunInTransactionAsync(conn => {",
        "    conn.Insert(scan); // 1. Instant local write with WAL",
        "    conn.Insert(new SyncQueueEntry(scan.Id, ScanOperation.Deliver)); // 2. Queue for sync",
        "  });",
        "  _syncOrchestrator.TriggerBackgroundSync(); // 3. Dispatches via HTTPS when online",
        "}",
      ],
    },
    metrics: [
      {
        label: "Award Recognition",
        value: "Panache Award",
        sub: "Best Newcomer 2022",
        color: "#f59e0b",
      },
      {
        label: "Offline Resilience",
        value: "100%",
        sub: "zero dropped delivery scans",
        color: "#00f5d4",
      },
      {
        label: "UI Blocking Time",
        value: "0ms",
        sub: "instant local SQLite commit",
        color: "#22c55e",
      },
      {
        label: "Query Speed",
        value: "65% Faster",
        sub: "composite SQL indexing",
        color: "#818cf8",
      },
    ],
    links: [
      {
        label: "LinkedIn Experience Verification ↗",
        url: "https://linkedin.com/in/arun-kumar-kulkarni",
      },
      {
        label: "GitHub Profile ↗",
        url: "https://github.com/arunkumar-dot",
      },
    ],
  },

  // ── 7. Claims Web API & Bounded Context Migration (Altimetrik / WEX Health) ─
  {
    id: "claims",
    tileId: "claims",
    tag: "Altimetrik / WEX Health · Backend & Distributed Systems",
    title: "Claims Web API & Bounded Context Migration",
    subtitle:
      "Participant-facing eligibility engine for consumer-directed accounts (FSA/HSA/HRA) with 5-level config resolution",
    stack: [
      ".NET 8",
      "ASP.NET Core",
      "MediatR CQRS",
      "EF Core",
      "SQL Server Sharding",
      "OpenAPI",
      "JMeter",
    ],
    overview: {
      context:
        "WEX Health's consumer-directed accounts platform required a modernized eligibility check pipeline. The legacy system coupled business rules directly into database stored procedures with no clean separation of concerns.",
      problem:
        "7 eligibility checks were tangled with side-effectful data writes, had 6 behavioural divergences from production (election predicates, date clamping, exception semantics), and EF Core DbContext concurrency crashes occurred under parallel execution.",
      solution:
        "Engineered an ASP.NET Core → MediatR CQRS → Orchestration Service → pure Rules Engine → Stored-Procedure Settings Repository pipeline. Implemented a 5-level configuration merge hierarchy. Scoped 4 of 7 checks out to protect bounded context. Hardened EF Core DbContext with per-operation factories.",
      outcome:
        "Passed JMeter load testing at 75 concurrent users / 600 RPM across 4,061 samples with 0.00% error rate (p95: 3.3s, p99: 4.2s). Shipped 8 test suites and OpenAPI client generation for downstream teams.",
    },
    arch: {
      title: "ASP.NET Core MediatR CQRS Pipeline",
      steps: [
        {
          label: "HTTP Controller",
          sub: "Route validation & dispatch",
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
          heading: "5-Level Configuration Merge Hierarchy",
          detail:
            "Resolution order: Global Defaults → Plan-Type Overrides → Employer Settings → Member Preferences → Request-Time Params. Each level overrides only keys it defines; absent keys fall through with exact legacy parity.",
        },
        {
          heading: "Bounded Context Defense",
          detail:
            "Scoped 4 of 7 checks out of the migration after identifying them as business-data reads rather than eligibility concerns, ensuring only pure eligibility predicates enter the engine.",
        },
        {
          heading: "IDbContextFactory Concurrency Hardening",
          detail:
            "Replaced shared scoped DbContext with IDbContextFactory<T> in parallel async continuations, eliminating InvalidOperationException thread-safety crashes under high concurrency.",
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
        label: "JMeter Load Test",
        value: "0.00% Errors",
        sub: "4,061 samples @ 600 RPM",
        color: "#00f5d4",
      },
      {
        label: "Latency (p95 / p99)",
        value: "3.3s / 4.2s",
        sub: "within strict SLA targets",
        color: "#f59e0b",
      },
      {
        label: "Peak Concurrency",
        value: "75 Virtual Users",
        sub: "simulated load profile",
        color: "#818cf8",
      },
      {
        label: "Verification",
        value: "8 Test Suites",
        sub: "full behavioral parity",
        color: "#22c55e",
      },
    ],
    links: [
      {
        label: "LinkedIn Experience Verification ↗",
        url: "https://linkedin.com/in/arun-kumar-kulkarni",
      },
    ],
  },

  // ── 8. Consumer Claims Micro-Frontend (Altimetrik / WEX Health) ─────────────
  {
    id: "mfe",
    tileId: "mfe",
    tag: "Altimetrik / WEX Health · Frontend & Architecture",
    title: "Consumer Claims Micro-Frontend",
    subtitle:
      "React 19 micro-frontend for reimbursement method selection with 11-locale internationalization",
    stack: [
      "React 19",
      "TypeScript",
      "Vite",
      "Vitest",
      "React Testing Library",
      "GraphQL BFF",
      "Module Federation",
    ],
    overview: {
      context:
        "The consumer claims portal's reimbursement selection flow was a legacy 4-step wizard that required multiple page transitions to choose between Direct Deposit and Check-by-Mail, causing high mobile abandonment.",
      problem:
        "Multi-step wizard UX increased drop-off rates on mobile devices; tight coupling to the monorepo shell prevented independent deployments; missing internationalization support across global participant bases.",
      solution:
        "Replaced the wizard with a unified review-stage payout selector dialog. Built the MFE with React 19, Vite, and Module Federation. Streamlined bank-accounts GraphQL BFF contracts and shipped internationalized copy across 11 locales.",
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
          label: "GraphQL BFF Gateway",
          sub: "Bank accounts & validation contract layer",
          variant: "accent",
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
          heading: "Strict GraphQL Contract Typing",
          detail:
            "Fixed schema nullable mismatches during upstream BFF review, preventing runtime null reference exceptions in production edge cases.",
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
        sub: "en-US, es-ES, fr-FR, de-DE, pt-BR...",
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
        value: "100% Vitest",
        sub: "state transition testing",
        color: "#818cf8",
      },
    ],
    links: [
      {
        label: "LinkedIn Experience Verification ↗",
        url: "https://linkedin.com/in/arun-kumar-kulkarni",
      },
    ],
  },

  // ── 9. Enterprise Security & XSS Remediation Layer ─────────────────────────
  {
    id: "xss",
    tileId: "security",
    tag: "Altimetrik / WEX Health · Security & Compliance",
    title: "Enterprise Security & XSS Remediation",
    subtitle:
      "Centralized JSON serialization and HTML escaping framework across 4 legacy backend services",
    stack: [
      "C#",
      ".NET 8",
      "ASP.NET Core",
      "OWASP Top 10",
      "Custom JSON Serialization",
      "Feature Flags",
    ],
    overview: {
      context:
        "A third-party penetration test uncovered a critical stored XSS vulnerability across 4 legacy backend services where unencoded user strings (claim notes, employee names) were serialized into JSON responses.",
      problem:
        "Over 20 endpoints across 4 legacy repositories returned unencoded HTML markup in JSON, allowing script injection into authenticated participant sessions.",
      solution:
        "Engineered a centralized SafeJsonResult layer with recursive HtmlEncoder property escaping and ASP.NET Core response-capture filters. Packaged as a shared NuGet library and deployed behind feature flags for zero-downtime staged rollout.",
      outcome:
        "Closed OWASP A03 (Injection) vulnerability across all 4 services with zero downtime and instant feature-flag rollback capability.",
    },
    arch: {
      title: "Centralized JSON Escaping Pipeline",
      steps: [
        {
          label: "ASP.NET Core Controller",
          sub: "Receives request & fetches entity",
          variant: "secondary",
        },
        {
          label: "SafeJsonResult Action",
          sub: "Custom IActionResult output interceptor",
          variant: "accent",
        },
        {
          label: "Response-Capture Filter",
          sub: "Pipeline hook for response payload",
          variant: "primary",
        },
        {
          label: "Recursive HtmlEncoder",
          sub: "Deep string property sanitization",
          variant: "primary",
        },
        {
          label: "Feature Flag Rollout Gate",
          sub: "Granular percentage rollout per service",
          variant: "accent",
        },
        {
          label: "Secure HTTP Response",
          sub: "Sanitized JSON payload returned to browser",
          variant: "secondary",
        },
      ],
      decisions: [
        {
          heading: "Centralized Serialization vs. Endpoint-by-Endpoint",
          detail:
            "Implemented a shared NuGet package with custom ContractResolver to sanitize all existing and future endpoints without touching 20+ controllers individually.",
        },
        {
          heading: "Feature Flag Staged Rollout",
          detail:
            "Enabled the security filter progressively across services over 2 weeks with telemetry monitoring to catch edge-case encoding quirks before full enablement.",
        },
        {
          heading: "Zero Model Mutation",
          detail:
            "Preserved raw string storage in database and applied encoding strictly during serialization before writing HTTP response bytes.",
        },
      ],
    },
    diff: {
      legend: "Raw JsonConvert output vs. centralized SafeJsonResult escaping",
      before: [
        "// ❌ Raw object serialization — returns unencoded HTML markup in JSON",
        "public IActionResult GetClaimData(int claimId) {",
        "  var claim = _repo.GetClaim(claimId);",
        "  // Danger: user-controlled string (claim.Notes) written directly to response",
        "  return Content(JsonConvert.SerializeObject(claim), \"application/json\");",
        "}",
      ],
      after: [
        "// ✅ Centralized JSON serialization with recursive HTML escaping & feature flags",
        "public IActionResult GetClaimData(int claimId) {",
        "  var claim = _repo.GetClaim(claimId);",
        "  // SafeJsonResult recursively encodes all string properties with HtmlEncoder",
        "  return new SafeJsonResult(claim, _serializerOptions);",
        "}",
      ],
    },
    metrics: [
      {
        label: "Services Patched",
        value: "4 Services",
        sub: "legacy enterprise repositories",
        color: "#00f5d4",
      },
      {
        label: "Endpoints Secured",
        value: "20+ Endpoints",
        sub: "protected via centralized filter",
        color: "#22c55e",
      },
      {
        label: "OWASP Finding",
        value: "A03 Closed",
        sub: "zero injection vulnerabilities",
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
        url: "https://linkedin.com/in/arun-kumar-kulkarni",
      },
    ],
  },
];

// Re-export alias for compatibility
export const CASE_STUDIES = PROJECTS_DATA;
