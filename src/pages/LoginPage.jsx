import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/products";

  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="full-center">
      <form className="auth-card" onSubmit={submit}>
        <h2 className="auth-title">Login</h2>
        <p className="auth-hint">Sign in using ReqRes demo API (or any credentials)</p>

        <label>
          Email
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Password
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <div className="status error">{error}</div>}

        <button className="btn btn-login" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
          Tip: use <strong>any</strong> credentials — login will succeed (demo).
        </p>
      </form>
    </div>
  );
}
