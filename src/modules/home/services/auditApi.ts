import interceptor from "../../core/services/axios";

export interface AuditLog {
  id: number | null;
  request_id: string;
  user_id: number | null;
  actor_email: string | null;
  actor_role: string | null;
  action: string | null;
  target_type: string | null;
  target_id: string | null;
  outcome: string | null;
  method: string;
  path: string;
  status_code: number;
  client_ip: string;
  user_agent: string | null;
  duration_ms: number;
  created_at: string;
}

export interface AuditPageResponse {
  data: {
    content: AuditLog[];
    total_elements: number;
    total_pages: number;
    page: number;
    size: number;
  };
}

export interface AuditSearchParams {
  q?: string;
  action?: string;
  targetType?: string;
  outcome?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export const SearchAuditLogsAPI = (params: AuditSearchParams = {}): Promise<AuditPageResponse> => {
  const query = new URLSearchParams();

  if (params.q) query.append("q", params.q);
  if (params.action) query.append("action", params.action);
  if (params.targetType) query.append("targetType", params.targetType);
  if (params.outcome) query.append("outcome", params.outcome);
  if (params.from) query.append("from", params.from);
  if (params.to) query.append("to", params.to);
  query.append("page", (params.page ?? 0).toString());
  query.append("size", (params.size ?? 20).toString());

  return interceptor
    .get(`/api/v1/audit/search?${query.toString()}`)
    .then((response) => response.data);
};
