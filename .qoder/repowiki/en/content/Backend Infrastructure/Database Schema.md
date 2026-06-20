# Database Schema

<cite>
**Referenced Files in This Document**
- [20240101000000_init.sql](file://supabase/migrations/20240101000000_init.sql)
- [20240101000001_seed_questions.sql](file://supabase/migrations/20240101000001_seed_questions.sql)
- [20240101000002_add_difficulty.sql](file://supabase/migrations/20240101000002_add_difficulty.sql)
- [start-quiz/index.ts](file://supabase/functions/start-quiz/index.ts)
- [submit-quiz/index.ts](file://supabase/functions/submit-quiz/index.ts)
- [post-guestbook/index.ts](file://supabase/functions/post-guestbook/index.ts)
</cite>

## Table Definitions

### trivia_questions
- Purpose: Stores the trivia question pool with four options and the correct answer.
- Primary Key: id (SERIAL)
- Columns:
  - id: SERIAL PRIMARY KEY
  - question: TEXT NOT NULL
  - option_a: TEXT NOT NULL
  - option_b: TEXT NOT NULL
  - option_c: TEXT NOT NULL
  - option_d: TEXT NOT NULL
  - correct_answer: CHAR(1) NOT NULL CHECK (IN ('a','b','c','d'))
  - category: TEXT NOT NULL DEFAULT 'mixed'
  - difficulty: TEXT NOT NULL DEFAULT 'medium' CHECK (IN ('easy','medium','hard'))
- Constraints:
  - correct_answer must be one of 'a','b','c','d'
  - difficulty must be one of 'easy','medium','hard'
- Notes:
  - Row Level Security enabled
  - Public SELECT access via policy
  - Correct answer intentionally excluded from client-facing queries

**Section sources**
- [20240101000000_init.sql:4-15](file://supabase/migrations/20240101000000_init.sql#L4-L15)

### quiz_sessions
- Purpose: Tracks active quiz sessions with randomized question sets and submission metadata.
- Primary Key: id (UUID)
- Columns:
  - id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - question_ids: INTEGER[] NOT NULL
  - ip_hash: TEXT
  - completed: BOOLEAN DEFAULT FALSE
  - score: INTEGER
  - answers: TEXT[]
  - created_at: TIMESTAMPTZ DEFAULT now()
- Constraints:
  - No explicit foreign keys
  - question_ids array contains references to trivia_questions.id
- Notes:
  - Row Level Security enabled
  - Service role access only (no anonymous policy)
  - Used to prevent duplicate submissions and track scoring

**Section sources**
- [20240101000000_init.sql:17-26](file://supabase/migrations/20240101000000_init.sql#L17-L26)

### leaderboard
- Purpose: Stores quiz results with performance metrics and ranking criteria.
- Primary Key: id (SERIAL)
- Columns:
  - id: SERIAL PRIMARY KEY
  - nickname: TEXT NOT NULL
  - score: INTEGER NOT NULL
  - total_questions: INTEGER NOT NULL
  - duration_seconds: INTEGER NOT NULL
  - category: TEXT NOT NULL DEFAULT 'mixed'
  - difficulty: TEXT NOT NULL DEFAULT 'mixed'
  - created_at: TIMESTAMPTZ DEFAULT now()
- Constraints:
  - No explicit foreign keys
  - difficulty column added later with default constraint
- Notes:
  - Row Level Security enabled
  - Public SELECT access via policy
  - Service role INSERT access
  - Composite index on (score DESC, duration_seconds ASC) for ranking
  - Additional index on (difficulty, score DESC, duration_seconds ASC)

**Section sources**
- [20240101000000_init.sql:28-37](file://supabase/migrations/20240101000000_init.sql#L28-L37)
- [20240101000002_add_difficulty.sql:1-6](file://supabase/migrations/20240101000002_add_difficulty.sql#L1-L6)

### guestbook
- Purpose: Stores visitor messages with moderation controls.
- Primary Key: id (SERIAL)
- Columns:
  - id: SERIAL PRIMARY KEY
  - nickname: TEXT NOT NULL
  - message: TEXT NOT NULL
  - ip_hash: TEXT
  - created_at: TIMESTAMPTZ DEFAULT now()
- Constraints:
  - No explicit foreign keys
- Notes:
  - Row Level Security enabled
  - Public SELECT access via policy
  - Service role INSERT access
  - Used for public guestbook functionality

**Section sources**
- [20240101000000_init.sql:39-46](file://supabase/migrations/20240101000000_init.sql#L39-L46)

### rate_limits
- Purpose: Enforces rate limits for quiz submissions and guestbook posts.
- Primary Key: id (SERIAL)
- Columns:
  - id: SERIAL PRIMARY KEY
  - ip_hash: TEXT NOT NULL
  - action: TEXT NOT NULL
  - created_at: TIMESTAMPTZ DEFAULT now()
- Constraints:
  - No explicit foreign keys
- Notes:
  - Row Level Security enabled
  - Service role access only (no anonymous policy)
  - Composite index on (ip_hash, action, created_at) for efficient lookups

**Section sources**
- [20240101000000_init.sql:48-54](file://supabase/migrations/20240101000000_init.sql#L48-L54)

## Indexes

- idx_rate_limits_lookup: (ip_hash, action, created_at)
  - Purpose: Efficient rate limit lookups per IP and action type
  - Used by both quiz and guestbook functions
- idx_leaderboard_ranking: (score DESC, duration_seconds ASC)
  - Purpose: Optimal ranking queries by score and completion time
- idx_leaderboard_difficulty: (difficulty, score DESC, duration_seconds ASC)
  - Purpose: Filtered ranking by difficulty level
- idx_guestbook_recent: (created_at DESC)
  - Purpose: Recent entries sorting for guestbook display

**Section sources**
- [20240101000000_init.sql:56-59](file://supabase/migrations/20240101000000_init.sql#L56-L59)
- [20240101000002_add_difficulty.sql:4-5](file://supabase/migrations/20240101000002_add_difficulty.sql#L4-L5)

## Relationships and Referential Integrity

- No explicit foreign key constraints defined in the schema
- Intended relationships:
  - quiz_sessions.question_ids references trivia_questions.id (arrays)
  - quiz_sessions.ip_hash and guestbook.ip_hash reference client IP addresses
  - rate_limits.ip_hash tracks submission activity
- Referential integrity enforced at application level through:
  - Quiz session creation ensures question_ids exist
  - Answer verification against trivia_questions.correct_answer
  - IP hashing for rate limiting consistency

**Section sources**
- [20240101000000_init.sql:17-26](file://supabase/migrations/20240101000000_init.sql#L17-L26)
- [20240101000001_seed_questions.sql:7-60](file://supabase/migrations/20240101000001_seed_questions.sql#L7-L60)

## Row Level Security Policies

### trivia_questions
- Policy: "trivia_questions_select"
- Access: anon, authenticated
- Condition: true
- Effect: Public read access
- Security note: Correct answer excluded from client-facing queries

### leaderboard
- Policy: "leaderboard_select"
- Access: anon, authenticated
- Condition: true
- Effect: Public read access
- Additional: Service role can INSERT

### guestbook
- Policy: "guestbook_select"
- Access: anon, authenticated
- Condition: true
- Effect: Public read access
- Additional: Service role can INSERT

### quiz_sessions, rate_limits
- Access: Service role only
- No anonymous SELECT policy
- Security note: Prevents direct client access to sensitive session data

**Section sources**
- [20240101000000_init.sql:68-87](file://supabase/migrations/20240101000000_init.sql#L68-L87)

## Initial Data Seeding

### Question Bank Structure
- Total questions: 30
- Categories:
  - postgresql: 7 questions
  - linux: 7 questions
  - gitlab: 6 questions
  - emily: 10 questions (personal lore)
  - mixed: 0 questions (seeded as mixed)
- Difficulty distribution:
  - easy: 10 questions
  - medium: 12 questions
  - hard: 8 questions

### Seeding Process
- Run seed script after initial migration
- Questions inserted with correct_answer and category/difficulty metadata
- Personal/emily category questions require site discovery
- Mixed category questions combine multiple topics

**Section sources**
- [20240101000001_seed_questions.sql:1-61](file://supabase/migrations/20240101000001_seed_questions.sql#L1-L61)

## Data Validation Rules

### Quiz Submission Validation
- Nickname: 3-20 characters, alphanumeric, spaces, underscores, hyphens only
- Duration: 5-3600 seconds (5 seconds to 60 minutes)
- Answer count: Must match number of questions in session
- Duplicate submission prevention: Session marked completed after first submission
- Rate limiting: 20 submissions per day per IP

### Guestbook Validation
- Nickname: Same pattern as quiz
- Message: 2-300 characters, trimmed
- Spam detection: URL limit (max 2 URLs), keyword filtering
- Rate limiting: 5 posts per hour per IP
- Honeypot field: Optional anti-bot mechanism

**Section sources**
- [submit-quiz/index.ts:15-42](file://supabase/functions/submit-quiz/index.ts#L15-L42)
- [post-guestbook/index.ts:12-49](file://supabase/functions/post-guestbook/index.ts#L12-L49)

## Business Logic Constraints

### Quiz Flow
1. Session creation: Randomized question selection with category/difficulty filters
2. Answer verification: Server-side scoring against correct_answer
3. Category/difficulty determination: Derived from session questions
4. Leaderboard insertion: With performance metrics
5. Rate limit logging: Per-IP submission tracking
6. Session completion: Prevents duplicate submissions

### Guestbook Moderation
1. Content validation: Length, spam detection, URL limits
2. Rate limiting: Hourly caps per IP
3. Storage: Cleaned and trimmed content
4. Display: Recent-first ordering

**Section sources**
- [start-quiz/index.ts:28-47](file://supabase/functions/start-quiz/index.ts#L28-L47)
- [submit-quiz/index.ts:75-114](file://supabase/functions/submit-quiz/index.ts#L75-L114)
- [post-guestbook/index.ts:51-77](file://supabase/functions/post-guestbook/index.ts#L51-L77)

## Data Lifecycle Management

### Quiz Sessions
- Creation: Randomized question set with IP hashing
- Completion: Score calculation and session marking
- Expiration: No automatic cleanup defined
- Archival: Results stored in leaderboard

### Rate Limits
- Tracking: Separate entries per IP and action
- Cleanup: No automatic pruning defined
- Monitoring: Count-based queries for enforcement

### Guestbook
- Display: Recent entries first
- Moderation: Content validation and spam filtering
- Storage: No explicit deletion policy

**Section sources**
- [start-quiz/index.ts:48-68](file://supabase/functions/start-quiz/index.ts#L48-L68)
- [submit-quiz/index.ts:108-114](file://supabase/functions/submit-quiz/index.ts#L108-L114)
- [post-guestbook/index.ts:51-77](file://supabase/functions/post-guestbook/index.ts#L51-L77)

## Data Access Methods

### Quiz Functions
- start-quiz: Creates session, returns randomized questions (without correct answers)
- submit-quiz: Scores answers, inserts leaderboard record, applies rate limits

### Guestbook Function
- post-guestbook: Validates content, applies rate limits, inserts message

### Direct Database Access
- Public read access to trivia_questions, leaderboard, guestbook
- Service role required for quiz_sessions and rate_limits operations

**Section sources**
- [start-quiz/index.ts:15-69](file://supabase/functions/start-quiz/index.ts#L15-L69)
- [submit-quiz/index.ts:18-119](file://supabase/functions/submit-quiz/index.ts#L18-L119)
- [post-guestbook/index.ts:17-82](file://supabase/functions/post-guestbook/index.ts#L17-L82)

## Performance Optimization Strategies

### Index Usage
- leaderboard ranking: Composite index optimizes score/duration queries
- rate_limits: Multi-column index enables efficient per-IP, per-action lookups
- guestbook: Reverse chronological sort for recent-first display

### Query Patterns
- Question selection: Fetch larger set then shuffle client-side to avoid expensive ORDER BY
- Answer verification: Single query to retrieve correct answers for session questions
- Rate limit checks: Exact-count queries with time window filtering

### Caching Opportunities
- Question lists: Potential caching for frequently accessed categories
- Leaderboard snapshots: Periodic aggregation for heavy ranking queries
- IP hash computation: Client-side hashing reduces server load

**Section sources**
- [20240101000000_init.sql:56-59](file://supabase/migrations/20240101000000_init.sql#L56-L59)
- [start-quiz/index.ts:28-47](file://supabase/functions/start-quiz/index.ts#L28-L47)
- [submit-quiz/index.ts:75-81](file://supabase/functions/submit-quiz/index.ts#L75-L81)

## Data Security Considerations

### Access Control
- RLS policies restrict anonymous access to sensitive tables
- Service role credentials required for administrative operations
- Correct answer hidden from client-facing queries
- IP addresses hashed before storage for privacy

### Input Sanitization
- Strict regex validation for nicknames
- Message trimming and length limits
- URL and spam keyword filtering
- Honeypot field for bot detection

### Privacy Protection
- IP addresses stored as SHA-256 hashes
- No personally identifiable information collected
- Rate limit data minimal and time-bounded

**Section sources**
- [20240101000000_init.sql:61-87](file://supabase/migrations/20240101000000_init.sql#L61-L87)
- [submit-quiz/index.ts:71-75](file://supabase/functions/submit-quiz/index.ts#L71-L75)
- [post-guestbook/index.ts:90-94](file://supabase/functions/post-guestbook/index.ts#L90-L94)

## Backup Procedures

### Recommended Approach
- Database export: Use Supabase CLI or SQL Editor exports
- Migration preservation: Keep all migration files under version control
- Data separation: Consider separate backups for production vs staging
- Testing: Regular restore testing to validate backup integrity

### Migration Management
- Version control: All SQL migrations tracked in repository
- Rollback capability: Downward-compatible migrations preferred
- Deployment: Apply migrations sequentially in timestamp order

**Section sources**
- [20240101000000_init.sql:1-3](file://supabase/migrations/20240101000000_init.sql#L1-L3)
- [20240101000001_seed_questions.sql:1-3](file://supabase/migrations/20240101000001_seed_questions.sql#L1-L3)

## Common Query Patterns

### Leaderboard Ranking
```sql
SELECT nickname, score, duration_seconds, category, difficulty
FROM leaderboard
ORDER BY score DESC, duration_seconds ASC
LIMIT 50;
```

### Category-Specific Queries
```sql
SELECT * FROM trivia_questions
WHERE category = 'postgresql'
ORDER BY RANDOM()
LIMIT 10;
```

### Rate Limit Checking
```sql
SELECT COUNT(*) as recent_count
FROM rate_limits
WHERE ip_hash = ?
AND action = ?
AND created_at >= NOW() - INTERVAL '1 day';
```

### Guestbook Recent Entries
```sql
SELECT nickname, message, created_at
FROM guestbook
ORDER BY created_at DESC
LIMIT 50;
```

**Section sources**
- [20240101000000_init.sql:58-59](file://supabase/migrations/20240101000000_init.sql#L58-L59)
- [20240101000002_add_difficulty.sql:5](file://supabase/migrations/20240101000002_add_difficulty.sql#L5)
- [submit-quiz/index.ts:64-73](file://supabase/functions/submit-quiz/index.ts#L64-L73)
- [post-guestbook/index.ts:56-65](file://supabase/functions/post-guestbook/index.ts#L56-L65)