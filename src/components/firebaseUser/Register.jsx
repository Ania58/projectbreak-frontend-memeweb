import { useState, useEffect, useContext } from "react";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup  } from "firebase/auth";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext"; 
import '../../css/Authorization.css'

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptRules, setAcceptRules] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [isGoogleRegister, setIsGoogleRegister] = useState(false); 
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})/;

  useEffect(() => {
    if (!isRegistrationComplete || isGoogleRegister) return; 

    const interval = setInterval(async () => {
      const user = auth.currentUser;

      if (!user) {
        clearInterval(interval);
        return;
      }

      await user.reload();
      console.log("Checking email verification status:", user.emailVerified);

      if (user.emailVerified) {
        clearInterval(interval);
        setSuccessMessage("Email verified successfully! You can now log in.");
        navigate("/login");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate, isRegistrationComplete, isGoogleRegister]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!acceptRules) {
      setError("You must accept the rules to create an account.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 7 characters long, contain at least one number, and one special character."
      );
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      const token = await user.getIdToken();
      console.log("ID Token:", token);
      localStorage.setItem("authToken", token);

      await axios.post(
        "/profile",
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser({ uid: user.uid, name, email }); 

      setSuccessMessage("Registration successful! Please check your email to verify your account.");
      setIsRegistrationComplete(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); 
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsGoogleRegister(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      localStorage.setItem("authToken", token);

      await axios.post(
        "/profile",
        { name: user.displayName, email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser({ uid: user.uid, name: user.displayName, email: user.email });
      setSuccessMessage("Google registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Google Registration Error:", err);
      setError("Google registration failed. Please try again.");
    } finally {
      setIsGoogleRegister(false); 
    }
  };

  return (
    <div className="auth-container"> 
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="show-password-button"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="rules-container">
            <label>
              <input
                type="checkbox"
                checked={acceptRules}
                onChange={(e) => setAcceptRules(e.target.checked)}
                required
              />
              I accept the <a href="/rules-and-regulations.pdf" target="_blank" rel="noopener noreferrer">rules</a>.
            </label>
          </div>
          <button type="submit" className="auth-button" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>
        <div className="google-button-container">
          <button onClick={handleGoogleRegister} className="google-button">
          <img src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/google.svg" alt="Google Logo" />
            Register with Google
          </button>
        </div>
        {error && <p className="auth-error">{error}</p>}
        {successMessage && <p className="auth-success">{successMessage}</p>}
      </div>
    </div>
  );
}

export default Register;
