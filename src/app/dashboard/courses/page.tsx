// app/dashboard/courses/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { Course } from "@/lib/types";

interface FormData {
  code: string;
  name: string;
  description: string;
  criteriaWeightsData: {
    c1Weight: number;
    c2Weight: number;
    c3Weight: number;
    c4Weight: number;
    c5Weight: number;
  };
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    code: "",
    name: "",
    description: "",
    criteriaWeightsData: {
      c1Weight: 3,
      c2Weight: 2,
      c3Weight: 2,
      c4Weight: 2,
      c5Weight: 3,
    },
  });
  const [errors, setErrors] = useState({
    code: "",
    name: "",
  });
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

  // Fetch courses on load
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/course");
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { code: "", name: "" };

    if (!formData.code.trim()) {
      newErrors.code = "Course code is required";
      isValid = false;
    }

    if (!formData.name.trim()) {
      newErrors.name = "Course name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle criteria weight changes
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      criteriaWeightsData: {
        ...formData.criteriaWeightsData,
        [name]: parseInt(value) || 0,
      },
    });
  };

  // Create a new course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create course");
      }

      toast.success("Course created successfully");
      setIsCreateModalOpen(false);
      resetForm();
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit a course
  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse || !validateForm()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/course/${currentCourse.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: formData.code,
          name: formData.name,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update course");
      }

      toast.success("Course updated successfully");
      setIsEditModalOpen(false);
      resetForm();
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a course
  const handleDeleteCourse = async () => {
    if (!currentCourse) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/course/${currentCourse.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete course");
      }

      toast.success("Course deleted successfully");
      setIsDeleteModalOpen(false);
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open the edit modal and prefill form data
  const openEditModal = (course: Course) => {
    setCurrentCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      description: course.description || "",
      criteriaWeightsData: {
        c1Weight: course.criteriaWeights?.[0]?.c1Weight || 3,
        c2Weight: course.criteriaWeights?.[0]?.c2Weight || 2,
        c3Weight: course.criteriaWeights?.[0]?.c3Weight || 2,
        c4Weight: course.criteriaWeights?.[0]?.c4Weight || 2,
        c5Weight: course.criteriaWeights?.[0]?.c5Weight || 3,
      },
    });
    setIsEditModalOpen(true);
  };

  // Open the delete modal
  const openDeleteModal = (course: Course) => {
    setCurrentCourse(course);
    setIsDeleteModalOpen(true);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      criteriaWeightsData: {
        c1Weight: 3,
        c2Weight: 2,
        c3Weight: 2,
        c4Weight: 2,
        c5Weight: 3,
      },
    });
    setErrors({ code: "", name: "" });
    setCurrentCourse(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
          Courses
        </h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          <span>Add Course</span>
        </Button>
      </div>

      {/* Course List */}
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            All Courses
          </h3>
        </div>
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-gray-500 dark:text-gray-400"
                  >
                    Loading courses...
                  </TableCell>
                </TableRow>
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-gray-500 dark:text-gray-400"
                  >
                    No courses found
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(course)}
                          className="h-8 w-8 p-0"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteModal(course)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-950/50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Course Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Create New Course
            </h2>
            <form onSubmit={handleCreateCourse}>
              <div className="space-y-4">
                <Input
                  id="code"
                  name="code"
                  label="Course Code *"
                  value={formData.code}
                  onChange={handleInputChange}
                  error={errors.code}
                />
                <Input
                  id="name"
                  name="name"
                  label="Course Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                />
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Criteria Weights
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num}>
                        <label
                          htmlFor={`c${num}Weight`}
                          className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          C{num}
                        </label>
                        <Input
                          type="number"
                          id={`c${num}Weight`}
                          name={`c${num}Weight`}
                          value={
                            formData.criteriaWeightsData[
                              `c${num}Weight` as keyof typeof formData.criteriaWeightsData
                            ]
                          }
                          onChange={handleWeightChange}
                          min="1"
                          max="5"
                          className="h-9"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Create Course
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {isEditModalOpen && currentCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Edit Course
            </h2>
            <form onSubmit={handleEditCourse}>
              <div className="space-y-4">
                <Input
                  id="edit-code"
                  name="code"
                  label="Course Code *"
                  value={formData.code}
                  onChange={handleInputChange}
                  error={errors.code}
                />
                <Input
                  id="edit-name"
                  name="name"
                  label="Course Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                />
                <div className="space-y-2">
                  <label
                    htmlFor="edit-description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-gray-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Update Course
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Course Modal */}
      {isDeleteModalOpen && currentCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete the course &quot;
              {currentCourse.name}&quot; ({currentCourse.code})? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteCourse}
                isLoading={isSubmitting}
              >
                Delete Course
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
