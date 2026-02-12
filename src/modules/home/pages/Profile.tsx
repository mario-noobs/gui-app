import { useEffect, useState } from 'react';
import { Typography } from "@material-tailwind/react";
import LoadingPage from '../../core/components/Loading';
import { HandleError } from '../../core/services/axios';
import { ErrorResponse } from '../../face-reg/services/axios';
import { AxiosError } from "axios";
import { GetProfileAPI } from '../services/api';
import { enqueueSnackbar } from "notistack";

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
  }
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const handleGetProfile = async () => {
    try {
      const result = await GetProfileAPI<UserData>();
      setUserData(result);
      setLoading(false)
    } catch (error) {
      enqueueSnackbar(
        HandleError(error as Error | AxiosError<ErrorResponse>).message,
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await handleGetProfile();
    })();
  }, []);

  if (loading) return <LoadingPage />;
  if (error) return <Typography color="red">{error}</Typography>;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-700 bg-green-50 border-green-200';
      case 'inactive': return 'text-red-700 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-6">
          <Typography variant="h4" className="text-gray-900 font-semibold">
            Profile
          </Typography>
          <Typography className="text-gray-500 text-sm mt-1">
            Your account information
          </Typography>
        </div>

        {/* Profile card */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {/* Header section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xl font-semibold">
                {userData?.data?.first_name?.charAt(0) || 'U'}
              </div>
              <div>
                <Typography variant="h5" className="text-gray-900 font-semibold">
                  {userData?.data?.first_name} {userData?.data?.last_name}
                </Typography>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded px-2 py-0.5">
                    {userData?.data?.role?.name || 'User'}
                  </span>
                  <span className={`text-xs font-medium rounded px-2 py-0.5 border ${getStatusColor(userData?.data?.status || '')}`}>
                    {userData?.data?.status || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm text-gray-900 font-medium">{userData?.data?.email}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-gray-500">Phone</span>
              <span className="text-sm text-gray-900 font-medium">{userData?.data?.phone || 'Not specified'}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-gray-500">Gender</span>
              <span className="text-sm text-gray-900 font-medium capitalize">{userData?.data?.gender || 'Not specified'}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-gray-500">Member since</span>
              <span className="text-sm text-gray-900 font-medium">
                {new Date(userData?.data?.created_at || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-gray-500">Last updated</span>
              <span className="text-sm text-gray-900 font-medium">
                {new Date(userData?.data?.updated_at || '').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Permissions */}
          {userData?.data?.role?.permissions && userData.data.role.permissions.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <span className="text-sm text-gray-500 block mb-2">Permissions</span>
              <div className="flex flex-wrap gap-1.5">
                {userData.data.role.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-2 py-0.5 font-mono"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
