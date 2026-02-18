import { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Button,
  Spinner,
} from "@material-tailwind/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { SearchAuditLogsAPI, AuditLog, AuditPageResponse, AuditSearchParams } from "../services/auditApi";

const ACTION_OPTIONS = [
  { value: "", label: "All Actions" },
  { value: "auth:login", label: "Auth: Login" },
  { value: "auth:register", label: "Auth: Register" },
  { value: "auth:logout", label: "Auth: Logout" },
  { value: "auth:refresh", label: "Auth: Refresh" },
  { value: "profile:read", label: "Profile: Read" },
  { value: "profile:update", label: "Profile: Update" },
  { value: "face:register", label: "Face: Register" },
  { value: "face:recognize", label: "Face: Recognize" },
  { value: "face:delete", label: "Face: Delete" },
  { value: "face:check", label: "Face: Check" },
  { value: "audit:list", label: "Audit: List" },
  { value: "audit:read", label: "Audit: Read" },
  { value: "user:list", label: "User: List" },
  { value: "user:read", label: "User: Read" },
  { value: "user:update", label: "User: Update" },
  { value: "user:update_status", label: "User: Update Status" },
  { value: "rbac:manage", label: "RBAC: Manage" },
];

const TARGET_TYPE_OPTIONS = [
  { value: "", label: "All Targets" },
  { value: "auth", label: "Auth" },
  { value: "profile", label: "Profile" },
  { value: "face", label: "Face" },
  { value: "audit", label: "Audit" },
  { value: "user", label: "User" },
  { value: "rbac", label: "RBAC" },
];

const OUTCOME_OPTIONS = [
  { value: "", label: "All Outcomes" },
  { value: "success", label: "Success" },
  { value: "failure", label: "Failure" },
];

export function Audit() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const buildParams = useCallback(
    (page = 0): AuditSearchParams => ({
      q: searchQuery || undefined,
      action: actionFilter || undefined,
      targetType: targetTypeFilter || undefined,
      outcome: outcomeFilter || undefined,
      page,
      size: pagination.size,
    }),
    [searchQuery, actionFilter, targetTypeFilter, outcomeFilter, pagination.size]
  );

  const fetchAuditLogs = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response: AuditPageResponse = await SearchAuditLogsAPI(buildParams(page));

      setAuditLogs(response.data.content);
      setPagination((prev) => ({
        ...prev,
        page: response.data.page,
        totalElements: response.data.total_elements,
        totalPages: response.data.total_pages,
      }));
    } catch (err: any) {
      setError(err.message || "Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleSearch = () => {
    fetchAuditLogs(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActionFilter("");
    setTargetTypeFilter("");
    setOutcomeFilter("");
  };

  const hasActiveFilters = searchQuery || actionFilter || targetTypeFilter || outcomeFilter;

  const handleNextPage = () => fetchAuditLogs(pagination.page + 1);
  const handlePrevPage = () => fetchAuditLogs(Math.max(0, pagination.page - 1));

  const getMethodStyle = (method: string) => {
    switch (method) {
      case "GET": return "text-blue-700 bg-blue-50";
      case "POST": return "text-green-700 bg-green-50";
      case "PUT": return "text-yellow-700 bg-yellow-50";
      case "DELETE": return "text-red-700 bg-red-50";
      default: return "text-gray-700 bg-gray-50";
    }
  };

  const getStatusStyle = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return "text-green-700 bg-green-50";
    if (statusCode >= 400) return "text-red-700 bg-red-50";
    return "text-gray-700 bg-gray-50";
  };

  const getOutcomeStyle = (outcome: string | null) => {
    if (outcome === "success") return "text-green-700 bg-green-50";
    if (outcome === "failure") return "text-red-700 bg-red-50";
    return "text-gray-700 bg-gray-50";
  };

  const stats = {
    total: pagination.totalElements,
    success: auditLogs.filter((l) => l.outcome === "success").length,
    errors: auditLogs.filter((l) => l.outcome === "failure").length,
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-6">
          <Typography variant="h4" className="text-gray-900 font-semibold">
            Audit Logs
          </Typography>
          <Typography className="text-gray-500 text-sm mt-1">
            Search and filter system activity from Elasticsearch
          </Typography>
        </div>

        {/* Search + Filter bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, path, request ID, user agent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? "text-blue-700 bg-blue-50 border-blue-200"
                  : "text-gray-600 bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
            {/* Search button */}
            <Button size="sm" onClick={handleSearch} disabled={loading} className="px-4">
              Search
            </Button>
          </div>

          {/* Filter dropdowns */}
          {showFilters && (
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ACTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <select
                value={targetTypeFilter}
                onChange={(e) => setTargetTypeFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TARGET_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {OUTCOME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 font-medium">Total Results</p>
            <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 font-medium">Success (this page)</p>
            <p className="text-lg font-semibold text-green-700">{stats.success}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 font-medium">Errors (this page)</p>
            <p className="text-lg font-semibold text-red-700">{stats.errors}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <Typography className="text-sm text-gray-700 font-medium">
              {auditLogs.length} of {pagination.totalElements} entries
            </Typography>
            {loading && (
              <div className="flex items-center gap-2 text-gray-500">
                <Spinner className="h-4 w-4" />
                <span className="text-xs">Searching...</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Outcome</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actor</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">IP</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Duration</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                      {error ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-red-600">{error}</span>
                          <Button size="sm" variant="outlined" onClick={() => fetchAuditLogs()} className="text-xs">
                            Retry
                          </Button>
                        </div>
                      ) : (
                        "No audit logs found"
                      )}
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log, index) => (
                    <tr
                      key={log.id || `${log.created_at}-${index}`}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {new Date(log.created_at).toLocaleDateString()}
                        </span>
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {log.action ? (
                          <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono">
                            {log.action}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-900 font-mono">{log.path}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${getMethodStyle(log.method)}`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusStyle(log.status_code)}`}>
                          {log.status_code}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {log.outcome ? (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${getOutcomeStyle(log.outcome)}`}>
                            {log.outcome}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600">{log.actor_email || "-"}</span>
                        {log.actor_role && (
                          <>
                            <br />
                            <span className="text-xs text-gray-400">{log.actor_role}</span>
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 font-mono">{log.client_ip}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-gray-600">{log.duration_ms}ms</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {auditLogs.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                Page {pagination.page + 1} of {pagination.totalPages} ({pagination.totalElements} total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={pagination.page === 0 || loading}
                  className="flex items-center gap-1 text-xs"
                >
                  <ChevronLeftIcon className="h-3.5 w-3.5" /> Previous
                </Button>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={pagination.page >= pagination.totalPages - 1 || loading}
                  className="flex items-center gap-1 text-xs"
                >
                  Next <ChevronRightIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
