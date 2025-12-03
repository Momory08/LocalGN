import React, { useEffect, useState, useContext, useRef } from "react";
import { Container, Card, Button, Alert, ListGroup, Form, Modal, Badge } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import { UserContext } from "../contexts/UserContext";

const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const { user } = useContext(UserContext);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [myReview, setMyReview] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const commentRef = useRef();

  useEffect(() => {
    fetch("/providers.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id === parseInt(id));
        setProvider(found);
      });
    // Charger les avis/notes du backend
  fetch(`/api/prestataire/${id}/evaluations`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(() => setReviews([]));
  }, [id]);
  // Affiche la moyenne calculée dynamiquement si pas fournie
  const averageRating = provider.ratingAverage || provider.rating || (reviews.length ? (reviews.reduce((sum, r) => sum + (r.note || 0), 0) / reviews.length).toFixed(1) : 0);

  // Charger la note existante du client (optionnel, à améliorer si backend prêt)
  useEffect(() => {
    if (user && user.role === "client") {
  fetch(`/api/prestataire/${id}/evaluations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((evals) => {
          // On suppose que clientNom = user.nom || user.email
          const myEval = evals.find((e) => e.clientNom === (user.nom || user.email));
          if (myEval) {
            setRating(myEval.note);
            setComment(myEval.commentaire || "");
            setCharCount((myEval.commentaire || "").length);
            setMyReview(myEval);
          } else {
            setMyReview(null);
          }
        })
        .catch(() => {});
    }
  }, [id, user]);

  // Focus sur le champ commentaire lors de la modification
  useEffect(() => {
    if (showEdit && commentRef.current) {
      commentRef.current.focus();
    }
  }, [showEdit]);

  // Scroll vers l'avis après ajout/modif
  const myReviewRef = useRef();

  useEffect(() => {
    if (message && myReviewRef.current) {
      myReviewRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (message) {
      const timer = setTimeout(() => setMessage("") , 3500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleRate = async (star) => {
    if (!user || user.role !== "client") {
      setMessage("Vous devez être connecté en tant que client pour noter.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      // Si déjà noté, on modifie, sinon on crée
      const method = myReview ? "PUT" : "POST";
  const res = await fetch(`/api/prestataire/${id}/evaluations`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
  body: JSON.stringify({ note: star, commentaire: comment }),
      });
      const data = await res.json();
      if (res.ok) {
        setRating(star);
        setMessage(myReview ? "Avis modifié !" : "Merci pour votre note !");
        setShowEdit(false);
        setComment("");
        setCharCount(0);
        // Rafraîchir les avis
  fetch(`/api/prestataire/${id}/evaluations`)
          .then((res) => res.json())
          .then((data) => setReviews(data));
        // Rafraîchir mon avis
        setMyReview(data);
      } else {
        setMessage(data.msg || "Erreur lors de l'envoi de la note.");
      }
    } catch {
      setMessage("Erreur serveur");
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!user || user.role !== "client") return;
    setSubmitting(true);
    setMessage("");
    try {
  const res = await fetch(`/api/prestataire/${id}/evaluations`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Avis supprimé.");
        setRating(0);
        setComment("");
        setCharCount(0);
        setMyReview(null);
        setShowEdit(false);
  fetch(`/api/prestataire/${id}/evaluations`)
          .then((res) => res.json())
          .then((data) => setReviews(data));
      } else {
        setMessage(data.msg || "Erreur lors de la suppression.");
      }
    } catch {
      setMessage("Erreur serveur");
    }
    setSubmitting(false);
  };

  if (!provider) {
    return <p className="m-4">Chargement...</p>;
  }

  return (
    <>
      <header className="bg-primary text-white py-3">
        <Container>
          <h1 className="h4">{provider.name}</h1>
        </Container>
      </header>

      <Container className="my-4">
        <Card>
          <Card.Body>
            <Card.Title>{provider.name}</Card.Title>
            <Card.Text>
              Catégorie : {provider.category}<br />
              Commune : {provider.commune}<br />
              Note moyenne : <b>⭐ {averageRating}</b> ({reviews.length} avis)<br />
            {/* Liste des avis */}
            <div className="my-3">
              <div className="fw-bold mb-2">Avis des clients :</div>
              {reviews.length === 0 && <div className="text-muted">Aucun avis pour ce prestataire.</div>}
              <ListGroup variant="flush">
                <AnimatePresence>
                  {reviews.map((r) => {
                    const isMine = user && (r.clientNom === (user.nom || user.email));
                    return (
                      <motion.div
                        key={r._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.4 }}
                        ref={isMine ? myReviewRef : undefined}
                      >
                        <ListGroup.Item className="d-flex align-items-start" style={{ background: isMine ? '#e0f2fe' : '#fff', borderLeft: isMine ? '4px solid #2563eb' : undefined }}>
                          {/* Avatar ou initiale */}
                          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#2563eb22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#2563eb', marginRight: 12 }}>
                            {r.clientNom ? r.clientNom[0].toUpperCase() : 'C'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <StarRating rating={r.note} disabled />
                              <span style={{ color: '#2563eb', fontWeight: 600 }}>{r.clientNom || 'Client'}</span>
                              {isMine && <Badge bg="primary">Vous</Badge>}
                            </div>
                            {r.commentaire && <div style={{ fontSize: 14, color: '#444', marginTop: 2 }}>{r.commentaire}</div>}
                          </div>
                        </ListGroup.Item>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </ListGroup>
            </div>
              Zone d'intervention : {provider.commune}
            </Card.Text>
            {/* Bloc notation par étoiles */}
            <div className="my-3">
              <div className="fw-bold mb-2">Noter ce prestataire :</div>
              {myReview && !showEdit ? (
                <div className="mb-2">
                  <StarRating rating={myReview.note} disabled />
                  <div style={{ color: '#444', fontSize: 15 }}>{myReview.commentaire}</div>
                  <Button size="sm" variant="outline-primary" className="me-2 mt-2" onClick={() => { setShowEdit(true); setRating(myReview.note); setComment(myReview.commentaire); setCharCount((myReview.commentaire || "").length); }}>Modifier</Button>
                  <Button size="sm" variant="outline-danger" className="mt-2" onClick={() => setShowDeleteModal(true)}>Supprimer</Button>
                </div>
              ) : (
                <Form onSubmit={e => { e.preventDefault(); handleRate(rating); }}>
                  <StarRating rating={rating} onRate={setRating} disabled={submitting} />
                  <Form.Group className="mt-2">
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Laissez un commentaire (optionnel)"
                      value={comment}
                      onChange={e => { setComment(e.target.value.slice(0, 250)); setCharCount(e.target.value.length > 250 ? 250 : e.target.value.length); }}
                      disabled={submitting}
                      ref={commentRef}
                      maxLength={250}
                      aria-label="Commentaire sur le prestataire"
                    />
                    <div className="text-end small" style={{ color: charCount > 230 ? '#d00' : '#888' }}>{charCount}/250 caractères</div>
                  </Form.Group>
                  <Button
                    className="mt-2"
                    type="submit"
                    variant="primary"
                    disabled={submitting || !rating}
                    aria-label={myReview ? "Enregistrer la modification de l'avis" : "Envoyer l'avis"}
                  >
                    {myReview ? "Enregistrer" : "Envoyer"}
                  </Button>
                  {myReview && <Button className="mt-2 ms-2" variant="secondary" size="sm" onClick={() => setShowEdit(false)}>Annuler</Button>}
                </Form>
              )}
              <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Supprimer l'avis</Modal.Title></Modal.Header>
                <Modal.Body>Voulez-vous vraiment supprimer votre avis ?</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
                  <Button variant="danger" onClick={() => { setShowDeleteModal(false); handleDelete(); }}>Supprimer</Button>
                </Modal.Footer>
              </Modal>
              {message && <Alert className="mt-2" variant={message.includes("Merci") || message.includes("modifié") || message.includes("supprimé") ? "success" : "danger"} role="alert">{message}</Alert>}
            </div>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Retour
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default ProviderDetails;
