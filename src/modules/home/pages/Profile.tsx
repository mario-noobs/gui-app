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
    <div className="w-full h-full flex flex-col bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 p-4 space-y-6 overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <Typography variant="h2" className="text-gray-800 font-bold mb-2">My Profile</Typography>
          <Typography variant="h6" className="text-gray-600">Manage your personal information and account settings</Typography>
        </div>

        {/* Single full-width card (removed sidebar column) */}
        <Card className="w-full shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow">
          <div className="p-6 md:p-8">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row items-start gap-8 mb-8">
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <Avatar src={userAvatar} alt="User Avatar" className="h-40 w-40 ring-4 ring-blue-500/20 shadow-2xl" variant="circular" />
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-white/90 p-4 rounded-full">
                    <CameraIcon className="h-8 w-8 text-gray-700" />
                  </motion.div>
                </div>
              </div>
              {/* Info + Actions */}
              <div className="flex-1 w-full">
                <div className="mb-6">
                  <Typography variant="h3" className="text-gray-800 font-bold mb-3">{`${userData?.data?.first_name} ${userData?.data?.last_name}`}</Typography>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <Chip value={userData?.data?.system_role || 'User'} color={getRoleColor(userData?.data?.system_role || '')} className="rounded-full text-base px-4 py-2" size="lg" />
                    <Chip value={userData?.data?.status || 'Unknown'} color={getStatusColor(userData?.data?.status || '')} className="rounded-full text-base px-4 py-2" size="lg" icon={<CheckBadgeIcon className="h-5 w-5" />} />
                  </div>
                  <Typography variant="h6" className="text-gray-600 leading-relaxed">Welcome to your profile dashboard. Here you can view and manage your account information.</Typography>
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 transition-colors px-6 py-3 text-base font-bold" size="lg" onClick={() => alert('Edit Profile')}>
                      <PencilIcon className="h-5 w-5" /> Edit Profile
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outlined" className="flex items-center gap-3 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 text-base font-bold" size="lg" onClick={() => alert('Change Password')}>
                      <KeyIcon className="h-5 w-5" /> Change Password
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3 rounded-xl"><EnvelopeIcon className="h-6 w-6 text-white" /></div>
                  <div className="flex-1">
                    <Typography className="text-base text-gray-500 font-medium mb-1">Email Address</Typography>
                    <Typography variant="h6" className="font-bold text-gray-800 break-all">{userData?.data?.email}</Typography>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 p-3 rounded-xl"><PhoneIcon className="h-6 w-6 text-white" /></div>
                  <div className="flex-1">
                    <Typography className="text-base text-gray-500 font-medium mb-1">Phone Number</Typography>
                    <Typography variant="h6" className="font-bold text-gray-800">{userData?.data?.phone || 'Not specified'}</Typography>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500 p-3 rounded-xl"><UserIcon className="h-6 w-6 text-white" /></div>
                  <div className="flex-1">
                    <Typography className="text-base text-gray-500 font-medium mb-1">Gender</Typography>
                    <Typography variant="h6" className="font-bold text-gray-800 capitalize">{userData?.data?.gender || 'Not specified'}</Typography>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500 p-3 rounded-xl"><CalendarDaysIcon className="h-6 w-6 text-white" /></div>
                  <div className="flex-1">
                    <Typography className="text-base text-gray-500 font-medium mb-1">Member Since</Typography>
                    <Typography variant="h6" className="font-bold text-gray-800">{new Date(userData?.data?.created_at || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Integrated Activity & Stats (previous sidebar) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <Typography variant="h5" className="text-gray-800 font-bold mb-4 flex items-center gap-2 text-base">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-500" /> Activity
                </Typography>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <Typography className="text-sm font-bold text-blue-800 mb-1">Last Update</Typography>
                    <Typography className="text-sm text-gray-600">{new Date(userData?.data?.updated_at || '').toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Typography>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <Typography className="text-sm font-bold text-green-800 mb-1">Created</Typography>
                    <Typography className="text-sm text-gray-600">{new Date(userData?.data?.created_at || '').toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <Typography variant="h5" className="text-gray-800 font-bold mb-4 text-base">Stats</Typography>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Profile Complete</span>
                    <span className="text-sm font-bold text-green-600">85%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Security Score</span>
                    <span className="text-sm font-bold text-blue-600">Good</span>
                  </div>
                </div>
              </motion.div>
              {/* Empty spacers to balance layout on very wide screens */}
              <div className="hidden xl:block" />
              <div className="hidden xl:block" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;

