import { useEffect, useState } from 'react';
import { Card, Typography, Avatar, Button } from "@material-tailwind/react";
import LoadingPage from '../../core/components/Loading';
import { HandleError } from '../../core/services/axios';
import { ErrorResponse } from '../../face-reg/services/axios';
import { AxiosError } from "axios";
import { GetProfileAPI } from '../services/api';
import { enqueueSnackbar } from "notistack";
import { motion } from "framer-motion";
import { UserCircleIcon, PhoneIcon, UserIcon, ShieldCheckIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";


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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" className="text-gray-800 mb-6 font-bold">
          My Profile
        </Typography>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <Card className="md:col-span-2 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="relative group">
                <Avatar 
                  src={userAvatar}
                  alt="User Avatar" 
                  className="h-32 w-32 ring-4 ring-blue-500/30 shadow-xl" 
                  variant="circular"
                />
                {!userData?.data?.avatar && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UserCircleIcon className="h-24 w-24 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    size="sm" 
                    className="bg-white/80 text-gray-900 hover:bg-white"
                    onClick={() => alert('Change Avatar')}
                  >
                    Change
                  </Button>
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <Typography variant="h4" className="text-gray-800 font-bold mb-1">
                  {`${userData?.data?.first_name} ${userData?.data?.last_name}`}
                </Typography>
                <Typography className="text-blue-500 font-medium mb-2">
                  {userData?.data?.system_role}
                </Typography>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                  <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                  <span className="capitalize">{userData?.data?.status}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <Typography className="text-sm text-gray-500">Gender</Typography>
                    <Typography className="font-medium">{userData?.data?.gender || "Not specified"}</Typography>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <PhoneIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <Typography className="text-sm text-gray-500">Phone</Typography>
                    <Typography className="font-medium">{userData?.data?.phone || "Not specified"}</Typography>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <Typography className="text-sm text-gray-500">Email</Typography>
                    <Typography className="font-medium">{userData?.data?.email}</Typography>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserCircleIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <Typography className="text-sm text-gray-500">Member Since</Typography>
                    <Typography className="font-medium">
                      {new Date(userData?.data?.created_at || "").toLocaleDateString()}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button 
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 transition-colors"
                onClick={() => alert('Edit Profile')}
              >
                <UserIcon className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button 
                variant="outlined"
                className="flex items-center gap-2"
                onClick={() => alert('Change Password')}
              >
                Change Password
              </Button>
            </div>
          </Card>

          {/* Stats/Activity Card */}
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Typography variant="h6" className="text-gray-800 font-semibold mb-4">
              Account Activity
            </Typography>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Typography className="text-sm font-medium text-blue-800">
                  Last Updated
                </Typography>
                <Typography className="text-gray-600">
                  {new Date(userData?.data?.updated_at || "").toLocaleString()}
                </Typography>
              </div>
              {/* Add more stats/activity info here */}
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;


