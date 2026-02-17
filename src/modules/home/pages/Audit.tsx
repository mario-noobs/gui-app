import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Spinner,
} from "@material-tailwind/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { GetAuditLogsAPI, AuditLog, AuditLogResponse } from "../services/auditApi";

export function Audit() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
  });

  const getStatusType = (statusCode: number): string => {
    if (statusCode >= 200 && statusCode < 300) return "success";
    if (statusCode >= 400 && statusCode < 500) return "client error";
    if (statusCode >= 500) return "server error";
    return "info";
  };

  const fetchAuditLogs = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response: AuditLogResponse = await GetAuditLogsAPI({
        limit: pagination.limit,
        offset: pagination.offset,
        ...params,
      });

      setAuditLogs(response.data.audit_logs);

      setPagination((prev) => ({
        ...prev,
        total: response.data.audit_logs.length,
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

  const handleNextPage = () => {
    const newOffset = pagination.offset + pagination.limit;
    setPagination((prev) => ({ ...prev, offset: newOffset }));
    fetchAuditLogs({ offset: newOffset });
  };

  const handlePrevPage = () => {
    const newOffset = Math.max(0, pagination.offset - pagination.limit);
    setPagination((prev) => ({ ...prev, offset: newOffset }));
    fetchAuditLogs({ offset: newOffset });
  };

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

  const stats = {
    total: auditLogs.length,
    success: auditLogs.filter((l) => l.status >= 200 && l.status < 300).length,
    errors: auditLogs.filter((l) => l.status >= 400).length,
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
            Monitor API calls and system activities
          </Typography>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 font-medium">Total</p>
            <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 font-medium">Success</p>
            <p className="text-lg font-semibold text-green-700">{stats.success}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 font-medium">Errors</p>
            <p className="text-lg font-semibold text-red-700">{stats.errors}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <Typography className="text-sm text-gray-700 font-medium">
              API Logs ({auditLogs.length} entries)
            </Typography>
            {loading && (
              <div className="flex items-center gap-2 text-gray-500">
                <Spinner className="h-4 w-4" />
                <span className="text-xs">Loading...</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    IP Address
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Endpoint
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Response
                  </th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
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
                      key={log.id || `${log.time}-${index}`}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">
                          {new Date(log.time).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          {new Date(log.time).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 font-mono">
                          {log.ip_address}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900 font-mono">
                          {log.api_call}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${getMethodStyle(log.method)}`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusStyle(log.status)}`}>
                          {log.status}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          {getStatusType(log.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {log.response_time}ms
                        </span>
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
                Showing {pagination.offset + 1} to{" "}
                {Math.min(pagination.offset + pagination.limit, pagination.offset + auditLogs.length)} entries
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={pagination.offset === 0 || loading}
                  className="flex items-center gap-1 text-xs"
                >
                  <ChevronLeftIcon className="h-3.5 w-3.5" /> Previous
                </Button>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={auditLogs.length < pagination.limit || loading}
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
