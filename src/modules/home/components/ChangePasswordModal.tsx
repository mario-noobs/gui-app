import { useState } from "react";
import { Button } from "@material-tailwind/react";
import { ChangePasswordAPI } from "../../auth/services/api";
import { HandleError } from "../../core/services/axios";
import { ErrorResponse } from "../../face-reg/services/axios";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import Modal from "./Modal";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Must be at least 8 characters";
    } else if (newPassword.length > 30) {
      newErrors.newPassword = "Must not exceed 30 characters";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await ChangePasswordAPI({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      enqueueSnackbar("Password changed successfully", { variant: "success" });
      handleClose();
    } catch (error) {
      const err = HandleError(error as Error | AxiosError<ErrorResponse>);
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
            <p className="text-sm text-gray-500">Secure your account with a new password</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setErrors((prev) => ({ ...prev, currentPassword: "" }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50/50 hover:bg-white ${
                errors.currentPassword
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
              placeholder="Enter current password"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1.5">{errors.currentPassword}</p>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors((prev) => ({ ...prev, newPassword: "" }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50/50 hover:bg-white ${
                errors.newPassword
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1.5">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50/50 hover:bg-white ${
                errors.confirmPassword
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium normal-case shadow-none hover:shadow-md transition-all"
          >
            Update Password
          </Button>
        </div>
      </div>
    </Modal>
  );
}
