CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subscribers BIGINT NOT NULL DEFAULT 0 CHECK (subscribers >= 0),
  monetized BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  views BIGINT NOT NULL DEFAULT 0 CHECK (views >= 0),
  likes BIGINT NOT NULL DEFAULT 0 CHECK (likes >= 0),
  comments BIGINT NOT NULL DEFAULT 0 CHECK (comments >= 0)
);

CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views BIGINT NOT NULL DEFAULT 0 CHECK (views >= 0),
  subscribers BIGINT NOT NULL DEFAULT 0 CHECK (subscribers >= 0),
  revenue NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (revenue >= 0),
  UNIQUE (channel_id, date)
);

CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target NUMERIC(14, 2) NOT NULL,
  current NUMERIC(14, 2) NOT NULL DEFAULT 0,
  deadline DATE,
  status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  stage TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100)
);

CREATE INDEX IF NOT EXISTS channels_user_id_idx ON channels(user_id);
CREATE INDEX IF NOT EXISTS videos_channel_id_idx ON videos(channel_id);
CREATE INDEX IF NOT EXISTS metrics_channel_date_idx ON metrics(channel_id, date DESC);
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
CREATE INDEX IF NOT EXISTS workflows_user_id_idx ON workflows(user_id);
