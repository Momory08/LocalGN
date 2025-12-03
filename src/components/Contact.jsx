import Footer from "./Footer";
import React from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const Contact = () => {
  return (
    <>
      <Header />
      <Container className="py-5" style={{ minHeight: '100vh', marginTop: -45 }}>
      <motion.h1
        className="fw-bold text-center mb-4"
        style={{ color: '#2563eb', fontSize: 38, letterSpacing: 1 }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Contactez-nous
      </motion.h1>
      <p className="text-center mb-5" style={{ fontSize: 18, color: '#555' }}>
        Une question, une suggestion ou un besoin d’assistance ?
        <br />
        Notre équipe vous répond rapidement !
      </p>
      <Row className="g-4 align-items-stretch">
        <Col md={6}>
          <Card className="shadow-lg border-0 h-100" style={{ borderRadius: 18 }}>
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3" style={{ color: '#2563eb' }}>Formulaire de contact</h4>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control type="text" placeholder="Votre nom" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Votre email" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={5} placeholder="Votre message..." required />
                </Form.Group>
                <div className="d-grid mt-4">
                  <Button variant="primary" size="lg" type="submit" style={{ borderRadius: 24, fontWeight: 700 }}>
                    <Send style={{ marginRight: 8, marginBottom: 2 }} /> Envoyer
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-lg border-0 h-100" style={{ borderRadius: 18, background: 'url(/Supportclient.jpeg) center/cover no-repeat', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center" style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(37,99,235,0.45)', zIndex: 1, borderRadius: 18 }}></div>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                <Mail size={38} style={{ marginBottom: 16, position: 'relative', zIndex: 2 }} />
                <h5 className="fw-bold mb-2" style={{ position: 'relative', zIndex: 2 }}>Email</h5>
                <p style={{ fontSize: 17, position: 'relative', zIndex: 2 }}>contact@localgn.com</p>
              </motion.div>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }}>
                <Phone size={38} style={{ marginBottom: 16, marginTop: 24, position: 'relative', zIndex: 2 }} />
                <h5 className="fw-bold mb-2" style={{ position: 'relative', zIndex: 2 }}>Téléphone</h5>
                <p style={{ fontSize: 17, position: 'relative', zIndex: 2 }}>+224 600 00 00 00</p>
              </motion.div>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }}>
                <MapPin size={38} style={{ marginBottom: 16, marginTop: 24, position: 'relative', zIndex: 2 }} />
                <h5 className="fw-bold mb-2" style={{ position: 'relative', zIndex: 2 }}>Adresse</h5>
                <p style={{ fontSize: 17, position: 'relative', zIndex: 2 }}>Conakry, Guinée</p>
              </motion.div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
  </Container>
  <Footer />
    </>
  );
};

export default Contact;
