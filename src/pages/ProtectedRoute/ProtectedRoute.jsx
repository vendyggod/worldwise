import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/FakeAuthContext';
import PropTypes from 'prop-types';

ProtectedRoute.propTypes = {
  children: PropTypes.any,
};

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
