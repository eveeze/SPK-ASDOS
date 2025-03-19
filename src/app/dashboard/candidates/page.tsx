"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { type Candidate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function CandidatesPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<
    Array<Candidate & { assessmentCount?: number; averageScore?: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(
    null
  );
  const [formData, setFormData] = useState({
    npm: "",
    name: "",
    semester: "",
  });
  const [formErrors, setFormErrors] = useState({
    npm: "",
    name: "",
    semester: "",
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/candidates");
      if (response.ok) {
        const data = await response.json();
        // Calculate assessment counts and average scores
        const processedData = data.map((candidate: any) => {
          const assessmentCount = candidate.assessments?.length || 0;
          const averageScore =
            assessmentCount > 0
              ? candidate.assessments.reduce(
                  (sum: number, assessment: any) => sum + assessment.score,
                  0
                ) / assessmentCount
              : null;

          return {
            ...candidate,
            assessmentCount,
            averageScore,
          };
        });
        setCandidates(processedData);
      } else {
        toast.error("Failed to fetch candidates");
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Error loading candidates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const validateForm = () => {
    let valid = true;
    const errors = {
      npm: "",
      name: "",
      semester: "",
    };

    if (!formData.npm.trim()) {
      errors.npm = "NPM is required";
      valid = false;
    }

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      valid = false;
    }

    if (!formData.semester.trim()) {
      errors.semester = "Semester is required";
      valid = false;
    } else if (
      isNaN(parseInt(formData.semester)) ||
      parseInt(formData.semester) < 1
    ) {
      errors.semester = "Semester must be a positive number";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOpenCreateModal = () => {
    setFormData({ npm: "", name: "", semester: "" });
    setFormErrors({ npm: "", name: "", semester: "" });
    setModalMode("create");
    setShowModal(true);
  };

  const handleOpenEditModal = (candidate: Candidate) => {
    setCurrentCandidate(candidate);
    setFormData({
      npm: candidate.npm,
      name: candidate.name,
      semester: candidate.semester.toString(),
    });
    setFormErrors({ npm: "", name: "", semester: "" });
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let response;

      if (modalMode === "create") {
        response = await fetch("/api/candidates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            npm: formData.npm,
            name: formData.name,
            semester: parseInt(formData.semester),
          }),
        });
      } else {
        response = await fetch(`/api/candidates/${currentCandidate?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            npm: formData.npm,
            name: formData.name,
            semester: parseInt(formData.semester),
          }),
        });
      }

      const data = await response.json();

      if (response.ok) {
        toast.success(
          modalMode === "create"
            ? "Candidate created successfully"
            : "Candidate updated successfully"
        );
        setShowModal(false);
        fetchCandidates();
        router.refresh();
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch (error) {
      console.error(
        `Error ${modalMode === "create" ? "creating" : "updating"} candidate:`,
        error
      );
      toast.error(
        `Failed to ${modalMode === "create" ? "create" : "update"} candidate`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Candidate deleted successfully");
        fetchCandidates();
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete candidate");
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("Error deleting candidate");
    } finally {
      setDeleteConfirmId(null);
      setIsDeleting(false);
    }
  };

  const handleViewCandidate = (id: number) => {
    router.push(`/dashboard/candidates/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Candidate Management
        </h1>
        <Button onClick={handleOpenCreateModal}>Add New Candidate</Button>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            All Candidates
          </h2>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading candidates...
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NPM</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Assessments</TableHead>
                <TableHead>Avg. Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 dark:text-gray-400"
                  >
                    No candidates found
                  </TableCell>
                </TableRow>
              ) : (
                candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">
                      {candidate.npm}
                    </TableCell>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.semester}</TableCell>
                    <TableCell>{candidate.assessmentCount || 0}</TableCell>
                    <TableCell>
                      {candidate.averageScore
                        ? candidate.averageScore.toFixed(2)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCandidate(candidate.id)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(candidate)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(candidate.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {modalMode === "create" ? "Add New Candidate" : "Edit Candidate"}
            </h2>

            <form onSubmit={handleSubmit}>
              <Input
                label="NPM"
                name="npm"
                value={formData.npm}
                onChange={handleInputChange}
                error={formErrors.npm}
                wrapperClassName="mb-4"
              />

              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={formErrors.name}
                wrapperClassName="mb-4"
              />

              <Input
                label="Semester"
                name="semester"
                type="number"
                min="1"
                value={formData.semester}
                onChange={handleInputChange}
                error={formErrors.semester}
                wrapperClassName="mb-6"
              />

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  {modalMode === "create" ? "Create" : "Update"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this candidate? This action cannot
              be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deleteConfirmId)}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
