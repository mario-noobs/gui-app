import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { LoadingPage } from "../../core/components/Loading";

interface IPrivateComponentProps {
  children: React.ReactNode;
}

export const PrivateComponent: React.FC<IPrivateComponentProps> = ({
  children,
}) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
