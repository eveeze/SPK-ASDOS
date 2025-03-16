"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type SAWResult } from "@/lib/types";

export default function CalculationPage() {
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [sawResult, setSawResult] = useState<SAWResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/course");
        const data = await response.json();
        if (Array.isArray(data)) {
          setCourses(data);
          if (data.length > 0) {
            setSelectedCourseId(String(data[0].id));
          }
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Fetch calculation results when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      fetchCalculations();
    }
  }, [selectedCourseId]);

  const fetchCalculations = async () => {
    if (!selectedCourseId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/calculations/course/${selectedCourseId}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setSawResult(data);
    } catch (error) {
      console.error("Failed to fetch calculations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecalculate = async () => {
    if (!selectedCourseId) return;

    setIsRecalculating(true);
    try {
      const response = await fetch(
        `/api/calculations/course/${selectedCourseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Refetch the calculations to show updated results
      await fetchCalculations();
    } catch (error) {
      console.error("Failed to recalculate scores:", error);
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
    setSawResult(null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Assessment Calculations</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            label="Select Course"
            options={courses.map((course) => ({
              value: String(course.id),
              label: course.name,
            }))}
            value={selectedCourseId}
            onChange={handleCourseChange}
            wrapperClassName="col-span-2"
          />

          <Button
            onClick={handleRecalculate}
            isLoading={isRecalculating}
            className="self-end"
          >
            Recalculate Scores
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : sawResult ? (
          <div className="space-y-8">
            {/* Criteria Weights Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Criteria Weights</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    C1 Weight
                  </p>
                  <p className="text-lg font-medium">
                    {sawResult.weights.c1Weight}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    C2 Weight
                  </p>
                  <p className="text-lg font-medium">
                    {sawResult.weights.c2Weight}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    C3 Weight
                  </p>
                  <p className="text-lg font-medium">
                    {sawResult.weights.c3Weight}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    C4 Weight
                  </p>
                  <p className="text-lg font-medium">
                    {sawResult.weights.c4Weight}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    C5 Weight
                  </p>
                  <p className="text-lg font-medium">
                    {sawResult.weights.c5Weight}
                  </p>
                </div>
              </div>
            </div>

            {/* Original Matrix */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Original Matrix</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>C1</TableHead>
                      <TableHead>C2</TableHead>
                      <TableHead>C3</TableHead>
                      <TableHead>C4</TableHead>
                      <TableHead>C5</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sawResult.matrix.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">
                          {row.candidateName}
                        </TableCell>
                        <TableCell>{row.c1Score}</TableCell>
                        <TableCell>{row.c2Score}</TableCell>
                        <TableCell>{row.c3Score}</TableCell>
                        <TableCell>{row.c4Score}</TableCell>
                        <TableCell>{row.c5Score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Normalized Matrix */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Normalized Matrix</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>C1</TableHead>
                      <TableHead>C2</TableHead>
                      <TableHead>C3</TableHead>
                      <TableHead>C4</TableHead>
                      <TableHead>C5</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sawResult.normalized.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">
                          {row.candidateName}
                        </TableCell>
                        <TableCell>{row.normalizedC1.toFixed(4)}</TableCell>
                        <TableCell>{row.normalizedC2.toFixed(4)}</TableCell>
                        <TableCell>{row.normalizedC3.toFixed(4)}</TableCell>
                        <TableCell>{row.normalizedC4.toFixed(4)}</TableCell>
                        <TableCell>{row.normalizedC5.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Preference Values (Final Ranking) */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Final Rankings</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Preference Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sawResult.preferenceValues.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {row.candidateName}
                        </TableCell>
                        <TableCell>{row.preferenceValue.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            {selectedCourseId
              ? "No calculation data available for this course."
              : "Please select a course to view calculations."}
          </div>
        )}
      </div>
    </div>
  );
}
