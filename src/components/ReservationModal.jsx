import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const ReservationModal = ({ show, onHide, prestataire, onReserve }) => {
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [details, setDetails] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!date || !heure) {
      setError("Veuillez renseigner la date et l'heure.");
      return;
    }
    try {
      await onReserve({ date, heure, details });
      setSuccess("Réservation envoyée au prestataire !");
      setDate("");
      setHeure("");
      setDetails("");
    } catch (err) {
      setError("Erreur lors de la réservation.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Réserver {prestataire?.nom} {prestataire?.prenom}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Heure</Form.Label>
            <Form.Control
              type="time"
              value={heure}
              onChange={e => setHeure(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Détails (optionnel)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Décrivez votre besoin..."
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            Envoyer la demande
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReservationModal;
