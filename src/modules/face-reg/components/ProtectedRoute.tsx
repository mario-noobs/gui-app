import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  canAccess: boolean;
  redirectPath: string;
  context?: any;
}

const ProtectedRoute = ({ canAccess, redirectPath, context }: ProtectedRouteProps) => {
  return canAccess ? <Outlet context={context} /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
import { createContext, useContext } from 'react';

interface FaceRegContextType {
  isRegistered: boolean;
  setIsRegistered: (value: boolean) => void;
}

export const FaceRegContext = createContext<FaceRegContextType | undefined>(undefined);

export const useFaceRegContext = () => {
  const context = useContext(FaceRegContext);
  if (!context) {
    throw new Error('useFaceRegContext must be used within a FaceRegProvider');
  }
  return context;
};
