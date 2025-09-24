import { useEffect, useState } from 'react';
import { Card, Typography, Avatar, Button, Chip } from "@material-tailwind/react";
import LoadingPage from '../../core/components/Loading';
import { HandleError } from '../../core/services/axios';
import { ErrorResponse } from '../../face-reg/services/axios';
import { AxiosError } from "axios";
import { GetProfileAPI } from '../services/api';
import { enqueueSnackbar } from "notistack";
import { motion } from "framer-motion";
import {
  PhoneIcon,
  UserIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  PencilIcon,
  KeyIcon,
  CameraIcon
} from "@heroicons/react/24/outline";


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
    system_role: string;
    status: string;
  }   
}

const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

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
        {
          variant: "error",
        }
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

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <Typography color="red">{error}</Typography>;
  }

  const userAvatar = userData?.data?.avatar 
    ? `data:image/jpeg;base64,${userData.data.avatar}` 
    : defaultAvatar;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'pending': return 'orange';
      default: return 'blue';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'purple';
      case 'user': return 'blue';
      case 'moderator': return 'indigo';
      default: return 'gray';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Typography variant="h3" className="text-gray-800 font-bold mb-2">
            My Profile
          </Typography>
          <Typography className="text-gray-600">
            Manage your personal information and account settings
          </Typography>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Profile Header Card */}
          <Card className="xl:col-span-3 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
                {/* Avatar Section */}
                <div className="relative group">
                  <Avatar
                    src={userAvatar}
                    alt="User Avatar"
                    className="h-32 w-32 ring-4 ring-blue-500/20 shadow-2xl"
                    variant="circular"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/90 p-3 rounded-full"
                    >
                      <CameraIcon className="h-6 w-6 text-gray-700" />
                    </motion.div>
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center lg:text-left flex-1">
                  <div className="mb-4">
                    <Typography variant="h4" className="text-gray-800 font-bold mb-2">
                      {`${userData?.data?.first_name} ${userData?.data?.last_name}`}
                    </Typography>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-3">
                      <Chip
                        value={userData?.data?.system_role || 'User'}
                        color={getRoleColor(userData?.data?.system_role || '')}
                        className="rounded-full"
                      />
                      <Chip
                        value={userData?.data?.status || 'Unknown'}
                        color={getStatusColor(userData?.data?.status || '')}
                        className="rounded-full"
                        icon={<CheckBadgeIcon className="h-4 w-4" />}
                      />
                    </div>
                    <Typography className="text-gray-600 max-w-md">
                      Welcome to your profile dashboard. Here you can view and manage your account information.
                    </Typography>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 transition-colors"
                        onClick={() => alert('Edit Profile')}
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outlined"
                        className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => alert('Change Password')}
                      >
                        <KeyIcon className="h-4 w-4" />
                        Change Password
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <EnvelopeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Typography className="text-sm text-gray-500 font-medium">Email Address</Typography>
                        <Typography className="font-semibold text-gray-800">{userData?.data?.email}</Typography>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <PhoneIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Typography className="text-sm text-gray-500 font-medium">Phone Number</Typography>
                        <Typography className="font-semibold text-gray-800">
                          {userData?.data?.phone || "Not specified"}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500 p-2 rounded-lg">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Typography className="text-sm text-gray-500 font-medium">Gender</Typography>
                        <Typography className="font-semibold text-gray-800 capitalize">
                          {userData?.data?.gender || "Not specified"}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-500 p-2 rounded-lg">
                        <CalendarDaysIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Typography className="text-sm text-gray-500 font-medium">Member Since</Typography>
                        <Typography className="font-semibold text-gray-800">
                          {new Date(userData?.data?.created_at || "").toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>

          {/* Activity & Stats Sidebar */}
          <div className="space-y-6">
            {/* Account Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <Typography variant="h6" className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                    <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                    Account Activity
                  </Typography>

                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <Typography className="text-sm font-medium text-blue-800 mb-1">
                        Last Profile Update
                      </Typography>
                      <Typography className="text-gray-600 text-sm">
                        {new Date(userData?.data?.updated_at || "").toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <Typography className="text-sm font-medium text-green-800 mb-1">
                        Account Created
                      </Typography>
                      <Typography className="text-gray-600 text-sm">
                        {new Date(userData?.data?.created_at || "").toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Typography>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <Typography variant="h6" className="text-gray-800 font-semibold mb-4">
                    Quick Stats
                  </Typography>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Profile Complete</span>
                      <span className="text-sm font-bold text-green-600">85%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Security Score</span>
                      <span className="text-sm font-bold text-blue-600">Good</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

