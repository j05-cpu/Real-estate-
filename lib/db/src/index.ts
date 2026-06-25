import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Support both Supabase (SUPABASE_DATABASE_URL) and Replit's managed DB (DATABASE_URL)
const connectionString = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("SUPABASE_DATABASE_URL or DATABASE_URL must be set.");
}

// Supabase requires SSL; add it if not already present
const isSupabase = connectionString.includes("supabase.co");
const ssl = isSupabase ? { rejectUnauthorized: false } : undefined;

export const pool = new Pool({ connectionString, ssl });
export const db = drizzle(pool, { schema });

export * from "./schema";
