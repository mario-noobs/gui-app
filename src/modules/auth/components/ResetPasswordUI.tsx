import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ResetPasswordAPI } from "../services/api";

const ResetPasswordUI = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await ResetPasswordAPI({ token, new_password: newPassword, confirm_password: confirmPassword });
      setSuccess(true);
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || "Failed to reset password. The link may be invalid or expired.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Invalid link</h2>
          <p className="text-sm text-gray-500 mb-5">This password reset link is invalid or missing a token.</p>
          <button
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            onClick={() => navigate("/login")}
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Password reset</h2>
          <p className="text-sm text-gray-500 mb-5">Your password has been reset successfully.</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 w-full text-white text-sm font-medium py-2 px-4 rounded transition-colors"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 text-center">
          Set new password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              maxLength={30}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              minLength={8}
              maxLength={30}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword}
            className="bg-blue-600 hover:bg-blue-700 w-full text-white text-sm font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordUI;
