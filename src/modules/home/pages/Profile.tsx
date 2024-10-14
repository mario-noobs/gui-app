import React, { useEffect, useState } from 'react';
import { Card, Typography, Avatar, Button, CircularProgress } from "@material-tailwind/react";
import LoadingPage from '../../core/components/Loading';

const mockUserData = {
    "data": {
        "id": "e532qos8jjM2",
        "created_at": "2024-09-25T16:41:54Z",
        "updated_at": "2024-09-25T16:41:54Z",
        "first_name": "Dev",
        "last_name": "Ộp",
        "email": "devops@200lab.io",
        "phone": "",
        "avatar": "",
        "gender": "unknown",
        "system_role": "user",
        "status": "active"
    }
};

interface UserData {
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

const Profile = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate an API call with a timeout
    const fetchUserProfile = () => {
      setTimeout(() => {
        // Simulate success
        setUserData(mockUserData.data);
        console.log("UserData", userData)
        setLoading(false);
      }, 1000); // Mock loading time
    };

    fetchUserProfile();
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
            src={userData?.avatar ? `data:image/jpeg;base64,${userData.avatar}` : "https://via.placeholder.com/150"} 
            alt="User Avatar" 
            className="mr-4" 
/>        <div>
            <Typography variant="h5" color="blue-gray">{`${userData?.first_name} ${userData?.last_name}`}</Typography>
            <Typography color="gray">{userData?.email}</Typography>
          </div>
        </div>
        <Typography color="gray" className="mb-2">
          Phone: {userData?.phone || "N/A"}
        </Typography>
        <Typography color="gray" className="mb-2">
          Gender: {userData?.gender}
        </Typography>
        <Typography color="gray" className="mb-2">
          Role: {userData?.system_role}
        </Typography>
        <Typography color="gray" className="mb-2">
          Status: {userData?.status}
        </Typography>
        <Button color="blue" onClick={() => alert('Edit Profile')}>
          Edit Profile
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
