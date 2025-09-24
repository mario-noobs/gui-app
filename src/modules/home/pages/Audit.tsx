import { useState } from "react";
import {
  Typography,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface AuditLog {
  id: string;
  timestamp: string;
  ip: string;
  apiCall: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  status: "success" | "warning" | "error" | "info";
  statusCode: number;
  userAgent: string;
  response_time: string;
}

const dummyAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024-09-24T10:30:15Z",
    ip: "192.168.1.100",
    apiCall: "/api/auth/face-login",
    method: "POST",
    status: "success",
    statusCode: 200,
    userAgent: "Chrome 120.0.0.0",
    response_time: "245ms",
  },
  {
    id: "2",
    timestamp: "2024-09-24T10:25:42Z",
    ip: "10.0.0.45",
    apiCall: "/api/auth/login",
    method: "POST",
    status: "warning",
    statusCode: 429,
    userAgent: "Firefox 118.0",
    response_time: "1.2s",
  },
  {
    id: "3",
    timestamp: "2024-09-24T10:20:33Z",
    ip: "172.16.0.25",
    apiCall: "/api/users/register",
    method: "POST",
    status: "success",
    statusCode: 201,
    userAgent: "Safari 17.0",
    response_time: "389ms",
  },
  {
    id: "4",
    timestamp: "2024-09-24T10:15:11Z",
    ip: "203.0.113.42",
    apiCall: "/api/admin/users",
    method: "GET",
    status: "error",
    statusCode: 403,
    userAgent: "Unknown Bot",
    response_time: "50ms",
  },
  {
    id: "5",
    timestamp: "2024-09-24T10:10:28Z",
    ip: "192.168.1.200",
    apiCall: "/api/users/profile",
    method: "PUT",
    status: "success",
    statusCode: 200,
    userAgent: "Edge 120.0.0.0",
    response_time: "156ms",
  },
  {
    id: "6",
    timestamp: "2024-09-24T10:05:17Z",
    ip: "10.0.0.100",
    apiCall: "/api/data/export",
    method: "GET",
    status: "info",
    statusCode: 200,
    userAgent: "Chrome 120.0.0.0",
    response_time: "2.1s",
  },
  {
    id: "7",
    timestamp: "2024-09-24T10:02:05Z",
    ip: "185.220.101.32",
    apiCall: "/api/auth/login",
    method: "POST",
    status: "error",
    statusCode: 401,
    userAgent: "curl/7.68.0",
    response_time: "89ms",
  },
  {
    id: "8",
    timestamp: "2024-09-24T09:58:44Z",
    ip: "192.168.1.150",
    apiCall: "/api/face/register",
    method: "POST",
    status: "success",
    statusCode: 201,
    userAgent: "Chrome 120.0.0.0",
    response_time: "567ms",
  },
];

export function Audit() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "green";
      case "warning":
        return "amber";
      case "error":
        return "red";
      case "info":
        return "blue";
      default:
        return "gray";
    }
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

  const filteredLogs = dummyAuditLogs.filter((log) => {
    const matchesSearch =
      log.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.apiCall.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.method.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: dummyAuditLogs.length,
    success: dummyAuditLogs.filter((log) => log.status === "success").length,
    warnings: dummyAuditLogs.filter((log) => log.status === "warning").length,
    errors: dummyAuditLogs.filter((log) => log.status === "error").length,
  };

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
            <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography className="text-amber-100 text-sm">
                      Warnings
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {stats.warnings}
                    </Typography>
                  </div>
                  <ExclamationTriangleIcon className="h-8 w-8 text-amber-200" />
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

        {/* Enhanced Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-6 shadow-lg border-0">
            <CardBody className="p-8">
              <div className="mb-4">
                <Typography variant="h6" className="text-gray-800 font-semibold mb-2">
                  🔍 Search & Filter Logs
                </Typography>
                <Typography className="text-gray-500 text-sm">
                  Find specific API calls, IP addresses, or filter by status
                </Typography>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 items-end">
                <div className="flex-1 space-y-2">
                  <Typography className="text-sm font-medium text-gray-700">
                    Search Query
                  </Typography>
                  <div className="relative">
                    <Input
                      size="lg"
                      label="Search by IP address, API endpoint, or HTTP method..."
                      icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full !border-gray-300 focus:!border-blue-500"
                      containerProps={{
                        className: "min-w-0"
                      }}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Clear search"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  {searchTerm && (
                    <Typography className="text-xs text-blue-600 flex items-center gap-1">
                      <span>🔍</span>
                      Showing results for: <span className="font-semibold">"{searchTerm}"</span>
                    </Typography>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 lg:min-w-[300px]">
                  <div className="space-y-2">
                    <Typography className="text-sm font-medium text-gray-700">
                      Filter by Status
                    </Typography>
                    <Select
                      size="lg"
                      label="Status Filter"
                      value={statusFilter}
                      onChange={(value) => setStatusFilter(value || "all")}
                      className="!border-gray-300 focus:!border-blue-500"
                    >
                      <Option value="all">🌐 All Status</Option>
                      <Option value="success">✅ Success</Option>
                      <Option value="warning">⚠️ Warning</Option>
                      <Option value="error">❌ Error</Option>
                      <Option value="info">ℹ️ Info</Option>
                    </Select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                      title="Clear all filters"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Results Summary */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <Typography className="text-sm text-gray-600">
                      <span className="font-semibold text-blue-600">{filteredLogs.length}</span> of <span className="font-semibold">{dummyAuditLogs.length}</span> entries
                    </Typography>
                    {(searchTerm || statusFilter !== "all") && (
                      <div className="flex items-center gap-2">
                        {searchTerm && (
                          <Chip
                            value={`Search: ${searchTerm}`}
                            onClose={() => setSearchTerm("")}
                            className="bg-blue-100 text-blue-800 text-xs"
                            size="sm"
                          />
                        )}
                        {statusFilter !== "all" && (
                          <Chip
                            value={`Status: ${statusFilter}`}
                            onClose={() => setStatusFilter("all")}
                            className="bg-green-100 text-green-800 text-xs"
                            size="sm"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {filteredLogs.length === 0 && (searchTerm || statusFilter !== "all") && (
                    <Typography className="text-sm text-amber-600 flex items-center gap-1">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      No results found
                    </Typography>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Audit Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="bg-gray-50 p-6">
              <Typography variant="h6" className="flex items-center gap-2">
                <CalendarDaysIcon className="h-5 w-5" />
                API Logs ({filteredLogs.length} entries)
              </Typography>
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
                    {filteredLogs.map((log, index) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="p-4">
                          <div>
                            <Typography className="text-sm font-medium text-gray-800">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </Typography>
                            <Typography className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </Typography>
                          </div>
                        </td>
                        <td className="p-4">
                          <Typography className="text-sm font-mono text-gray-800">
                            {log.ip}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography className="text-sm font-mono text-blue-600">
                            {log.apiCall}
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
                              value={log.statusCode.toString()}
                              className={`bg-${getStatusColor(
                                log.status
                              )}-100 text-${getStatusColor(log.status)}-800 text-xs`}
                              size="sm"
                            />
                            <Typography className="text-xs text-gray-500">
                              {log.status}
                            </Typography>
                          </div>
                        </td>
                        <td className="p-4">
                          <Typography className="text-sm text-gray-600">
                            {log.response_time}
                          </Typography>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
