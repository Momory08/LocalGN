
import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
// ...existing code...
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header-main" style={{
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 0',
      position: 'sticky',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      minHeight: 68,
      boxShadow: '0 2px 12px #0001',
    }}>
      <div className="header-inner" style={{
        maxWidth: 1300,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 68,
        padding: '0 32px',
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/') }>
          <img src="/logo3.png" alt="SiteLogo" style={{ width: 38, height: 38, marginRight: 10 }} />
          <span style={{ fontWeight: 700, fontSize: 22, color: '#222', letterSpacing: 1 }}>LocalGN</span>
        </div>
        {/* Hamburger pour mobile */}
  <button className="menu-toggle" aria-label="Ouvrir le menu" onClick={() => setShowMenu((v) => !v)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            marginLeft: 12,
            zIndex: 1201,
          }}
        >
          <span style={{ display: 'block', width: 28, height: 3, background: '#2563eb', borderRadius: 2, marginBottom: 5 }}></span>
          <span style={{ display: 'block', width: 28, height: 3, background: '#2563eb', borderRadius: 2, marginBottom: 5 }}></span>
          <span style={{ display: 'block', width: 28, height: 3, background: '#2563eb', borderRadius: 2 }}></span>
        </button>
        {/* Menu navigation */}
        <nav className={showMenu ? "nav-main nav-mobile-open" : "nav-main"} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}>
          <div style={{ position: 'relative' }}>
            <a href="/prestataires" style={{ color: '#222', fontWeight: 500, fontSize: 16, textDecoration: 'none' }} onClick={() => setShowMenu(false)}>Prestataires</a>
          </div>
          <a href="/gallery" style={{ color: '#222', fontWeight: 500, fontSize: 16, textDecoration: 'none' }} onClick={() => setShowMenu(false)}>Gallery</a>
          <a href="/team" style={{ color: '#222', fontWeight: 500, fontSize: 16, textDecoration: 'none' }} onClick={() => setShowMenu(false)}>Equipes</a>
          <a href="/contact" style={{ color: '#222', fontWeight: 500, fontSize: 16, textDecoration: 'none' }} onClick={() => setShowMenu(false)}>Contact</a>
          <a href="/apropos" style={{ color: '#222', fontWeight: 500, fontSize: 16, textDecoration: 'none' }} onClick={() => setShowMenu(false)}>A propos</a>
        </nav>

        {/* Overlay pour fermer le menu mobile en cliquant à l'extérieur */}
        {showMenu && (
          <div
            onClick={() => setShowMenu(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.08)',
              zIndex: 1199,
            }}
          />
        )}
        {/* Utilisateur connecté : menu profil */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 24, position: 'relative' }}>
            {/* Bloc profil + nom + email */}
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowMenu((v) => !v)}>
              <>
                <img src={user.photo ? (user.photo.startsWith("http") ? user.photo : `http://localhost:5000${user.photo}`) : "/logo192.png"} alt="Profil" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #fbbf24', objectFit: 'cover' }} />
                <div style={{ marginLeft: 8 }}>
                  <div style={{ fontWeight: 700, color: '#2563eb', fontSize: 16 }}>{user.nom || user.name}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{user.email}</div>
                </div>
              </>
            </div>
            {/* Menu déroulant utilisateur */}
            {showMenu && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                style={{ position: 'absolute', top: 50, right: 0, background: '#fff', boxShadow: '0 4px 24px #2563eb33', borderRadius: 12, minWidth: 220, zIndex: 2000 }}>
                <>
                  <Link to="/client-profile" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', color: '#222', textDecoration: 'none', fontWeight: 600, fontSize: 15, borderBottom: '1px solid #f3f4f6' }} onClick={() => setShowMenu(false)}>
                    <span role="img" aria-label="Profil">👤</span> Profil
                  </Link>
                  <Link to="/parametres" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', color: '#222', textDecoration: 'none', fontWeight: 600, fontSize: 15, borderBottom: '1px solid #f3f4f6' }} onClick={() => setShowMenu(false)}>
                    <span role="img" aria-label="Paramètres">⚙️</span> Paramètres
                  </Link>
                  <div style={{ padding: '12px 18px', color: '#d00', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={handleLogout}>
                    <span role="img" aria-label="Déconnexion">🚪</span> Se déconnecter
                  </div>
                </>
              </motion.div>
            )}
          </div>
        ) : (
          <button onClick={() => navigate('/login')} style={{
            background: 'linear-gradient(90deg,#38bdf8 60%,#6366f1 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            padding: '10px 26px',
            boxShadow: '0 2px 8px #2563eb22',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}>Connexion</button>
        )}
      </div>
    </header>
  );
};

export default Header;
