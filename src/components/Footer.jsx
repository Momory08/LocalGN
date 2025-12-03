import React from "react";

const Footer = () => {
  return (
    <footer style={{ background: 'linear-gradient(90deg, #2563eb 80%, #0ea5e9 100%)', color: '#fff', padding: '0 0 0 0', marginTop: 32, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: 36, background: 'linear-gradient(90deg, #fff 0%, #e0e7ff 100%)', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginBottom: -18, boxShadow: '0 -2px 12px #2563eb22' }} />
      <div className="container py-4" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row align-items-center mb-3">
          <div className="col-md-3 text-center mb-3 mb-md-0">
            <img src="/logo3.png" alt="Logo LocalGN" style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff', border: '2px solid #fff', boxShadow: '0 2px 8px #0002' }} />
            <div className="fw-bold mt-2" style={{ fontSize: 20, letterSpacing: 1 }}>Local Guinée</div>
          </div>
          <div className="col-md-6 text-center mb-3 mb-md-0">
            <div className="mb-2" style={{ fontSize: 15 }}>Votre plateforme de confiance pour trouver un professionnel près de chez vous.</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 8 }}>
              <a href="/" style={{ color: '#fff', fontSize: 16, textDecoration: 'none', fontWeight: 500 }}>Accueil</a>
              <a href="/prestataires" style={{ color: '#fff', fontSize: 16, textDecoration: 'none', fontWeight: 500 }}>Prestataires</a>
              <a href="/contact" style={{ color: '#fff', fontSize: 16, textDecoration: 'none', fontWeight: 500 }}>Contact</a>
              <a href="/apropos" style={{ color: '#fff', fontSize: 16, textDecoration: 'none', fontWeight: 500 }}>À propos</a>
            </div>
          </div>
          <div className="col-md-3 text-center">
            <div className="mb-2" style={{ fontSize: 15 }}>Suivez-nous :</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', width: 32, height: 32 }}>
                <img src="/facebook.jpeg" alt="Facebook" style={{ width: 32, height: 32, borderRadius: '50%', boxShadow: '0 2px 8px #0002', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.15)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', width: 32, height: 32 }}>
                <img src="/linkedin.jpeg" alt="LinkedIn" style={{ width: 32, height: 32, borderRadius: '50%', boxShadow: '0 2px 8px #0002', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.15)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', width: 32, height: 32 }}>
                <img src="/youtube.jpeg" alt="LinkedIn" style={{ width: 32, height: 32, borderRadius: '50%', boxShadow: '0 2px 8px #0002', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.15)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} />
              </a>
              <a href="https://twiter.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', width: 32, height: 32 }}>
                <img src="/twiter.jpeg" alt="LinkedIn" style={{ width: 32, height: 32, borderRadius: '50%', boxShadow: '0 2px 8px #0002', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.15)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} />
              </a>
            </div>
          </div>
        </div>
        <div className="row mt-3" style={{ fontSize: 14, color: '#e0e7ef' }}>
          <div className="col-md-4 text-center text-md-start mb-2 mb-md-0">
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>Adresse :</span> Conakry, Guinée
          </div>
          <div className="col-md-4 text-center mb-2 mb-md-0">
            <a href="mailto:contact@localgn.com" style={{ color: '#e0e7ef', textDecoration: 'underline' }}>contact@localgn.com</a>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <a href="/mentions-legales" style={{ color: '#e0e7ef', textDecoration: 'underline' }}>Mentions légales</a>
          </div>
        </div>
        <div className="text-center" style={{ fontSize: 13, color: '#e0e7ef', borderTop: '1px solid #fff2', paddingTop: 10, marginTop: 10 }}>
          © {new Date().getFullYear()} LocalGN. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
