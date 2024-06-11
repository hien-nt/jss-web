import { Navigate, useLocation, useNavigate  } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

//Original
// export const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   if (!user) {
//     // user is not authenticated
//     return <Navigate to="/login" />;
//   } 
//   return children;
// };

//Update
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect or show a "Not Authorized" page
    return <Navigate to="/unauthorized" replace />;
    // return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }
  return children;
};

