// src/db/schema.ts
import {
  pgTable,
  serial,
  varchar,
  numeric,
  text,
  timestamp,
  integer,
  boolean,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  npm: varchar("npm", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  semester: integer("semester").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
});

export const criteriaWeights = pgTable("criteria_weights", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id, {
      onDelete: "cascade",
    })
    .unique(),
  c1Weight: integer("c1_weight").notNull().default(3),
  c2Weight: integer("c2_weight").notNull().default(2),
  c3Weight: integer("c3_weight").notNull().default(2),
  c4Weight: integer("c4_weight").notNull().default(2),
  c5Weight: integer("c5_weight").notNull().default(3),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id")
    .notNull() // Tambahkan ini
    .references(() => candidates.id),
  courseId: integer("course_id")
    .notNull() // Tambahkan ini
    .references(() => courses.id),
  c1Value: varchar("c1_value"),
  c2Value: varchar("c2_value"),
  c3Value: varchar("c3_value"),
  c4Value: varchar("c4_value"),
  c5Value: varchar("c5_value"),
  c1Score: integer("c1_score"),
  c2Score: integer("c2_score"),
  c3Score: integer("c3_score"),
  c4Score: integer("c4_score"),
  c5Score: integer("c5_score"),
  totalScore: doublePrecision("total_score"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assessmentPeriods = pgTable("assessment_periods", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  courseId: integer("course_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const candidatesRelations = relations(candidates, ({ many }) => ({
  assessments: many(assessments),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  criteriaWeights: many(criteriaWeights),
  assessmentPeriods: many(assessmentPeriods),
  assessments: many(assessments),
}));

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  candidate: one(candidates, {
    fields: [assessments.candidateId],
    references: [candidates.id],
  }),
  course: one(courses, {
    fields: [assessments.courseId],
    references: [courses.id],
  }),
}));

export const criteriaWeightsRelations = relations(
  criteriaWeights,
  ({ one }) => ({
    course: one(courses, {
      fields: [criteriaWeights.courseId],
      references: [courses.id],
    }),
  })
);

export const assessmentPeriodsRelations = relations(
  assessmentPeriods,
  ({ one }) => ({
    course: one(courses, {
      fields: [assessmentPeriods.courseId],
      references: [courses.id],
    }),
  })
);
