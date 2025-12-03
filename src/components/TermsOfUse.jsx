import React from "react";


const TermsOfUse = () => (
  <div style={{
    maxWidth: 800,
    margin: "40px auto",
    padding: 32,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    fontFamily: 'Segoe UI',
    color: '#222',
  }}>
    <div style={{textAlign: 'center', marginBottom: 24}}>
      <img src="/logo1.png" alt="LocalGN logo" style={{height: 60, marginBottom: 8}} />
      <h2 style={{color: '#0d6efd', fontWeight: 700, marginBottom: 8}}>
        <span role="img" aria-label="document">📄</span> Conditions d'utilisation de LocalGN
      </h2>
      <p style={{fontSize: 18, color: '#555'}}>Dernière mise à jour : 16 septembre 2025</p>
    </div>
    <section style={{marginBottom: 24}}>
      <h4 style={{color: '#0d6efd', fontWeight: 600}}>1. Acceptation des conditions</h4>
      <p>
        En créant un compte sur LocalGN, vous acceptez sans réserve les présentes conditions d'utilisation. Veuillez les lire attentivement avant toute inscription ou utilisation de nos services.
      </p>
    </section>
    <section style={{marginBottom: 24}}>
      <h4 style={{color: '#0d6efd', fontWeight: 600}}>2. Obligations de l'utilisateur</h4>
      <ul style={{fontSize: 17, lineHeight: 1.7}}>
        <li>Fournir des informations exactes, complètes et à jour lors de l'inscription.</li>
        <li>Respecter la confidentialité de vos identifiants et ne pas les partager.</li>
        <li>Ne pas usurper l'identité d'autrui ni créer de faux comptes.</li>
        <li>Utiliser la plateforme dans le respect des lois en vigueur et des autres utilisateurs.</li>
        <li>Signaler tout comportement inapproprié ou contenu illicite à l'équipe LocalGN.</li>
      </ul>
    </section>
    <section style={{marginBottom: 24}}>
      <h4 style={{color: '#0d6efd', fontWeight: 600}}>3. Responsabilités de LocalGN</h4>
      <ul style={{fontSize: 17, lineHeight: 1.7}}>
        <li>LocalGN s'engage à protéger vos données personnelles conformément à la législation en vigueur.</li>
        <li>La plateforme peut être mise à jour ou modifiée à tout moment pour améliorer l'expérience utilisateur.</li>
        <li>LocalGN ne saurait être tenu responsable des contenus publiés par les utilisateurs.</li>
      </ul>
    </section>
    <section style={{marginBottom: 24}}>
      <h4 style={{color: '#0d6efd', fontWeight: 600}}>4. Modification des conditions</h4>
      <p>
        LocalGN se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés en cas de changement important.
      </p>
    </section>
    <section style={{marginBottom: 24}}>
      <h4 style={{color: '#0d6efd', fontWeight: 600}}>5. Contact</h4>
      <p>
        Pour toute question ou réclamation, contactez-nous à <a href="mailto:contact@localgn.com" style={{color: '#0d6efd'}}>contact@localgn.com</a> ou via notre formulaire de contact.
      </p>
    </section>
    <div style={{background: '#e9f7ef', border: '1px solid #b6e2d3', borderRadius: 8, padding: 18, marginTop: 32, textAlign: 'center'}}>
      <span role="img" aria-label="check" style={{fontSize: 22, color: '#198754'}}>✔️</span>
      <span style={{fontWeight: 600, color: '#198754', fontSize: 18, marginLeft: 8}}>
        En cochant la case lors de l'inscription, vous reconnaissez avoir lu et accepté ces conditions d'utilisation.
      </span>
    </div>
  </div>
);

export default TermsOfUse;
