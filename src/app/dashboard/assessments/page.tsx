// dashboard/assessments/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Assessment, Course, Candidate } from "@/lib/types";
import { Select, SelectOption } from "@/components/ui/select";
import { AssessmentDialog } from "@/components/ui/assessmentDialog";

export default function AssessmentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [courseOptions, setCourseOptions] = useState<SelectOption[]>([]);
  const [candidateOptions, setCandidateOptions] = useState<SelectOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [filteredCandidateOptions, setFilteredCandidateOptions] = useState<
    SelectOption[]
  >([]);
  const [courseCandidates, setCourseCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(
    null
  );
  const [formValues, setFormValues] = useState({
    candidateId: "",
    courseId: "",
    c1Value: "",
    c2Value: "",
    c3Value: "",
    c4Value: "",
    c5Value: "",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<number | null>(
    null
  );
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

  // Get courseId from URL params
  useEffect(() => {
    const courseId = searchParams.get("courseId");
    if (courseId) {
      setSelectedCourse(courseId);
      setFormValues((prev) => ({
        ...prev,
        courseId: courseId,
      }));
    }
  }, [searchParams]);

  // Fetch courses
  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/course");
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();

        setCourses(data);

        // Transform courses into SelectOptions format
        const options: SelectOption[] = data.map((course: Course) => ({
          value: course.id.toString(),
          label: `${course.code} - ${course.name}`,
        }));
        setCourseOptions(options);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      }
    }

    fetchCourses();
  }, []);

  // Fetch all candidates
  useEffect(() => {
    async function fetchCandidates() {
      try {
        const response = await fetch("/api/candidates");
        if (!response.ok) throw new Error("Failed to fetch candidates");
        const data = await response.json();

        // Check if data has candidates property, otherwise use data directly
        const candidatesData = data.candidates || data;
        setCandidates(candidatesData);

        // Transform candidates into SelectOptions format
        const options: SelectOption[] = candidatesData.map(
          (candidate: Candidate) => ({
            value: candidate.id.toString(),
            label: `${candidate.npm} - ${candidate.name}`,
          })
        );
        setCandidateOptions(options);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast.error("Failed to load candidates");
      }
    }

    fetchCandidates();
  }, []);

  // Fetch assessments when course is selected
  useEffect(() => {
    async function fetchAssessments() {
      if (!selectedCourse) {
        setAssessments([]);
        setCourseCandidates([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/assessments?courseId=${selectedCourse}`
        );
        if (!response.ok) throw new Error("Failed to fetch assessments");
        const data = await response.json();
        setAssessments(data.assessments);

        // Extract candidates with assessments for this course
        const assessedCandidateIds = new Set(
          data.assessments.map(
            (assessment: Assessment) => assessment.candidateId
          )
        );

        // Find course candidates - those who have assessments
        const courseCandidatesList = candidates.filter((candidate) =>
          assessedCandidateIds.has(candidate.id)
        );
        setCourseCandidates(courseCandidatesList);

        // Update filtered candidate options - exclude candidates who already have assessments
        // for this course to prevent duplicate assessments
        const filteredOptions = candidateOptions.filter(
          (option) => !assessedCandidateIds.has(parseInt(option.value))
        );
        setFilteredCandidateOptions(filteredOptions);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        toast.error("Failed to load assessments");
      } finally {
        setLoading(false);
      }
    }

    if (candidates.length > 0 && candidateOptions.length > 0) {
      fetchAssessments();
    }
  }, [selectedCourse, candidates, candidateOptions]);

  // Handle course selection
  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    setFormValues((prev) => ({
      ...prev,
      courseId: value,
      candidateId: "", // Reset candidate when course changes
    }));
  };

  // Open create new assessment dialog
  const handleAddClick = () => {
    if (!selectedCourse) {
      toast.error("Please select a course first");
      return;
    }

    // Check if there are available candidates to assess
    if (filteredCandidateOptions.length === 0) {
      toast.error("All candidates already have assessments for this course");
      return;
    }

    setCurrentAssessment(null);
    setFormValues({
      candidateId: "",
      courseId: selectedCourse,
      c1Value: "",
      c2Value: "",
      c3Value: "",
      c4Value: "",
      c5Value: "",
    });
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const handleEditClick = async (assessmentId: number) => {
    try {
      const response = await fetch(`/api/assessments/${assessmentId}`);
      if (!response.ok) throw new Error("Failed to fetch assessment");
      const assessment = await response.json();
      setCurrentAssessment(assessment);
      setFormValues({
        candidateId: assessment.candidateId.toString(),
        courseId: assessment.courseId.toString(),
        c1Value: assessment.c1Value.toString(),
        c2Value: assessment.c2Value.toString(),
        c3Value: assessment.c3Value.toString(),
        c4Value: assessment.c4Value.toString(),
        c5Value: assessment.c5Value.toString(),
      });
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      toast.error("Failed to load assessment details");
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form to create new assessment
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    if (!formValues.candidateId || !formValues.courseId) {
      toast.error("Please select a candidate and course");
      return;
    }

    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create assessment");
      }

      const newAssessment = await response.json();

      // Refetch assessments to get the updated list with candidate names
      const refreshResponse = await fetch(
        `/api/assessments?courseId=${selectedCourse}`
      );
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setAssessments(data.assessments);

        // Update filtered candidate options
        const assessedCandidateIds = new Set(
          data.assessments.map(
            (assessment: Assessment) => assessment.candidateId
          )
        );

        // Update course candidates
        const updatedCourseCandidates = candidates.filter((candidate) =>
          assessedCandidateIds.has(candidate.id)
        );
        setCourseCandidates(updatedCourseCandidates);

        // Update filtered options
        const updatedFilteredOptions = candidateOptions.filter(
          (option) => !assessedCandidateIds.has(parseInt(option.value))
        );
        setFilteredCandidateOptions(updatedFilteredOptions);
      }

      toast.success("Assessment created successfully");
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create assessment"
      );
    }
  };

  // Submit form to update assessment
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAssessment) return;

    try {
      const response = await fetch(`/api/assessments/${currentAssessment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          c1Value: formValues.c1Value,
          c2Value: formValues.c2Value,
          c3Value: formValues.c3Value,
          c4Value: formValues.c4Value,
          c5Value: formValues.c5Value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update assessment");
      }

      const updatedAssessment = await response.json();

      // Update the assessments list
      setAssessments((prev) =>
        prev.map((assessment) =>
          assessment.id === updatedAssessment.id
            ? { ...updatedAssessment, candidateName: assessment.candidateName }
            : assessment
        )
      );

      toast.success("Assessment updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating assessment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update assessment"
      );
    }
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (assessmentId: number) => {
    setAssessmentToDelete(assessmentId);
    setIsDeleteDialogOpen(true);
  };

  // Delete assessment
  const handleDeleteConfirm = async () => {
    if (!assessmentToDelete) return;

    try {
      const response = await fetch(`/api/assessments/${assessmentToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete assessment");
      }

      // Find the candidate ID associated with the deleted assessment
      const deletedAssessment = assessments.find(
        (assessment) => assessment.id === assessmentToDelete
      );
      const deletedCandidateId = deletedAssessment?.candidateId;

      // Remove the deleted assessment from the list
      setAssessments((prev) =>
        prev.filter((assessment) => assessment.id !== assessmentToDelete)
      );

      // Update course candidates and filtered options
      const updatedAssessments = assessments.filter(
        (assessment) => assessment.id !== assessmentToDelete
      );
      const assessedCandidateIds = new Set(
        updatedAssessments.map((assessment) => assessment.candidateId)
      );

      // Update course candidates
      const updatedCourseCandidates = candidates.filter((candidate) =>
        assessedCandidateIds.has(candidate.id)
      );
      setCourseCandidates(updatedCourseCandidates);

      // Add the deleted candidate back to the filtered options
      if (deletedCandidateId) {
        const candidateOption = candidateOptions.find(
          (option) => parseInt(option.value) === deletedCandidateId
        );
        if (candidateOption) {
          setFilteredCandidateOptions((prev) => [...prev, candidateOption]);
        }
      }

      toast.success("Assessment deleted successfully");
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete assessment"
      );
    } finally {
      setIsDeleteDialogOpen(false);
      setAssessmentToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Assessments
        </h1>
        <div className="flex items-center gap-4">
          <Select
            value={selectedCourse}
            onChange={handleCourseChange}
            options={[
              { value: "", label: "Select a course", disabled: true },
              ...courseOptions,
            ]}
            className="w-[250px]"
          />
          <Button size="sm" onClick={handleAddClick} disabled={!selectedCourse}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Assessment
          </Button>
        </div>
      </div>

      {/* Course Candidates Section */}
      {selectedCourse && courseCandidates.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Candidates for this Course
          </h2>
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md flex items-center"
                >
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {candidate.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      NPM: {candidate.npm}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">
            Loading assessments...
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Candidate
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  C1 (IPK)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  C2
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  C3
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  C4
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  C5
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Total Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
              {assessments.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {selectedCourse
                      ? "No assessments found for this course"
                      : "Please select a course to view assessments"}
                  </td>
                </tr>
              ) : (
                assessments.map((assessment) => (
                  <tr
                    key={assessment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {assessment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {assessment.candidateName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {assessment.c1Value} ({assessment.c1Score})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {assessment.c2Value} ({assessment.c2Score})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {assessment.c3Value} ({assessment.c3Score})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {assessment.c4Value} ({assessment.c4Score})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {assessment.c5Value} ({assessment.c5Score})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {(assessment.totalScore ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(assessment.id)}
                          className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(assessment.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Assessment Dialog */}
      <AssessmentDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add New Assessment"
        currentAssessment={null}
        formValues={formValues}
        onInputChange={handleInputChange}
        onSubmit={handleAddSubmit}
        candidateOptions={filteredCandidateOptions}
        isNewAssessment={true}
      />

      {/* Edit Assessment Dialog */}
      <AssessmentDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title="Edit Assessment"
        currentAssessment={currentAssessment}
        formValues={formValues}
        onInputChange={handleInputChange}
        onSubmit={handleUpdateSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <AssessmentDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Assessment"
        currentAssessment={null}
        formValues={formValues}
        onInputChange={handleInputChange}
        onSubmit={handleUpdateSubmit}
        isDelete={true}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
