import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import type { Role } from '../utils/types';

export function ProtectedRoute({ role }: { role?: Role }) {
  const { token, user } = useAppSelector((state) => state.auth);

  if (!token && !user) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}
