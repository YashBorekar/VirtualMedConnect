import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("patient"), // patient or doctor
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Doctor profiles
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  specialty: varchar("specialty").notNull(),
  education: varchar("education"),
  hospital: varchar("hospital"),
  experience: integer("experience"), // years
  consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  isVerified: boolean("is_verified").default(false),
  isAvailable: boolean("is_available").default(true),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Appointments
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  doctorId: integer("doctor_id").notNull().references(() => doctors.id),
  appointmentDate: timestamp("appointment_date").notNull(),
  duration: integer("duration").default(30), // minutes
  consultationType: varchar("consultation_type").default("video"), // video, audio
  status: varchar("status").default("scheduled"), // scheduled, completed, cancelled
  reasonForVisit: text("reason_for_visit"),
  consultationNotes: text("consultation_notes"),
  consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Health records
export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  doctorId: integer("doctor_id").references(() => doctors.id),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  recordType: varchar("record_type").notNull(), // exam, test, prescription, etc.
  title: varchar("title").notNull(),
  description: text("description"),
  attachments: jsonb("attachments"), // array of file URLs
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Symptom analyses
export const symptomAnalyses = pgTable("symptom_analyses", {
  id: serial("id").primaryKey(),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  symptoms: text("symptoms").notNull(),
  age: varchar("age"),
  gender: varchar("gender"),
  analysis: jsonb("analysis"), // AI analysis results
  recommendations: text("recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  doctorProfile: one(doctors, {
    fields: [users.id],
    references: [doctors.userId],
  }),
  patientAppointments: many(appointments, {
    relationName: "patientAppointments",
  }),
  healthRecords: many(healthRecords),
  symptomAnalyses: many(symptomAnalyses),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, {
    fields: [doctors.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  healthRecords: many(healthRecords),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(users, {
    fields: [appointments.patientId],
    references: [users.id],
    relationName: "patientAppointments",
  }),
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
  healthRecord: one(healthRecords),
}));

export const healthRecordsRelations = relations(healthRecords, ({ one }) => ({
  patient: one(users, {
    fields: [healthRecords.patientId],
    references: [users.id],
  }),
  doctor: one(doctors, {
    fields: [healthRecords.doctorId],
    references: [doctors.id],
  }),
  appointment: one(appointments, {
    fields: [healthRecords.appointmentId],
    references: [appointments.id],
  }),
}));

export const symptomAnalysesRelations = relations(symptomAnalyses, ({ one }) => ({
  patient: one(users, {
    fields: [symptomAnalyses.patientId],
    references: [users.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertDoctor = typeof doctors.$inferInsert;
export type Doctor = typeof doctors.$inferSelect;

export type InsertAppointment = typeof appointments.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;

export type InsertHealthRecord = typeof healthRecords.$inferInsert;
export type HealthRecord = typeof healthRecords.$inferSelect;

export type InsertSymptomAnalysis = typeof symptomAnalyses.$inferInsert;
export type SymptomAnalysis = typeof symptomAnalyses.$inferSelect;

// Schemas
export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  appointmentDate: z.string().transform((str) => new Date(str)),
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSymptomAnalysisSchema = createInsertSchema(symptomAnalyses).omit({
  id: true,
  createdAt: true,
});
