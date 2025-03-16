// components/ui/assessmentDialog.tsx
"use client";

import { useState } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { Assessment, SelectOption } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

interface AssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentAssessment: Assessment | null;
  formValues: any;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  isNewAssessment?: boolean;
  isDelete?: boolean;
  onDeleteConfirm?: () => void;
  candidateOptions?: SelectOption[];
}

export const AssessmentDialog = ({
  isOpen,
  onClose,
  title,
  currentAssessment,
  formValues,
  onInputChange,
  onSubmit,
  isNewAssessment = false,
  isDelete = false,
  onDeleteConfirm,
  candidateOptions = [],
}: AssessmentDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-950">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isDelete ? (
          <>
            <div className="py-4">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this assessment? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={onDeleteConfirm}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {isNewAssessment &&
                candidateOptions &&
                candidateOptions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Candidate
                    </label>
                    <Select
                      name="candidateId"
                      value={formValues.candidateId}
                      onChange={(value) =>
                        onInputChange({
                          target: { name: "candidateId", value },
                        } as React.ChangeEvent<HTMLSelectElement>)
                      }
                      options={[
                        {
                          value: "",
                          label: "Select a candidate",
                          disabled: true,
                        },
                        ...candidateOptions,
                      ]}
                      required
                    />
                  </div>
                )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  C1 Value (IPK)
                </label>
                <Input
                  type="number"
                  name="c1Value"
                  value={formValues.c1Value}
                  onChange={onInputChange}
                  step="0.01"
                  min="0"
                  max="4"
                  required
                  placeholder="Enter IPK (0.00 - 4.00)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  IPK Range: 0.00 - 4.00
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  C2 Value
                </label>
                <Input
                  type="number"
                  name="c2Value"
                  value={formValues.c2Value}
                  onChange={onInputChange}
                  step="1"
                  min="0"
                  max="100"
                  required
                  placeholder="Enter score (0 - 100)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Score Range: 0 - 100
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  C3 Value
                </label>
                <Input
                  type="number"
                  name="c3Value"
                  value={formValues.c3Value}
                  onChange={onInputChange}
                  step="1"
                  min="0"
                  max="100"
                  required
                  placeholder="Enter score (0 - 100)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Score Range: 0 - 100
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  C4 Value
                </label>
                <Input
                  type="number"
                  name="c4Value"
                  value={formValues.c4Value}
                  onChange={onInputChange}
                  step="1"
                  min="0"
                  max="100"
                  required
                  placeholder="Enter score (0 - 100)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Score Range: 0 - 100
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  C5 Value
                </label>
                <Input
                  type="number"
                  name="c5Value"
                  value={formValues.c5Value}
                  onChange={onInputChange}
                  step="1"
                  min="0"
                  max="100"
                  required
                  placeholder="Enter score (0 - 100)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Score Range: 0 - 100
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {isNewAssessment ? "Create Assessment" : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
