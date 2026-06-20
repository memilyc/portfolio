-- Seed: 30 trivia questions (mix of tech + personal about Emily)
-- Run after the migration, or paste into SQL Editor

-- ═══════════════════════════════════════════════════════════
--  PostgreSQL category
-- ═══════════════════════════════════════════════════════════
INSERT INTO trivia_questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty) VALUES
('What does pg_stat_activity show?', 'Active database connections and queries', 'Database disk usage', 'Replication lag', 'Table sizes', 'a', 'postgresql', 'easy'),
('Which PostgreSQL view helps find slow queries?', 'pg_stat_statements', 'pg_class', 'pg_attribute', 'pg_namespace', 'a', 'postgresql', 'medium'),
('What is the default port for PostgreSQL?', '3306', '5432', '27017', '6379', 'b', 'postgresql', 'easy'),
('What does VACUUM do in PostgreSQL?', 'Deletes tables', 'Recovers disk space from dead rows', 'Creates indexes', 'Restarts the server', 'b', 'postgresql', 'medium'),
('Which command shows the PostgreSQL version?', 'pg_version()', 'SELECT version();', 'psql --v', 'SHOW VER;', 'b', 'postgresql', 'easy'),
('What is a "bloat" in PostgreSQL?', 'A type of index', 'Wasted space from dead tuples not yet vacuumed', 'A replication error', 'A network issue', 'b', 'postgresql', 'hard'),
('What does pg_locks show?', 'Table sizes', 'Current locks held and waited for', 'Query plans', 'User permissions', 'b', 'postgresql', 'medium');

-- ═══════════════════════════════════════════════════════════
--  Linux category
-- ═══════════════════════════════════════════════════════════
INSERT INTO trivia_questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty) VALUES
('What does dmesg print?', 'Disk usage', 'Kernel ring buffer messages', 'DNS records', 'Memory stats', 'b', 'linux', 'medium'),
('Which command checks open file descriptors?', 'lsof', 'top', 'htop', 'fdisk', 'a', 'linux', 'medium'),
('What does "load average" represent in uptime?', 'CPU temperature', 'Number of processes in run queue', 'Disk I/O wait', 'Network throughput', 'b', 'linux', 'hard'),
('What signal does Ctrl+C send?', 'SIGTERM', 'SIGKILL', 'SIGINT', 'SIGHUP', 'c', 'linux', 'medium'),
('What does /proc/cpuinfo contain?', 'CPU temperature', 'CPU model and core info', 'Process list', 'Memory layout', 'b', 'linux', 'easy'),
('Which command shows disk inode usage?', 'df -h', 'du -sh', 'df -i', 'ls -i', 'c', 'linux', 'hard'),
('What does strace do?', 'Stream audio', 'Trace system calls made by a process', 'Check storage RAID', 'Show swap usage', 'b', 'linux', 'medium');

-- ═══════════════════════════════════════════════════════════
--  GitLab category
-- ═══════════════════════════════════════════════════════════
INSERT INTO trivia_questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty) VALUES
('What is a GitLab Runner?', 'A race tracker', 'A CI/CD agent that executes jobs', 'A code reviewer bot', 'A deployment server', 'b', 'gitlab', 'easy'),
('What does gitlab-ctl do?', 'Git operations', 'Manages GitLab Omnibus services', 'Creates merge requests', 'Runs database migrations', 'b', 'gitlab', 'medium'),
('What is a GitLab Sidekiq queue used for?', 'Git push operations', 'Background job processing', 'Frontend rendering', 'SSH connections', 'b', 'gitlab', 'hard'),
('What file configures CI/CD pipelines?', 'Dockerfile', '.gitlab-ci.yml', 'Makefile', 'pipeline.yaml', 'b', 'gitlab', 'easy'),
('What does "It''s always DNS" mean in incident response?', 'DNS is the best service', 'DNS misconfiguration is a common root cause', 'DNS never fails', 'DNS is fast', 'b', 'gitlab', 'easy'),
('What is Gitaly in GitLab architecture?', 'A UI framework', 'The Git RPC service for storage', 'A monitoring tool', 'A load balancer', 'b', 'gitlab', 'hard');

-- ═══════════════════════════════════════════════════════════
--  Emily category (personal lore — discoverable through the site)
-- ═══════════════════════════════════════════════════════════
INSERT INTO trivia_questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty) VALUES
('How many years of experience does Emily have?', '5 years', '9+ years', '15 years', '3 years', 'b', 'emily', 'easy'),
('What is Emily''s top CliftonStrength?', 'Strategic', 'Positivity', 'Achiever', 'Analytical', 'b', 'emily', 'medium'),
('What database is Emily known for debugging?', 'MongoDB', 'Redis', 'PostgreSQL', 'Oracle', 'c', 'emily', 'easy'),
('What does Emily build so the same problem never bites twice?', 'Monitoring alerts', 'Documentation and internal tools', 'New features', 'Test suites', 'b', 'emily', 'medium'),
('What is Emily''s side project covering Malaysian Chinese entertainment?', 'TechMy', 'Viggou.net', 'MalayDev', 'AsiaCode', 'b', 'emily', 'medium'),
('What kind of on-call rotation does Emily run?', 'Business hours only', '24/7', 'Weekends only', 'No on-call', 'b', 'emily', 'easy'),
('Which cloud platforms has Emily worked with?', 'AWS only', 'AWS, GCP, and Azure', 'GCP only', 'Azure only', 'b', 'emily', 'easy'),
('What does Emily''s "systemctl status" show as memory usage?', '16GB', 'Unlimited', 'Coffee-dependent', '8GB', 'c', 'emily', 'hard'),
('What is the "restart policy" on Emily''s service?', 'On-failure', 'Never', 'Always', 'Manual', 'c', 'emily', 'hard'),
('What does "find / -name root_cause" eventually locate?', 'Nowhere', '/var/logs, /customer_comments, /postmortem.md, /documentation', '/dev/null', '/etc/root', 'b', 'emily', 'hard');

-- ═══════════════════════════════════════════════════════════
--  Mixed / general tech
-- ═══════════════════════════════════════════════════════════
INSERT INTO trivia_questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty) VALUES
('What does HTTP 429 mean?', 'Not Found', 'Too Many Requests', 'Server Error', 'Redirect', 'b', 'mixed', 'easy'),
('What is the default Docker network mode?', 'Host', 'Bridge', 'Overlay', 'None', 'b', 'mixed', 'medium'),
('What does "incident SEV1" typically mean?', 'Low priority', 'Critical / highest severity', 'Feature request', 'Documentation update', 'b', 'mixed', 'easy');
