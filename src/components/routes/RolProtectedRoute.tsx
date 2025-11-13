import { Navigate } from "react-router";
import { useUsuario } from "../../hooks/Usuario/useUsuario";
import { JSX } from "react/jsx-runtime";

type RoleProtectedRouteProps = {
    allowedRoles: string[];
    children: JSX.Element;
};

const RoleProtectedRoute = ({ allowedRoles, children }: RoleProtectedRouteProps) => {
  const { usuario, loading } = useUsuario();

  if (loading) return null; // o un spinner

  const rolUsuario = usuario?.rol;
  console.log("Rol del usuario autenticado:", rolUsuario);

  if (!rolUsuario || !allowedRoles.includes(rolUsuario)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;