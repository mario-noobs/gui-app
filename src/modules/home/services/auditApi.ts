import interceptor from "../../core/services/axios";

export interface AuditLogResponse {
  data: {
    audit_logs: AuditLog[];
    limit: number;
    offset: number;
    user_id: string;
  };
}

export interface AuditLog {
  id: string | null;
  created_at: string;
  updated_at: string;
  time: string;
  ip_address: string;
  api_call: string;
  method: string;
  status: number;
  response_time: number;
  user_id: string;
}

export interface AuditLogParams {
  limit?: number;
  offset?: number;
  search?: string;
  status_filter?: string;
}

export const GetAuditLogsAPI = (params: AuditLogParams = {}): Promise<AuditLogResponse> => {
  return new Promise((resolve, reject) => {
    const queryParams = new URLSearchParams();
    
    // Set default values and add to query params
    queryParams.append('limit', (params.limit || 20).toString());
    queryParams.append('offset', (params.offset || 0).toString());
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.status_filter && params.status_filter !== 'all') {
      queryParams.append('status_filter', params.status_filter);
    }

    interceptor
      .get(`/api/v1/audit/all?${queryParams.toString()}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};