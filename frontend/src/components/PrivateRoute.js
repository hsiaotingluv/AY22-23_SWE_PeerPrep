import React , { useState, useEffect } from "react"
import { useLocation, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function PrivateRoute({ children }) {
    const location = useLocation();
    const { user, checkToken } = useAuth();
    const [isTokenValidated, setIsTokenValidated] = useState(false);

    useEffect(() => {
        const authorize = async () => {
            if (!user) {
                await checkToken();
            }
            setIsTokenValidated(true);
        }
        authorize();
    }, [checkToken, user])
    
     if (!isTokenValidated) {
        return <div />;
     }

    return user ? children : <Navigate to="/login" state={{ from: location }}/>;

}

export default PrivateRoute;