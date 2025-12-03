import Footer from "./Footer";
import React from "react";
import Header from "./Header";

const MentionsLegales = () => (
  <>
    <Header />
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e0e7ff 0%, #fff 100%)', padding: '40px 16px', marginTop: 80 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #2563eb11', padding: 32 }}>
        <h1 style={{ color: '#2563eb', fontWeight: 800, fontSize: 32, marginBottom: 24 }}>Mentions légales</h1>
        <h2 style={{ fontSize: 22, color: '#2563eb', marginTop: 24 }}>Éditeur du site</h2>
        <p>LocalGN<br />Conakry, Guinée<br />Email : <a href="mailto:contact@localgn.com">contact@localgn.com</a></p>
        <h2 style={{ fontSize: 22, color: '#2563eb', marginTop: 24 }}>Hébergement</h2>
        <p>Le site est hébergé par :<br />OVH SAS<br />2 rue Kellermann, 59100 Roubaix, France</p>
        <h2 style={{ fontSize: 22, color: '#2563eb', marginTop: 24 }}>Propriété intellectuelle</h2>
        <p>Tous les contenus présents sur ce site (textes, images, logos, icônes, etc.) sont la propriété exclusive de LocalGN, sauf mention contraire. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l’autorisation écrite préalable de LocalGN.</p>
        <h2 style={{ fontSize: 22, color: '#2563eb', marginTop: 24 }}>Protection des données personnelles</h2>
        <p>Les informations recueillies via les formulaires sont destinées uniquement à LocalGN et ne sont jamais transmises à des tiers. Conformément à la loi, vous disposez d’un droit d’accès, de rectification et de suppression de vos données. Pour exercer ce droit, contactez-nous à l’adresse <a href="mailto:contact@localgn.com">contact@localgn.com</a>.</p>
        <h2 style={{ fontSize: 22, color: '#2563eb', marginTop: 24 }}>Cookies</h2>
        <p>Le site LocalGN utilise des cookies pour améliorer l’expérience utilisateur et réaliser des statistiques de visites. Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre navigateur.</p>
  <h2 style={{ fontSize: 22, color: '#2563eb', marginTop: 24 }}>Responsabilité</h2>
  <p>LocalGN s’efforce de fournir des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu’elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.</p>

  <h2 style={{ fontSize: 22, color: '#2563eb', marginTop: 24 }}>Conditions d'utilisation</h2>
  <p>L’utilisation du site LocalGN implique l’acceptation pleine et entière des conditions générales d’utilisation décrites sur cette page. Ces conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment.</p>

  <h2 style={{ fontSize: 22, color: '#2563eb', marginTop: 24 }}>Modération des contenus</h2>
  <p>Les avis, commentaires et contenus publiés par les utilisateurs sont modérés par l’équipe LocalGN. Tout contenu inapproprié, diffamatoire ou contraire à la loi pourra être supprimé sans préavis.</p>

  <h2 style={{ fontSize: 22, color: '#2563eb', marginTop: 24 }}>Liens externes</h2>
  <p>Le site LocalGN peut contenir des liens vers d’autres sites. LocalGN n’exerce aucun contrôle sur ces sites et ne saurait être tenu responsable de leur contenu ou de leur politique de confidentialité.</p>

  <h2 style={{ fontSize: 22, color: '#2563eb', marginTop: 24 }}>Droit applicable</h2>
  <p>Le site LocalGN est soumis au droit guinéen. En cas de litige, les tribunaux de Conakry seront seuls compétents.</p>
      </div>
  </div>
  <Footer />
  </>
);

export default MentionsLegales;
