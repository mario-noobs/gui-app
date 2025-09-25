import { useFaceRegContext } from './ProtectedRoute';
import ProtectedRoute from './ProtectedRoute';
import { Outlet } from 'react-router-dom';

interface FaceRegRouteGuardProps {
  type: 'register' | 'recognize';
}

const FaceRegRouteGuard = ({ type }: FaceRegRouteGuardProps) => {
  const { isRegistered, setIsRegistered } = useFaceRegContext();
  const onRegistrationStatusChange = setIsRegistered;
  if (type === 'register') {
    return !isRegistered
      ? <Outlet context={{ onRegistrationStatusChange }} />
      : <ProtectedRoute canAccess={false} redirectPath="/face-regconize/recognize" />;
  }
  return isRegistered
    ? <Outlet context={{ onRegistrationStatusChange }} />
    : <ProtectedRoute canAccess={false} redirectPath="/face-regconize/register" />;
};

export default FaceRegRouteGuard;
