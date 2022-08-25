import { Outlet, Navigate, useLocation } from 'react-router-dom'

const PrivateRoutes = ({
  isAllowed,
  redirectPath = '/login',
  children,
}) => {
  const location = useLocation();
  console.log("isAllowed", isAllowed)
  if (!isAllowed) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoutes