CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trails (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  region VARCHAR(100),
  difficulty VARCHAR(20),
  estimated_time VARCHAR(50),
  shade_level VARCHAR(20),
  water_sources BOOLEAN DEFAULT FALSE,
  description TEXT,
  map_center_lat DECIMAL(10,7),
  map_center_lng DECIMAL(10,7)
);

CREATE TABLE waypoints (
  id SERIAL PRIMARY KEY,
  trail_id INTEGER REFERENCES trails(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  lat DECIMAL(10,7) NOT NULL,
  lng DECIMAL(10,7) NOT NULL,
  story_text TEXT,
  order_on_trail INTEGER
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  trail_id INTEGER REFERENCES trails(id) ON DELETE CASCADE,
  UNIQUE(user_id, trail_id)
);