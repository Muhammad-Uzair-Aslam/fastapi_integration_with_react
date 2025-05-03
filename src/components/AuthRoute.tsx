import { Navigate } from 'react-router-dom';
import { JSX } from 'react';
interface AuthRouteProps {
  children: JSX.Element;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/home" replace /> : children;
};

export default AuthRoute;