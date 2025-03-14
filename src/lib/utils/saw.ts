// src/lib/utils/saw.ts
import { type Assessment, type CriteriaWeight } from "../types";

/**
 * Normalize a decision matrix value based on the SAW method.
 * For benefit criteria (higher is better), we divide by the max value.
 * For cost criteria (lower is better), we divide the min value by the current value.
 */
export function normalizeValue(
  value: number,
  allValues: number[],
  isBenefit: boolean = true,
): number {
  if (allValues.length === 0) return 0;
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);

  // Handle division by zero cases
  if (isBenefit) {
    return max === 0 ? 0 : value / max;
  } else {
    return value === 0 ? 0 : min / value;
  }
}

/**
 * Calculate normalized matrix for all assessments
 */
export function calculateNormalizedMatrix(assessments: Assessment[]): {
  normalized: Array<{
    id: number;
    candidateId: number;
    candidateName: string;
    normalizedC1: number;
    normalizedC2: number;
    normalizedC3: number;
    normalizedC4: number;
    normalizedC5: number;
  }>;
  rawValues: {
    c1Values: number[];
    c2Values: number[];
    c3Values: number[];
    c4Values: number[];
    c5Values: number[];
  };
} {
  // Extract all values for each criterion and ensure they're numbers
  const c1Values = assessments.map((a) => Number(a.c1Score));
  const c2Values = assessments.map((a) => Number(a.c2Score));
  const c3Values = assessments.map((a) => Number(a.c3Score));
  const c4Values = assessments.map((a) => Number(a.c4Score));
  const c5Values = assessments.map((a) => Number(a.c5Score));

  // Calculate normalized values for each assessment
  const normalized = assessments.map((assessment) => ({
    id: assessment.id,
    candidateId: assessment.candidateId,
    candidateName: assessment.candidateName,
    normalizedC1: normalizeValue(Number(assessment.c1Score), c1Values, true),
    normalizedC2: normalizeValue(Number(assessment.c2Score), c2Values, true),
    normalizedC3: normalizeValue(Number(assessment.c3Score), c3Values, true),
    normalizedC4: normalizeValue(Number(assessment.c4Score), c4Values, true),
    normalizedC5: normalizeValue(Number(assessment.c5Score), c5Values, true),
  }));

  return {
    normalized,
    rawValues: {
      c1Values,
      c2Values,
      c3Values,
      c4Values,
      c5Values,
    },
  };
}

/**
 * Calculate final preference values for each candidate
 */
export function calculatePreferenceValues(
  normalizedMatrix: Array<{
    id: number;
    candidateId: number;
    candidateName: string;
    normalizedC1: number;
    normalizedC2: number;
    normalizedC3: number;
    normalizedC4: number;
    normalizedC5: number;
  }>,
  weights: CriteriaWeight,
) {
  return normalizedMatrix.map((item) => {
    const preferenceValue =
      item.normalizedC1 * Number(weights.c1Weight) +
      item.normalizedC2 * Number(weights.c2Weight) +
      item.normalizedC3 * Number(weights.c3Weight) +
      item.normalizedC4 * Number(weights.c4Weight) +
      item.normalizedC5 * Number(weights.c5Weight);

    return {
      id: item.id,
      candidateId: item.candidateId,
      candidateName: item.candidateName,
      normalizedC1: item.normalizedC1,
      normalizedC2: item.normalizedC2,
      normalizedC3: item.normalizedC3,
      normalizedC4: item.normalizedC4,
      normalizedC5: item.normalizedC5,
      preferenceValue: parseFloat(preferenceValue.toFixed(2)),
    };
  });
}

/**
 * Convert raw scores to 1-5 scale according to defined ranges
 */
export function convertToScale(value: number, type: "ipk" | "score"): number {
  if (type === "ipk") {
    if (value >= 3.81 && value <= 4.0) return 5;
    if (value >= 3.51 && value <= 3.8) return 4;
    if (value >= 3.31 && value <= 3.5) return 3;
    if (value >= 3.0 && value <= 3.3) return 2;
    return 1;
  } else {
    // Score type (0-100)
    if (value >= 86 && value <= 100) return 5;
    if (value >= 76 && value <= 85) return 4;
    if (value >= 66 && value <= 75) return 3;
    if (value >= 51 && value <= 65) return 2;
    return 1;
  }
}
