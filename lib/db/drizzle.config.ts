import { defineConfig } from "drizzle-kit";
import path from "path";

const dbUrl = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("SUPABASE_DATABASE_URL or DATABASE_URL must be set before running drizzle-kit");
}

// Ensure SSL is enabled for Supabase
const url = dbUrl.includes("sslmode=") ? dbUrl : `${dbUrl}?sslmode=require`;

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url,
    ssl: true,
  },
});
