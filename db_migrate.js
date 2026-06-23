const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '.env');
  const env = fs.readFileSync(envPath, 'utf8');
  env.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = val;
    }
  });
} catch (e) {
  console.log("Could not read .env file directly, relying on system environment variables:", e.message);
}

const pool = new Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '6543', 10),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB || 'postgres',
  ssl: process.env.PG_HOST && process.env.PG_HOST !== 'localhost' && process.env.PG_HOST !== '127.0.0.1' ? { rejectUnauthorized: false } : undefined,
});

async function migrate() {
  console.log("Running migration using connection config:", {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    database: process.env.PG_DB,
  });
  try {
    // Alter users table to add is_banned column
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;
    `);
    console.log("Users table altered successfully!");

    await pool.query(`DROP VIEW IF EXISTS issues_view;`);
    await pool.query(`DROP TABLE IF EXISTS issues CASCADE;`);

    await pool.query(`
      CREATE TABLE issues (
        issue_id SERIAL PRIMARY KEY,
        sender_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        receiver_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    await pool.query(`
      CREATE VIEW issues_view AS
      SELECT 
        i.issue_id,
        i.sender_id,
        s.name AS sender_name,
        s.email AS sender_email,
        s.role AS sender_role,
        i.receiver_id,
        r.name AS receiver_name,
        r.email AS receiver_email,
        r.role AS receiver_role,
        i.title,
        i.message,
        i.created_at
      FROM issues i
      LEFT JOIN users s ON i.sender_id = s.user_id
      LEFT JOIN users r ON i.receiver_id = r.user_id;
    `);

    console.log("Issues table and issues_view created successfully!");

    // Alter contacts table to add status column
    await pool.query(`
      ALTER TABLE contacts ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'replied'));
    `);
    console.log("Contacts table altered successfully to add status column!");

    // Create websites table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS websites (
        website_id SERIAL PRIMARY KEY,
        logo_url TEXT,
        theme_color TEXT,
        hero_title TEXT,
        hero_subtitle TEXT,
        name TEXT,
        address TEXT,
        tagline TEXT,
        sociallink TEXT,
        email TEXT,
        phone TEXT,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);
    console.log("Websites table created successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrate();
