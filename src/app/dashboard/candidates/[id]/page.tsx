// dashboard/candidates/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Candidate, Assessment } from "@/lib/types";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Pencil,
  Calendar,
  User,
  BookOpen,
  FileText,
  ChartBar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CandidateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth-test");
        if (!res.ok) {
          // Not authenticated, redirect to login
          router.push("/login");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchCandidate = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/candidates/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch candidate");
        }
        const data = await response.json();
        setCandidate(data);
      } catch (err) {
        console.error("Error fetching candidate:", err);
        setError("Failed to load candidate data");
        toast.error("Failed to load candidate data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const calculateStats = () => {
    if (!candidate?.assessments || candidate.assessments.length === 0) {
      return {
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        totalAssessments: 0,
      };
    }

    const scores = candidate.assessments
      .map((assessment) => assessment.c1Score)
      .filter((score): score is number => score !== null);
    return {
      averageScore:
        scores.reduce((sum, score) => sum + score, 0) / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      totalAssessments: scores.length,
    };
  };

  const stats = calculateStats();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading candidate data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {error || "Candidate not found"}
            </p>
            <Button
              onClick={() => router.back()}
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="mr-4"
            onClick={() => router.push("/dashboard/candidates")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Candidate Details
          </h1>
        </div>
        <Button size="sm" onClick={() => router.push(`/candidates/${id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Candidate
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Information */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Candidate Information</CardTitle>
            <CardDescription>Personal and academic details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Name
                  </p>
                  <p className="font-medium">{candidate.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    NPM
                  </p>
                  <p className="font-medium">{candidate.npm}</p>
                </div>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Semester
                  </p>
                  <p className="font-medium">{candidate.semester}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created At
                  </p>
                  <p className="font-medium">
                    {formatDate(candidate.createdAt.toString())}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last Updated
                  </p>
                  <p className="font-medium">
                    {formatDate(candidate.updatedAt.toString())}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Assessment Summary</CardTitle>
            <CardDescription>Overall performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Average Score
                </p>
                <p className="text-2xl font-bold">
                  {stats.averageScore.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Highest Score
                </p>
                <p className="text-2xl font-bold">
                  {stats.highestScore.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Lowest Score
                </p>
                <p className="text-2xl font-bold">
                  {stats.lowestScore.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Assessments
                </p>
                <p className="text-2xl font-bold">{stats.totalAssessments}</p>
              </div>
            </div>

            <Tabs defaultValue="timeline">
              <TabsList className="mb-4">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline">
                {candidate.assessments && candidate.assessments.length > 0 ? (
                  <div className="relative pl-6 border-l border-gray-200 dark:border-gray-800 space-y-6">
                    {candidate.assessments
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt ?? "").getTime() -
                          new Date(a.createdAt ?? "").getTime()
                      )
                      .map((assessment) => (
                        <div key={assessment.id} className="relative">
                          <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-blue-500"></div>
                          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-gray-500">
                                {formatDate(
                                  assessment.createdAt?.toString() ?? ""
                                )}
                              </p>
                              <Badge
                                variant={
                                  (assessment.c1Score ?? 0) >= 70
                                    ? "success"
                                    : "destructive"
                                }
                              >
                                Score: {assessment.c1Score}
                              </Badge>
                            </div>
                            <p className="text-sm mb-2">
                              <span className="font-medium">Course:</span>{" "}
                              {assessment.courseId}
                            </p>
                            <p className="text-sm mb-2">
                              <span className="font-medium">C1 Score:</span>{" "}
                              {assessment.c1Score}
                            </p>
                            <p className="text-sm mb-2">
                              <span className="font-medium">C2 Score:</span>{" "}
                              {assessment.c2Score}
                            </p>
                            <p className="text-sm mb-2">
                              <span className="font-medium">C3 Score:</span>{" "}
                              {assessment.c3Score}
                            </p>
                            <p className="text-sm mb-2">
                              <span className="font-medium">C4 Score:</span>{" "}
                              {assessment.c4Score}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">C5 Score:</span>{" "}
                              {assessment.c5Score}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No assessments available
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="performance">
                {candidate.assessments && candidate.assessments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>C1</TableHead>
                        <TableHead>C2</TableHead>
                        <TableHead>C3</TableHead>
                        <TableHead>C4</TableHead>
                        <TableHead>C5</TableHead>
                        <TableHead>Final Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidate.assessments
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt ?? "").getTime() -
                            new Date(a.createdAt ?? "").getTime()
                        )
                        .map((assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell>
                              {formatDate(
                                assessment.createdAt?.toString() ?? ""
                              )}
                            </TableCell>
                            <TableCell>{assessment.courseId}</TableCell>
                            <TableCell>{assessment.c1Score}</TableCell>
                            <TableCell>{assessment.c2Score}</TableCell>
                            <TableCell>{assessment.c3Score}</TableCell>
                            <TableCell>{assessment.c4Score}</TableCell>
                            <TableCell>{assessment.c5Score}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  (assessment.c1Score ?? 0) >= 70
                                    ? "success"
                                    : "destructive"
                                }
                              >
                                {assessment.c1Score}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No assessments available
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Criteria Breakdown */}
      {candidate.assessments && candidate.assessments.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Criteria Breakdown</CardTitle>
            <CardDescription>Average scores by criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {["C1", "C2", "C3", "C4", "C5"].map((criterion, index) => {
                const criterionKey = `c${index + 1}Score` as keyof Assessment;
                const scores = candidate.assessments?.map(
                  (a) => a[criterionKey]
                ) as number[];
                const average =
                  scores.length > 0
                    ? scores.reduce((sum, score) => sum + score, 0) /
                      scores.length
                    : 0;

                return (
                  <div
                    key={criterion}
                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {criterion} Average
                    </p>
                    <p className="text-2xl font-bold">{average.toFixed(2)}</p>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(average / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Assessment History */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
            <CardDescription>Timeline of assessment activities</CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {candidate.assessments && candidate.assessments.length > 0 ? (
              <div className="space-y-4">
                {candidate.assessments
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt?.toString() ?? "").getTime() -
                      new Date(a.createdAt?.toString() ?? "").getTime()
                  )
                  .map((assessment) => (
                    <div key={assessment.id} className="flex items-start">
                      <div className="min-w-10 pt-1">
                        <Badge
                          variant="outline"
                          className="h-8 w-8 rounded-full flex items-center justify-center p-0"
                        >
                          {(assessment.c1Score ?? 0) >= 70 ? "✓" : "!"}
                        </Badge>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium">
                          Assessment for Course ID: {assessment.courseId}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(assessment.createdAt?.toString() ?? "")}
                        </p>
                        <p className="text-sm mt-1">
                          Final Score:{" "}
                          <span
                            className={
                              (assessment.c1Score ?? 0) >= 70
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {assessment.c1Score}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No assessment history available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Available operations for this candidate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                className="w-full"
                onClick={() =>
                  router.push(`/assessments/new?candidateId=${id}`)
                }
              >
                <ChartBar className="mr-2 h-4 w-4" />
                Create New Assessment
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/candidates/${id}/edit`)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Information
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/reports/candidates/${id}`)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Separator className="my-4" />
              <Button variant="destructive" className="w-full">
                Delete Candidate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
