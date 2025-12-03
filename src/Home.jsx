import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import ProvidersMap from "./components/ProvidersMap";
// Importation des dépendances React et Bootstrap
// ...existing code...
import {
  Container,
  Row,
  Col,
  Card,
  Carousel,
} from "react-bootstrap";

import "./Home.css";
// ...existing code...
// import { Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import { Nav } from "react-bootstrap";

// Déclaration du composant principal Home

const Home = () => {
  // Récupération des prestataires depuis l'API backend
  const [providers, setProviders] = useState([]);

  const { user } = useContext(UserContext);
  useEffect(() => {
    fetch("/api/prestataire/all")
      .then((res) => res.json())
      .then((data) => setProviders(data));
  }, []);

  return (
    <>
  <Container fluid className="p-0 home-main-container">
        <Header />
        {/* HERO MODERNE */}
        <section className="hero-section">
          {/* Bloc texte */}
          <div className="hero-text">
            <h1 className="hero-title">
              Trouvez facilement le professionnel qu’il vous faut, où que vous soyez<br />
            </h1>
            <p className="hero-desc">
              Nous aidons les habitants à trouver rapidement des professionnels de confiance grâce à une plateforme moderne.
              <br />
              Les prestataires utilisent LocalGN pour partager leurs services et recevoir des avis transparents de la communauté.
            </p>
          </div>
          {/* Illustration vidéo */}
          <div className="hero-img">
            <video
              src="/presentation.mp4"
              // poster="/logo3.png"
              style={{ width: '100%', maxWidth: 520, minWidth: 220, borderRadius: 18, boxShadow: '0 4px 24px #2563eb22' }}
              autoPlay
              loop
              muted
              playsInline
            >
            </video>
            {/* <img src="/home1.jpg" alt="Présentation" className="hero-main-img" /> */}
          </div>
        </section>

        {/* ----- CARROUSEL D’IMAGES ----- */}
        <Container className="my-2 px-0 px-md-2">
        <Carousel
          fade
          interval={3500}
          indicators
          controls
          className="custom-carousel"
        >
          {/* Slide 1 */}
          <Carousel.Item>
            <div className="carousel-img-wrapper">
              <img
                className="d-block w-100 rounded-4 shadow img-fluid"
                src="/plumber-.png"
                alt="Plombier qualifié"
                style={{ maxHeight: 260, objectFit: 'cover' }}
              />
              <Carousel.Caption className="custom-caption">
                <h3>Des professionnels qualifiés</h3>
                <p>Trouvez rapidement un artisan fiable près de chez vous.</p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>

          {/* Slide 2 */}
          <Carousel.Item>
            <div className="carousel-img-wrapper">
              <img
                className="d-block w-100 rounded-4 shadow img-fluid"
                src="/carrousel4.jpg"
                alt="Menuisier expert"
                style={{ maxHeight: 260, objectFit: 'cover' }}
              />
              <Carousel.Caption className="custom-caption">
                <h3>Travail de qualité</h3>
                <p>Comparez et choisissez le meilleur prestataire.</p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>

          {/* Slide 3 */}
          <Carousel.Item>
            <div className="carousel-img-wrapper">
              <img
                className="d-block w-100 rounded-4 shadow img-fluid"
                src="/carrousel3.png"
                alt="Service rapide"
                style={{ maxHeight: 260, objectFit: 'cover' }}
              />
              <Carousel.Caption className="custom-caption">
                <h3>Intervention rapide</h3>
                <p>Des services disponibles dans tout Conakry.</p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>

          {/* Slide 4 */}
          <Carousel.Item>
            <div className="carousel-img-wrapper">
              <img
                className="d-block w-100 rounded-4 shadow img-fluid"
                src="/carrousel2.png"
                alt="Prestataires locaux"
                style={{ maxHeight: 260, objectFit: 'cover' }}
              />
              <Carousel.Caption className="custom-caption">
                <h3>100% Local</h3>
                <p>Soutenez les talents et entreprises locales.</p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        </Carousel>
        </Container>


      {/* Section call-to-action */}
  <section className="cta-section">
  <div className="container text-center">
          <h2 className="fw-bold mb-3" style={{ fontSize: 28 }}>Vous êtes un professionnel&nbsp;?</h2>
          <p style={{ fontSize: 18, marginBottom: 24 }}>Rejoignez LocalGN et développez votre activité en ligne gratuitement.</p>
          <a href="/register" className="btn btn-warning fw-bold cta-btn">S'inscrire comme prestataire</a>
        </div>
      </section>

      {/* Carte des prestataires (affichée uniquement au client connecté) */}
  {user && user.role === "client" && (
  <div className="container my-5">
          <h3 className="text-center mb-4 fw-bold">Carte des prestataires</h3>
          <ProvidersMap providers={providers} />
        </div>
      )}

     

    {/* Section FAQ */}
  <section className="faq-section">
      <div className="container">
        <h2 className="fw-bold text-center mb-4 faq-title">Questions fréquentes</h2>
  <Row className="g-3 g-md-4 justify-content-center valeurs-row">
          <Col xs={12} md={4}>
            <div style={{ background: '#f3f4f6', borderRadius: 14, padding: 24, boxShadow: '0 2px 8px #2563eb11', height: '100%' }}>
              <div className="fw-bold mb-2" style={{ color: '#2563eb', fontSize: 18 }}>Comment fonctionne LocalGN ?</div>
              <div style={{ color: '#374151', fontSize: 16 }}>Vous recherchez un service, comparez les profils et contactez directement le professionnel de votre choix.</div>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div style={{ background: '#f3f4f6', borderRadius: 14, padding: 24, boxShadow: '0 2px 8px #2563eb11', height: '100%' }}>
              <div className="fw-bold mb-2" style={{ color: '#2563eb', fontSize: 18 }}>Est-ce gratuit ?</div>
              <div style={{ color: '#374151', fontSize: 16 }}>Oui, l’utilisation de la plateforme est 100% gratuite pour les clients.</div>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div style={{ background: '#f3f4f6', borderRadius: 14, padding: 24, boxShadow: '0 2px 8px #2563eb11', height: '100%' }}>
              <div className="fw-bold mb-2" style={{ color: '#2563eb', fontSize: 18 }}>Comment laisser un avis ?</div>
              <div style={{ color: '#374151', fontSize: 16 }}>Après avoir utilisé un service, vous pouvez évaluer le prestataire depuis votre espace personnel.</div>
            </div>
          </Col>
        </Row>
      </div>
    </section>

    {/* Section fonctionnement */} 
   { <section style={{ background: '#fff', padding: '32px 0 24px 0', marginTop: 32 }}>
      <div className="container">
        <h2 className="fw-bold text-center mb-5" style={{ color: '#2563eb', fontSize: 30 }}>Comment fonctionne LocalGN&nbsp;?</h2>
  <Row className="justify-content-center g-3 g-md-4">
          <Col xs={12} sm={6} md={4} className="mb-3 mb-md-0">
            <div style={{ background: '#f3f4f6', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 2px 12px #2563eb11', height: '100%' }}>
              <img src="/search.png" alt="Recherche" style={{ width: 54, height: 54, marginBottom: 14 }} />
              <div className="fw-bold mb-2" style={{ color: '#2563eb', fontSize: 18 }}>1. Je recherche</div>
              <div style={{ color: '#374151', fontSize: 16 }}>Je choisis une catégorie, une commune ou je tape un mot-clé pour trouver un professionnel.</div>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4} className="mb-3 mb-md-0">
            <div style={{ background: '#f3f4f6', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 2px 12px #2563eb11', height: '100%' }}>
              <img src="/results.png" alt="Comparaison" style={{ width: 54, height: 54, marginBottom: 14 }} />
              <div className="fw-bold mb-2" style={{ color: '#2563eb', fontSize: 18 }}>2. Je compare</div>
              <div style={{ color: '#374151', fontSize: 16 }}>Je consulte les profils, avis et notes pour choisir le meilleur prestataire.</div>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4} className="mb-3 mb-md-0">
            <div style={{ background: '#f3f4f6', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 2px 12px #2563eb11', height: '100%' }}>
              <img src="/contact.png" alt="Contact" style={{ width: 54, height: 54, marginBottom: 14 }} />
              <div className="fw-bold mb-2" style={{ color: '#2563eb', fontSize: 18 }}>3. Je contacte</div>
              <div style={{ color: '#374151', fontSize: 16 }}>Je contacte le professionnel choisi directement via la plateforme ou par téléphone.</div>
            </div>
          </Col>
        </Row>
      </div>
    </section>

    /* Section statistiques */}
  <section className="stats-section">
      <div className="container">
        <h2 className="fw-bold text-center mb-5 stats-title">LocalGN en chiffres</h2>
  <Row className="justify-content-center g-3 g-md-4 temoignages-row">
          <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 2px 12px #2563eb11', height: '100%' }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#2563eb', marginBottom: 8 }}>
                <span>+2 500</span>
              </div>
              <div style={{ color: '#374151', fontSize: 17 }}>Prestataires inscrits</div>
            </div>
          </Col>
          <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 2px 12px #2563eb11', height: '100%' }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#f97316', marginBottom: 8 }}>
                <span>+8 000</span>
              </div>
              <div style={{ color: '#374151', fontSize: 17 }}>Clients satisfaits</div>
            </div>
          </Col>
          <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 2px 12px #2563eb11', height: '100%' }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#22c55e', marginBottom: 8 }}>
                <span>+1 200</span>
              </div>
              <div style={{ color: '#374151', fontSize: 17 }}>Avis publiés</div>
            </div>
          </Col>
          <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 2px 12px #2563eb11', height: '100%' }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#ec4899', marginBottom: 8 }}>
                <span>+35</span>
              </div>
              <div style={{ color: '#374151', fontSize: 17 }}>Communes couvertes</div>
            </div>
          </Col>
        </Row>
      </div>
    </section>


    {/* Section partenaires style "grandes organisations" */}
    <section className="partenaires-section">
      <div className="container">
        <div className="partenaires-flex">
          {/* Colonne gauche : titre et texte */}
          <div className="partenaires-text">
            <h2 className="fw-bold mb-3 partenaires-title">
              Approuvé par les plus grandes organisations mondiales
            </h2>
            <p className="partenaires-desc">
              Qu’ils aient pour objectif la représentation en entreprise<br />
              ou la mise en place d’une culture dédiée ou l’agilité multi-juridiction.<br />
              Entreprise, votre succès et capitalité sont notre priorité.
            </p>
          </div>
          {/* Colonne droite : logos partenaires */}
          <div className="partenaires-grid">
            {/* Logos fictifs style minimaliste */}
            {[
              { src: '/p4.png', name: 'MAGOE SA' },
              { src: '/p2.png', name: 'CONFIANT' },
              { src: '/p1.png', name: 'RMC SARLU' },
              { src: '/p3.png', name: 'CONFIANT' },
              { src: '/p5.png', name: 'CONFIANT' },
              { src: '/p6.png', name: 'CONFIANT' },
            ].map((p, i) => (
              <div key={i} className="partenaire-logo-item">
                <div className="partenaire-logo-imgbox">
                  <img src={p.src} alt={p.name} className="partenaire-logo-img" />
                </div>
                <span className="partenaire-logo-name">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Section valeurs */}
  <section className="valeurs-section">
      <div className="container">
        <h2 className="fw-bold text-center mb-4 valeurs-title">Nos valeurs</h2>
        <Row className="justify-content-center g-4">
          <Col md={4} sm={6}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 2px 8px #2563eb11', height: '100%' }}>
              <div className="fw-bold mb-2" style={{ color: '#2563eb', fontSize: 18 }}>Proximité</div>
              <div style={{ color: '#374151', fontSize: 16 }}>Nous favorisons les échanges directs et humains entre habitants et professionnels locaux.</div>
            </div>
          </Col>
          <Col md={4} sm={6}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 2px 8px #2563eb11', height: '100%' }}>
              <div className="fw-bold mb-2" style={{ color: '#2563eb', fontSize: 18 }}>Confiance</div>
              <div style={{ color: '#374151', fontSize: 16 }}>La transparence des avis et la qualité des profils sont au cœur de notre démarche.</div>
            </div>
          </Col>
          <Col md={4} sm={6}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 2px 8px #2563eb11', height: '100%' }}>
              <div className="fw-bold mb-2" style={{ color: '#2563eb', fontSize: 18 }}>Impact local</div>
              <div style={{ color: '#374151', fontSize: 16 }}>Nous soutenons l’économie guinéenne et la valorisation des métiers de proximité.</div>
            </div>
          </Col>
        </Row>
      </div>
    </section>


    
    {/* Section témoignages clients */}
  <section className="temoignages-section">
      <div className="container">
        <h2 className="fw-bold text-center mb-5 temoignages-title">Ils nous font confiance</h2>
  <Row className="justify-content-center g-3 g-md-4">
          <Col xs={12} md={4} className="mb-3 mb-md-0">
            <Card className="shadow border-0 h-100" style={{ borderRadius: 18 }}>
              <Card.Body>
                <p style={{ fontSize: 17, color: '#374151' }}>
                  “Grâce à LocalGN, j’ai trouvé un plombier en 10 minutes, super efficace !”
                </p>
                <div className="d-flex align-items-center mt-3">
                  <img src="/Fatoumata.png" alt="Client 1" style={{ width: 48, height: 48, borderRadius: '50%', marginRight: 12, border: '2px solid #2563eb' }} />
                  <div>
                    <div className="fw-bold" style={{ color: '#2563eb' }}>Fatoumata D.</div>
                    <div style={{ fontSize: 13, color: '#888' }}>Kaloum</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4} className="mb-3 mb-md-0">
            <Card className="shadow border-0 h-100" style={{ borderRadius: 18 }}>
              <Card.Body>
                <p style={{ fontSize: 17, color: '#374151' }}>
                  “Service rapide, artisans sérieux, je recommande à tous mes amis !”
                </p>
                <div className="d-flex align-items-center mt-3">
                  <img src="/plumber-.png" alt="Client 2" style={{ width: 48, height: 48, borderRadius: '50%', marginRight: 12, border: '2px solid #2563eb' }} />
                  <div>
                    <div className="fw-bold" style={{ color: '#2563eb' }}>Mamadou S.</div>
                    <div style={{ fontSize: 13, color: '#888' }}>Ratoma</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4} className="mb-3 mb-md-0">
            <Card className="shadow border-0 h-100" style={{ borderRadius: 18 }}>
              <Card.Body>
                <p style={{ fontSize: 17, color: '#374151' }}>
                  “Enfin une plateforme qui valorise les artisans locaux !”
                </p>
                <div className="d-flex align-items-center mt-3">
                  <img src="/menuisier.png" alt="Client 3" style={{ width: 48, height: 48, borderRadius: '50%', marginRight: 12, border: '2px solid #2563eb' }} />
                  <div>
                    <div className="fw-bold" style={{ color: '#2563eb' }}>Aissatou B.</div>
                    <div style={{ fontSize: 13, color: '#888' }}>Matoto</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </section>

    
    {/* Section newsletter */}
    <section className="newsletter-section">
      <div className="container text-center">
        <h2 className="fw-bold mb-3 newsletter-title">Restez informé</h2>
        <p className="newsletter-desc">Recevez les nouveautés, conseils et offres exclusives de LocalGN directement par email.</p>
        <form className="newsletter-form">
          <input type="email" className="form-control newsletter-input" placeholder="Votre email" required />
          <button type="submit" className="btn btn-primary fw-bold w-100 newsletter-btn">S'inscrire</button>
        </form>
      </div>
    </section>

  {/* Footer moderne amélioré */}
        <Footer />
      </Container>
    </>
  );
};

export default Home; // Exportation du composant
