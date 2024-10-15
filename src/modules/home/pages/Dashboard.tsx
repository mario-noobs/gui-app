import React from 'react';
import { Typography, Card, Button } from "@material-tailwind/react";

const Dashboard = () => {
  return (
    <div className="p-4">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Dashboard
      </Typography>
      <Card className="p-6 shadow-xl">
        <Typography variant="h6" color="blue-gray" className="mb-2">
          Welcome to Your Dashboard!
        </Typography>
        <Typography color="gray" className="mb-4">
          Here you can manage your account settings, view your analytics, and much more.
        </Typography>
      </Card>
    </div>
  );
};

export default Dashboard;