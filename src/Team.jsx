import React from "react";
import { Container, Row, Col, Card, } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { motion } from "framer-motion";
import "./Home.css";

const teamMembers = [
  {
    name: "Fatoumata Diallo",
    role: "Fondatrice",
    img: "/Fondatrice.jpeg",
    desc: "Visionnaire et passionnée par l'entrepreneuriat local, elle a fondé LocalGN pour valoriser les talents de Guinée.",
    socials: { linkedin: "", facebook: "#" },
  },
  {
    name: "Mamadou Sylla",
    role: "Développeur",
    img: "/Developpeur.jpeg",
    desc: "Développeur fullstack, il conçoit des solutions innovantes pour connecter clients et prestataires.",
    socials: { github: "#", linkedin: "#" },
  },
  {
    name: "Aissatou Bah",
    role: "Community Manager",
    img: "/Gestionnaire.jpeg",
    desc: "Experte en communication digitale, elle anime la communauté et met en avant les artisans locaux.",
    socials: { instagram: "#", facebook: "#" },
  },
  {
    name: "Ibrahima Camara",
    role: "Support client",
    img: "/Supportclient.jpeg",
    desc: "Toujours à l'écoute, il accompagne les utilisateurs et veille à leur satisfaction sur la plateforme.",
    socials: { whatsapp: "#" },
  },
  {
    name: "Mariam Kaba",
    role: "Designer UI/UX",
    img: "/ConcepteurUIUX.jpeg",
    desc: "Créative et rigoureuse, elle conçoit des interfaces intuitives et modernes pour LocalGN.",
    socials: { dribbble: "#", linkedin: "#" },
  },
  {
    name: "Alpha Barry",
    role: "Responsable Partenariats",
    img: "/ResponsablePartenariats.jpeg",
    desc: "Il développe le réseau de partenaires et assure la visibilité de la plateforme.",
    socials: { linkedin: "#", facebook: "#" },
  },
];

const socialIcons = {
  linkedin: <i className="bi bi-linkedin" style={{ color: '#2563eb' }}></i>,
  facebook: <i className="bi bi-facebook" style={{ color: '#2563eb' }}></i>,
  github: <i className="bi bi-github" style={{ color: '#2563eb' }}></i>,
  instagram: <i className="bi bi-instagram" style={{ color: '#2563eb' }}></i>,
  whatsapp: <i className="bi bi-whatsapp" style={{ color: '#22c55e' }}></i>,
  dribbble: <i className="bi bi-dribbble" style={{ color: '#ec4899' }}></i>,
};

const Team = () => {
  const isMobile = window.innerWidth <= 768;
  return (
    <>
      <Container fluid className="p-0" style={{ background: "#f8fafc", minHeight: "100vh" }}>
        <Header />
        <section style={{ padding: isMobile ? "8px 0" : "", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ maxWidth: isMobile ? "98vw" : 1200, margin: "0 auto", textAlign: "center" }}>
            <h1 className="fw-bold mb-3" style={{ color: "#2563eb", fontSize: isMobile ? 22 : 36 }}>Notre équipe</h1>
            <p style={{ color: "#374151", fontSize: isMobile ? 15 : 18, marginBottom: isMobile ? 18 : 32 }}>
              Découvrez les personnes qui font vivre LocalGN et accompagnent chaque jour la communauté.
            </p>
          </div>
          <Row className="g-4 justify-content-center" style={{ maxWidth: isMobile ? "98vw" : 1200, margin: "0 auto" }}>
            {teamMembers.map((member, idx) => (
              <Col xs={12} sm={6} md={4} lg={3} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.12, duration: 0.6 }}
                >
                  <Card className="shadow-sm border-0 h-100 team-card" style={{ borderRadius: 14, overflow: "hidden", transition: "transform 0.2s" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: isMobile ? 18 : 32, background: "#f1f5f9" }}>
                      <img
                        src={member.img}
                        alt={member.name}
                        style={{ width: isMobile ? 60 : 90, height: isMobile ? 60 : 90, borderRadius: "50%", marginBottom: isMobile ? 10 : 18, border: "3px solid #2563eb", objectFit: "cover", background: "#fff" }}
                      />
                      <div className="fw-bold" style={{ color: "#2563eb", fontSize: isMobile ? 15 : 20 }}>{member.name}</div>
                      <div style={{ color: "#888", fontSize: isMobile ? 13 : 16, marginBottom: isMobile ? 6 : 10 }}>{member.role}</div>
                      <div style={{ color: "#374151", fontSize: isMobile ? 12 : 15, minHeight: isMobile ? 32 : 48 }}>{member.desc}</div>
                      {/* Liens sociaux */}
                      <div style={{ display: 'flex', gap: isMobile ? 8 : 14, marginTop: isMobile ? 8 : 14 }}>
                        {member.socials && Object.entries(member.socials).map(([key, url]) => (
                          <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: isMobile ? 16 : 22, transition: 'color 0.2s' }}>
                            {socialIcons[key]}
                          </a>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </section>
        <Footer />
      </Container>
    </>
  );
};

export default Team;
