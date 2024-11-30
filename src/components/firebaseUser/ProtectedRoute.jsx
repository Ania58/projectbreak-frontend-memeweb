{/*import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");

  return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;*/}


import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../config/firebase";

function ProtectedRoute({ children }) {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      const user = auth.currentUser;

      if (user) {
        await user.reload(); 
        setIsVerified(user.emailVerified); 
      }

      setLoading(false);
    };

    checkVerification();
  }, []);

  if (loading) return <p>Loading...</p>;

  const token = localStorage.getItem("authToken");

  return token && isVerified ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;

