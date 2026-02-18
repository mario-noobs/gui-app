import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AcceptInvitationAPI } from "../services/api";

const AcceptInvitationUI = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res: any = await AcceptInvitationAPI({ token, password, confirm_password: confirmPassword });
      const data = res.data;
      if (data?.access_token?.token) {
        localStorage.setItem("access_token", data.access_token.token);
      }
      if (data?.refresh_token?.token) {
        localStorage.setItem("refresh_token", data.refresh_token.token);
      }
      navigate("/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || "Failed to accept invitation. The link may be invalid or expired.";
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
          <p className="text-sm text-gray-500 mb-5">This invitation link is invalid or missing a token.</p>
          <button
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            onClick={() => navigate("/login")}
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 text-center">
          Set up your password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          Create a password to activate your account.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            disabled={loading || !password || !confirmPassword}
            className="bg-blue-600 hover:bg-blue-700 w-full text-white text-sm font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Setting up..." : "Activate account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AcceptInvitationUI;
