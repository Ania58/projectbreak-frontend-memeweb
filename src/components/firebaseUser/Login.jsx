import { useState, useContext } from "react";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import '../../css/Authorization.css'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data); 

      navigate("/profile");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Error logging in. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">Login</button>
        </form>
        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
