import { Navigate } from 'react-router-dom';
import useAuthStore from './appStore';

const PrivateRoute = ({ children }) => {
    const { user } = useAuthStore();

    // Check if the user is authenticated
    if (!user || !user.name) {
        // Redirect to the login page
        return <Navigate to="/login" />;
    }

    // If the user is authenticated, render the children components
    return children;
}

export default PrivateRoute;
