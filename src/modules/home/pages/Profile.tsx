import { useEffect, useState } from 'react';
import { Card, Typography, Avatar, Button } from "@material-tailwind/react";
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
    system_role: string;
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

  return (
      <div className="p-4">
          <Typography variant="h4" color="blue-gray" className="mb-4">
              Profile
          </Typography>
          <Card className="p-6 shadow-xl">
              <div className="flex items-center mb-4">
                  <Avatar 
                      src={userData?.data?.avatar ? `data:image/jpeg;base64,${userData?.data?.avatar}` : "https://via.placeholder.com/150"} 
                      alt="User Avatar" 
                      className="mr-4" 
                  />
                  <div>
                      <Typography variant="h5" color="blue-gray">{`${userData?.data?.first_name} ${userData?.data?.last_name}`}</Typography>
                      <Typography color="gray">{userData?.data?.email}</Typography>
                  </div>
              </div>
              <Typography color="gray" className="mb-2">
                  Phone: {userData?.data?.phone || "N/A"}
              </Typography>
              <Typography color="gray" className="mb-2">
                  Gender: {userData?.data?.gender}
              </Typography>
              <Typography color="gray" className="mb-2">
                  Role: {userData?.data?.system_role}
              </Typography>
              <Typography color="gray" className="mb-2">
                  Status: {userData?.data?.status}
              </Typography>
              <Button color="blue" onClick={() => alert('Edit Profile')}>
                  Edit Profile
              </Button>
          </Card>
      </div>
  );
};

export default Profile;


