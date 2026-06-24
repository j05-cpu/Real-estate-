import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const appointmentsTable = pgTable("appointments", {
  id:           serial("id").primaryKey(),
  buyerName:    text("buyer_name").notNull(),
  phoneNumber:  text("phone_number"),
  location:     text("location"),
  visitDate:    text("visit_date"),
  visitTime:    text("visit_time"),
  duration:     text("duration"),
  bhk:          text("bhk"),
  budget:       text("budget"),
  status:       text("status").default("Pending"),
  tag:          text("tag").default("Cold"),
  createdAt:    timestamp("created_at").defaultNow(),
  updatedAt:    timestamp("updated_at").defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointmentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointmentsTable.$inferSelect;
