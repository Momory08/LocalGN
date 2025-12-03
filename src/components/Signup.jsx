import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    role: "client",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation simple
    if (!formData.email.includes("@")) {
      setError("Email invalide");
      return;
    }
    if (formData.password.length < 6) {
      setError("Mot de passe trop court (min 6 caractères)");
      return;
    }
    setError("");
    // Appel à API ou gestion locale
    onSignup(formData);
  };

  return (
    <Container style={{ maxWidth: 500, marginTop: 40 }}>
      <h2 className="mb-4 text-center">Inscription</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nom">
          <Form.Label>Nom complet</Form.Label>
          <Form.Control
            type="text"
            placeholder="Votre nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="exemple@domaine.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="6 caractères minimum"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="role">
          <Form.Label>Rôle</Form.Label>
          <Form.Select name="role" value={formData.role} onChange={handleChange}>
            <option value="client">Client</option>
            <option value="prestataire">Prestataire</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100">
          S'inscrire
        </Button>
      </Form>
    </Container>
  );
};

export default Signup;
