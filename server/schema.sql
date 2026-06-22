-- ── Enable UUID extension ─────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(255)        NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  provider      VARCHAR(50)  DEFAULT 'email',
  avatar_url    TEXT,
  plan          VARCHAR(50)  DEFAULT 'free',
  minutes_used  INTEGER      DEFAULT 0,
  created_at    TIMESTAMP    DEFAULT NOW(),
  updated_at    TIMESTAMP    DEFAULT NOW()
);

-- ── Transcripts ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transcripts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  language    VARCHAR(50)  DEFAULT 'auto',
  audio_url   TEXT,
  duration    VARCHAR(20)  DEFAULT '—',
  speakers    INTEGER      DEFAULT 1,
  status      VARCHAR(50)  DEFAULT 'processing',
  content     JSONB,
  summary     JSONB,
  created_at  TIMESTAMP    DEFAULT NOW(),
  updated_at  TIMESTAMP    DEFAULT NOW()
);

-- ── Speaker labels ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS speakers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transcript_id UUID        NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  label         VARCHAR(10) NOT NULL,
  name          VARCHAR(255),
  created_at    TIMESTAMP   DEFAULT NOW()
);

-- ── Team workspaces ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workspaces (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       VARCHAR(255) NOT NULL,
  owner_id   UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP    DEFAULT NOW()
);

-- ── Workspace members ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workspace_members (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
  role         VARCHAR(50) DEFAULT 'member',
  joined_at    TIMESTAMP   DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- ── Indexes ───────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_transcripts_user_id   ON transcripts(user_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_status     ON transcripts(status);
CREATE INDEX IF NOT EXISTS idx_transcripts_created_at ON transcripts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_speakers_transcript_id ON speakers(transcript_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);

-- ── Auto-update updated_at ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER transcripts_updated_at
  BEFORE UPDATE ON transcripts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();