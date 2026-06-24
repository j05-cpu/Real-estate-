import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadsTable = pgTable("leads", {
  id:              serial("id").primaryKey(),
  rowNumber:       text("row_number"),
  customerName:    text("customer_name").notNull(),
  phoneNumber:     text("phone_number"),
  email:           text("email"),
  bhkPreference:   text("bhk_preference"),
  preferredLocation: text("preferred_location"),
  budgetRange:     text("budget_range"),
  leadSummary:     text("lead_summary"),
  isHot:           boolean("is_hot").default(false),
  isWarm:          boolean("is_warm").default(false),
  isCold:          boolean("is_cold").default(false),
  createdAt:       timestamp("created_at").defaultNow(),
  updatedAt:       timestamp("updated_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
