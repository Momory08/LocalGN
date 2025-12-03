import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Un email de réinitialisation a été envoyé si l'adresse existe.");
      } else {
        setMessage("❌ " + (data.msg || "Erreur lors de la demande."));
      }
    } catch (err) {
      setMessage("❌ Erreur serveur. Veuillez réessayer plus tard.");
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #6366f122', padding: 36, maxWidth: 400, width: '100%' }}>
          <h2 style={{ color: '#6366f1', fontWeight: 700, marginBottom: 18, fontSize: 26 }}>Mot de passe oublié ?</h2>
          <p style={{ color: '#444', marginBottom: 18 }}>Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Votre e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ borderRadius: 8, fontSize: 16, marginBottom: 16 }}
            />
            <button type="submit" className="btn btn-primary w-100 btn-lg" style={{ borderRadius: 8, fontWeight: 600, fontSize: 18, background: 'linear-gradient(90deg,#6366f1 60%,#a5b4fc 100%)', border: 'none' }} disabled={loading}>
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>
          {message && (
            <div className={`alert mt-3 ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>{message}</div>
          )}
          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 15 }}>
            <a href="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Retour à la connexion</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;
