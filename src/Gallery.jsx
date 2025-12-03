import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./Home.css";

// Images à afficher dans la galerie (à adapter selon vos images dans public/)
const galleryImages = [
  { src: "/carrousel1.jpg", alt: "Travaux de plomberie" },
  { src: "/carrousel2.png", alt: "Demenageurs en action" },
  { src: "/carrousel3.png", alt: "Service rapide" },
  { src: "/carrousel4.jpg", alt: "Artisan à l'œuvre" },
  { src: "/coiffeuse.png", alt: "Coiffeuse professionnelle" },
  { src: "/couture.png", alt: "Couturier local" },
  { src: "/demenagement.jpg", alt: "Déménagement efficace" },
  { src: "/doctor-1699656_1280.jpg", alt: "Médecin partenaire" },
  { src: "/electricien.png", alt: "Electricien qualifié" },
  { src: "/menuisier.png", alt: "Menuisier expert" },
  { src: "/painter-.jpg", alt: "Peintre en action" },
  { src: "/plumber-.png", alt: "Plombier local" },
  { src: "/taxi.png", alt: "Taxi partenaire" },
];

const Gallery = () => {
  const [lightbox, setLightbox] = useState({ open: false, img: null });
  const isMobile = window.innerWidth <= 768;

  // Animation de zoom au survol
  const handleMouseOver = (e) => {
    e.currentTarget.style.transform = "scale(1.07)";
    e.currentTarget.style.boxShadow = "0 8px 32px #2563eb33";
  };
  const handleMouseOut = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 2px 8px #2563eb11";
  };

  return (
    <>
      <Container fluid className="p-0" style={{ background: "#f8fafc", minHeight: "100vh" }}>
        <Header />
        {/* Lightbox plein écran */}
        {lightbox.open && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(20,30,60,0.92)",
              zIndex: 5000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "zoom-out",
              transition: "background 0.3s"
            }}
            onClick={() => setLightbox({ open: false, img: null })}
          >
            <img
              src={lightbox.img.src}
              alt={lightbox.img.alt}
              style={{
                maxWidth: isMobile ? "98vw" : "90vw",
                maxHeight: isMobile ? "80vh" : "90vh",
                borderRadius: 12,
                boxShadow: "0 8px 32px #2563eb77",
                transition: "transform 0.3s",
                background: "#fff"
              }}
            />
          </div>
        )}
        <section style={{ padding: isMobile ? "8px 0" : "", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ maxWidth: isMobile ? "98vw" : 1200, margin: "0 auto", textAlign: "center" }}>
            <h1 className="fw-bold mb-3" style={{ color: "#2563eb", fontSize: isMobile ? 22 : 36 }}>Galerie</h1>
            <p style={{ color: "#374151", fontSize: isMobile ? 15 : 18, marginBottom: isMobile ? 18 : 32 }}>
              Découvrez les réalisations de nos prestataires et l'ambiance de la communauté LocalGN.
            </p>
          </div>
          <Row className="g-4 justify-content-center" style={{ maxWidth: isMobile ? "98vw" : 1200, margin: "0 auto" }}>
            {galleryImages.map((img, idx) => (
              <Col xs={12} sm={6} md={4} lg={3} key={idx}>
                <Card
                  className="shadow-sm border-0 h-100 gallery-card"
                  style={{ borderRadius: 14, overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={() => setLightbox({ open: true, img })}
                  tabIndex={0}
                  role="button"
                  aria-label={img.alt}
                >
                  <div style={{ overflow: "hidden", height: isMobile ? 120 : 220, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
                    <Card.Img
                      src={img.src}
                      alt={img.alt}
                      style={{ objectFit: "cover", width: "100%", height: "100%", transition: "transform 0.3s" }}
                      className="gallery-img"
                    />
                  </div>
                  <Card.Body style={{ background: "#fff" }}>
                    <Card.Text className="text-center" style={{ color: "#2563eb", fontWeight: 600, fontSize: isMobile ? 13 : 16 }}>{img.alt}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>
      <Footer />
    </>
  );
};

export default Gallery;

