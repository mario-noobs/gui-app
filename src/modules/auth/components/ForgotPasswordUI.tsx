import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordAPI } from "../services/api";

const ForgotPasswordUI = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await ForgotPasswordAPI({ email });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h2>
          <p className="text-sm text-gray-500 mb-5">
            If an account exists for <strong>{email}</strong>, we've sent a password reset link.
          </p>
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

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 text-center">
          Forgot password?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          Enter your email and we'll send you a reset link.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email}
            className="bg-blue-600 hover:bg-blue-700 w-full text-white text-sm font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={() => navigate("/login")}
            >
              Back to sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordUI;
