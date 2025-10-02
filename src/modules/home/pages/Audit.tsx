import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Spinner,
} from "@material-tailwind/react";
import {
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
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
  const [, setCurrentUserId] = useState<string>("");

  // Map status code to status type for UI
  const getStatusType = (statusCode: number): string => {
    if (statusCode >= 200 && statusCode < 300) return "success";
    if (statusCode >= 400 && statusCode < 500) return "error";
    if (statusCode >= 500) return "error";
    return "info";
  };

  const getStatusColor = (statusCode: number) => {
    const statusType = getStatusType(statusCode);
    switch (statusType) {
      case "success":
        return "green";
      case "error":
        return "red";
      case "info":
        return "blue";
      default:
        return "gray";
    }
  };

  // Fetch audit logs from API
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
      setCurrentUserId(response.data.user_id);
      
      // Update pagination info if available
      setPagination(prev => ({
        ...prev,
        total: response.data.audit_logs.length
      }));
    } catch (err: any) {
      setError(err.message || "Failed to fetch audit logs");
      console.error("Error fetching audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Pagination handlers
  const handleNextPage = () => {
    const newOffset = pagination.offset + pagination.limit;
    setPagination(prev => ({ ...prev, offset: newOffset }));
    fetchAuditLogs({ offset: newOffset });
  };

  const handlePrevPage = () => {
    const newOffset = Math.max(0, pagination.offset - pagination.limit);
    setPagination(prev => ({ ...prev, offset: newOffset }));
    fetchAuditLogs({ offset: newOffset });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "blue";
      case "POST":
        return "green";
      case "PUT":
        return "orange";
      case "DELETE":
        return "red";
      case "PATCH":
        return "purple";
      default:
        return "gray";
    }
  };

  // Calculate stats from current audit logs
  const stats = {
    total: auditLogs.length,
    success: auditLogs.filter((log) => getStatusType(log.status) === "success").length,
    errors: auditLogs.filter((log) => getStatusType(log.status) === "error").length,
    info: auditLogs.filter((log) => getStatusType(log.status) === "info").length,
  };

  const displayLogs = auditLogs;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h3" className="text-gray-800 font-bold mb-2">
            🔍 Audit Logs
          </Typography>
          <Typography className="text-gray-600">
            Monitor API calls and system activities
          </Typography>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography className="text-blue-100 text-sm">
                      Total Requests
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {stats.total}
                    </Typography>
                  </div>
                  <EyeIcon className="h-8 w-8 text-blue-200" />
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography className="text-green-100 text-sm">
                      Success
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {stats.success}
                    </Typography>
                  </div>
                  <CheckCircleIcon className="h-8 w-8 text-green-200" />
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography className="text-blue-100 text-sm">
                      Info
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {stats.info}
                    </Typography>
                  </div>
                  <ExclamationTriangleIcon className="h-8 w-8 text-blue-200" />
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography className="text-red-100 text-sm">Errors</Typography>
                    <Typography variant="h4" className="font-bold">
                      {stats.errors}
                    </Typography>
                  </div>
                  <XCircleIcon className="h-8 w-8 text-red-200" />
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Audit Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="bg-gray-50 p-6">
              <div className="flex items-center justify-between">
                <Typography variant="h6" className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5" />
                  API Logs ({displayLogs.length} entries)
                </Typography>
                {loading && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Spinner className="h-4 w-4" />
                    <Typography className="text-sm">Loading...</Typography>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Time
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        IP Address
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        API Call
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Method
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Response Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayLogs.length === 0 && !loading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center">
                          <div className="text-gray-500">
                            {error ? (
                              <div className="flex items-center justify-center gap-2 text-red-600">
                                <ExclamationTriangleIcon className="h-5 w-5" />
                                <span>Error loading audit logs: {error}</span>
                                <Button
                                  size="sm"
                                  color="blue"
                                  onClick={() => fetchAuditLogs()}
                                  className="ml-2"
                                >
                                  Retry
                                </Button>
                              </div>
                            ) : (
                              "No audit logs found"
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      displayLogs.map((log: AuditLog, index: number) => (
                        <motion.tr
                          key={log.id || `${log.time}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="p-4">
                            <div>
                              <Typography className="text-sm font-medium text-gray-800">
                                {new Date(log.time).toLocaleDateString()}
                              </Typography>
                              <Typography className="text-xs text-gray-500">
                                {new Date(log.time).toLocaleTimeString()}
                              </Typography>
                            </div>
                          </td>
                          <td className="p-4">
                            <Typography className="text-sm font-mono text-gray-800">
                              {log.ip_address}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <Typography className="text-sm font-mono text-blue-600">
                              {log.api_call}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <Chip
                              value={log.method}
                              className={`bg-${getMethodColor(
                                log.method
                              )}-100 text-${getMethodColor(log.method)}-800 text-xs font-mono`}
                              size="sm"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Chip
                                value={log.status.toString()}
                                className={`bg-${getStatusColor(
                                  log.status
                                )}-100 text-${getStatusColor(log.status)}-800 text-xs`}
                                size="sm"
                              />
                              <Typography className="text-xs text-gray-500">
                                {getStatusType(log.status)}
                              </Typography>
                            </div>
                          </td>
                          <td className="p-4">
                            <Typography className="text-sm text-gray-600">
                              {log.response_time}ms
                            </Typography>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
          
          {/* Pagination Controls */}
          {displayLogs.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.offset + displayLogs.length)} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={pagination.offset === 0 || loading}
                  className="flex items-center gap-1"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={displayLogs.length < pagination.limit || loading}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
