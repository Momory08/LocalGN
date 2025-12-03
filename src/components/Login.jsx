
import React, { useState, useContext } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Header from "./Header";
import Footer from "./Footer";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [keepLogged, setKeepLogged] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Connexion réussie !");
        fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${data.token}` },
        })
          .then((res) => res.json())
          .then((userData) => {
            setUser(userData);
            if (userData.role === "client") {
              navigate("/");
            } else if (userData.role === "prestataire") {
              navigate("/dashboard");
            } else if (userData.role === "admin") {
              navigate("/admin-dashboard");
            } else {
              navigate("/");
            }
          });
      } else {
        setMessage(`❌ ${data.msg}`);
      }
    } catch (err) {
      setMessage("❌ Erreur de connexion au serveur");
    }
  };

  // Gestion Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) return;
    try {
      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Connexion Google réussie !");
        fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${data.token}` },
        })
          .then((res) => res.json())
          .then((userData) => {
            setUser(userData);
            if (userData.role === "client") {
              navigate("/");
            } else if (userData.role === "prestataire") {
              navigate("/dashboard");
            } else if (userData.role === "admin") {
              navigate("/admin-dashboard");
            } else {
              navigate("/");
            }
          });
      } else {
        setMessage("❌ Connexion Google impossible");
      }
    } catch (err) {
      setMessage("❌ Erreur Google login");
    }
  };

  // Style décoratif pour le fond et les formes
  const bgShapes = [
    { top: 0, left: 0, width: 180, height: 180, bg: "linear-gradient(135deg,#e0e7ff 60%,#fff 100%)", borderRadius: "50%" },
    { top: 0, right: 0, width: 160, height: 160, bg: "linear-gradient(135deg,#fca5a5 60%,#fff 100%)", borderRadius: "50%" },
    { bottom: 0, left: 0, width: 120, height: 120, bg: "linear-gradient(135deg,#f472b6 60%,#fff 100%)", borderRadius: "50%" },
    { bottom: 0, right: 0, width: 180, height: 180, bg: "linear-gradient(135deg,#a5b4fc 60%,#fff 100%)", borderRadius: "50%" },
    { top: 120, left: 80, width: 80, height: 80, bg: "#fbbf24", borderRadius: "30% 70% 70% 30%/30% 30% 70% 70%" },
    { top: 200, right: 120, width: 90, height: 90, bg: "#38bdf8", borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%" },
  ];

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginTop: 0,
      }}>
        {/* Décorations */}
        {bgShapes.map((shape, i) => (
          <div key={i} style={{
            position: 'absolute',
            ...shape,
            zIndex: 0,
            opacity: 0.7
          }} />
        ))}
        <div style={{
          zIndex: 1,
          width: '100%',
          maxWidth: 1100,
          minHeight: 520,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 32,
          boxShadow: '0 4px 32px #2563eb22',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
         
        }}>
          {/* Colonne gauche : formulaire */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 36, background: '#fff' }}>
            <div style={{ width: '100%', maxWidth: 370 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg,#a5b4fc 60%,#f472b6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 32, color: '#fff' }}>LG</div>
                <span style={{ fontWeight: 700, fontSize: 28, color: '#6366f1', letterSpacing: 1 }}>Connectez-vous</span>
              </div>
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "VOTRE_CLIENT_ID_GOOGLE"}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setMessage("❌ Google login failed")}
                  width="100%"
                  useOneTap
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  logo_alignment="left"
                  style={{ width: '100%', marginBottom: 18 }}
                />
              </GoogleOAuthProvider>
              <div style={{ textAlign: 'center', color: '#888', fontSize: 15, margin: '10px 0 18px 0' }}>Ou connectez-vous avec votre adresse e-mail</div>
              <form onSubmit={handleLogin} autoComplete="on">
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ borderRadius: 8, fontSize: 16, marginBottom: 12 }}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ borderRadius: 8, fontSize: 16, marginBottom: 6 }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', fontSize: 15, color: '#444', cursor: 'pointer' }}>
                    <input type="checkbox" checked={keepLogged} onChange={e => setKeepLogged(e.target.checked)} style={{ marginRight: 6 }} />
                    Restez connecté
                  </label>
                  {/* Option mot de passe oublié déplacée en bas */}
                </div>
                <button type="submit" className="btn btn-primary w-100 btn-lg" style={{ borderRadius: 8, fontWeight: 600, fontSize: 18, background: 'linear-gradient(90deg,#6366f1 60%,#a5b4fc 100%)', border: 'none', marginTop: 8 }}>Login</button>
              </form>
              {message && (
                <div className={`alert mt-3 ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>{message}</div>
              )}
              <div style={{ textAlign: 'center', marginTop: 18, fontSize: 15 }}>
                Vous n’avez pas de compte <a href="/register" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Inscrivez-vous</a>
              </div>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <a href="/forgot-password" style={{ color: '#6366f1', fontWeight: 500, textDecoration: 'underline', fontSize: 15 }}>Mot de passe oublié ?</a>
              </div>
            </div>
          </div>
          {/* Colonne droite : texte */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'url(/home.jpg) center/cover no-repeat', position: 'relative' }}>
            {/* <div style={{ fontSize: 34, fontWeight: 700, color: '#222', lineHeight: 1.2, maxWidth: 340, textAlign: 'center', letterSpacing: 0.5 }}>
              Connectez-vous sur <br />
              <span style={{ color: '#6366f1' }}>LocalGN</span> pour une expérience personnalisée
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
