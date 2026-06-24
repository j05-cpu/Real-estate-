import { defineConfig } from "drizzle-kit";
import path from "path";

// Prefer SUPABASE_DATABASE_URL (custom) over Replit's managed DATABASE_URL
const dbUrl = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("SUPABASE_DATABASE_URL or DATABASE_URL must be set before running drizzle-kit");
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
