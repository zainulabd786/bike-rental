import { memo } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes = ({
  isAllowed,
  redirectPath = '/login',
  children,
}) => {
  const location = useLocation();
  
  if(isAllowed === undefined) return null
  else if (isAllowed === false) 
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  

  return children ? children : <Outlet />;
};

export default memo(PrivateRoutes)