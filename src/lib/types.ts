// src/lib/types.ts
import { type InferSelectModel } from "drizzle-orm";
import {
  users,
  candidates,
  courses,
  criteriaWeights,
  assessments,
  assessmentPeriods,
} from "../db/schema";

// Base types from schema
export type User = InferSelectModel<typeof users>;
export type Candidate = InferSelectModel<typeof candidates> & {
  assessments?: Assessment[];
};
export type Course = InferSelectModel<typeof courses> & {
  criteriaWeights?: CriteriaWeight[];
  assessmentPeriods?: AssessmentPeriod[];
  assessments?: Assessment[];
};
export type CriteriaWeight = InferSelectModel<typeof criteriaWeights>;
export type Assessment = InferSelectModel<typeof assessments> & {
  candidate: Candidate; // Hapus optional chaining (?)
  candidateName: string;
};
export type AssessmentPeriod = InferSelectModel<typeof assessmentPeriods>;

// Extended types for UI components
export type NavItem = {
  title: string;
  href: string;
  icon: React.JSX.Element;
};

export type StatCard = {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
};

// Types for SAW calculation
export type NormalizedMatrix = {
  id: number;
  candidateId: number;
  candidateName: string;
  normalizedC1: number;
  normalizedC2: number;
  normalizedC3: number;
  normalizedC4: number;
  normalizedC5: number;
};

export type PreferenceValue = NormalizedMatrix & {
  preferenceValue: number;
};

export type SAWResult = {
  matrix: Array<{
    id: number;
    candidateId: number;
    candidateName: string;
    c1Score: number;
    c2Score: number;
    c3Score: number;
    c4Score: number;
    c5Score: number;
  }>;
  normalized: NormalizedMatrix[];
  preferenceValues: PreferenceValue[];
  weights: CriteriaWeight;
};

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}