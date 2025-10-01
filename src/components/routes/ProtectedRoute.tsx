import { JSX } from "react/jsx-runtime";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = localStorage.getItem("access");

    if (!token) {
        return <Navigate to="/ingresar" replace />;
    }

    return children;
};

export default ProtectedRoute;