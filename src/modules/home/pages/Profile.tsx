import { useContext, useEffect, useState } from 'react';
import { Typography, Spinner } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../../core/components/Loading';
import { HandleError } from '../../core/services/axios';
import { ErrorResponse } from '../../face-reg/services/axios';
import { AxiosError } from "axios";
import { GetProfileAPI, GetFaceStatusAPI, GetUserActivityAPI } from '../services/api';
import { enqueueSnackbar } from "notistack";
import { AuthContext } from '../../auth/context/authContext';
import ChangePasswordModal from '../components/ChangePasswordModal';
import EditProfileModal from '../components/EditProfileModal';
import { IUserProfile } from '../../auth/models/auth';
import { getCountryName, getGenderLabel } from '../constants/countries';

interface UserData {
  data: {
    id: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar: string;
    gender: string;
    role: {
      name: string;
      permissions: string[];
    } | null;
    status: string;
    profile: IUserProfile | null;
  }
}

interface FaceStatusData {
  data: {
    registered?: boolean;
    is_registered?: boolean;
  }
}

interface AuditEntry {
  id: number;
  method: string;
  path: string;
  status_code: number;
  duration_ms: number;
  created_at: string;
}

interface AuditPageResponse {
  data: {
    content: AuditEntry[];
    total_elements: number;
  }
}

const Profile = () => {
  const navigate = useNavigate();
  const { handleUpdateProfile } = useContext(AuthContext);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Face status
  const [faceRegistered, setFaceRegistered] = useState<boolean | null>(null);
  const [faceLoading, setFaceLoading] = useState(true);

  // Recent activity
  const [recentActivity, setRecentActivity] = useState<AuditEntry[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  const handleGetProfile = async () => {
    try {
      const result = await GetProfileAPI<UserData>();
      setUserData(result);
    } catch (error) {
      enqueueSnackbar(
        HandleError(error as Error | AxiosError<ErrorResponse>).message,
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFetchFaceStatus = async () => {
    try {
      const result = await GetFaceStatusAPI<FaceStatusData>();
      setFaceRegistered(result.data?.registered ?? result.data?.is_registered ?? false);
    } catch {
      setFaceRegistered(null);
    } finally {
      setFaceLoading(false);
    }
  };

  const handleFetchActivity = async (userId: string) => {
    try {
      const result = await GetUserActivityAPI<AuditPageResponse>(userId, 0, 5);
      setRecentActivity(result.data?.content || []);
    } catch {
      setRecentActivity([]);
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await handleGetProfile();
    })();
  }, []);

  useEffect(() => {
    if (userData?.data?.id) {
      handleFetchFaceStatus();
      handleFetchActivity(userData.data.id);
    }
  }, [userData?.data?.id]);

  const handleSaveProfile = async (data: { first_name: string; last_name: string; phone: string; profile?: Partial<IUserProfile> }) => {
    try {
      await handleUpdateProfile(data);
      await handleGetProfile();
      enqueueSnackbar("Profile updated successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        HandleError(error as Error | AxiosError<ErrorResponse>).message,
        { variant: "error" }
      );
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'activated': return 'text-green-700 bg-green-50 ring-green-600/10';
      case 'deactivated': return 'text-red-700 bg-red-50 ring-red-600/10';
      case 'banned': return 'text-red-700 bg-red-50 ring-red-600/10';
      default: return 'text-gray-700 bg-gray-50 ring-gray-600/10';
    }
  };

  const getMethodStyle = (method: string) => {
    switch (method) {
      case "GET": return "text-blue-700 bg-blue-50";
      case "POST": return "text-green-700 bg-green-50";
      case "PUT": return "text-amber-700 bg-amber-50";
      case "DELETE": return "text-red-700 bg-red-50";
      default: return "text-gray-700 bg-gray-50";
    }
  };

  const getStatusStyle = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return "text-green-700 bg-green-50";
    if (statusCode >= 400) return "text-red-700 bg-red-50";
    return "text-gray-700 bg-gray-50";
  };

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) return <LoadingPage />;
  if (error) return <Typography color="red">{error}</Typography>;

  const d = userData?.data;

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50/80">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
        {/* Page header */}
        <div>
          <Typography variant="h4" className="text-gray-900 font-semibold">
            Profile
          </Typography>
          <Typography className="text-gray-500 text-sm mt-1">
            Your account information
          </Typography>
        </div>

        {/* Profile header card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-white text-xl font-bold ring-2 ring-white/20">
                {d?.first_name?.charAt(0) || 'U'}{d?.last_name?.charAt(0) || ''}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {d?.first_name} {d?.last_name}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs font-medium text-white/70 bg-white/10 backdrop-blur rounded-md px-2.5 py-1">
                    {d?.role?.name || 'User'}
                  </span>
                  <span className={`text-xs font-medium rounded-md px-2.5 py-1 ring-1 ring-inset ${getStatusColor(d?.status || '')}`}>
                    {d?.status || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">Personal Information</span>
            </div>
            <button
              onClick={() => setEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Edit
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { label: 'Email', value: d?.email },
              { label: 'First Name', value: d?.first_name || 'Not specified' },
              { label: 'Last Name', value: d?.last_name || 'Not specified' },
              { label: 'Phone', value: d?.phone || 'Not specified', muted: !d?.phone },
              { label: 'Display Name', value: d?.profile?.display_name || 'Not specified', muted: !d?.profile?.display_name },
              { label: 'Gender', value: getGenderLabel(d?.profile?.gender) || 'Not specified', muted: !d?.profile?.gender },
              { label: 'Date of Birth', value: d?.profile?.date_of_birth ? new Date(d.profile.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified', muted: !d?.profile?.date_of_birth },
              { label: 'Bio', value: d?.profile?.bio || 'Not specified', muted: !d?.profile?.bio },
              { label: 'Member since', value: new Date(d?.created_at || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
              { label: 'Last updated', value: new Date(d?.updated_at || '').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between px-6 py-3.5">
                <span className="text-sm text-gray-500">{row.label}</span>
                <span className={`text-sm font-medium ${row.muted ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Address</span>
          </div>
          <div className="divide-y divide-gray-50">
            {(() => {
              const p = d?.profile;
              const hasAddress = p?.address_line_1 || p?.city || p?.state || p?.postal_code || p?.country;
              if (!hasAddress) {
                return (
                  <div className="px-6 py-6 text-center">
                    <p className="text-sm text-gray-400 italic">No address information provided</p>
                  </div>
                );
              }
              return [
                { label: 'Address', value: [p?.address_line_1, p?.address_line_2].filter(Boolean).join(', ') || 'Not specified', muted: !p?.address_line_1 },
                { label: 'City', value: p?.city || 'Not specified', muted: !p?.city },
                { label: 'State', value: p?.state || 'Not specified', muted: !p?.state },
                { label: 'Postal Code', value: p?.postal_code || 'Not specified', muted: !p?.postal_code },
                { label: 'Country', value: p?.country ? `${getCountryName(p.country)} (${p.country})` : 'Not specified', muted: !p?.country },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-6 py-3.5">
                  <span className="text-sm text-gray-500">{row.label}</span>
                  <span className={`text-sm font-medium ${row.muted ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                    {row.value}
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Security & Biometric row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Security */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">Security</span>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900 font-medium">Password</p>
                  <p className="text-xs text-gray-400 mt-0.5 tracking-widest">••••••••••••</p>
                </div>
                <button
                  onClick={() => setPasswordModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Biometric */}
          {faceRegistered !== null && (
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a48.667 48.667 0 0 0 6.712 3.86m-1.576-6.97a4.5 4.5 0 0 1 6.798 3.612c0 1.236-.164 2.434-.472 3.572M13.477 13.91a4.5 4.5 0 0 1-3.092.714M10.5 10.5a1.5 1.5 0 0 1 3 0c0 .454-.036.897-.106 1.328" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">Biometric</span>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <p className="text-sm text-gray-900 font-medium">Face ID</p>
                    {faceLoading ? (
                      <Spinner className="h-4 w-4" />
                    ) : faceRegistered ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 ring-1 ring-inset ring-green-600/10 rounded-md px-2 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Registered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 ring-1 ring-inset ring-gray-500/10 rounded-md px-2 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Not registered
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(faceRegistered ? '/face-regconize/recognize' : '/face-regconize/register')}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {faceRegistered ? 'Manage' : 'Register'}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Permissions */}
        {d?.role?.permissions && d.role.permissions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">Permissions</span>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {d.role.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="text-xs text-gray-600 bg-gray-50 ring-1 ring-inset ring-gray-500/10 rounded-md px-2.5 py-1 font-mono"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {activityLoading ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-center py-8">
            <Spinner className="h-5 w-5" />
          </div>
        ) : recentActivity.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-sky-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">Recent Activity</span>
              </div>
              <button
                onClick={() => navigate('/audit')}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                View All
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                    <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="text-right px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentActivity.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3">
                        <span className="text-xs text-gray-800 font-mono">{entry.path}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getMethodStyle(entry.method)}`}>
                          {entry.method}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getStatusStyle(entry.status_code)}`}>
                          {entry.status_code}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-gray-500">{entry.duration_ms}ms</span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className="text-xs text-gray-400">{formatTimeAgo(entry.created_at)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={{
          first_name: d?.first_name || '',
          last_name: d?.last_name || '',
          phone: d?.phone || '',
          profile: d?.profile ? { ...d.profile } : {},
        }}
      />
      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
