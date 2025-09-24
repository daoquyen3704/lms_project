import { useContext } from 'react';
import { AuthContext } from '../context/Auth';
import { Navigate } from 'react-router-dom';

export const RequiredAuth = ({ children }) => {
    const { user, token } = useContext(AuthContext);

    if (!user || !token) {
        return <Navigate to="/account/login" replace />;
    }
    return children;
};
