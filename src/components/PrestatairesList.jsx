
import React, { useEffect, useState, useContext } from "react";
import ReservationModal from "./ReservationModal";
import Footer from "./Footer";
import Header from "./Header";
import { UserContext } from "../contexts/UserContext";
import { Container, Row, Col, Card, Button, Spinner, Modal, Form, Alert } from "react-bootstrap";
import StaticStar from "./StaticStar";
import StarRating from "./StarRating";
import { motion } from "framer-motion";


// ...existing code...
const PrestatairesList = () => {

  // Fonction utilitaire pour afficher le statut d'abonnement avec icône, couleur, date de fin d'essai et lien
  const { user } = useContext(UserContext);
  const [prestataires, setPrestataires] = useState([]);
  const [evaluationsMap, setEvaluationsMap] = useState({}); // { prestataireId: [evaluations] }
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCommune, setFilterCommune] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [error, setError] = useState("");
  // Pour la notation directe
  const [showModal, setShowModal] = useState(false);
  const [selectedPrestataire, setSelectedPrestataire] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
    // Pour la réservation
    const [showReservation, setShowReservation] = useState(false);
    const [reservationPrestataire, setReservationPrestataire] = useState(null);
  // (Variables supprimées car inutilisées)

    const openReservation = (prestataire) => {
      setReservationPrestataire(prestataire);
      setShowReservation(true);
  // (Variables supprimées car inutilisées)
    };
    const closeReservation = () => {
      setShowReservation(false);
      setReservationPrestataire(null);
  // (Variables supprimées car inutilisées)
    };
    const handleReserve = async ({ date, heure, details }) => {
      if (!reservationPrestataire) return;
      try {
        const res = await fetch(`/api/reservations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            prestataireId: reservationPrestataire._id,
            date,
            heure,
            details,
          }),
        });
        // const data = await res.json();
        if (res.ok) {
          setShowReservation(false);
        }
        // else {
        //   // Affichage d'erreur possible ici
        // }
      } catch {
        // Affichage d'erreur possible ici
      }
    };

    // Pour afficher/masquer les avis clients
    const [showReviews, setShowReviews] = useState({}); // { prestataireId: bool }

  const openModal = (prestataire) => {
    setSelectedPrestataire(prestataire);
    setRating(0);
    setComment("");
    setSubmitMsg("");
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedPrestataire(null);
    setRating(0);
    setComment("");
    setSubmitMsg("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPrestataire) return;
    setSubmitting(true);
    setSubmitMsg("");
    try {
      const res = await fetch(`/api/prestataire/${selectedPrestataire._id}/evaluations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ note: rating, commentaire: comment }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitMsg("Merci pour votre avis !");
      } else {
        setSubmitMsg(data.msg || "Erreur lors de l'envoi.");
      }
    } catch {
      setSubmitMsg("Erreur serveur");
    }
    setSubmitting(false);
  };
  useEffect(() => {
    fetch("/api/auth/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`
      }
    })
      .then(res => res.json())
      .then(async data => {
        if (Array.isArray(data)) {
          setPrestataires(data);
          setError("");
          // Récupérer les évaluations pour chaque prestataire
          const evals = {};
          await Promise.all(data.map(async (p) => {
            try {
              const res = await fetch(`/api/prestataire/${p._id}/evaluations`);
              const evalData = await res.json();
              evals[p._id] = Array.isArray(evalData) ? evalData : [];
            } catch {
              evals[p._id] = [];
            }
          }));
          setEvaluationsMap(evals);
        } else {
          setPrestataires([]);
          setError(data.msg || "Erreur lors du chargement des prestataires.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur réseau ou serveur.");
        setLoading(false);
      });
  }, []);

  // ✅ Appliquer recherche + filtres
  const filteredPrestataires = Array.isArray(prestataires)
    ? prestataires.filter((p) => {
        const matchSearch =
          p.nom?.toLowerCase().includes(search.toLowerCase()) ||
          p.email?.toLowerCase().includes(search.toLowerCase());
        const matchCommune = filterCommune ? p.commune === filterCommune : true;
        const matchCategory = filterCategory ? p.category === filterCategory : true;
        return matchSearch && matchCommune && matchCategory;
      })
    : [];

  // ✅ Extraire communes & catégories uniques pour les filtres
  const communes = [...new Set(prestataires.map((p) => p.commune).filter(Boolean))];
  const categories = [...new Set(prestataires.map((p) => p.category).filter(Boolean))];

  if (!user || user.role !== "client") {
    return (
      <>
        <Header />
        <Container className="my-5 text-center">
          <div className="alert alert-warning mt-5">Vous devez être connecté en tant que client pour accéder à la liste des prestataires.</div>
        </Container>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Header />
  <Container className="my-8" style={{ marginTop: 15 }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold" style={{ fontSize: 32, color: '#2563eb', letterSpacing: 1 }}>Nos Prestataires</h2>
          <p className="text-muted" style={{ fontSize: 18 }}>Contactez un professionnel en un clic !</p>
        </div>
        {/* Filtres de recherche */}
        <div className="mb-4 d-flex flex-wrap gap-3 justify-content-center align-items-center">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: 220 }}
            placeholder="Recherche par nom ou email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            style={{ maxWidth: 180 }}
            value={filterCommune}
            onChange={e => setFilterCommune(e.target.value)}
          >
            <option value="">Toutes les communes</option>
            {communes.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="form-select"
            style={{ maxWidth: 180 }}
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
            <Spinner animation="border" variant="primary" role="status" />
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : filteredPrestataires.length === 0 ? (
          <p className="text-center text-muted">Aucun prestataire trouvé.</p>
        ) : (
          <Row className="g-4">
            {filteredPrestataires.map((p, idx) => (
              <Col xs={12} sm={6} md={4} lg={3} key={p._id}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07, duration: 0.5 }}
                >
                  <Card className="shadow-lg border-0 modern-card h-100 text-center" style={{ borderRadius: 22, background: '#fff', overflow: 'hidden', position: 'relative' }}>
                    {p.photo && (
                      <div style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 18, marginBottom: 8
                      }}>
                        <img
                          src={p.photo.startsWith("http") ? p.photo : `http://localhost:5000${p.photo}`}
                          alt={p.nom || 'Photo prestataire'}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: '3px solid #2563eb',
                            boxShadow: '0 4px 18px #2563eb22',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.transform = 'scale(1.07)';
                            e.currentTarget.style.boxShadow = '0 8px 32px #2563eb44';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 18px #2563eb22';
                          }}
                        />
                      </div>
                    )}
                    <Card.Body style={{ padding: 24 }}>
                      {p.role === 'entreprise' ? (
                        <>
                          <div style={{ fontWeight: 700, fontSize: 20, color: '#2563eb', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>{p.companyName}</span>
                            <span className="badge bg-warning text-dark" style={{ fontSize: 13, marginLeft: 4 }}>Entreprise</span>
                          </div>
                          <div style={{ fontSize: 15, color: '#888', marginBottom: 6 }}>
                            {Array.isArray(p.companyDomains) ? p.companyDomains.join(', ') : p.companyDomains}
                          </div>
                          {p.companyDescription && <div style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>{p.companyDescription}</div>}
                        </>
                      ) : (
                        <>
                          <div style={{ fontWeight: 700, fontSize: 20, color: '#2563eb', marginBottom: 8 }}>{p.nom} {p.prenom}</div>
                          <div style={{ fontSize: 15, color: '#888', marginBottom: 8 }}>{p.category}</div>
                        </>
                      )}
                      {typeof p.ratingAverage !== 'undefined' && (
                        <div className="mb-2">
                          <StaticStar value={Math.round(p.ratingAverage || 0)} />
                          <span style={{ color: '#2563eb', fontWeight: 600, fontSize: 15, marginLeft: 4 }}>{(p.ratingAverage || 0).toFixed(1)} / 5</span>
                        </div>
                      )}
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="mb-2 shadow-sm"
                        style={{
                          borderRadius: 22,
                          fontWeight: 600,
                          fontSize: 15,
                          border: '2px solid #2563eb',
                          color: '#2563eb',
                          background: '#f8fafc',
                          transition: 'background 0.2s, color 0.2s',
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = '#2563eb';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = '#f8fafc';
                          e.currentTarget.style.color = '#2563eb';
                        }}
                        onClick={() => openModal(p)}
                      >
                        <span style={{ fontSize: 18, marginRight: 6 }}>⭐</span> Noter / Commenter
                      </Button>
                      <Button
                        variant="warning"
                        size="md"
                        className="mb-2 ms-2 shadow-sm"
                        style={{
                          borderRadius: 22,
                          fontWeight: 700,
                          fontSize: 16,
                          background: 'linear-gradient(90deg, #fbbf24 60%, #f59e42 100%)',
                          color: '#fff',
                          border: 'none',
                          boxShadow: '0 2px 12px #fbbf2444',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          transition: 'background 0.2s',
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = 'linear-gradient(90deg, #f59e42 60%, #fbbf24 100%)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = 'linear-gradient(90deg, #fbbf24 60%, #f59e42 100%)';
                        }}
                        onClick={() => openReservation(p)}
                      >
                        <span style={{ fontSize: 22 }}>📅</span> Réserver
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        className="mb-2 ms-2 shadow-sm"
                        style={{
                          borderRadius: 22,
                          fontWeight: 600,
                          fontSize: 16,
                          background: 'linear-gradient(90deg, #2563eb 60%, #1e40af 100%)',
                          color: '#fff',
                          border: 'none',
                          boxShadow: '0 2px 12px #2563eb33',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          transition: 'background 0.2s',
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = 'linear-gradient(90deg, #1e40af 60%, #2563eb 100%)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 60%, #1e40af 100%)';
                        }}
                        onClick={() => setShowReviews(prev => ({ ...prev, [p._id]: !prev[p._id] }))}
                      >
                        <span style={{ fontSize: 18, color: '#fff' }}>★</span> {showReviews[p._id] ? "Masquer les avis" : "Afficher les avis"}
                      </Button>

                      {/* Avis clients affichés seulement si showReviews[p._id] est true */}
                      {showReviews[p._id] && evaluationsMap[p._id] && evaluationsMap[p._id].length > 0 && (
                        <div style={{ marginTop: 18, borderTop: '1px solid #eee', paddingTop: 10 }}>
                          <div style={{ fontWeight: 600, color: '#2563eb', fontSize: 15, marginBottom: 6 }}>Avis des clients :</div>
                          {evaluationsMap[p._id].slice(0,3).map((ev, i) => (
                            <div key={ev._id || i} style={{ marginBottom: 10, textAlign: 'left', background: '#f8fafc', borderRadius: 10, padding: '8px 12px', boxShadow: '0 2px 8px #2563eb11' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <StaticStar value={ev.note} />
                                <span style={{ fontWeight: 600, color: '#fbbf24', fontSize: 15 }}>{ev.note} / 5</span>
                              </div>
                              {ev.commentaire && <div style={{ fontSize: 14, color: '#374151', marginTop: 2 }}>{ev.commentaire}</div>}
                            </div>
                          ))}
                          {evaluationsMap[p._id].length > 3 && <div style={{ fontSize: 13, color: '#888' }}>...et {evaluationsMap[p._id].length - 3} autres avis</div>}
                        </div>
                      )}

                      {(p.telephone || p.phone) && (
                        <Button
                          variant="success"
                          href={`https://wa.me/${(p.telephone || p.phone).replace(/[^\d]/g, "")}`}
                          target="_blank"
                          style={{
                            borderRadius: 28,
                            fontWeight: 700,
                            fontSize: 17,
                            padding: '10px 0',
                            width: '100%',
                            background: 'linear-gradient(90deg, #25D366 60%, #128C7E 100%)',
                            border: 'none',
                            marginTop: 16,
                            color: '#fff',
                            boxShadow: '0 4px 16px #25d36644',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            transition: 'transform 0.15s, box-shadow 0.15s',
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.transform = 'scale(1.04)';
                            e.currentTarget.style.boxShadow = '0 8px 24px #128c7e33';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 16px #25d36644';
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 32 32" fill="none">
                            <circle cx="16" cy="16" r="16" fill="#25D366"/>
                            <path d="M23.5 19.5c-.3-.2-1.7-.8-2-1s-.5-.1-.7.1c-.2.2-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.3-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6.1-.1.2-.2.3-.4.1-.1.1-.2.2-.3.1-.1.1-.2.2-.3.1-.2.1-.3 0-.5-.1-.2-.7-1.7-1-2.3-.2-.5-.4-.4-.6-.4-.2 0-.3 0-.5 0-.2 0-.4 0-.6.2-.2.2-.8.8-.8 2 0 1.2.8 2.4 1.1 2.8.3.4 2.1 3.2 5.1 4.2 1.2.4 2.1.7 2.8.7.6 0 1.1-.1 1.5-.2.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.4z" fill="#fff"/>
                          </svg>
                          <span style={{ fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: 0.5 }}>Contacter sur WhatsApp</span>
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      {/* Modal de réservation (hors boucle) */}
      <ReservationModal
        show={showReservation}
        onHide={closeReservation}
        prestataire={reservationPrestataire}
        onReserve={handleReserve}
      />
      {/* Modal de notation/commentaire (hors boucle) */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Noter {selectedPrestataire ? `${selectedPrestataire.nom} ${selectedPrestataire.prenom}` : ''}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="mb-3">
              <StarRating rating={rating} onRate={setRating} disabled={submitting} />
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Commentaire (optionnel)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={comment}
                onChange={e => setComment(e.target.value)}
                disabled={submitting}
                placeholder="Votre avis sur ce prestataire..."
              />
            </Form.Group>
            {submitMsg && <Alert variant={submitMsg.includes("Merci") ? "success" : "danger"}>{submitMsg}</Alert>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal} disabled={submitting}>Annuler</Button>
            <Button variant="primary" type="submit" disabled={submitting || !rating}>
              Envoyer
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      </Container>
      <Footer />
    </>
  );
};

export default PrestatairesList;
