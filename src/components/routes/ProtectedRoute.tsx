import { JSX } from "react/jsx-runtime";
import { Navigate } from "react-router";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = localStorage.getItem("access");
    const hasShownToast = useRef(false);

    useEffect(() => {
        if (!token && !hasShownToast.current) {
            toast.error("Sesión requerida", {
                description: "Debes iniciar sesión para acceder a esta página.",
                duration: 4000,
            });
            hasShownToast.current = true;
        }
    }, [token]);

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default ProtectedRoute;  