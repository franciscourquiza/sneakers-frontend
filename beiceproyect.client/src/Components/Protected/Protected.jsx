/* eslint-disable react/prop-types */
import { Navigate } from 'react-router';

const Protected = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        return <Navigate to="/adminpanel" replace />;
    } else {
        return children;
    }
}

export default Protected